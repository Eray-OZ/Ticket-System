import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { BullModule } from '@nestjs/bullmq';
import { OrdersProcessor } from './orders.processor';

@Module({
  providers: [OrdersService, OrdersProcessor],
  controllers: [OrdersController],
  imports: [BullModule.registerQueue({
    name: 'orders-queue',
  })],
})
export class OrdersModule {}
