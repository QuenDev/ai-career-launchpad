import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    userId?: number;
    userEmail?: string;
}

export const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        //1. get token fron header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({error: "No token provded"});
            return;
        }

        //2. extract token
        const token = authHeader.split(" ")[1];

        //3. verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            userId: number;
            email: string;
        };
       
        //4. attach user info to request 
        req.userId = decoded.userId;
        req.userEmail = decoded.email;

        //5. move to next function
        next();
    } catch (err) {
        res.status(401).json({error: "Invalid token"});

    }
    };
