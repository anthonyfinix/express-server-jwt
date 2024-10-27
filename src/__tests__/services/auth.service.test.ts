import mongoose from 'mongoose';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../config/config';

declare global {
    var __MONGO_URI__: string;
}

describe('Auth Service Test', () => {
    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    describe('registerUser', () => {
        it('should register a new user successfully', async () => {
            const userData = {
                email: 'test@test.com',
                password: 'password123',
                name: 'Test User',
            };

            const result = await AuthService.registerUser(userData);

            expect(result.user).toBeDefined();
            expect(result.token).toBeDefined();
            expect(result.user.email).toBe(userData.email);
            expect(result.user.name).toBe(userData.name);
        });

        it('should not register user with existing email', async () => {
            const userData = {
                email: 'test@test.com',
                password: 'password123',
                name: 'Test User',
            };

            await AuthService.registerUser(userData);

            await expect(AuthService.registerUser(userData)).rejects.toThrow('User already exists');
        });
    });

    describe('loginUser', () => {
        it('should login user with correct credentials', async () => {
            const userData = {
                email: 'test@test.com',
                password: 'password123',
                name: 'Test User',
            };

            await AuthService.registerUser(userData);

            const result = await AuthService.loginUser(userData.email, userData.password);

            expect(result.user).toBeDefined();
            expect(result.token).toBeDefined();
            expect(result.user.email).toBe(userData.email);
        });

        it('should not login with incorrect password', async () => {
            const userData = {
                email: 'test@test.com',
                password: 'password123',
                name: 'Test User',
            };

            await AuthService.registerUser(userData);

            await expect(AuthService.loginUser(userData.email, 'wrongpassword')).rejects.toThrow('Invalid credentials');
        });
    });
});