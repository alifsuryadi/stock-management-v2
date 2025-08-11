// backend/src/services/admin.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Admin } from '../entities/admin.entity';
import { CreateAdminDto, UpdateAdminDto, LoginDto } from '../dto/admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private jwtService: JwtService,
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    const existingAdmin = await this.adminRepository.findOne({
      where: { email: createAdminDto.email },
    });

    if (existingAdmin) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);
    const admin = this.adminRepository.create({
      ...createAdminDto,
      password: hashedPassword,
    });

    const savedAdmin = await this.adminRepository.save(admin);
    delete savedAdmin.password;
    return savedAdmin;
  }

  async findAll(): Promise<Admin[]> {
    const admins = await this.adminRepository.find();
    return admins.map((admin) => {
      delete admin.password;
      return admin;
    });
  }

  async findOne(id: number): Promise<Admin> {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }
    delete admin.password;
    return admin;
  }

  async update(id: number, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    if (updateAdminDto.email && updateAdminDto.email !== admin.email) {
      const existingAdmin = await this.adminRepository.findOne({
        where: { email: updateAdminDto.email },
      });
      if (existingAdmin) {
        throw new ConflictException('Email already exists');
      }
    }

    await this.adminRepository.update(id, updateAdminDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }
    await this.adminRepository.delete(id);
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ access_token: string; admin: Admin }> {
    const admin = await this.adminRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!admin || !(await bcrypt.compare(loginDto.password, admin.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: admin.id, email: admin.email };
    const access_token = this.jwtService.sign(payload);

    delete admin.password;
    return { access_token, admin };
  }

  async validateUser(id: number): Promise<Admin> {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (admin) {
      delete admin.password;
      return admin;
    }
    return null;
  }
}
