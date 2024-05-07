import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { generateEntityId } from '../utils';
import { Comment } from './comment.entity';
import { Post } from './post.entity';
import { UploadService } from './upload.service';

@Injectable()
export class PostService {
  constructor(
    private readonly uploadService: UploadService,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async create(file: Express.Multer.File): Promise<any> {
    const id = generateEntityId();
    const imageUrl = await this.uploadService.uploadFile(file, id);
    return this.postRepository.save({ id, imageUrl });
  }

  findAll(): Promise<Post[]> {
    return this.postRepository.find();
  }

  findById(id: string): Promise<Post> {
    return this.postRepository.findOne({
      where: {
        id,
      },
      relations: ['comments'],
    });
  }

  update(id: string, payload: string): Promise<any> {
    return this.postRepository.update(id, {
      caption: payload,
    });
  }

  async delete(id: string): Promise<any> {
    await this.commentRepository.delete({ post: { id } });
    return this.postRepository.delete(id);
  }

  async addLike(id: string): Promise<any> {
    return this.postRepository.increment({ id }, 'likes', 1);
  }

  async deleteLike(id: string): Promise<any> {
    return this.postRepository.decrement({ id }, 'likes', 1);
  }

  async createComment(id: string, payload: string): Promise<Comment> {
    const post = await this.postRepository.findOneBy({ id });
    const comment = new Comment();
    comment.text = payload;
    comment.post = post;
    return this.commentRepository.save(comment);
  }

  async deleteComment(id: string, commentId: number): Promise<any> {
    return this.commentRepository.delete({ id: commentId, post: { id } });
  }
}
