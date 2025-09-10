import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { PaginationCategoryDto } from '../dtos/pagination-category.dto';

@Injectable()
export class CategoriesService {
    constructor(private readonly prisma: PrismaService) { }

    async create(dto: CreateCategoryDto) {
        return this.prisma.categories.create({ data: dto });
    }

    async findAll(pagination?: PaginationCategoryDto): Promise<any> {
        const page = pagination?.page || 1;
        const limit = pagination?.limit || 10;

        const [data, total] = await Promise.all([
            this.prisma.categories.findMany({
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { cars: true },
            }),
            this.prisma.categories.count(),
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
        const category = await this.prisma.categories.findUnique({
            where: { id },
            include: { cars: true },
        });
        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
        return category;
    }

    async update(id: string, dto: UpdateCategoryDto) {
        await this.findOne(id);
        return this.prisma.categories.update({ where: { id }, data: dto });
    }

    async remove(id: string): Promise<void> {
        await this.findOne(id);
        await this.prisma.categories.delete({ where: { id } });
    }
}
