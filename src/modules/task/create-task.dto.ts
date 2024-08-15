import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsArray, IsDecimal, IsDateString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { IsTimeFormat } from 'src/shared/decorator/validator';

export class CreateTaskDto {
  

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  taskName: string;
  
  

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  points: number;
  
  

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  dateCreated?: Date;
  
  

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  dateUpdated?: Date;
  
  

  

}
