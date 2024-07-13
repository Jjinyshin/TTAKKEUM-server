import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: '사용자 이메일' })
  email: string;

  @ApiProperty({ description: '사용자 닉네임' })
  nickname: string;

  @ApiProperty({ description: '도치 이름' })
  dochiname: string;

  @ApiProperty({ description: '사용자 비밀번호' })
  password: string;
}
