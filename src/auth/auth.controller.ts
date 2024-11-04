import { Body, Controller, Get, Patch, Post, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { TeachersService } from 'src/teachers/teachers.service';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dtos/login.dto';
import { LocalTeacherAuthGuard } from './guards/local-teacher-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Auth } from 'common/decorators/auth.decorator';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { Roles } from 'common/decorators/roles.decorator';
import { UserRoleEnum } from 'common/enums/user-role.enum';
import { RolesGuard } from './guards/roles.guard';
import { AddWalletAddressDto } from './dtos/add-wallet-address.dto';

@ApiBearerAuth()
@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalTeacherAuthGuard)
    @ApiOperation({summary: 'Đăng nhập giảng viên/sinh viên'})
    @Post('/login')
    async login(@Request() req: any, @Body(ValidationPipe) loginDto: LoginDto) {
        return await this.authService.generateToken(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @ApiOperation({summary: 'Lấy profile giáo viên'})
    @Get('/teacher/profile')
    async getTeacherProfile(@Auth() auth: any) {
        return this.authService.getTeacherProfile(auth);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRoleEnum.TEACHER, UserRoleEnum.ADMIN)
    @ApiOperation({summary: 'Kiểm tra địa chỉ ví của giảng viên'})
    @Get('/teacher/check-wallet-address')
    async checkWalletAdrress(@Auth() auth: any) {
        return this.authService.checkWalletAddress(auth);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRoleEnum.TEACHER, UserRoleEnum.ADMIN)
    @ApiOperation({summary: 'Thêm wallet address cho giảng viên'})
    @Post('/teacher/add-wallet-address')
    async addWalletAddress(@Auth() auth: any, @Body() addWalletAddressDto: AddWalletAddressDto) {
        return this.authService.addWalletAddress(auth, addWalletAddressDto);
    }

    @UseGuards(JwtAuthGuard)
    @ApiOperation({summary: 'Get profile sinh viên'})
    @Get('/student/profile')
    async getStudentProfile(@Auth() auth: any) {
        return this.authService.getStudentProfile(auth);
    }

    @ApiOperation({summary: 'Đổi mật khẩu giảng viên/sinh viên'})
    @UseGuards(JwtAuthGuard)
    @Patch('/teacher/change-password')
    async changeTeacherPassword(@Auth() auth: any, @Body(ValidationPipe) changePasswordDto: ChangePasswordDto) {
        return this.authService.changePassword(auth, changePasswordDto);
    }
}
