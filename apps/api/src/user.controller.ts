import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('users')
export class UserController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.user.findMany();
  }

  @Post()
  async create(@Body() data: any) {
    return this.prisma.user.create({
      data: {
        name: data.name,
        username: data.username,
        password_hash: data.password, // In a real app, hash this!
        role: data.role,
      },
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.prisma.user.update({
      where: { id: Number(id) },
      data: {
        name: data.name,
        username: data.username,
        password_hash: data.password,
        role: data.role,
      },
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.prisma.user.delete({
      where: { id: Number(id) },
    });
  }
}
