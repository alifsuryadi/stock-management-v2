// backend/src/controllers/transaction.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';

interface AuthenticatedRequest extends Request {
  user: {
    sub: number;
    email: string;
  };
}
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { TransactionService } from '../services/transaction.service';
import { CreateTransactionDto } from '../dto/transaction.dto';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.transactionService.create(createTransactionDto, req.user.sub);
  }

  @Get()
  findAll() {
    return this.transactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(+id);
  }
}
