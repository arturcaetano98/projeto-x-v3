import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { buscaUsuario, buscaCPF, enviaSegurado } from "../../servicos/api";

import "react-toastify/dist/ReactToastify.css";
import "./CriarCotacao.css";

import UsuarioContexto from "../../contextos/UsuarioContext";
import SeguradoContexto from "../../contextos/SeguradoContext";

import Botao from "../../componentes/Botao";
import CampoTexto from "../../componentes/CampoTexto";
import CampoNumerico from "../../componentes/CampoNumerico";
import CampoSelecao from "../../componentes/CampoSelecao";

import validaCPF from "../../utils/validaCadastroDePessoaFisica.js";

const CriarCotacao = () => {

    const { id, nome } = useContext(UsuarioContexto);

    const { nomeSeg, setNomeSeg, CPF, setCPF, 
        terminoVig, setTerminoVig, valorRisco, setValorRisco, 
        cobertura, setCobertura, setLista } = useContext(SeguradoContexto);

    const [info, setInfo] = useState("");

    let retornoCPF = [];

    const checaSegurado = async (CPFAtual) => {

        retornoCPF = await buscaCPF(CPFAtual);

        if(validaCPF(CPFAtual)){
            if(retornoCPF.length > 0) {
                return [false, "O CPF já está cadastrado em nossa base!"];
            }
            else {
                return [true, "Cadastrado com sucesso!"];
            }   
        }
        else {
            return [false, "O CPF é inválido!"];
        }
    }
    
    const calculaDatas = () => {
        const dataAtual = new Date();
        dataAtual.setDate(dataAtual.getDate() + 1);
        const inicio = dataAtual.getDate()+"/"+(dataAtual.getMonth()+1)+"/"+dataAtual.getFullYear();
        dataAtual.setDate(dataAtual.getDate() + (parseInt(terminoVig) * 365.25));
        const fim = dataAtual.getDate()+"/"+(dataAtual.getMonth()+1)+"/"+dataAtual.getFullYear();
        return [inicio, fim];
    }

    const precoSeguro = (tipoCobertura, valorVeiculo) => {
        if(tipoCobertura === "Perda Total"){
            return 0.06 * valorVeiculo;
        }
        else if (tipoCobertura === "Incêndio"){
            return 0.04 * valorVeiculo;
        }
        else {
            return 0.05 * valorVeiculo;
        }
    }

    const realizaCotacao = async(evento) => {
        evento.preventDefault();
        const datas = calculaDatas();
        const preco = precoSeguro(cobertura, valorRisco);
        const validade = await checaSegurado(CPF);

        if(validade[0]){
            const body = {
                id_usuario: id,
                nome_segurado: nomeSeg,
                cpf_segurado: CPF,
                inicio_vigencia: datas[0],
                termino_vigencia: datas[1],
                valor_risco: valorRisco,
                tipo_cobertura: cobertura,
                valor_seguro: preco,
                proposta_efetivada: false
            };
            await enviaSegurado(body);
            toast.success(validade[1]);
            limpaFormulario();
        }
        else {
            toast.error(validade[1]);
        }
    }

    const limpaFormulario = () => {
        setNomeSeg("");
        setCPF("");
        setValorRisco("");
        setTerminoVig(5);
        setCobertura("Morte natural");
    }

    const deslogarUsuario = () => {
        localStorage.removeItem("token");
    }

    useEffect(() => {
        if(cobertura === "Morte natural"){
            setInfo("Cobertura em caso de morte por algum problema fisiológico");
        }
        else if (cobertura === "Morte acidental"){
            setInfo("Cobertura em caso de morte por lesões causadas por um acidente");
        }
        else if (cobertura === "Invalidez") {
            setInfo("Cobertura em caso de lesões que causem invalidez permanente no contratante");
        }
    }, [cobertura]);

    useEffect(() => {
        buscaUsuario()
        .then((listaSegurados) => {
            setLista(listaSegurados.data);
        })
        .catch((e) => {
            console.log(e);
        });
        // eslint-disable-next-line
    }, []);
   

    return(
        <div>
            <p className="CriarCotacao-saudacoes">Olá {nome}, <Link className="CriarCotacao-sair" to="/" onClick={() => deslogarUsuario()}>Sair</Link></p>
            <div className="CriarCotacao-formulario">
                <form onSubmit={realizaCotacao}>
                    <h2 className="Login-titulo">Nova Cotação</h2>
                        <ToastContainer />
                        <CampoTexto
                            campoTextoLabel="Nome:"
                            campoTextoRequired={true}
                            campoTextoType="text"
                            campoTextoPlaceholder="Digite o nome do segurado"
                            campoTextoValue={nomeSeg}
                            campoTextoMaxLength={45}
                            alteraCampo={valorCampo => {
                                setNomeSeg(valorCampo);
                            }}
                        />
                        <CampoNumerico
                            campoNumericoLabel="CPF (apenas números):"
                            campoNumericoRequired={true}
                            campoNumericoPlaceholder="Digite o CPF do segurado"
                            campoNumericoValue={CPF}
                            campoNumericoMin={0}
                            campoNumericoMax={99999999999}
                            campoStep="1"
                            alteraCampo={valorCampo => setCPF(valorCampo)}
                        />
                        <CampoSelecao
                            campoSelecaoLabel="Término de vigência (em anos):"
                            campoSelecaoValores={[5, 6, 7, 8, 9, 10]}
                            campoSelecaoValor={terminoVig}
                            alteraCampo={evento => setTerminoVig(evento.target.value)}
                        />
                        <CampoNumerico
                            campoNumericoLabel="Valor em risco (apenas números):"
                            campoNumericoRequired={true}
                            campoNumericoPlaceholder="Digite o valor em risco"
                            campoNumericoValue={valorRisco}
                            campoNumericoMin={5000.00}
                            campoNumericoMax={1000000.00}
                            campoStep="0.01"
                            alteraCampo={valorCampo => setValorRisco(valorCampo)}
                        />
                        <CampoSelecao
                            campoSelecaoLabel="Tipo de cobertura:"
                            campoSelecaoValores={["Morte natural", "Morte acidental", "Invalidez"]}
                            campoSelecaoValor={cobertura}
                            alteraCampo={evento => setCobertura(evento.target.value)}
                        />
                        <div className="CriarCotacao-informacaoCotacao"><label>Detalhes sobre a cobertura:</label> {info}</div>
                        {
                            nomeSeg.length !== 0 && CPF > 0 && valorRisco > 0
                            &&
                            <Botao
                                botaoOnClick={() => realizaCotacao}
                                botaoTexto="Elaborar proposta"
                            />
                        }
                        <Link className="CriarCotacao-voltar" to="/menuUsuario" onClick={() => limpaFormulario()}>
                            Voltar
                        </Link>
                </form>
            </div>
        </div>
    );
}

export default CriarCotacao;