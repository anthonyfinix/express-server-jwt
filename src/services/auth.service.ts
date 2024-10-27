import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/config';
import { IUser, JwtPayload, UserModel } from '../types/user.types';

export class AuthService {
    static async registerUser(userData: Partial<IUser>) {
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const user = new User(userData);
        await user.save();

        const token = this.generateToken(user);

        return {
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
            token,
        };
    }

    static async loginUser(email: string, password: string) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('No user found');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const token = this.generateToken(user);
        console.log(user)

        return {
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
            token,
        };
    }

    private static generateToken(user: UserModel): string {
        const payload: JwtPayload = {
            userId: (user as any)._id.toString(),
            email: user.email,
        };

        return jwt.sign(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });
    }
}