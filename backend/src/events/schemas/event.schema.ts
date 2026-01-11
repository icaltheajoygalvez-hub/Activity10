import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true, min: 1 })
  capacity: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  organizerId: Types.ObjectId;

  @Prop()
  imageUrl?: string;

  @Prop({ default: 'active' })
  status: string;

  @Prop({ type: [String], default: [] })
  tags?: string[];

  @Prop()
  category?: string;

  @Prop({ default: 0 })
  registeredCount: number;
}

export const EventSchema = SchemaFactory.createForClass(Event);

// Add indexes for better query performance
EventSchema.index({ title: 'text', description: 'text' });
EventSchema.index({ date: 1 });
EventSchema.index({ organizerId: 1 });
