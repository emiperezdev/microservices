import { Request, Response, NextFunction } from "express";

export default function validateApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.header("x-api-key");

  if (!apiKey) 
    return res.status(401).send(">>> [AUTH SERVICE] Access denied. No API key provided.");

  if (apiKey !== process.env.API_KEY) 
    return res.status(403).send(">>> [AUTH SERVICE] Invalid API key.");

  next();
}
