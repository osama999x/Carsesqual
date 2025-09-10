import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CarsService } from './providers/cars.service';
import { CreateCarDto } from './dtos/create-car.dto';
import { UpdateCarDto } from './dtos/update-car.dto';
import { PaginationCarDto } from './dtos/pagination-car.dto';

@ApiTags('Cars')
@ApiBearerAuth()
@Controller('cars')
export class CarsController {
    constructor(private readonly carsService: CarsService) { }

    @Post()
    create(@Body() dto: CreateCarDto) {
        return this.carsService.create(dto);
    }

    @Get()
    findAll(@Query() pagination: PaginationCarDto) {
        return this.carsService.findAll(pagination);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.carsService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateCarDto) {
        return this.carsService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.carsService.remove(id);
    }
}
