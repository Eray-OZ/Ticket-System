import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {

    constructor(private Prisma: PrismaService) {}

    async create(createUserDto: CreateUserDto) {

        const createdUser = await this.Prisma.user.create({
            data: {
                email: createUserDto.email,
                name: createUserDto.name,
            },
        });

        return { message: 'User created successfully', user: createdUser };
    }

}
