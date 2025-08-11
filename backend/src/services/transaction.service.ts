// backend/src/services/transaction.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { TransactionItem } from '../entities/transaction-item.entity';
import { CreateTransactionDto } from '../dto/transaction.dto';
import { ProductService } from './product.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionItem)
    private transactionItemRepository: Repository<TransactionItem>,
    private productService: ProductService,
    private dataSource: DataSource,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
    adminId: number,
  ): Promise<Transaction> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Validate stock for stock_out transactions
      if (createTransactionDto.type === 'stock_out') {
        for (const item of createTransactionDto.items) {
          const product = await this.productService.findOne(item.productId);
          if (product.stock < item.quantity) {
            throw new BadRequestException(
              `Insufficient stock for product: ${product.name}`,
            );
          }
        }
      }

      // Create transaction
      const transaction = this.transactionRepository.create({
        type: createTransactionDto.type,
        adminId,
        notes: createTransactionDto.notes,
      });
      const savedTransaction = await queryRunner.manager.save(transaction);

      // Create transaction items and update stock
      for (const item of createTransactionDto.items) {
        const transactionItem = this.transactionItemRepository.create({
          transactionId: savedTransaction.id,
          productId: item.productId,
          quantity: item.quantity,
        });
        await queryRunner.manager.save(transactionItem);

        // Update product stock
        const stockType =
          createTransactionDto.type === 'stock_in' ? 'increase' : 'decrease';
        await this.productService.updateStock(
          item.productId,
          item.quantity,
          stockType,
        );
      }

      await queryRunner.commitTransaction();
      return this.findOne(savedTransaction.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      relations: ['admin', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['admin', 'items', 'items.product'],
    });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }
}
