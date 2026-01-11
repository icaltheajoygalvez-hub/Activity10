import { IsString, IsOptional, IsEnum } from 'class-validator';
import { CheckInMethod } from '../schemas/check-in.schema';

export class ScanTicketDto {
  @IsString()
  ticketCode: string;

  @IsEnum(CheckInMethod)
  @IsOptional()
  method?: CheckInMethod = CheckInMethod.QR;

  @IsString()
  @IsOptional()
  notes?: string;
}
