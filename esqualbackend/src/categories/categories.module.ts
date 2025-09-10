import { Module } from '@nestjs/common';
import { CategoriesService } from './providers/categories.service';
import { CategoriesController } from './categories.controller';

@Module({
  imports: [],
  providers: [CategoriesService],
  controllers: [CategoriesController],
})
export class CategoriesModule { }
