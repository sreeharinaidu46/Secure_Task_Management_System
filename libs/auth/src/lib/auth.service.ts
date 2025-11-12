import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User, Organization, RoleName } from '@secure-task-system/data';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { AuditLoggerService } from './services/audit-logger.service.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>,
    private readonly jwtService: JwtService,
    private readonly audit: AuditLoggerService,
  ) {}

  //  LOGIN
  async login(dto: LoginUserDto, context?: { method?: string; url?: string }) {
    const { email, password } = dto;

    const user = await this.userRepo.findOne({
      where: { email },
      relations: ['organization'],
    });

    if (!user) {
      this.audit.log(
        null,
        `Failed login attempt (invalid email: ${email})`,
        context?.method,
        context?.url,
        dto,
      );
      throw new UnauthorizedException('Invalid email or password');
    }

    const valid = await user.validatePassword(password);
    if (!valid) {
      this.audit.log(
        user,
        `Failed login attempt (wrong password)`,
        context?.method,
        context?.url,
        dto,
      );
      throw new UnauthorizedException('Invalid email or password');
    }

    //  Include minimal but structured org info in JWT
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organization?.id || null,
    };

    const token = this.jwtService.sign(payload);

    this.audit.log(
      user,
      'Successful login',
      context?.method,
      context?.url,
      { email },
    );

    //  Return organization as an object (not just name)
    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        organization: user.organization
          ? {
              id: user.organization.id,
              name: user.organization.name,
            }
          : null,
      },
    };
  }

  //  REGISTER
  async register(dto: CreateUserDto, context?: { method?: string; url?: string }) {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) {
      this.audit.log(
        null,
        `Failed registration (email already exists: ${dto.email})`,
        context?.method,
        context?.url,
        dto,
      );
      throw new BadRequestException('Email already exists');
    }

    let organization = await this.orgRepo.findOne({
      where: { name: dto.organizationName },
    });

    if (!organization) {
      organization = this.orgRepo.create({ name: dto.organizationName });
      organization = await this.orgRepo.save(organization);
      this.audit.log(
        null,
        `Created new organization "${dto.organizationName}" during registration`,
        context?.method,
        context?.url,
      );
    }

    const role = dto.role ?? RoleName.VIEWER;

    const user = this.userRepo.create({
      email: dto.email,
      password: dto.password,
      fullName: dto.fullName,
      organization,
      role,
    });

    const savedUser = await this.userRepo.save(user);

    this.audit.log(
      savedUser,
      'User registered successfully',
      context?.method,
      context?.url,
      dto,
    );

    //  Return organization as object instead of string
    return {
      id: savedUser.id,
      email: savedUser.email,
      fullName: savedUser.fullName,
      role: savedUser.role,
      organization: {
        id: organization.id,
        name: organization.name,
      },
    };
  }
}
