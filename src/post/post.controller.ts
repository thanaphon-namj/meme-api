import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { shuffle } from '../utils';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file: Express.Multer.File): Promise<any> {
    const data = await this.postService.create(file);
    return {
      success: true,
      data,
    };
  }

  @Get()
  async getAll(): Promise<any> {
    const data = await this.postService.findAll();
    return {
      success: true,
      data: shuffle(data),
    };
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<any> {
    const data = await this.postService.findById(id);
    return {
      success: data !== null,
      data,
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto): any {
    try {
      this.postService.update(id, updatePostDto.caption);
      return {
        success: true,
      };
    } catch (e) {
      return {
        success: false,
      };
    }
  }

  @Delete(':id')
  delete(@Param('id') id: string): any {
    try {
      this.postService.delete(id);
      return {
        success: true,
      };
    } catch (e) {
      return {
        success: false,
      };
    }
  }

  @Post(':id/like')
  like(@Param('id') id: string): any {
    try {
      this.postService.addLike(id);
      return {
        success: true,
      };
    } catch (e) {
      return {
        success: false,
      };
    }
  }

  @Delete(':id/like')
  unlike(@Param('id') id: string): any {
    try {
      this.postService.deleteLike(id);
      return {
        success: true,
      };
    } catch (e) {
      return {
        success: false,
      };
    }
  }

  @Post(':id/comments')
  async addComment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<any> {
    const data = await this.postService.createComment(
      id,
      createCommentDto.text,
    );
    return {
      success: true,
      data,
    };
  }

  @Delete(':id/comments/:commentId')
  deleteComment(
    @Param('id') id: string,
    @Param('commentId') commentId: number,
  ): any {
    try {
      this.postService.deleteComment(id, commentId);
      return {
        success: true,
      };
    } catch (e) {
      return {
        success: false,
      };
    }
  }
}
