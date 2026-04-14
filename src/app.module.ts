import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TicketsModule } from './tickets/tickets.module';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from './orders/orders.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [PrismaModule, TicketsModule, ConfigModule.forRoot({ isGlobal: true }), OrdersModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
