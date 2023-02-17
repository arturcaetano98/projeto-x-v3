import "./Botao.css";

const Botao = (props) => {
    return (
        <div className="Botao-fundo">
            <button className="Botao" onClick={props.botaoOnClick}>{props.botaoTexto}</button>
        </div>
    );
}

export default Botao;