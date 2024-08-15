import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsArray, IsDecimal, IsDate, IsNotEmpty, IsOptional, IsDateString, IsBoolean } from 'class-validator';
import { IsTimeFormat } from 'src/shared/decorator/validator';

export class UpdateDailyToDoListDto {


  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  taskId?: number;
    


  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string;
    


  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  completionDate?: Date;
    

  

  
}
