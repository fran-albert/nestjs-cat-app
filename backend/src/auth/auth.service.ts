import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const userExists = await this.usersService.findOneByEmail(
      registerDto.email,
    );

    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const newUser = {
      ...registerDto,
      password: await bcryptjs.hash(registerDto.password, 10),
      role: [Role.USER], // Asignar un rol predeterminado
    };

    await this.usersService.create(newUser);

    return {
      message: 'User created successfully',
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(
      loginDto.email,
    );
    if (!user) {
      throw new UnauthorizedException('Email is wrong');
    }

    const isPasswordValid = await bcryptjs.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Password is wrong');
    }

    const payload = { email: user.email, roles: user.role };
    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      email: user.email,
    };
  }

  async profile({ email, roles }: { email: string; roles: string }) {
    return await this.usersService.findOneByEmail(email);
  }
}
