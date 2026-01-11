import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/schemas/user.schema';

@Controller('registrations')
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createRegistrationDto: CreateRegistrationDto, @Request() req) {
    return this.registrationsService.create(createRegistrationDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string, @Request() req) {
    // Users can only view their own registrations unless they're admin
    if (userId !== req.user.userId && req.user.role !== UserRole.ADMIN) {
      userId = req.user.userId;
    }
    return this.registrationsService.findByUser(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @Get('event/:eventId')
  async findByEvent(@Param('eventId') eventId: string) {
    return this.registrationsService.findByEvent(eventId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @Get('event/:eventId/statistics')
  async getEventStatistics(@Param('eventId') eventId: string) {
    return this.registrationsService.getEventStatistics(eventId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.registrationsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/ticket')
  async getTicket(@Param('id') id: string, @Request() req) {
    return this.registrationsService.getTicket(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async cancel(@Param('id') id: string, @Request() req) {
    return this.registrationsService.cancel(id, req.user.userId);
  }
}
