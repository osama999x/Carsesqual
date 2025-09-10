import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCarDto } from '../dtos/create-car.dto';
import { UpdateCarDto } from '../dtos/update-car.dto';
import { PaginationCarDto } from '../dtos/pagination-car.dto';

@Injectable()
export class CarsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(dto: CreateCarDto) {
        const category = await this.prisma.categories.findUnique({ where: { id: dto.categoryId } });
        if (!category) {
            throw new NotFoundException(`Category with ID ${dto.categoryId} not found`);
        }

        return this.prisma.cars.create({
            data: {
                name: dto.name,
                year: dto.year,
                price: dto.price,
                category: { connect: { id: dto.categoryId } },
            },
        });
    }

    async findAll(pagination?: PaginationCarDto): Promise<any> {
        const page = pagination?.page || 1;
        const limit = pagination?.limit || 10;

        const [data, total] = await Promise.all([
            this.prisma.cars.findMany({
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { category: true },
            }),
            this.prisma.cars.count(),
        ]);

        return {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        const car = await this.prisma.cars.findUnique({ where: { id }, include: { category: true } });
        if (!car) {
            throw new NotFoundException(`Car with ID ${id} not found`);
        }
        return car;
    }

    async update(id: string, dto: UpdateCarDto) {
        await this.findOne(id);

        return this.prisma.cars.update({
            where: { id },
            data: {
                name: dto.name,
                year: dto.year,
                price: dto.price,
                ...(dto.categoryId && {
                    category: { connect: { id: dto.categoryId } },
                }),
            },
        });
    }

    async remove(id: string): Promise<void> {
        await this.findOne(id);
        await this.prisma.cars.delete({ where: { id } });
    }
}
