import { ApiProperty } from '@nestjs/swagger';

export class EmailDto {
  @ApiProperty({
    example: 'example@example.com',
    pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
    description: 'Email of already registered but not confirmed user',
    required: true,
  })
  email: string;
}
