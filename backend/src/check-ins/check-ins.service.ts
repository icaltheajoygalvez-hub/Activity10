import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CheckIn, CheckInDocument, CheckInMethod } from './schemas/check-in.schema';
import { ScanTicketDto } from './dto/scan-ticket.dto';
import { RegistrationsService } from '../registrations/registrations.service';
import { Registration, RegistrationStatus } from '../registrations/schemas/registration.schema';

@Injectable()
export class CheckInsService {
  constructor(
    @InjectModel(CheckIn.name) private checkInModel: Model<CheckInDocument>,
    @InjectModel(Registration.name) private registrationModel: Model<any>,
    private registrationsService: RegistrationsService,
  ) {}

  async scanTicket(scanTicketDto: ScanTicketDto, scannedBy: string) {
    const { ticketCode, method, notes } = scanTicketDto;

    // Find registration by ticket code
    const registration = await this.registrationsService.findByTicketCode(ticketCode);

    // Check if registration is confirmed
    if (registration.status === RegistrationStatus.CANCELLED) {
      throw new BadRequestException('This ticket has been cancelled');
    }

    // Check if already checked in
    const existingCheckIn = await this.checkInModel.findOne({
      registrationId: registration._id,
    });

    if (existingCheckIn) {
      throw new ConflictException('This ticket has already been checked in');
    }

    // Check if event date is today or in the past (allow same day check-in)
    const event = registration.eventId as any;
    const eventDate = new Date(event.date);
    const now = new Date();
    
    // Set event date to start of day for comparison
    const eventDay = new Date(eventDate);
    eventDay.setHours(0, 0, 0, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (eventDay > today) {
      throw new BadRequestException('Cannot check in before event date');
    }

    // Create check-in record
    const checkIn = new this.checkInModel({
      registrationId: registration._id,
      scannedBy: new Types.ObjectId(scannedBy),
      scannedAt: new Date(),
      method: method || CheckInMethod.QR,
      notes,
      eventId: registration.eventId,
    });

    await checkIn.save();

    // Update registration status and checked-in timestamp
    await this.registrationModel.findByIdAndUpdate(registration._id, {
      status: RegistrationStatus.CHECKED_IN,
      checkedInAt: new Date(),
    });

    // Populate details
    await checkIn.populate([
      { path: 'registrationId', populate: { path: 'userId', select: 'name email' } },
      { path: 'scannedBy', select: 'name' },
      { path: 'eventId', select: 'title date location' },
    ]);

    // Extract data for response
    const populatedCheckIn = checkIn as any;
    const eventTitle = populatedCheckIn.eventId?.title || 'Unknown Event';
    const attendeeName = populatedCheckIn.registrationId?.userId?.name || 'Unknown';

    return {
      message: 'Check-in successful',
      eventTitle,
      attendeeName,
      checkIn,
    };
  }

  async manualCheckIn(registrationId: string, scannedBy: string, notes?: string) {
    const registration = await this.registrationsService.findOne(registrationId);

    // Check if registration is confirmed
    if (registration.status === RegistrationStatus.CANCELLED) {
      throw new BadRequestException('This registration has been cancelled');
    }

    // Check if already checked in
    const existingCheckIn = await this.checkInModel.findOne({
      registrationId: new Types.ObjectId(registrationId),
    });

    if (existingCheckIn) {
      throw new ConflictException('This registration has already been checked in');
    }

    // Create check-in record
    const checkIn = new this.checkInModel({
      registrationId: new Types.ObjectId(registrationId),
      scannedBy: new Types.ObjectId(scannedBy),
      scannedAt: new Date(),
      method: CheckInMethod.MANUAL,
      notes,
      eventId: registration.eventId,
    });

    await checkIn.save();

    // Update registration status
    await this.registrationModel.findByIdAndUpdate(registrationId, {
      status: RegistrationStatus.CHECKED_IN,
      checkedInAt: new Date(),
    });

    // Populate details
    await checkIn.populate([
      { path: 'registrationId', populate: { path: 'userId', select: 'name email' } },
      { path: 'scannedBy', select: 'name' },
      { path: 'eventId', select: 'title date location' },
    ]);

    return {
      message: 'Manual check-in successful',
      checkIn,
    };
  }

  async findByEvent(eventId: string) {
    if (!Types.ObjectId.isValid(eventId)) {
      throw new BadRequestException('Invalid event ID');
    }

    return this.checkInModel
      .find({ eventId: new Types.ObjectId(eventId) })
      .populate({
        path: 'registrationId',
        populate: { path: 'userId', select: 'name email phone' },
      })
      .populate('scannedBy', 'name')
      .sort({ scannedAt: -1 })
      .exec();
  }

  async getEventStatistics(eventId: string) {
    if (!Types.ObjectId.isValid(eventId)) {
      throw new BadRequestException('Invalid event ID');
    }

    const totalCheckIns = await this.checkInModel.countDocuments({ eventId: new Types.ObjectId(eventId) });
    const qrCheckIns = await this.checkInModel.countDocuments({ 
      eventId: new Types.ObjectId(eventId), 
      method: CheckInMethod.QR 
    });
    const manualCheckIns = await this.checkInModel.countDocuments({ 
      eventId: new Types.ObjectId(eventId), 
      method: CheckInMethod.MANUAL 
    });

    // Get check-ins by hour (for today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const checkInsByHour = await this.checkInModel.aggregate([
      {
        $match: {
          eventId: new Types.ObjectId(eventId),
          scannedAt: { $gte: today, $lt: tomorrow },
        },
      },
      {
        $group: {
          _id: { $hour: '$scannedAt' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    return {
      totalCheckIns,
      qrCheckIns,
      manualCheckIns,
      checkInsByHour,
    };
  }

  async getRecentCheckIns(eventId: string, limit: number = 10) {
    return this.checkInModel
      .find({ eventId: new Types.ObjectId(eventId) })
      .populate({
        path: 'registrationId',
        populate: { path: 'userId', select: 'name email' },
      })
      .sort({ scannedAt: -1 })
      .limit(limit)
      .exec();
  }
}
