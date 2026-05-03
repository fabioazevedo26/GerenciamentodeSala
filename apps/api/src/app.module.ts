import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { UserController } from './user.controller';
import { RoomController } from './room.controller';
import { BookingController } from './booking.controller';

@Module({
  imports: [],
  controllers: [AppController, UserController, RoomController, BookingController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
