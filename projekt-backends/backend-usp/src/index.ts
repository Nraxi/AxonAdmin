import express from 'express';
import cors from 'cors';
import uspRoutes from './routes/uspRoutes';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/usp', uspRoutes);

const port = 3003;
app.listen(port, () => {
  console.log(`USP backend körs på http://localhost:${port}`);
});