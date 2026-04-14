import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from 'src/prisma/prisma.service';

// Listen to the 'orders-queue'
@Processor('orders-queue')
export class OrdersProcessor extends WorkerHost {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  // Automatically triggered whenever a new job hits the queue
  async process(job: Job<any>) {
    const { dto } = job.data;

    try {
      // Execute the database transaction safely in the background
      await this.prisma.$transaction([
        this.prisma.order.create({
          data: {
            ticketId: dto.ticketId,
            userId: dto.userId,
            status: 'SUCCESS',
          },
        }),
        this.prisma.ticket.update({
          where: { id: dto.ticketId },
          data: { totalStock: { decrement: 1 } },
        }),
      ]);
    } catch (error) {
      console.error(`DB Write Failed for Job ${job.id}:`, error);
      // Throwing error allows BullMQ to retry the job automatically
      throw error; 
    }
  }
}