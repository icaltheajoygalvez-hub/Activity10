import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { Event, EventDocument } from '../events/schemas/event.schema';
import { Registration, RegistrationDocument } from '../registrations/schemas/registration.schema';
import { CheckIn, CheckInDocument } from '../check-ins/schemas/check-in.schema';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(Registration.name) private registrationModel: Model<RegistrationDocument>,
    @InjectModel(CheckIn.name) private checkInModel: Model<CheckInDocument>,
  ) {}

  async getAllUsers(page: number = 1, limit: number = 10, search?: string) {
    const query: any = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.userModel
        .find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.userModel.countDocuments(query),
    ]);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateUserRole(userId: string, updateUserRoleDto: UpdateUserRoleDto) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.role = updateUserRoleDto.role;
    await user.save();

    const { password, ...result } = user.toObject();
    return {
      message: 'User role updated successfully',
      user: result,
    };
  }

  async deleteUser(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user has any active events as organizer
    const activeEvents = await this.eventModel.countDocuments({
      organizerId: new Types.ObjectId(userId),
      status: 'active',
    });

    if (activeEvents > 0) {
      throw new BadRequestException(
        'Cannot delete user with active events. Please reassign or cancel events first.',
      );
    }

    await this.userModel.findByIdAndDelete(userId);
    return { message: 'User deleted successfully' };
  }

  async getSystemStatistics() {
    const [
      totalUsers,
      totalEvents,
      totalRegistrations,
      totalCheckIns,
      usersByRole,
      recentUsers,
      upcomingEvents,
    ] = await Promise.all([
      this.userModel.countDocuments(),
      this.eventModel.countDocuments(),
      this.registrationModel.countDocuments(),
      this.checkInModel.countDocuments(),
      this.userModel.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 },
          },
        },
      ]),
      this.userModel
        .find()
        .select('-password')
        .sort({ createdAt: -1 })
        .limit(5)
        .exec(),
      this.eventModel
        .find({ date: { $gte: new Date() } })
        .populate('organizerId', 'name email')
        .sort({ date: 1 })
        .limit(5)
        .exec(),
    ]);

    // Get registrations trend (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const registrationsTrend = await this.registrationModel.aggregate([
      {
        $match: {
          registeredAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$registeredAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    return {
      overview: {
        totalUsers,
        totalEvents,
        totalRegistrations,
        totalCheckIns,
      },
      usersByRole,
      recentUsers,
      upcomingEvents,
      registrationsTrend,
    };
  }

  async exportEvents() {
    const events = await this.eventModel
      .find()
      .populate('organizerId', 'name email')
      .exec();

    // Convert to CSV format
    const csvData = events.map((event) => ({
      ID: event._id,
      Title: event.title,
      Description: event.description,
      Date: event.date,
      Location: event.location,
      Capacity: event.capacity,
      Registered: event.registeredCount,
      Organizer: (event.organizerId as any)?.name || 'N/A',
      Status: event.status,
    }));

    return csvData;
  }

  async exportRegistrations(eventId?: string) {
    const query: any = {};
    if (eventId) {
      query.eventId = new Types.ObjectId(eventId);
    }

    const registrations = await this.registrationModel
      .find(query)
      .populate('eventId', 'title date location')
      .populate('userId', 'name email phone')
      .exec();

    // Convert to CSV format
    const csvData = registrations.map((reg) => ({
      'Ticket Code': reg.ticketCode,
      'Event': (reg.eventId as any)?.title || 'N/A',
      'Attendee Name': (reg.userId as any)?.name || 'N/A',
      'Attendee Email': (reg.userId as any)?.email || 'N/A',
      'Attendee Phone': (reg.userId as any)?.phone || 'N/A',
      'Registration Date': reg.registeredAt,
      'Status': reg.status,
    }));

    return csvData;
  }
}
