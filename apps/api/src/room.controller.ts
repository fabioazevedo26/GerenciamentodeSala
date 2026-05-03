import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('rooms')
export class RoomController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.room.findMany();
  }

  @Post()
  async create(@Body() data: any) {
    return this.prisma.room.create({
      data: {
        name: data.name,
        capacity: Number(data.capacity),
        description: data.res,
        is_active: true,
      },
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.prisma.room.delete({
      where: { id: Number(id) },
    });
  }
}
