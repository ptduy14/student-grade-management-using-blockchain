import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalTeacherStrategy extends PassportStrategy(Strategy, 'local-teacher') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    try {
      const teacher = await this.authService.teacherCredentialByPassword({
        email,
        password,
      });

      return teacher;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new UnauthorizedException(
          'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.',
        );
      }
    }
  }
}
