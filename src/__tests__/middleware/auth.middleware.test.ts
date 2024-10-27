import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticate } from '../../middleware/auth.middleware';
import { User } from '../../models/user.model';
import { JWT_SECRET } from '../../config/config';

describe('Auth Middleware Test', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  it('should authenticate valid token', async () => {
    const user = await User.create({
      email: 'test@test.com',
      password: 'password123',
      name: 'Test User',
    });

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET);
    mockRequest.header = jest.fn().mockReturnValue(`Bearer ${token}`);

    await authenticate(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.user).toBeDefined();
  });

  it('should reject invalid token', async () => {
    mockRequest.header = jest.fn().mockReturnValue('Bearer invalid-token');

    await authenticate(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Please authenticate' });
  });
});