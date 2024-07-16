import { Module } from '@nestjs/common';
import { QnasService } from './qnas.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { QnasController } from './qnas.controller';

@Module({
  controllers: [QnasController],
  providers: [QnasService],
  imports: [PrismaModule],
})
export class QnasModule {}
