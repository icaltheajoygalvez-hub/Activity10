import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { Event, EventSchema } from '../events/schemas/event.schema';
import { Registration, RegistrationSchema } from '../registrations/schemas/registration.schema';
import { CheckIn, CheckInSchema } from '../check-ins/schemas/check-in.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Event.name, schema: EventSchema },
      { name: Registration.name, schema: RegistrationSchema },
      { name: CheckIn.name, schema: CheckInSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
