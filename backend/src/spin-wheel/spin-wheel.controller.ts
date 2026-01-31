import { Controller, Post, Param } from '@nestjs/common';
import { SpinWheelService } from './spin-wheel.service';

@Controller('spin-wheel')
export class SpinWheelController {
  constructor(private readonly service: SpinWheelService) {}

  @Post('create')
  create() {
    return this.service.createWheel();
  }

  @Post('join/:id')
  join(@Param('id') id: string) {
    return this.service.joinWheel(Number(id));
  }

  @Post('start')
  start() {
    return this.service.startWheel();
  }

  //   @Post('eliminate')
  //   eliminate() {
  //     return this.service.eliminateUser();
  //   }
}
