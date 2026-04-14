import { Controller, Post, Body } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {

    constructor(private TicketsService: TicketsService) {}


    @Post()
    async createTicket(@Body() createTicketDto: CreateTicketDto) {
        return this.TicketsService.create(createTicketDto);
}




}   
