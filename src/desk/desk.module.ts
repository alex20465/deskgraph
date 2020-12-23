import { Module } from '@nestjs/common';
import { DeskResolver } from './desk.resolver';
import { DeskService } from './desk.service';

@Module({
  providers: [DeskService, DeskResolver],
})
export class DeskModule {}
