import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Comment } from './comment.entity';

@Entity({ name: 'Post' })
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  caption: string;

  @Column()
  imageUrl: string;

  @Column({ default: 0 })
  likes: number;

  @OneToMany((type) => Comment, (comment) => comment.post, { cascade: true })
  comments: Comment[];
}
