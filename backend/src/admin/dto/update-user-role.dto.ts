import { IsEnum } from 'class-validator';
import { UserRole } from '../../auth/schemas/user.schema';

export class UpdateUserRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
}
