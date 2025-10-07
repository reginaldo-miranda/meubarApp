// admin/src/services/productService.ts
import { api } from "./api";

// Tipagem do produto
export interface Produto {
  _id: string;
  nome: string;
  precoVenda: number;
  ativo: boolean;
}

export const productService = {
  // Listar todos os produtos
  list: async (): Promise<Produto[]> => {
    const res = await api.get<Produto[]>("/products");
    return res.data;
  },

  // Buscar produto por ID
  getById: async (id: string): Promise<Produto> => {
    const res = await api.get<Produto>(`/products/${id}`);
    return res.data;
  },

  // Criar novo produto
  create: async (produto: Partial<Produto>): Promise<Produto> => {
    const res = await api.post<Produto>("/products", produto);
    return res.data;
  },

  // Atualizar produto
  update: async (id: string, produto: Partial<Produto>): Promise<Produto> => {
    const res = await api.put<Produto>(`/products/${id}`, produto);
    return res.data;
  },

  // Ativar/Inativar produto
  toggleActive: async (id: string, ativo: boolean): Promise<Produto> => {
    const res = await api.put<Produto>(`/products/${id}`, { ativo });
    return res.data;
  },

  // Deletar produto (opcional)
  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};
