import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { extractDomain } from 'common/utils/extract-domain.util';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local-teacher') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    try {
      if (extractDomain(email) === 'ctuet.edu.vn') {
        const teacher = await this.authService.teacherCredentialByPassword({
          email,
          password,
        });

        return teacher;
      } else {
        const student = await this.authService.studentCredentialByPassword({
          email,
          password,
        });
        return student;
      }
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
