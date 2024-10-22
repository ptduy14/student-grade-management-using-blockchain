import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TeachersModule } from 'src/teachers/teachers.module';
import { LocalTeacherStrategy } from './strategies/local-teacher.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TeachersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      // signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, LocalTeacherStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
