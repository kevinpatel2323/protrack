import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsArray, IsDecimal, IsDateString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { IsTimeFormat } from 'src/shared/decorator/validator';

export class CreatePointsTableDto {
  

  @ApiProperty()
  @IsInt()
  @IsOptional()
  taskId?: number;
  
  

  

}
