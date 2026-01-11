import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email: registerDto.email });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    const user = new this.userModel({
      ...registerDto,
      password: hashedPassword,
    });

    await user.save();
    
    const { password, ...result } = user.toObject();
    return {
      message: 'User registered successfully',
      user: result,
    };
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { userId: user._id.toString(), email: user.email, role: user.role };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async validateUser(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // If password is being updated, hash it
    if (updateProfileDto.password) {
      updateProfileDto.password = await bcrypt.hash(updateProfileDto.password, 10);
    }

    // Only update allowed fields, never allow email change
    const allowedFields = ['name', 'phone', 'company', 'password'];
    const updateData: any = {};
    
    allowedFields.forEach(field => {
      if ((updateProfileDto as any)[field] !== undefined) {
        updateData[field] = (updateProfileDto as any)[field];
      }
    });

    Object.assign(user, updateData);
    await user.save();

    const { password, ...result } = user.toObject();
    return {
      message: 'Profile updated successfully',
      user: result,
    };
  }
}
