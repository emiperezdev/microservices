import { Request, Response, NextFunction } from 'express';

export default function(err: any, req: Request, res: Response, next: NextFunction) {
  console.log(err.message, err);
  res.status(500).send('>>> [AUTH SERVICE] Something failed.');
}