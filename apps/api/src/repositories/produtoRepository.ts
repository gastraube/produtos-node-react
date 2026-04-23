import pool from '../config/database';
import { Produto, ProdutoCreateDTO, ProdutoUpdateDTO } from '../types/produto';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class ProdutoRepository {
  async listarTodos(): Promise<Produto[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM produtos WHERE ativo = TRUE ORDER BY id DESC'
    );
    return rows as Produto[];
  }

  async buscarPorId(id: number): Promise<Produto | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM produtos WHERE id = ? AND ativo = TRUE',
      [id]
    );
    return rows.length > 0 ? (rows[0] as Produto) : null;
  }

  async criar(produto: ProdutoCreateDTO): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO produtos (nome, descricao, preco, estoque) VALUES (?, ?, ?, ?)',
      [produto.nome, produto.descricao ?? null, produto.preco, produto.estoque ?? 0]
    );
    return result.insertId;
  }

  async atualizar(id: number, produto: ProdutoUpdateDTO): Promise<boolean> {
    const campos: string[] = [];
    const valores: any[] = [];

    if (produto.nome !== undefined) { 
      campos.push('nome = ?'); valores.push(produto.nome); 
    }
    if (produto.descricao !== undefined) { 
      campos.push('descricao = ?'); 
      valores.push(produto.descricao); 
    }
    if (produto.preco !== undefined) { 
      campos.push('preco = ?'); 
      valores.push(produto.preco); }
    if (produto.estoque !== undefined) { 
      campos.push('estoque = ?'); 
      valores.push(produto.estoque); }
    if (produto.ativo !== undefined) { 
      campos.push('ativo = ?'); 
      valores.push(produto.ativo); 
    }

    if (campos.length === 0) return false;

    valores.push(id);
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE produtos SET ${campos.join(', ')} WHERE id = ?`,
      valores
    );
    return result.affectedRows > 0;
  }

  async deletar(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE produtos SET ativo = FALSE WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}