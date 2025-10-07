/* // mobile/src/services/saleService.ts
import { api } from "./api";

export const saleService = {
  getOpen: async () => {
    const res = await api.get("/sales/open");
    return res.data;
  },

  create: async (data: any) => {
    const res = await api.post("/sales/create", data);
    return res.data;
  },

  addItem: async (vendaId: string, produtoId: string, quantidade: number) => {
    const res = await api.post(`/sales/${vendaId}/item`, { produtoId, quantidade });
    return res.data;
  },

  removeItem: async (vendaId: string, produtoId: string) => {
    const res = await api.delete(`/sales/${vendaId}/item/${produtoId}`);
    return res.data;
  },

  finalize: async (vendaId: string, formaPagamento: string) => {
    const res = await api.put(`/sales/${vendaId}/finalize`, { formaPagamento });
    return res.data;
  },
};
*/
/*
// mobile/src/services/saleService.ts
import { api } from "./api";

export interface ItemVenda {
  produto: string;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface Venda {
  _id: string;
  mesa?: string;
  funcionario: { nome: string };
  cliente?: { nome: string };
  itens: ItemVenda[];
  status: string;
  total?: number;
}

// Serviço de vendas
export const saleService = {
  getOpen: async (): Promise<Venda[]> => {
    const res = await api.get("/sales/open");
    return res.data;
  },

  create: async (data: any): Promise<Venda> => {
    const res = await api.post("/sales/create", data);
    return res.data;
  },

  addItem: async (vendaId: string, produtoId: string, quantidade: number): Promise<Venda> => {
    const res = await api.post(`/sales/${vendaId}/item`, { produtoId, quantidade });
    return res.data;
  },

  removeItem: async (vendaId: string, produtoId: string): Promise<Venda> => {
    const res = await api.delete(`/sales/${vendaId}/item/${produtoId}`);
    return res.data;
  },

  finalize: async (vendaId: string, formaPagamento: string): Promise<Venda> => {
    const res = await api.put(`/sales/${vendaId}/finalize`, { formaPagamento });
    return res.data;
  },
};
*/
/*
import { api } from "./api";

export interface ItemVenda {
  produto: string;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface Venda {
  _id: string;
  mesa?: string;
  funcionario: { nome: string };
  cliente?: { nome: string };
  itens: ItemVenda[];
  status: string;
  total?: number;
}

export const saleService = {
  getOpen: async (): Promise<Venda[]> => {
    const res = await api.get<Venda[]>("/sales/open");
    return res.data;
  },

  create: async (data: any): Promise<Venda> => {
    const res = await api.post<Venda>("/sales/create", data);
    return res.data;
  },

  addItem: async (vendaId: string, produtoId: string, quantidade: number): Promise<Venda> => {
    const res = await api.post<Venda>(`/sales/${vendaId}/item`, { produtoId, quantidade });
    return res.data;
  },

  removeItem: async (vendaId: string, produtoId: string): Promise<Venda> => {
    const res = await api.delete<Venda>(`/sales/${vendaId}/item/${produtoId}`);
    return res.data;
  },

  finalize: async (vendaId: string, formaPagamento: string): Promise<Venda> => {
    const res = await api.put<Venda>(`/sales/${vendaId}/finalize`, { formaPagamento });
    return res.data;
  },
};
*/


// mobile/src/services/saleService.ts
import { api } from "./api";

// Tipagem da venda
export interface ItemVenda {
  produto: string;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface Funcionario {
  _id: string;
  nome: string;
}

export interface Cliente {
  _id: string;
  nome: string;
}

export interface Venda {
  _id: string;
  funcionario: Funcionario;
  cliente?: Cliente;
  mesa?: string;
  nomeComanda?: string;
  itens: ItemVenda[];
  total?: number;
  desconto?: number;
  status: "aberta" | "finalizada" | "cancelada";
  tipoVenda: "mesa" | "balcao";
  formaPagamento?: "dinheiro" | "cartao" | "pix";
  dataVenda?: string;
  dataFinalizacao?: string;
}

// Parâmetros para filtro de listagem
export interface ListParams {
  status?: string;
  funcionario?: string;
  cliente?: string;
  dataInicio?: string;
  dataFim?: string;
}

export const saleService = {
  // Criar nova venda
  create: async (venda: Partial<Venda>): Promise<Venda> => {
    const res = await api.post<Venda>("/sales/create", venda);
    return res.data;
  },

  // Listar vendas abertas
  getOpen: async (): Promise<Venda[]> => {
    const res = await api.get<Venda[]>("/sales/open");
    return res.data;
  },

  // Listar vendas com filtros
  list: async (params?: ListParams): Promise<Venda[]> => {
    const res = await api.get<Venda[]>("/sales/list", { params });
    return res.data;
  },

  // Buscar venda por ID
  getById: async (id: string): Promise<Venda> => {
    const res = await api.get<Venda>(`/sales/${id}`);
    return res.data;
  },

  // Adicionar item
  addItem: async (
    vendaId: string,
    produtoId: string,
    quantidade: number
  ): Promise<Venda> => {
    const res = await api.post<Venda>(`/sales/${vendaId}/item`, { produtoId, quantidade });
    return res.data;
  },

  // Remover item
  removeItem: async (vendaId: string, produtoId: string): Promise<Venda> => {
    const res = await api.delete<Venda>(`/sales/${vendaId}/item/${produtoId}`);
    return res.data;
  },

  // Atualizar quantidade de item
  updateItemQuantity: async (
    vendaId: string,
    produtoId: string,
    quantidade: number
  ): Promise<Venda> => {
    const res = await api.put<Venda>(`/sales/${vendaId}/item/${produtoId}`, { quantidade });
    return res.data;
  },

  // Aplicar desconto
  applyDiscount: async (vendaId: string, desconto: number): Promise<Venda> => {
    const res = await api.put<Venda>(`/sales/${vendaId}/discount`, { desconto });
    return res.data;
  },

  // Finalizar venda
  finalize: async (vendaId: string, formaPagamento: "dinheiro" | "cartao" | "pix"): Promise<Venda> => {
    const res = await api.put<Venda>(`/sales/${vendaId}/finalize`, { formaPagamento });
    return res.data;
  },

  // Cancelar venda
  cancel: async (vendaId: string): Promise<Venda> => {
    const res = await api.put<Venda>(`/sales/${vendaId}/cancel`);
    return res.data;
  },
};
