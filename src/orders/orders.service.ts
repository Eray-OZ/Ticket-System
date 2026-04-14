import { Injectable} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrdersService {

    constructor(private prisma: PrismaService) {}


    async create(createOrderDto: CreateOrderDto) {

        return await this.prisma.$transaction(async (prisma) => {   

        const ticket = await prisma.ticket.findUnique({
            where: { id: createOrderDto.ticketId },
        });

        if (!ticket) {
            throw new Error('Ticket not found');
        }

        if (ticket.totalStock <= 0) {
            throw new Error('Ticket is out of stock');
        }

    
        const createdOrder = await prisma.order.create({
            data: {
                ticketId: createOrderDto.ticketId,
                userId: createOrderDto.userId,
                status: 'Success',
            },
        });


        await prisma.ticket.update({
            where: { id: createOrderDto.ticketId },
            data: { totalStock: { decrement: 1 } },
        });

        return createdOrder;

})
}
}