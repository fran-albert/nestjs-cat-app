import { Role } from "src/common/enums/role.enum";

export class CreateUserDto {
  name?: string;
  email: string;
  password: string;
  role?: Role[];
}
