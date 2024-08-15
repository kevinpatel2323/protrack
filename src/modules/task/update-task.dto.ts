import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsArray, IsDecimal, IsDate, IsNotEmpty, IsOptional, IsDateString, IsBoolean } from 'class-validator';
import { IsTimeFormat } from 'src/shared/decorator/validator';

export class UpdateTaskDto {


  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  taskName?: string;
    


  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  points?: number;
    


  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  dateCreated?: Date;
    


  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  dateUpdated?: Date;
    

  

  
}
