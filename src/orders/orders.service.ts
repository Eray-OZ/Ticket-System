import { Injectable, BadRequestException, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import Redis from 'ioredis';

@Injectable()
export class OrdersService implements OnModuleInit {
  private redis: Redis;

  constructor(
    private prisma: PrismaService,
    // Inject the BullMQ queue
    @InjectQueue('orders-queue') private ordersQueue: Queue, 
  ) {
    this.redis = new Redis();
  }

  async onModuleInit() {
    console.log('Loading ticket stocks into Redis RAM...');
    const tickets = await this.prisma.ticket.findMany();
    for (const ticket of tickets) {
      await this.redis.set(`ticket:${ticket.id}`, ticket.totalStock);
    }
    console.log('Redis cache is primed and ready!');
  }

  async create(createOrderDto: CreateOrderDto) {
    const redisKey = `ticket:${createOrderDto.ticketId}`;

    // 1. ATOMIC CACHE DECREMENT
    const currentStock = await this.redis.decr(redisKey);

    if (currentStock < 0) {
      await this.redis.incr(redisKey);
      throw new BadRequestException('Ticket is sold out or not found!');
    }

    // 2. ADD TO BULLMQ QUEUE (100% Safe Background Processing)
    // Send the DTO to the queue; the Processor handles the DB writing.
    await this.ordersQueue.add('process-order', { dto: createOrderDto });

    // 3. INSTANT RESPONSE
    return {
      message: 'Order received and queued successfully!',
      ticketId: createOrderDto.ticketId,
      userId: createOrderDto.userId,
      status: 'PROCESSING' // Changed to processing since DB write is pending
    };
  }
}