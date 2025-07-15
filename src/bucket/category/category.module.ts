import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  providers: [CategoryService],
  controllers: [CategoryController],
  imports: [CaslModule],
})
export class CategoryModule {}
