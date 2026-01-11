import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Event, EventDocument } from './schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FilterEventDto } from './dto/filter-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  async create(createEventDto: CreateEventDto, organizerId: string) {
    // Validate event date is not in the past
    const eventDate = new Date(createEventDto.date);
    const endDate = new Date(createEventDto.endDate);
    const now = new Date();
    
    if (eventDate < now) {
      throw new BadRequestException('Event date cannot be in the past');
    }

    if (endDate <= eventDate) {
      throw new BadRequestException('End date must be after start date');
    }

    // Check for overlapping events by the same organizer
    const overlappingEvent = await this.eventModel.findOne({
      organizerId: new Types.ObjectId(organizerId),
      $or: [
        // New event starts before existing event ends
        { date: { $lt: endDate } },
        // New event ends after existing event starts AND new event hasn't started yet
      ],
      endDate: { $gt: eventDate },
    });

    if (overlappingEvent) {
      throw new BadRequestException(
        'You have an event scheduled during this time. Please choose a different date/time.'
      );
    }

    const event = new this.eventModel({
      ...createEventDto,
      organizerId: new Types.ObjectId(organizerId),
    });

    await event.save();
    return event;
  }

  async findAll(filterDto: FilterEventDto) {
    const { 
      search, 
      category, 
      location, 
      startDate, 
      endDate, 
      status,
      page = 1, 
      limit = 10,
      sortBy = 'date',
      sortOrder = 'asc'
    } = filterDto;

    const query: any = {};

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [events, total] = await Promise.all([
      this.eventModel
        .find(query)
        .populate('organizerId', 'name email')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.eventModel.countDocuments(query),
    ]);

    return {
      events,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid event ID');
    }

    const event = await this.eventModel
      .findById(id)
      .populate('organizerId', 'name email company')
      .exec();

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async findByOrganizer(organizerId: string) {
    return this.eventModel
      .find({ organizerId: new Types.ObjectId(organizerId) })
      .sort({ date: -1 })
      .exec();
  }

  async update(id: string, updateEventDto: UpdateEventDto, userId: string, userRole: string) {
    const event = await this.findOne(id);

    // Check if user is the organizer or admin
    // Convert both to ObjectId for comparison to handle any format issues
    try {
      const userObjId = new Types.ObjectId(userId);
      const isOrganizerOrAdmin = event.organizerId.equals(userObjId) || userRole === 'admin';
      
      if (!isOrganizerOrAdmin) {
        throw new ForbiddenException('You do not have permission to update this event');
      }
    } catch (error) {
      // If userId is not a valid ObjectId, comparison fails
      if (userRole !== 'admin') {
        throw new ForbiddenException('You do not have permission to update this event');
      }
    }

    // Prevent updating events that have already started
    const eventDate = new Date(event.date);
    const now = new Date();
    if (eventDate < now) {
      throw new BadRequestException('Cannot update events that have already started');
    }

    // If capacity is being reduced, check if it's still valid
    if (updateEventDto.capacity && updateEventDto.capacity < event.registeredCount) {
      throw new BadRequestException(
        `Cannot reduce capacity below current registrations (${event.registeredCount})`
      );
    }

    // Validate endDate if provided
    if (updateEventDto.endDate) {
      const startDate = updateEventDto.date || event.date;
      const endDate = new Date(updateEventDto.endDate);
      if (endDate <= new Date(startDate)) {
        throw new BadRequestException('End date must be after start date');
      }
    }

    Object.assign(event, updateEventDto);
    await event.save();

    return event;
  }

  async remove(id: string, userId: string, userRole: string) {
    const event = await this.findOne(id);

    // Check if user is the organizer or admin
    // Convert both to ObjectId for comparison to handle any format issues
    try {
      const userObjId = new Types.ObjectId(userId);
      const isOrganizerOrAdmin = event.organizerId.equals(userObjId) || userRole === 'admin';
      
      if (!isOrganizerOrAdmin) {
        throw new ForbiddenException('You do not have permission to delete this event');
      }
    } catch (error) {
      // If userId is not a valid ObjectId, comparison fails
      if (userRole !== 'admin') {
        throw new ForbiddenException('You do not have permission to delete this event');
      }
    }

    // Delete event (registrations will be cascade deleted or updated separately if needed)
    await this.eventModel.findByIdAndDelete(id);
    return { message: 'Event deleted successfully' };
  }

  async incrementRegistrationCount(eventId: string) {
    const event = await this.findOne(eventId);
    
    if (event.registeredCount >= event.capacity) {
      throw new BadRequestException('Event is at full capacity');
    }

    event.registeredCount += 1;
    await event.save();
    return event;
  }

  async decrementRegistrationCount(eventId: string) {
    const event = await this.findOne(eventId);
    
    if (event.registeredCount > 0) {
      event.registeredCount -= 1;
      await event.save();
    }
    
    return event;
  }

  async checkCapacity(eventId: string): Promise<boolean> {
    const event = await this.findOne(eventId);
    return event.registeredCount < event.capacity;
  }
}
