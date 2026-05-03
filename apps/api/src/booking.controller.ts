import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
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
      orderBy: {
        start_time: 'asc',
      },
    });
  }

  @Post()
  async create(@Body() data: any) {
    // Se o usuário for ADMIN, já cria como APPROVED, senão PENDING
    const status = data.userRole === 'ADMIN' ? 'APPROVED' : 'PENDING';
    
    return this.prisma.booking.create({
      data: {
        title: data.title,
        start_time: new Date(data.start),
        end_time: new Date(data.end),
        status: status,
        room: { connect: { id: Number(data.roomId) } },
        user: { connect: { id: Number(data.userId) } },
      },
    });
  }

  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body() data: { status: 'APPROVED' | 'REJECTED' }) {
    return this.prisma.booking.update({
      where: { id: Number(id) },
      data: {
        status: data.status,
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
