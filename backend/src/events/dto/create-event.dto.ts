import { IsString, IsDate, IsNumber, Min, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @Type(() => Date)
  @IsDate()
  date: Date;

  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @IsString()
  location: string;

  @IsNumber()
  @Min(1)
  capacity: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
