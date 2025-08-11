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

  /**
   * Helper function to safely remove password from admin object
   * @param admin The admin object
   * @returns Admin object without the password
   */
  private toResponseObject(admin: Admin): Omit<Admin, 'password'> {
    const response = { ...admin };
    delete response.password;
    return response;
  }

  async create(
    createAdminDto: CreateAdminDto,
  ): Promise<Omit<Admin, 'password'>> {
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
    return this.toResponseObject(savedAdmin);
  }

  async findAll(): Promise<Omit<Admin, 'password'>[]> {
    const admins = await this.adminRepository.find();
    return admins.map((admin) => this.toResponseObject(admin));
  }

  async findOne(id: number): Promise<Omit<Admin, 'password'>> {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }
    return this.toResponseObject(admin);
  }

  async update(
    id: number,
    updateAdminDto: UpdateAdminDto,
  ): Promise<Omit<Admin, 'password'>> {
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

    // Create a mutable copy that can include the password property for hashing.
    // This resolves the TypeScript error as `UpdateAdminDto` doesn't have `password`.
    const updatePayload: Partial<Admin> = { ...updateAdminDto };

    // Only hash password if it's being updated
    if (updatePayload.password) {
      updatePayload.password = await bcrypt.hash(updatePayload.password, 10);
    }

    await this.adminRepository.update(id, updatePayload);
    // findOne will return the updated admin without the password
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.adminRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Admin not found');
    }
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ access_token: string; admin: Omit<Admin, 'password'> }> {
    const admin = await this.adminRepository.findOne({
      where: { email: loginDto.email },
      // Explicitly select the password field for comparison
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'birthDate',
        'gender',
        'password',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!admin || !(await bcrypt.compare(loginDto.password, admin.password!))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: admin.id, email: admin.email };
    const access_token = this.jwtService.sign(payload);

    return { access_token, admin: this.toResponseObject(admin) };
  }

  async validateUser(id: number): Promise<Omit<Admin, 'password'> | null> {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (admin) {
      return this.toResponseObject(admin);
    }
    return null;
  }
}
