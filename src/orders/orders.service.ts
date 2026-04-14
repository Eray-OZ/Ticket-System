import { BadRequestException, Injectable} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrdersService {

    constructor(private prisma: PrismaService) {}


    async create(createOrderDto: CreateOrderDto) {

        return await this.prisma.$transaction(async (prisma) => {   

        const ticketUpdateResult = await prisma.ticket.updateMany({
        where: { 
          id: createOrderDto.ticketId,
          totalStock: { gt: 0 }, 
        },
        data: {
          totalStock: { decrement: 1 },
        },
      });


      if (ticketUpdateResult.count === 0) {
        throw new BadRequestException('Tickets Sold Out!');
      }

    
        const createdOrder = await prisma.order.create({
            data: {
                ticketId: createOrderDto.ticketId,
                userId: createOrderDto.userId,
                status: 'Success',
            },
        });



        return createdOrder;

})
}
}