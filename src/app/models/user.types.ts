export enum UserRole {
  patient,
  doctor
}
export interface User {
  id?: string;
  email: string;
  passwordHash?: string;
  firstName: string;
  lastName: string;
  imagePath?: string;
  role?: UserRole;
}
