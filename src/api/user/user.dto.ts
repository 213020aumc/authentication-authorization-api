
import { User, UserRole } from './user.entity.js';

export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
}

export const toUserResponseDto = (user: User): UserResponseDto => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
  };
};