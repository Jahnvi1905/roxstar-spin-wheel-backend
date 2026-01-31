import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpinWheelController } from './spin-wheel/spin-wheel.controller';
import { SpinWheelService } from './spin-wheel/spin-wheel.service';
import { PrismaService } from './prisma/prisma.service';
import { SpinWheelGateway } from './spin-wheel/spin-wheel.gateway';

@Module({
  controllers: [AppController, SpinWheelController],
  providers: [AppService, SpinWheelService, PrismaService, SpinWheelGateway],
})
export class AppModule {}
