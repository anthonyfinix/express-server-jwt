import { Request, Response } from 'express';
import { AuthController } from '../../controllers/auth.controller';
import { AuthService } from '../../services/auth.service';

declare global {
  var __MONGO_URI__: string;
}

jest.mock('../../services/auth.service');

describe('Auth Controller Test', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      body: {},
    };
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  describe('register', () => {
    it('should register user successfully', async () => {
      const userData = {
        email: 'test@test.com',
        password: 'password123',
        name: 'Test User',
      };
      mockRequest.body = userData;

      const mockAuthResponse = {
        user: { id: '123', ...userData },
        token: 'mock-token',
      };

      (AuthService.registerUser as jest.Mock).mockResolvedValue(mockAuthResponse);

      await AuthController.register(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockAuthResponse);
    });

    it('should handle registration error', async () => {
      mockRequest.body = {
        email: 'test@test.com',
        password: 'password123',
        name: 'Test User',
      };

      (AuthService.registerUser as jest.Mock).mockRejectedValue(new Error('Registration failed'));

      await AuthController.register(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Registration failed' });
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const loginData = {
        email: 'test@test.com',
        password: 'password123',
      };
      mockRequest.body = loginData;

      const mockAuthResponse = {
        user: { id: '123', email: loginData.email },
        token: 'mock-token',
      };

      (AuthService.loginUser as jest.Mock).mockResolvedValue(mockAuthResponse);

      await AuthController.login(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockAuthResponse);
    });

    it('should handle login error', async () => {
      mockRequest.body = {
        email: 'test@test.com',
        password: 'wrongpassword',
      };

      (AuthService.loginUser as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

      await AuthController.login(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });
  });
});