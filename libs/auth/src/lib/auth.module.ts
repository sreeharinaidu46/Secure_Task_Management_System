import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Organization } from '@secure-task-system/data'; // ✅ include logger module
import { AuthService } from './auth.service.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { AuditLoggerModule } from './services/audit-logger.service.js';
import { AuthController } from './auth.controller.js';

@Module({
  imports: [
    
    TypeOrmModule.forFeature([User, Organization]),

    
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecretkey',
      signOptions: {
        expiresIn: parseInt(process.env.JWT_EXPIRES_IN as string) || '1d', //  properly typed & safe
      },
    }),

    //  Shared global audit logger
    AuditLoggerModule, 
  ],

  controllers: [AuthController], 
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
