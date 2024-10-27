import mongoose from 'mongoose';
import { User } from '../../models/user.model';

declare global {
    var __MONGO_URI__: string;
}

describe('User Model Test', () => {
    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    it('should create & save user successfully', async () => {
        const validUser = new User({
            email: 'test@test.com',
            password: 'password123',
            name: 'Test User',
        });
        const savedUser = await validUser.save();

        expect(savedUser._id).toBeDefined();
        expect(savedUser.email).toBe(validUser.email);
        expect(savedUser.name).toBe(validUser.name);
        expect(savedUser.password).not.toBe('password123'); // Should be hashed
    });

    it('should fail to save user without required fields', async () => {
        const userWithoutRequiredField = new User({ email: 'test@test.com' });
        let err;
        try {
            await userWithoutRequiredField.save();
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    });

    it('should not save password in plain text', async () => {
        const password = 'password123';
        const user = new User({
            email: 'test@test.com',
            password,
            name: 'Test User',
        });

        await user.save();
        expect(user.password).not.toBe(password);
    });

    it('should correctly compare passwords', async () => {
        const user = new User({
            email: 'test@test.com',
            password: 'password123',
            name: 'Test User',
        });

        await user.save();

        const isMatch = await user.comparePassword('password123');
        const isNotMatch = await user.comparePassword('wrongpassword');

        expect(isMatch).toBe(true);
        expect(isNotMatch).toBe(false);
    });
});