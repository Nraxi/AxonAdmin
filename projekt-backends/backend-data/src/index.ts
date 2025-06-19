import express from 'express';
import cors from 'cors';
import todoRoutes from './routes/todoRoutes';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/data', todoRoutes);

const port = 3002;
app.listen(port, () => {
  console.log(`Data backend körs på http://localhost:${port}`);
});