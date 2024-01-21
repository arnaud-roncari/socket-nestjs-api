import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/module/user/user.schema';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { UserAlreadyExistException } from 'src/common/errors/security/user-already-exist';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { JwtContent } from 'src/common/types/jwt-content';
import { UserNotFoundException } from 'src/common/errors/security/user-not-found';
import { InvalidPasswordException } from 'src/common/errors/security/invalid-password';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: mongoose.Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<string> {
    const { username, password } = dto;
    const existingUser = await this.userModel.findOne({ username });

    if (!existingUser) {
      throw new UserNotFoundException();
    }
    const match = await argon2.verify(existingUser.password_hash, password);
    if (!match) {
      throw new InvalidPasswordException();
    }
    return await this.jwtService.signAsync({
      id: existingUser._id.toString(),
    } as JwtContent);
  }

  async signup(dto: SignupDto): Promise<string> {
    const { username, password } = dto;
    const isUsername = await this.userModel.findOne({ username });

    if (isUsername) {
      throw new UserAlreadyExistException();
    }

    const passwordHash = await argon2.hash(password);
    const userCreated = await this.userModel.create({
      username,
      password_hash: passwordHash,
      avatar_number: Math.floor(Math.random() * 15) + 1,
    });
    return await this.jwtService.signAsync({
      id: userCreated._id.toString(),
    } as JwtContent);
  }
}