import { Body, Controller, Get, Patch, Post, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { TeachersService } from 'src/teachers/teachers.service';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dtos/login.dto';
import { LocalTeacherAuthGuard } from './guards/local-teacher-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Auth } from 'common/decorators/auth.decorator';
import { TeacherDto } from 'src/teachers/dto/teacher.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';

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

    @UseGuards(JwtAuthGuard)
    @Get('/teacher/profile')
    async getTeacherProfile(@Auth() auth: any) {
        return this.authService.getTeacherProfile(auth);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/teacher/change-password')
    async changeTeacherPassword(@Auth() auth: any, @Body(ValidationPipe) changePasswordDto: ChangePasswordDto) {
        return this.authService.changeTeacherPassword(auth, changePasswordDto);
    }
}
