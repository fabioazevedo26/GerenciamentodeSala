import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('bookings')
export class BookingController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.booking.findMany({
      include: {
        room: true,
        user: true,
      },
    });
  }

  @Post()
  async create(@Body() data: any) {
    return this.prisma.booking.create({
      data: {
        title: data.title,
        start_time: new Date(data.start),
        end_time: new Date(data.end),
        room: { connect: { id: Number(data.roomId) } },
        user: { connect: { id: Number(data.userId) } },
      },
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.prisma.booking.delete({
      where: { id: Number(id) },
    });
  }
}
