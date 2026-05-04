import { Controller, Get, Post, Body, Param, Delete, Put, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('users')
export class UserController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.user.findMany();
  }

  @Get('count')
  async count() {
    const count = await this.prisma.user.count();
    return { count };
  }

  @Post()
  async create(@Body() data: any) {
    return this.prisma.user.create({
      data: {
        name: data.name,
        username: data.username,
        password_hash: data.password, 
        role: data.role || 'USER',
      },
    });
  }

  @Post('login')
  async login(@Body() data: any) {
    const user = await this.prisma.user.findUnique({
      where: { username: data.username },
    });

    if (user && user.password_hash === data.password) {
      return user;
    }

    throw new UnauthorizedException('Usuário ou senha inválidos');
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    const updateData: any = {
      name: data.name,
      username: data.username,
      role: data.role,
    };
    if (data.password) {
      updateData.password_hash = data.password;
    }
    
    return this.prisma.user.update({
      where: { id: Number(id) },
      data: updateData,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.prisma.user.delete({
      where: { id: Number(id) },
    });
  }
}
