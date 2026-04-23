export interface Produto {
  id: number;
  nome: string;
  descricao: string | null;
  preco: number;
  estoque: number;
  ativo: boolean;
  criado_em: Date;
  atualizado_em: Date;
}

export interface ProdutoCreateDTO {
  nome: string;
  descricao?: string;
  preco: number;
  estoque?: number;
}

export interface ProdutoUpdateDTO {
  nome?: string;
  descricao?: string;
  preco?: number;
  estoque?: number;
  ativo?: boolean;
}