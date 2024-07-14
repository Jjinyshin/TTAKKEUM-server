import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '사용자 이메일' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '사용자 닉네임' })
  nickname: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '도치 이름' })
  dochiname: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ description: '사용자 비밀번호' })
  password: string;
}
