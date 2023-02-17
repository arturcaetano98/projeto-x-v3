// Tudo que tem contato com relação ao servidor.
import axios from "axios";

const api = axios.create({
	baseURL: "https://projeto-x-backend-v3.vercel.app",
	headers: {
        "Content-Type": "application/json",
		"x-access-token": localStorage.getItem("token")
    }
});

api.interceptors.request.use(function (config) {
    const token = localStorage.getItem("token");
    config.headers["x-access-token"] = token;
    return config;
});

export const realizaLogin = async(body) => {
	const resposta = await api.post("/login", body);
	return resposta;
}

export const buscaUsuario = async() => {
    const resposta = await api.get("/usuario");
	return resposta;
}

export const enviaUsuario = async(body) => {
    const resposta = await api.post("/usuarios/", body);
	return resposta;
}

export const buscaCPF = async(cpf) => {
    const resposta = await api.get("/segurados/cpf/" + cpf);
	return resposta.data;
}

export const buscaSegurados = async() => {
    const resposta = await api.get("/segurados/");
	return resposta;
}

export const buscaPorSegurado = async(n_cotacao) => {
    const resposta = await api.get("/segurados/" + n_cotacao);
	return resposta;
}

export const enviaSegurado = async(body) => {
    const resposta = await api.post("/segurados/", body);
	return resposta;
}

export const alteraSegurado = async(n_cotacao, body) => {
    const resposta = await api.put("/segurados/" + n_cotacao, body);
	return resposta;
}