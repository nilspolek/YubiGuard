export interface User {
  id: string; // UUID
  first_name: string;
  last_name: string;
  email: string;
  keys: string[];
}

export interface CreateUserDto {
  first_name: string;
  last_name: string;
  email: string;
}
