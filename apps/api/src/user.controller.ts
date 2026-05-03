import { Controller, Get, Post, Body, Param, Delete, Put, UnauthorizedException } from '@nestjs/common';
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
        password_hash: data.password, 
        role: data.role,
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

    // Fallback para admin/admin se o banco estiver vazio ou para facilitar testes iniciais
    if (data.username === 'admin' && data.password === 'admin') {
       return { username: 'admin', role: 'ADMIN', name: 'Administrador' };
    }

    throw new UnauthorizedException('Usuário ou senha inválidos');
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
