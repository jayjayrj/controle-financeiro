async function carregarBanco(id) {
    try {
        const response = await fetch(`/bancos/${id}`);
        if (!response.ok) {
            throw new Error("Erro ao buscar banco");
        }
        const banco = await response.json();
        preencherCamposBanco(banco);
    } catch (error) {
        console.error(error);
        document.getElementById("feedback-message").innerText = "❌ Não foi possível carregar os dados.";
    }
}

async function carregarSelectBancos() {
    try {
        console.log("Entrei no carregarSelectBancos");
        // Chama o endpoint do controller
        const response = await fetch("/bancos/listar");
        const data = await response.json();
        console.log("carregarSelectBancos fiz o fetch");

        // O endpoint retorna um Page<BancoResponseDTO>, então os dados estão em data.content
        const bancos = data.content;

        const select = document.getElementById("idBanco");
        console.log("carregarSelectBancos instanciei o select");

        bancos.forEach(banco => {
            const option = document.createElement("option");
            option.value = banco.id;
            option.textContent = banco.nome;
            select.appendChild(option);
            console.log("carregarSelectBancos for banco.nome" + banco.nome);
        });
    } catch (error) {
        console.error("Erro ao carregar bancos:", error);
    }
}

async function preencherSelectBanco() {
    await carregarSelectBancos();
    console.log("Vou popular o idBanco com " + sessionStorage.getItem("idBanco"));
    document.getElementById("idBanco").value = sessionStorage.getItem("idBanco");
    sessionStorage.removeItem("idBanco");
}

function preencherCamposBanco(banco) {
    try {
        document.getElementById("idBanco").value = banco.id;
        document.getElementById("nome").value = banco.nome;
        document.getElementById("numero").value = banco.numero;
    } catch (error) {
        console.error(error);
    }
}

let currentPageBanco = 0;
const pageSizeBanco = 5;
const sortByBanco = "nome";

async function carregarBancos(page) {
    console.log("Entrei no carregarBancos");
    try {
        console.log("Vou chamar: "+ `/bancos/listar?page=${page}&size=${pageSizeBanco}&sortBy=${sortByBanco}`);
        const response = await fetch(`/bancos/listar?page=${page}&size=${pageSizeBanco}&sortBy=${sortByBanco}`);
        console.log("Fiz a consulta");
        if (!response.ok) throw new Error("Erro ao buscar bancos");
        console.log("Passei da consulta");

        const data = await response.json(); // objeto Page do Spring
        const tabela = document.getElementById("tabela-bancos");
        tabela.innerHTML = "";

        // renderiza os bancos em formato de tabela
        data.content.forEach(banco => {
            console.log("Entrei no for");
            const tr = document.createElement("tr");

            // coluna editar
            const tdAcoes = document.createElement("td");
            tdAcoes.innerHTML = `| <a href="#" onclick="handleActionId('banco', 'editar', ${banco.id})" style="cursor:pointer">✏️</a> | <a href="#" onclick="handleActionId('banco', 'excluir', ${banco.id})" style="cursor:pointer">🗑️</a> |`;

            // coluna número
            const tdNumero = document.createElement("td");
            tdNumero.textContent = banco.numero;

            // coluna nome
            const tdNome = document.createElement("td");
            tdNome.textContent = banco.nome;

            tr.appendChild(tdAcoes);
            tr.appendChild(tdNumero);
            tr.appendChild(tdNome);

            tabela.appendChild(tr);
        });

        // paginação
        document.getElementById("pageInfo").innerText =
            `Página ${data.number + 1} de ${data.totalPages}`;
        document.getElementById("prevBtn").disabled = data.first;
        document.getElementById("nextBtn").disabled = data.last;

        currentPageBanco = data.number;
    } catch (error) {
        document.getElementById("tabela-bancos").innerHTML =
            "<tr><td colspan='3'>❌ Não foi possível carregar os bancos.</td></tr>";
    }

    // eventos dos botões
    document.getElementById("prevBtn").addEventListener("click", () => {
        if (currentPageBanco > 0) carregarBancos(currentPageBanco - 1);
    });

    document.getElementById("nextBtn").addEventListener("click", () => {
        carregarBancos(currentPageBanco + 1);
    });
}

