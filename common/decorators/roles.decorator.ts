import { SetMetadata } from '@nestjs/common';
import { TeacherRoleEnum } from 'common/enums/teacher-role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: TeacherRoleEnum[]) => SetMetadata(ROLES_KEY, roles);