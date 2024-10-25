import { Body, Controller, Get, Patch, Post, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { TeachersService } from 'src/teachers/teachers.service';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dtos/login.dto';
import { LocalTeacherAuthGuard } from './guards/local-teacher-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Auth } from 'common/decorators/auth.decorator';
import { ChangePasswordDto } from './dtos/change-password.dto';

@ApiBearerAuth()
@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalTeacherAuthGuard)
    @ApiOperation({summary: 'Đăng nhập giảng viên/sinh viên'})
    @Post('/teacher/login')
    async teacherLogin(@Request() req: any, @Body(ValidationPipe) loginDto: LoginDto) {
        return await this.authService.generateToken(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @ApiOperation({summary: 'Get teacher profile'})
    @Get('/teacher/profile')
    async getTeacherProfile(@Auth() auth: any) {
        return this.authService.getTeacherProfile(auth);
    }

    @UseGuards(JwtAuthGuard)
    @ApiOperation({summary: 'Get student profile'})
    @Get('/student/profile')
    async getStudentProfile(@Auth() auth: any) {
        return this.authService.getStudentProfile(auth);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/teacher/change-password')
    async changeTeacherPassword(@Auth() auth: any, @Body(ValidationPipe) changePasswordDto: ChangePasswordDto) {
        return this.authService.changeTeacherPassword(auth, changePasswordDto);
    }
}
