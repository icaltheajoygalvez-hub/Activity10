import { IsString, IsOptional } from 'class-validator';

export class CreateRegistrationDto {
  @IsString()
  eventId: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
