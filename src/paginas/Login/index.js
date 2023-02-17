import "./Login.css";

import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import { realizaLogin } from "../../servicos/api";

import "react-toastify/dist/ReactToastify.css";

import CampoTexto from "../../componentes/CampoTexto";
import Botao from "../../componentes/Botao";

import UsuarioContexto from "../../contextos/UsuarioContext";

const Login = () => {

    const navegate = useNavigate();

    const { setId, setNome, username, setUsername, senha, setSenha } = useContext(UsuarioContexto);

    const loginSubmit = async (evento) => {
        try {
                evento.preventDefault();
                const body = {
                    "usuario": username,
                    "senha": senha
                }

                let retornoLogin = await realizaLogin(body);
                retornoLogin = retornoLogin.data;

                if((retornoLogin.sucesso === true) && (retornoLogin.usuarioLogado != null)){
                    localStorage.setItem("token", retornoLogin.token);
                    setNome(retornoLogin.nome);
                    setUsername("");
                    setSenha("");
                    setId(retornoLogin.id);
                    navegate("/menuUsuario");
                }
                else if((retornoLogin.sucesso === true) && (retornoLogin.usuarioLogado === null)){
                    toast.error("Username ou senha inválidos!!!!!");
                }
                else {
                    toast.error("Username não existe!!!!!");
                }
        }
        catch(e){
            console.log(e);
        }
    }

    useEffect(() => {
        if(localStorage.getItem("token") != null){
            navegate("/menuUsuario");
        }
    }, []);

    return(
        <div className="Login-formulario">
            <form onSubmit={loginSubmit}>
                <h2 className="Login-titulo">Login</h2>
                    <ToastContainer />
                    <CampoTexto
                        campoTextoLabel="Username:"
                        campoTextoRequired={true}
                        campoTextoType="text"
                        campoTextoPlaceholder="Digite o username"
                        campoTextoValue={username}
                        campoTextoMaxLength={45}
                        alteraCampo={valorCampo => {
                            setUsername(valorCampo);
                        }}
                    />
                    <CampoTexto
                        campoTextoLabel="Senha:"
                        campoTextoRequired={true}
                        campoTextoType="password"
                        campoTextoPlaceholder="Digite a senha"
                        campoTextoValue={senha}
                        campoTextoMaxLength={18}
                        alteraCampo={valorCampo => {
                            setSenha(valorCampo);
                        }}
                    />
                    <Botao
                        botaoOnClick={() => loginSubmit}
                        botaoTexto="Login"
                    />
            </form>
        </div>
    );
}

export default Login;