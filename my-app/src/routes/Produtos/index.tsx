import { useEffect, useRef, useState } from "react";
import type { TipoProduto } from "../../types/types";
import { Link } from "react-router";
import { CiEdit as Editar} from "react-icons/ci";
import { RiDeleteBin6Line as Excluir } from "react-icons/ri";
import { produtosPromise } from "../../service/produto";

const API_URL = import.meta.env.VITE_API_URL

export default function Produtos() {
  document.title = "Produtos";

                       
  //REF do DIALOG para o produto que será deletado:
  const dialogRef = useRef<HTMLDialogElement>(null);
  //STATE do DIALOG para o produto que será deletado:
  const[idExclusivo, setIdExclusivo] = useState<string>("");

  //Abrir modal
  const abrirModal = (id:string)=>{
    setIdExclusivo(id);
    dialogRef.current?.showModal();
  }

  //Estrutua que vai receber a lista, seja ela mocada ou externa!
  const [produtos, setProdutos] = useState<TipoProduto[]>([]);


  useEffect(() => {

    //Função para carregar os dados
    const carregaProdutos = async ()=>{
      try {

        const data:TipoProduto[] = await produtosPromise;
        setProdutos(data);
        
      } catch (error) {
        console.error(error);
      }
    }

    carregaProdutos();

  }, []);

  const handleDelete = async()=>{
      try {

        const response = await fetch(API_URL, {
          method: "POST",
          headers:{
            "Content-Type":"text/plain;charset=utf-8"
          },
          body: JSON.stringify({action:"DELETE",id:idExclusivo}),redirect:"follow"
        });

        if(!response.ok){
          throw new Error(`Falha na exclusão dos produtos... ${response.status} - ${response.statusText}`);
        }

        const {status}  = await response.json();

        if(status === "error") {
          throw new Error(`Erro na listagem: ${status}`);
        }
       
        const id:string = idExclusivo;
        
        //Refatorando o idEclusivo para utilizalo como ponteiro de transformação do MODAL!
        dialogRef.current?.close();
        setIdExclusivo("");
        dialogRef.current?.showModal()
       
        //RECARREGANDO A TABELA DE PRODUTOS
        setProdutos((prevProdut)=> prevProdut.filter((p)=> p.id !== id));

      } catch (error) {
        console.error(error);
      }
  }

  return (
    <main>
      <h2>Produtos</h2>

      <dialog ref={dialogRef} style={{ padding: "20px", borderRadius: "8px", border: "1px solid #ccc" }}>
        <h3>Confirmar Exclusão de Produto</h3>
        {
          idExclusivo !== "" ?(
          <div>
            <p>Tem certeza que deseja excluir este produto?</p>
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "15px" }}>
              <button onClick={()=> dialogRef.current?.close()}>Cancelar</button>
              <button onClick={()=> handleDelete()} style={{ background: "red", color: "white", border: "none", padding: "5px 10px", cursor: "pointer" }}>Excluir</button>
            </div>
        </div>
        ):(
          <div>
            <p>Produto Excluído com Sucesso</p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "15px" }}>
              <button onClick={()=> dialogRef.current?.close()} style={{ background: "blue", color: "white", border: "none", padding: "5px 10px", cursor: "pointer" }}>Close</button>
            </div>
        </div>
        )
        }

      </dialog>

      <table border={1} style={{margin:"0 auto",borderCollapse:"collapse"}}>
        <thead>
          <tr>
            <th>ID</th>
            <th>NOME</th>
            <th>PREÇO</th>
            <th>AVATAR</th>
            <th>AÇÕES</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((p,i) => (
            <tr key={i}>
              <td>{p.id}</td>
              <td>{p.nome}</td>
              <td>{p.preco}</td>
              <td>
               {
                p.avatar == "" ? <img src={"https://placehold.co/200x200/000000/FFFFFF/png"} alt={p.nome} width={30}/> : <img src={p.avatar} alt={p.nome} width={30}/> 
                }
              </td>
              <td>
                <Link to={`/editar-produtos/${p.id}`}><Editar/></Link> |
                <Excluir style={{cursor:"pointer"}} onClick={()=> abrirModal(p.id)}/>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={5}>Quantidade de produtos : {produtos.length}</td>
          </tr>
        </tfoot>
      </table>
    </main>
  );
}
