import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CheckInsService } from './check-ins.service';
import { ScanTicketDto } from './dto/scan-ticket.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/schemas/user.schema';

@Controller('check-ins')
export class CheckInsController {
  constructor(private readonly checkInsService: CheckInsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @Post('scan')
  async scanTicket(@Body() scanTicketDto: ScanTicketDto, @Request() req) {
    return this.checkInsService.scanTicket(scanTicketDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @Post('manual')
  async manualCheckIn(
    @Body() body: { registrationId: string; notes?: string },
    @Request() req,
  ) {
    return this.checkInsService.manualCheckIn(
      body.registrationId,
      req.user.userId,
      body.notes,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @Get('event/:eventId')
  async findByEvent(@Param('eventId') eventId: string) {
    return this.checkInsService.findByEvent(eventId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @Get('event/:eventId/statistics')
  async getEventStatistics(@Param('eventId') eventId: string) {
    return this.checkInsService.getEventStatistics(eventId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @Get('event/:eventId/recent')
  async getRecentCheckIns(@Param('eventId') eventId: string) {
    return this.checkInsService.getRecentCheckIns(eventId);
  }
}
