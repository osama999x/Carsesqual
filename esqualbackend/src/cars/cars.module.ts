import { Module } from '@nestjs/common';
import { CarsService } from './providers/cars.service';
import { CarsController } from './cars.controller';

@Module({
  imports: [],
  providers: [CarsService],
  controllers: [CarsController],
})
export class CarsModule { }
