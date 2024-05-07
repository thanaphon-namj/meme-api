import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { PostController } from './post.controller';
import { Post } from './post.entity';
import { PostService } from './post.service';
import { UploadService } from './upload.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    TypeOrmModule.forFeature([Comment]),
  ],
  controllers: [PostController],
  providers: [PostService, UploadService],
})
export class PostModule {}
