async function carregarUsuario(id) {
    try {
        const response = await fetch(`/user/${id}`);
        if (!response.ok) {
            throw new Error("Erro ao buscar usuário");
        }
        const usuario = await response.json();
        preencherCamposPerfil(usuario);
    } catch (error) {
        console.error(error);
        document.getElementById("feedback-message").innerText = "❌ Não foi possível carregar os dados.";
    }
}

function verificaUsuarioLogado() {
    const usuarioLogado = sessionStorage.getItem("usuarioLogado");
    if (!usuarioLogado) {
        sessionStorage.setItem("signupSuccess", "❌ Usuário não logado. Favor logar novamente.");
        window.location.href = "index.html";
    }
}
document.addEventListener("DOMContentLoaded", () => {
    verificaUsuarioLogado();
});

async function salvarEdicaoPerfil() {
    // pega os campos
    const nome = document.getElementById("nome");
    const email = document.getElementById("email");
    const usuario = document.getElementById("cadastroUsuario");
    const senha = document.getElementById("cadastroSenha");
    const senhaConfirm = document.getElementById("cadastroSenhaConfirm");

    // remove erros anteriores
    [nome, email, usuario, senha, senhaConfirm].forEach(campo => campo.classList.remove("input-error"));

    let valido = true;

    // valida campos obrigatórios
    [nome, email, usuario, senha, senhaConfirm].forEach(campo => {
        if (!campo.value.trim()) {
            campo.classList.add("input-error"); // aplica borda/sublinhado vermelho
            valido = false;
        }
    });

    // valida senha
    if (senha.value.trim() !== senhaConfirm.value.trim()) {
        senha.classList.add("input-error");
        senhaConfirm.classList.add("input-error");
        document.getElementById("feedback-message").innerText = "⚠️ As senhas não conferem.";
        valido = false;
    }

    if (!valido) {
        document.getElementById("feedback-message").innerText = "⚠️ Preencha todos os campos corretamente.";
        return;
    }

    // se passou na validação, envia
    const user = {
        nome: nome.value.trim(),
        email: email.value.trim(),
        usuario: usuario.value.trim(),
        senha: senha.value.trim()
    };

    try {
        const usuarioLogado = sessionStorage.getItem("usuarioLogado");
        if (!usuarioLogado) {
            sessionStorage.setItem("signupSuccess", "❌ Usuário não logado. Favor logar novamente.");
            window.location.href = "index.html";
        }
        const response = await fetch("/user/" + usuarioLogado, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(user)
        });

        if (response.ok) {
            const mensagem = await response.text();
            document.getElementById("feedback-message").innerText = "✅ Conta atualizada com sucesso!";
        } else {
            document.getElementById("feedback-message").innerText = "❌ Erro ao criar conta. Tente novamente.";
        }
    } catch (error) {
        document.getElementById("feedback-message").innerText = "❌ Falha na conexão com o servidor.";
    }
}

async function salvarExclusaoPerfil() {
    console.log("salvarExclusao");
    const resposta = confirm("Deseja realmente excluir o perfil e perder o acesso ao sistema?");
    if (!resposta) {
        // usuário clicou em Cancelar
        document.getElementById("feedback-message").innerText = "⚠️ A exclusão de perfil foi cancelada.";
        return;
    }

    try {
        const usuarioLogado = sessionStorage.getItem("usuarioLogado");
        if (!usuarioLogado) {
            sessionStorage.setItem("signupSuccess", "❌ Usuário não logado. Favor logar novamente.");
            window.location.href = "index.html";
        }
        const response = await fetch("/user/" + usuarioLogado, {
            method: "DELETE"
        });

        if (response.ok) {
            const mensagem = await response.text();
            sessionStorage.setItem("signupSuccess", "✅ Perfil excluído com sucesso!");
            window.location.href = "index.html";
        } else {
            document.getElementById("feedback-message").innerText = "❌ Erro ao excluir o perfil. Tente novamente.";
        }
    } catch (error) {
        document.getElementById("feedback-message").innerText = "❌ Falha na conexão com o servidor.";
    }
}