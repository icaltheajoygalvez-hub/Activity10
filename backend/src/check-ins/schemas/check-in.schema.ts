import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CheckInDocument = CheckIn & Document;

export enum CheckInMethod {
  QR = 'qr',
  MANUAL = 'manual',
}

@Schema({ timestamps: true })
export class CheckIn {
  @Prop({ type: Types.ObjectId, ref: 'Registration', required: true })
  registrationId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  scannedBy: Types.ObjectId;

  @Prop({ required: true })
  scannedAt: Date;

  @Prop({ type: String, enum: CheckInMethod, default: CheckInMethod.QR })
  method: CheckInMethod;

  @Prop()
  notes?: string;

  @Prop({ type: Types.ObjectId, ref: 'Event' })
  eventId: Types.ObjectId;
}

export const CheckInSchema = SchemaFactory.createForClass(CheckIn);

// Add indexes
CheckInSchema.index({ registrationId: 1 });
CheckInSchema.index({ eventId: 1 });
CheckInSchema.index({ scannedAt: -1 });
