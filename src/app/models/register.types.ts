import {UserRole} from './user.types';

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  specialty?: string;
}
