// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { getDatabaseConfig } from './config/database.config';
import { JwtStrategy } from './strategies/jwt.strategy';

// Entities
import { Admin } from './entities/admin.entity';
import { ProductCategory } from './entities/product-category.entity';
import { Product } from './entities/product.entity';
import { Transaction } from './entities/transaction.entity';
import { TransactionItem } from './entities/transaction-item.entity';

// Services
import { AdminService } from './services/admin.service';
import { ProductCategoryService } from './services/product-category.service';
import { ProductService } from './services/product.service';
import { TransactionService } from './services/transaction.service';

// Controllers
import { AdminController } from './controllers/admin.controller';
import { ProductCategoryController } from './controllers/product-category.controller';
import { ProductController } from './controllers/product.controller';
import { TransactionController } from './controllers/transaction.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
    TypeOrmModule.forFeature([
      Admin,
      ProductCategory,
      Product,
      Transaction,
      TransactionItem,
    ]),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [
    AdminController,
    ProductCategoryController,
    ProductController,
    TransactionController,
  ],
  providers: [
    JwtStrategy,
    AdminService,
    ProductCategoryService,
    ProductService,
    TransactionService,
  ],
})
export class AppModule {}
