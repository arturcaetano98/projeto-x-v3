import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { buscaSegurados } from "../../servicos/api";

import "./ListarCotacoes.css";

import CampoSelecao from "../../componentes/CampoSelecao";

import UsuarioContexto from "../../contextos/UsuarioContext";
import SeguradoContexto from "../../contextos/SeguradoContext";

const ListarCotacoes = () => {

    const navegate = useNavigate();

    const { id, nome } = useContext(UsuarioContexto);
    const { lista, setLista } = useContext(SeguradoContexto);

    const [ordenacao, setOrdenacao] = useState("Menor cotação");

    const header = [ "Nº Cotação", "Nome Segurado", "CPF", "Inicio Vigência", "Termino Vigência", "Valor do Risco (R$)", "Cobertura", "Valor seguro (R$)", "Informações"];
    const valores = lista?.filter(item => (item.proposta_efetivada === false) && (item.id_usuario === id));

    const exibirDetalhes = (evento, n_cotacao) => {
        evento.preventDefault();
        navegate("/cotacao", { state: n_cotacao.toString() });
    }

    const deslogarUsuario = () => {
        localStorage.removeItem("token");
    }
    
    useEffect(() => {
        buscaSegurados()
        .then((listaSegurados) => {
            setLista(listaSegurados.data);      
        })
        .catch((e) => {
            console.log(e);
        });
    }, []);

    return(
        <div>
            <p className="ListarCotacoes-saudacoes">Olá {nome}, <Link className="ListarCotacoes-sair" to="/" onClick={() => deslogarUsuario()}>Sair</Link></p>
            <div className="ListarCotacoes-lista">
                <h1 className="ListarCotacoes-titulo">Listando as cotações</h1>
                {
                    valores.length === 0 ? 
                    <p className="ListaCotacoes-mensagemRegistro"> Nenhum registro de cotações foi encontrado</p> :
                    <div>
                        <div className="ListarCotacoes-ordenacao">
                            <CampoSelecao
                                campoSelecaoValores={["Menor cotação", "Maior cotação"]}
                                campoSelecaoValor={ordenacao}
                                alteraCampo={evento => setOrdenacao(evento.target.value)}
                            />
                        </div>
                        <table className="ListarCotacoes-tabela">
                            <thead className="ListarCotacoes-cabecalho">
                                <tr>
                                    {header?.map((headerItem, index) => 
                                    (<th className="ListarCotacoes-coluna" key={index}>{headerItem}</th>))}
                                </tr>
                            </thead>
                            <tbody>
                                {valores?.sort((a, b) => {return (ordenacao === "Menor cotação" ? a.n_cotacao - b.n_cotacao : b.n_cotacao - a.n_cotacao)}
                                )?.map((valorItem, index) => 
                                    (<tr className="ListarCotacoes-linha" key={index}>
                                        <td className="ListarCotacoes-valor">{valorItem.n_cotacao}</td>
                                        <td className="ListarCotacoes-valor">{valorItem.nome_segurado}</td>
                                        <td className="ListarCotacoes-valor">{valorItem.cpf_segurado}</td>
                                        <td className="ListarCotacoes-valor">{valorItem.inicio_vigencia}</td>
                                        <td className="ListarCotacoes-valor">{valorItem.termino_vigencia}</td>
                                        <td className="ListarCotacoes-valor">{valorItem.valor_risco.toFixed(2)}</td>
                                        <td className="ListarCotacoes-valor">{valorItem.tipo_cobertura}</td>
                                        <td className="ListarCotacoes-valor">{valorItem.valor_seguro.toFixed(2)}</td>
                                        <td className="ListarCotacoes-valor">
                                            <Link 
                                                className="ListarCotacoes-maisDetalhes" 
                                                to="" 
                                                onClick={(evento) => exibirDetalhes(evento, valorItem.n_cotacao)}
                                            >
                                                mais detalhes
                                            </Link>
                                        </td>
                                    </tr>))}
                            </tbody>
                        </table>
                    </div>
                }
                <Link className="ListarCotacoes-voltar" to="/menuUsuario">Voltar</Link>
            </div>
        </div>
    );
}

export default ListarCotacoes;