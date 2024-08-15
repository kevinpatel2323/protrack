import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsArray, IsDecimal, IsDate, IsNotEmpty, IsOptional, IsDateString, IsBoolean } from 'class-validator';
import { IsTimeFormat } from 'src/shared/decorator/validator';

export class UpdateProgressTrackerDto {


  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  totalPoints?: number;
    


  @ApiProperty({ required: false })
  @IsOptional()
  @IsDecimal()
  completionPercentage?: number;
    

  

  
}
