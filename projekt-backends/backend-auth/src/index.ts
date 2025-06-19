import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

const port = 3001;
app.listen(port, () => {
  console.log(`Auth backend körs på http://localhost:${port}`);
});
