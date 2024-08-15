import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsArray, IsDecimal, IsDateString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { IsTimeFormat } from 'src/shared/decorator/validator';

export class CreateDailyToDoListDto {
  

  @ApiProperty()
  @IsInt()
  @IsOptional()
  taskId?: number;
  
  

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: string;
  
  

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  completionDate?: Date;
  
  

  

}
