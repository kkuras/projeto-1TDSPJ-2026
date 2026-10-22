import type { TipoProduto } from "../types/types";

async function carregaProdutos(): Promise<TipoProduto[]> {
  try {
    const url = import.meta.env.VITE_API_URL;

    await new Promise(resolve => setTimeout(resolve, 2000));

    const resposta = await fetch(url);
    if (!resposta.ok) {
      throw new Error(`Erro na listagem: ${resposta.status}`);
    }
    const resultado  = await resposta.json();

    if(resultado.status === "error") {
      throw new Error(`Erro na listagem: ${resultado.message}`);
    }
    const dados: TipoProduto[] = resultado.data;
    return dados;

  } catch (error) {
    console.error(error);
    throw error;
  }
}
export const produtosPromise = carregaProdutos();
