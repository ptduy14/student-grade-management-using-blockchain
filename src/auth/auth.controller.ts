import { Body, Controller, Post, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { TeachersService } from 'src/teachers/teachers.service';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dtos/login.dto';
import { LocalTeacherAuthGuard } from './guards/local-teacher-auth.guard';

@ApiBearerAuth()
@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalTeacherAuthGuard)
    @ApiOperation({summary: 'Đăng nhập giảng viên'})
    @Post('/teacher/login')
    async teacherLogin(@Request() req: any, @Body(ValidationPipe) loginDto: LoginDto) {
        return await this.authService.generateToken(req.user);
    }
}
