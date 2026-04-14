import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';


@Injectable()
export class TicketsService {

    constructor(private prisma: PrismaService) {}


    async create(createTicketDto: CreateTicketDto) {
    
        const createdTicket = await this.prisma.ticket.create({
            data: {
                eventName: createTicketDto.eventName,
                price: createTicketDto.price,
                totalStock: createTicketDto.totalStock,
            },
        });

        return createdTicket;

    }

}
