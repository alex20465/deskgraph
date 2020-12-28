import { Module } from '@nestjs/common';
import { DeskResolver } from './desk.resolver';
import { DeskbluezService } from './deskbluez.service';

@Module({
  providers: [DeskbluezService, DeskResolver],
})
export class DeskModule {}
