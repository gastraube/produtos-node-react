import { ProdutoRepository } from '../repositories/produtoRepository';
import { Produto, ProdutoCreateDTO, ProdutoUpdateDTO } from '../types/produto';

export class ProdutoService {
  private repository: ProdutoRepository;

  constructor() {
    this.repository = new ProdutoRepository();
  }

  async listar(): Promise<Produto[]> {
    return this.repository.listarTodos();
  }

  async buscarPorId(id: number): Promise<Produto> {
    const produto = await this.repository.buscarPorId(id);
    if (!produto) {
      throw new Error('Produto não encontrado');
    }
    return produto;
  }

  async criar(dto: ProdutoCreateDTO): Promise<Produto> {
    this.validarCriacao(dto);
    const id = await this.repository.criar(dto);
    return this.buscarPorId(id);
  }

  async atualizar(id: number, dto: ProdutoUpdateDTO): Promise<Produto> {
    await this.buscarPorId(id);
    this.validarAtualizacao(dto);
    await this.repository.atualizar(id, dto);
    return this.buscarPorId(id);
  }

  async deletar(id: number): Promise<void> {
    await this.buscarPorId(id);
    await this.repository.deletar(id);
  }

  private validarCriacao(dto: ProdutoCreateDTO): void {
    if (!dto.nome || dto.nome.trim().length === 0) {
      throw new Error('Nome é obrigatório');
    }
    if (dto.preco === undefined || dto.preco < 0) {
      throw new Error('Preço deve ser maior ou igual a zero');
    }
    if (dto.estoque !== undefined && dto.estoque < 0) {
      throw new Error('Estoque não pode ser negativo');
    }
  }

  private validarAtualizacao(dto: ProdutoUpdateDTO): void {
    if (dto.preco !== undefined && dto.preco < 0) {
      throw new Error('Preço deve ser maior ou igual a zero');
    }
    if (dto.estoque !== undefined && dto.estoque < 0) {
      throw new Error('Estoque não pode ser negativo');
    }
  }
}