import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import * as QRCode from 'qrcode';
import { Registration, RegistrationDocument, RegistrationStatus } from './schemas/registration.schema';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { EventsService } from '../events/events.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class RegistrationsService {
  constructor(
    @InjectModel(Registration.name) private registrationModel: Model<RegistrationDocument>,
    private eventsService: EventsService,
    private notificationsService: NotificationsService,
  ) {}

  async create(createRegistrationDto: CreateRegistrationDto, userId: string) {
    const { eventId, notes } = createRegistrationDto;

    // Validate event exists
    const event = await this.eventsService.findOne(eventId);

    // Check if event date has passed
    if (new Date(event.date) < new Date()) {
      throw new BadRequestException('Cannot register for past events');
    }

    // Check capacity
    const hasCapacity = await this.eventsService.checkCapacity(eventId);
    if (!hasCapacity) {
      throw new BadRequestException('Event is at full capacity');
    }

    // Check for duplicate registration
    const existingRegistration = await this.registrationModel.findOne({
      eventId: new Types.ObjectId(eventId),
      userId: new Types.ObjectId(userId),
      status: { $ne: RegistrationStatus.CANCELLED },
    });

    if (existingRegistration) {
      throw new ConflictException('You are already registered for this event');
    }

    // Generate unique ticket code
    const ticketCode = uuidv4();

    // Generate QR code - encode only the ticket code for consistency
    const qrCodeUrl = await QRCode.toDataURL(ticketCode);

    // Create registration
    const registration = new this.registrationModel({
      eventId: new Types.ObjectId(eventId),
      userId: new Types.ObjectId(userId),
      ticketCode,
      qrCodeUrl,
      status: RegistrationStatus.CONFIRMED,
      registeredAt: new Date(),
      notes,
    });

    await registration.save();

    // Increment event registration count
    await this.eventsService.incrementRegistrationCount(eventId);

    // Populate event and user details
    await registration.populate([
      { path: 'eventId', select: 'title date location' },
      { path: 'userId', select: 'name email' },
    ]);

    // Send registration confirmation email asynchronously
    if (registration.userId && registration.eventId) {
      const user = registration.userId as any;
      const event = registration.eventId as any;
      this.notificationsService.sendRegistrationConfirmation(
        user.email,
        user.name,
        event.title,
        new Date(event.date).toLocaleString(),
        event.location,
        registration.ticketCode,
        registration.qrCodeUrl,
      ).catch(error => {
        console.error('Failed to send registration email:', error);
      });
    }

    return {
      message: 'Registration successful',
      registration,
    };
  }

  async findByUser(userId: string) {
    return this.registrationModel
      .find({ 
        userId: new Types.ObjectId(userId),
        status: { $ne: RegistrationStatus.CANCELLED }
      })
      .populate('eventId', 'title date location imageUrl')
      .sort({ registeredAt: -1 })
      .exec();
  }

  async findByEvent(eventId: string) {
    return this.registrationModel
      .find({ 
        eventId: new Types.ObjectId(eventId),
        status: { $ne: RegistrationStatus.CANCELLED }
      })
      .populate('userId', 'name email phone')
      .sort({ registeredAt: -1 })
      .exec();
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid registration ID');
    }

    const registration = await this.registrationModel
      .findById(id)
      .populate('eventId', 'title date location imageUrl')
      .populate('userId', 'name email phone')
      .exec();

    if (!registration) {
      throw new NotFoundException('Registration not found');
    }

    return registration;
  }

  async findByTicketCode(ticketCode: string) {
    const registration = await this.registrationModel
      .findOne({ ticketCode })
      .populate('eventId', 'title date location')
      .populate('userId', 'name email')
      .exec();

    if (!registration) {
      throw new NotFoundException('Ticket not found');
    }

    return registration;
  }

  async cancel(id: string, userId: string) {
    const registration = await this.registrationModel.findById(id);
    if (!registration) {
      throw new NotFoundException('Registration not found');
    }

    // Check if user owns this registration - userId is still ObjectId at this point
    const registrationUserId = registration.userId.toString();
    const requestUserId = new Types.ObjectId(userId).toString();
    
    if (registrationUserId !== requestUserId) {
      throw new BadRequestException('You can only cancel your own registrations');
    }

    // Check if already cancelled
    if (registration.status === RegistrationStatus.CANCELLED) {
      throw new BadRequestException('Registration is already cancelled');
    }

    // Update registration status
    registration.status = RegistrationStatus.CANCELLED;
    registration.cancelledAt = new Date();
    await registration.save();

    // Decrement event registration count
    await this.eventsService.decrementRegistrationCount(registration.eventId.toString());

    return {
      message: 'Registration cancelled successfully',
      registration,
    };
  }

  async getTicket(id: string, userId: string) {
    const registration = await this.registrationModel
      .findById(id)
      .populate('eventId', 'title date location imageUrl')
      .exec();
    
    if (!registration) {
      throw new NotFoundException('Registration not found');
    }

    // Check if user owns this registration - userId is still ObjectId at this point
    const registrationUserId = registration.userId.toString();
    const requestUserId = new Types.ObjectId(userId).toString();
    
    if (registrationUserId !== requestUserId) {
      throw new BadRequestException('You can only view your own tickets');
    }

    return registration;
  }

  async getEventStatistics(eventId: string) {
    const event = await this.eventsService.findOne(eventId);
    
    const [total, confirmed, checkedIn, cancelled] = await Promise.all([
      this.registrationModel.countDocuments({ eventId: new Types.ObjectId(eventId) }),
      this.registrationModel.countDocuments({ 
        eventId: new Types.ObjectId(eventId), 
        status: RegistrationStatus.CONFIRMED 
      }),
      this.registrationModel.countDocuments({ 
        eventId: new Types.ObjectId(eventId), 
        status: RegistrationStatus.CHECKED_IN 
      }),
      this.registrationModel.countDocuments({ 
        eventId: new Types.ObjectId(eventId), 
        status: RegistrationStatus.CANCELLED 
      }),
    ]);

    const activeRegistrations = total - cancelled;
    const availableSpots = Math.max(0, event.capacity - activeRegistrations);

    return {
      total,
      confirmed,
      checkedIn,
      cancelled,
      activeRegistrations,
      availableSpots,
      capacity: event.capacity,
      checkInRate: activeRegistrations > 0 ? ((checkedIn / activeRegistrations) * 100).toFixed(2) : 0,
    };
  }
}
