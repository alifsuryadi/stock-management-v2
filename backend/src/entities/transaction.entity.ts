// backend/src/entities/transaction.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Admin } from './admin.entity';
import { TransactionItem } from './transaction-item.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['stock_in', 'stock_out'] })
  type: string;

  @Column({ name: 'admin_id' })
  adminId: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Admin, (admin) => admin.transactions)
  @JoinColumn({ name: 'admin_id' })
  admin: Admin;

  @OneToMany(() => TransactionItem, (item) => item.transaction, {
    cascade: true,
  })
  items: TransactionItem[];
}
