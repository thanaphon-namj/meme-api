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
      data,
    };
  }

  @Get(':id')
  async getById(@Param('id') id: number): Promise<any> {
    const data = await this.postService.findById(id);
    return {
      success: true,
      data,
    };
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto): any {
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

  @Post(':id/like')
  like(@Param('id') id: number): Promise<any> {
    return this.postService.addLike(id);
  }

  @Delete(':id/like')
  unlike(@Param('id') id: number): Promise<any> {
    return this.postService.removeLike(id);
  }

  @Post(':id/comments')
  async addComment(
    @Param('id') id: number,
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
    @Param('id') id: number,
    @Param('commentId') commentId: number,
  ): Promise<any> {
    return this.postService.removeComment(id, commentId);
  }
}
