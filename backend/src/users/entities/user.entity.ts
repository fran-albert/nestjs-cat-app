import { Role } from 'src/common/enums/role.enum';
import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false, select: false})
  password: string;

  @Column("simple-array")
  role: Role[];

  @DeleteDateColumn()
  deletedAt: Date;
}
