import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class SendFriendRequestDto {
  @IsUUID()
  @ApiProperty({ type: String, description: 'receiverId' })
  receiverId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: 'message' })
  message: string;
}
