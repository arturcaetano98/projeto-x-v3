import { useState, useContext, useEffect} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { buscaPorSegurado } from "../../servicos/api";

import "./Apolice.css";

import UsuarioContexto from "../../contextos/UsuarioContext";

const Apolice = () => {

    const { state } = useLocation();
    const numeroCotacao = parseInt(state);

    const { nome } = useContext(UsuarioContexto);
    const [segurado, setSegurado] = useState([]);

    const navegate = useNavigate();

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
            <p className="Apolice-saudacoes">Olá {nome}, <Link className="Apolice-sair" to="/" onClick={() => deslogarUsuario()}>Sair</Link></p>
                <div className="Apolice-formulario">
                    <h1 className="Apolice-titulo">Apólice número: {segurado[0]?.n_cotacao}</h1>
                    <div className="Apolice-informacao">
                        <p className="Apolice-texto">
                            A <div className="Apolice-enfase">Seguradora X</div>, registrada sob o CPNJ<div className="Apolice-enfase"> 00.000.00/0000-00</div>, tem como responsabilidade 
                            assegurar <div className="Apolice-enfase">{segurado[0]?.nome_segurado.toUpperCase()}</div>, portador do CPF<div className="Apolice-enfase"> {segurado[0]?.cpf_segurado}</div>, 
                            em um período que corresponde de <div className="Apolice-enfase">{segurado[0]?.inicio_vigencia}</div> à <div className="Apolice-enfase">{segurado[0]?.termino_vigencia}</div>.
                            Como responsável pelo <div className="Apolice-enfase"> Seguro X</div>, registrado na apólice <div className="Apolice-enfase"> {segurado[0]?.n_cotacao}</div>, a mesma se 
                            compromete em <div className="Apolice-enfase">INDENIZAR</div> o contratante do <div className="Apolice-enfase">SEGURO DE VIDA</div>, com um valor corresponde à 
                            <div className="Apolice-enfase"> R${segurado[0]?.valor_risco.toFixed(2)} </div> contra danos de natureza similares a <div className="Apolice-enfase"> {segurado[0]?.tipo_cobertura.toUpperCase()}</div>.
                        </p>
                    </div>
                <Link className="Apolice-sair" to="/listarApolices">Voltar</Link>
            </div>
        </div>
    );
}

export default Apolice;