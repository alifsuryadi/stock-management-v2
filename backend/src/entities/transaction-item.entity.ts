// backend/src/entities/transaction-item.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';
import { Product } from './product.entity';

@Entity('transaction_items')
export class TransactionItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'transaction_id' })
  transactionId: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Transaction, (transaction) => transaction.items)
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @ManyToOne(() => Product, (product) => product.transactionItems)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