function verificaCamposBanco() {
    // pega os campos
    const nome = document.getElementById("nome");
    const numero = document.getElementById("numero");

    // remove erros anteriores
    [nome, numero].forEach(campo => campo.classList.remove("input-error"));

    let valido = true;

    // valida campos obrigatórios
    [nome, numero].forEach(campo => {
        if (!campo.value.trim()) {
            campo.classList.add("input-error"); // aplica borda/sublinhado vermelho
            valido = false;
        }
    });

    if (!valido) {
        document.getElementById("feedback-message").innerText = "⚠️ Preencha todos os campos corretamente.";
    }
    return valido;
}

async function salvarInclusaoBanco() {
    // pega os campos
    const nome = document.getElementById("nome");
    const numero = document.getElementById("numero");

    if (!verificaCamposBanco()) {
        return;
    }

    // se passou na validação, envia
    const banco = {
        nome: nome.value.trim(),
        numero: numero.value.trim()
    };

    try {
        const usuarioLogado = sessionStorage.getItem("usuarioLogado");
        if (!usuarioLogado) {
            sessionStorage.setItem("signupSuccess", "❌ Usuário não logado. Favor logar novamente.");
            window.location.href = "index.html";
        }
        const response = await fetch("/bancos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(banco)
        });

        if (response.ok) {
            const mensagem = await response.text();
            document.getElementById("feedback-message").innerText = "✅ Conta criada com sucesso!";
            sessionStorage.setItem("signupSuccess", "✅ Banco incluído com sucesso!");
            handleActionId('banco', 'listar');
        } else {
            document.getElementById("feedback-message").innerText = "❌ Erro ao criar conta. Tente novamente.";
        }
    } catch (error) {
        document.getElementById("feedback-message").innerText = "❌ Falha na conexão com o servidor.";
    }
}

async function salvarEdicaoBanco() {
    // pega os campos
    const campoIdBanco = document.getElementById("idBanco");
    const nome = document.getElementById("nome");
    const numero = document.getElementById("numero");

    if (!verificaCamposBanco()) {
        return;
    }

    // se passou na validação, envia
    const banco = {
        nome: nome.value.trim(),
        numero: numero.value.trim()
    };
    const idBanco = campoIdBanco.value.trim();

    try {
        const usuarioLogado = sessionStorage.getItem("usuarioLogado");
        if (!usuarioLogado || !idBanco) {
            sessionStorage.setItem("signupSuccess", "❌ Usuário não logado. Favor logar novamente.");
            window.location.href = "index.html";
        }
        const response = await fetch("/bancos/" + idBanco, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(banco)
        });

        if (response.ok) {
            const mensagem = await response.text();
            document.getElementById("feedback-message").innerText = "✅ Banco atualizado com sucesso!";
            sessionStorage.setItem("signupSuccess", "✅ Banco atualizado com sucesso!");
            handleActionId('banco', 'listar');
        } else {
            document.getElementById("feedback-message").innerText = "❌ Erro ao atualizar o banco. Tente novamente.";
        }
    } catch (error) {
        document.getElementById("feedback-message").innerText = "❌ Falha na conexão com o servidor.";
    }
}

async function salvarExclusaoBanco() {
    const campoIdBanco = document.getElementById("idBanco");
    console.log("salvarExclusaoBanco");
    const resposta = confirm("Deseja realmente excluir o banco do sistema?");
    if (!resposta) {
        // usuário clicou em Cancelar
        document.getElementById("feedback-message").innerText = "⚠️ A exclusão do banco foi cancelada.";
        return;
    }
    const idBanco = campoIdBanco.value.trim();

    try {
        const usuarioLogado = sessionStorage.getItem("usuarioLogado");
        if (!usuarioLogado || !idBanco) {
            sessionStorage.setItem("signupSuccess", "❌ Usuário não logado. Favor logar novamente.");
            window.location.href = "index.html";
        }
        const response = await fetch("/bancos/" + idBanco, {
            method: "DELETE"
        });

        if (response.ok) {
            const mensagem = await response.text();
            sessionStorage.setItem("signupSuccess", "✅ Banco excluído com sucesso!");
            handleActionId('banco', 'listar');
        } else {
            document.getElementById("feedback-message").innerText = "❌ Erro ao excluir o banco. Tente novamente.";
        }
    } catch (error) {
        document.getElementById("feedback-message").innerText = "❌ Falha na conexão com o servidor.";
    }
}