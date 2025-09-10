import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, IsNumber, Min } from 'class-validator';

export class CreateCarDto {
    @ApiProperty({ description: 'Name or model of the car' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ description: 'Year of the car', required: false })
    @IsOptional()
    @IsNumber()
    year?: number;

    @ApiProperty({ description: 'Price of the car', required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    price?: number;

    @ApiProperty({ description: 'Category ID the car belongs to' })
    @IsNotEmpty()
    @IsUUID()
    categoryId: string;
}
