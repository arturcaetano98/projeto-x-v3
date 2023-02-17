import { useState, useContext, useEffect} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { buscaPorSegurado, alteraSegurado } from "../../servicos/api";

import "react-toastify/dist/ReactToastify.css";
import "./Cotacao.css";

import Botao from "../../componentes/Botao";
import UsuarioContexto from "../../contextos/UsuarioContext";

const Cotacao = () => {

    const { state } = useLocation();
    const numeroCotacao = parseInt(state);

    const { nome } = useContext(UsuarioContexto);
    const [segurado, setSegurado]  = useState([]);

    const navegate = useNavigate();

    const efetivaProposta = (evento) => {
        evento.preventDefault();
        alteraSegurado(numeroCotacao , { "proposta_efetivada": true });
        toast.success(`Proposta do(a) ${segurado[0]?.nome_segurado} efetivada com sucesso!`);
    }

    const deslogarUsuario = () => {
        localStorage.removeItem("token");
    }

    useEffect(() => {
        if(state === null && localStorage.getItem("token") != null){
            navegate("/menuUsuario");
        }
        else if (state === null && localStorage.getItem("token") == null){
            navegate("/");
        }
        else {
            buscaPorSegurado(numeroCotacao)
            .then((seguradoEncontrado) => {
                setSegurado(seguradoEncontrado.data);
            })
            .catch((e) => {
                console.log(e);
            });
        }
        // eslint-disable-next-line
    }, []);

    return (
        <div>
            <p className="Cotacao-saudacoes">Olá {nome}, <Link className="Cotacao-sair" to="/" onClick={() => deslogarUsuario()}>Sair</Link></p>
            <div className="Cotacao-formulario">
                <h1 className="Cotacao-titulo">Cotação número: {segurado[0]?.n_cotacao}</h1>
                <ToastContainer />
                <div className="Cotacao-informacao"><label>Nome do segurado:</label> {segurado[0]?.nome_segurado}</div>
                <div className="Cotacao-informacao"><label>CPF:</label> {segurado[0]?.cpf_segurado}</div>
                <div className="Cotacao-informacao"><label>Início de vigência:</label> {segurado[0]?.inicio_vigencia}</div>
                <div className="Cotacao-informacao"><label>Termino de vigência:</label> {segurado[0]?.termino_vigencia}</div>
                <div className="Cotacao-informacao"><label>Valor do Risco (R$):</label> {segurado[0]?.valor_risco.toFixed(2)}</div>
                <div className="Cotacao-informacao"><label>Tipo de Cobertura:</label> {segurado[0]?.tipo_cobertura}</div>
                <div className="Cotacao-informacao"><label>Valor anual do seguro (R$):</label> {segurado[0]?.valor_seguro.toFixed(2)}</div>
                <Botao
                    botaoOnClick={(evento) => efetivaProposta(evento)}
                    botaoTexto="Efetivar proposta"
                />
                <Link className="Cotacao-sair" to="/listarCotacoes">Voltar</Link>
            </div>
        </div>
    );
}

export default Cotacao;