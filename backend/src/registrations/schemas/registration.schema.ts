import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RegistrationDocument = Registration & Document;

export enum RegistrationStatus {
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  CHECKED_IN = 'checked_in',
}

@Schema({ timestamps: true })
export class Registration {
  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  eventId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  ticketCode: string;

  @Prop()
  qrCodeUrl: string;

  @Prop({ type: String, enum: RegistrationStatus, default: RegistrationStatus.CONFIRMED })
  status: RegistrationStatus;

  @Prop()
  registeredAt: Date;

  @Prop()
  checkedInAt?: Date;

  @Prop()
  cancelledAt?: Date;

  @Prop()
  notes?: string;
}

export const RegistrationSchema = SchemaFactory.createForClass(Registration);

// Create compound index to prevent duplicate registrations
RegistrationSchema.index({ eventId: 1, userId: 1 }, { unique: true });
RegistrationSchema.index({ ticketCode: 1 });
RegistrationSchema.index({ status: 1 });
