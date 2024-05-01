import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async create(file: Express.Multer.File): Promise<Post> {
    const data = await this.uploadService.uploadFile(file);
    return this.postRepository.save({ imageUrl: data.Location });
  }

  findAll(): Promise<Post[]> {
    return this.postRepository.find();
  }

  findById(id: number): Promise<Post> {
    return this.postRepository.findOne({
      where: {
        id,
      },
      relations: ['comments'],
    });
  }

  update(id: number, payload: string): Promise<any> {
    return this.postRepository.update(id, {
      caption: payload,
    });
  }

  async addLike(id: number): Promise<Post> {
    const post = await this.postRepository.findOneBy({ id });
    post.likes = post.likes + 1;
    return this.postRepository.save(post);
  }

  async removeLike(id: number): Promise<Post> {
    const post = await this.postRepository.findOneBy({ id });
    if (post.likes > 0) {
      post.likes = post.likes - 1;
    }
    return this.postRepository.save(post);
  }

  async createComment(id: number, payload: string): Promise<Comment> {
    const post = await this.postRepository.findOneBy({ id });
    const comment = new Comment();
    comment.text = payload;
    comment.post = post;
    return this.commentRepository.save(comment);
  }

  async removeComment(id: number, commentId: number): Promise<any> {
    return this.commentRepository.delete({ id: commentId, post: { id } });
  }
}
