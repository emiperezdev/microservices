import express from 'express';
import morgan from 'morgan';
import { AppRoutes } from '../presentation/AppRoutes';
import error from '../middleware/error';

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.use(AppRoutes.routes);

app.use(error);

export default app; 