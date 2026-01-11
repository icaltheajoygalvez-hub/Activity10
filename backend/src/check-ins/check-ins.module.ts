import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CheckInsController } from './check-ins.controller';
import { CheckInsService } from './check-ins.service';
import { CheckInsGateway } from './check-ins.gateway';
import { CheckIn, CheckInSchema } from './schemas/check-in.schema';
import { Registration, RegistrationSchema } from '../registrations/schemas/registration.schema';
import { RegistrationsModule } from '../registrations/registrations.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CheckIn.name, schema: CheckInSchema },
      { name: Registration.name, schema: RegistrationSchema },
    ]),
    RegistrationsModule,
  ],
  controllers: [CheckInsController],
  providers: [CheckInsService, CheckInsGateway],
  exports: [CheckInsService, CheckInsGateway],
})
export class CheckInsModule {}
