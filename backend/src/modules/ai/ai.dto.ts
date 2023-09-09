import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export interface AiDescriptioInputnDto {
  input: string;
}

export class GenerateDescriptionDto implements AiDescriptioInputnDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  input: string;
}

export interface AiGeneratedDescriptionDto {
  input: string;
  output: string;
}
