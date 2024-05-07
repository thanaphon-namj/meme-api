import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Comment } from './comment.entity';

@Entity({ name: 'Post' })
export class Post {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  caption: string;

  @Column()
  imageUrl: string;

  @Column({ default: 0 })
  likes: number;

  @OneToMany((type) => Comment, (comment) => comment.post, { cascade: true })
  comments: Comment[];
}
