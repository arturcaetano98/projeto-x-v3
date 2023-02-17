import { useEffect, useContext } from "react";
import { buscaUsuario } from "../../servicos/api";
import { useNavigate } from "react-router-dom";

import UsuarioContexto from "../../contextos/UsuarioContext";

import "./Navbar.css";

const Navbar = () => {

    const navegate = useNavigate();

    const { setId, setNome } = useContext(UsuarioContexto);

    // O "useEffect" funciona em todo o site 
    useEffect(() => {
        let token = localStorage.getItem("token");
        if(token !== null) {
            buscaUsuario()
            .then((usuario) => {
                setNome(usuario.data[0].nome);
                setId(usuario.data[0].id);
            })
            .catch((e) => {
                console.log(e);
            });
        }
        else {
            navegate("/");
        }

        if(token && window.location.pathname === "/"){

        }
        // eslint-disable-next-line
    }, []);

    return (
            <div className="Navbar-fundo">
                <div className="Navbar-logo">
                    <h1 className="Navbar-texto">Projeto Seguro X</h1>
                </div>
            </div>
    );
}

export default Navbar;