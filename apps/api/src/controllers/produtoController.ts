import { Request, Response } from 'express';
import { ProdutoService } from '../services/produtoService';

export class ProdutoController {
  private service: ProdutoService;

  constructor() {
    this.service = new ProdutoService();
  }

  listar = async (req: Request, res: Response): Promise<void> => {
    try {
      const produtos = await this.service.listar();
      res.json(produtos);
    } catch (error) {
      res.status(500).json({ erro: (error as Error).message });
    }
  };

  buscarPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const produto = await this.service.buscarPorId(id);
      res.json(produto);
    } catch (error) {
      const mensagem = (error as Error).message;
      const status = mensagem === 'Produto não encontrado' ? 404 : 500;
      res.status(status).json({ erro: mensagem });
    }
  };

  criar = async (req: Request, res: Response): Promise<void> => {
    try {
      const produto = await this.service.criar(req.body);
      res.status(201).json(produto);
    } catch (error) {
      res.status(400).json({ erro: (error as Error).message });
    }
  };

  atualizar = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const produto = await this.service.atualizar(id, req.body);
      res.json(produto);
    } catch (error) {
      const mensagem = (error as Error).message;
      const status = mensagem === 'Produto não encontrado' ? 404 : 400;
      res.status(status).json({ erro: mensagem });
    }
  };

  deletar = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      await this.service.deletar(id);
      res.status(204).send();
    } catch (error) {
      const mensagem = (error as Error).message;
      const status = mensagem === 'Produto não encontrado' ? 404 : 500;
      res.status(status).json({ erro: mensagem });
    }
  };
}