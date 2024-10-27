import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
    static async register(req: Request, res: Response) {
        try {
            const { email, password, name } = req.body;
            const result = await AuthService.registerUser({ email, password, name });
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const result = await AuthService.loginUser(email, password);
            res.status(200).json(result);
        } catch (error) {
            res.status(401).json({ error: (error as Error).message });
        }
    }
}
