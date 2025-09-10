import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
    @ApiProperty({ description: 'Name of the category' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ description: 'Optional description', required: false })
    @IsOptional()
    @IsString()
    description?: string;
}
