import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 20, unique: true })
  username: string;
  @Column({ length: 10 })
  name: string;
  @Column({ length: 100 })
  password: string;
  @Column({ length: 50 })
  email: string;
  @Column({ type: 'date', nullable: true })
  birth: Date;
}
