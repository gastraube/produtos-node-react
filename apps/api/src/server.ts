import express from 'express';
import dotenv from 'dotenv';
import produtoRoutes from './routes/produtoRoutes';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

app.use('/api/produtos', produtoRoutes);

app.get('/', (req, res) => {
  res.json({ mensagem: 'API CRUD de Produtos rodando', versao: '1.0.0' });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});