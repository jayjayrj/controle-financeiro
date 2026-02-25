async function carregarCartao(id) {
    try {
        const response = await fetch(`/cartoesCredito/${id}`);
        if (!response.ok) {
            throw new Error("Erro ao buscar cartão");
        }
        const cartao = await response.json();
        preencherCamposCartao(cartao);
    } catch (error) {
        console.error(error);
        document.getElementById("feedback-message").innerText = "❌ Não foi possível carregar os dados.";
    }
}

function preencherCamposCartao(cartao) {
    try {
        document.getElementById("idCartao").value = cartao.id;
        document.getElementById("bandeira").value = cartao.bandeira;
        document.getElementById("numero").value = cartao.numero;
        document.getElementById("nome").value = cartao.nome;
        document.getElementById("vencimento").value = cartao.vencimento;
        document.getElementById("limite").value = cartao.limite;
    } catch (error) {
        console.error(error);
    }
}

let currentPageCartao = 0;
const pageSizeCartao = 5;
const sortByCartao = "nome";

async function carregarCartoes(page) {
    console.log("Entrei no carregarCartoes");
    try {
        console.log("Vou chamar: "+ `/cartoesCredito/listar?page=${page}&size=${pageSizeCartao}&sortBy=${sortByCartao}`);
        const response = await fetch(`/cartoesCredito/listar?page=${page}&size=${pageSizeCartao}&sortBy=${sortByCartao}`);
        console.log("Fiz a consulta");
        if (!response.ok) throw new Error("Erro ao buscar cartões");
        console.log("Passei da consulta");

        const data = await response.json(); // objeto Page do Spring
        const tabela = document.getElementById("tabela-cartoes");
        tabela.innerHTML = "";

        // renderiza os bancos em formato de tabela
        data.content.forEach(cartao => {
            console.log("Entrei no for");
            const tr = document.createElement("tr");

            // coluna acoes
            const tdAcoes = document.createElement("td");
            tdAcoes.innerHTML = `<a href="#" onclick="handleActionId('cartao', 'editar', ${cartao.id})" title="Editar cartão" style="cursor:pointer">✏️</a> | <a href="#" onclick="handleActionId('cartao', 'excluir', ${cartao.id})" title="Excluir cartão" style="cursor:pointer">🗑️</a> | <a href="#" onclick="handleActionId('cartao', 'sumario', ${cartao.id})" title="Exibir resumo de transações" style="cursor:pointer">📈</a>`;

            // coluna bandeira
            const tdBandeira = document.createElement("td");
            tdBandeira.textContent = cartao.bandeira;

            // coluna numero
            const tdNumero = document.createElement("td");
            tdNumero.textContent = cartao.numero;

            // coluna nome
            const tdNome = document.createElement("td");
            tdNome.textContent = cartao.nome;

            // coluna vencimento
            const tdVencimento = document.createElement("td");
            tdVencimento.textContent = cartao.vencimento;

            // coluna limite
            const tdLimite = document.createElement("td");
            tdLimite.textContent = cartao.limite;

            // coluna total fatura
            const tdTotalFatura = document.createElement("td");
            tdTotalFatura.textContent = cartao.totalFatura;

            tr.appendChild(tdAcoes);
            tr.appendChild(tdBandeira);
            tr.appendChild(tdNumero);
            tr.appendChild(tdNome);
            tr.appendChild(tdVencimento);
            tr.appendChild(tdLimite);
            tr.appendChild(tdTotalFatura);

            tabela.appendChild(tr);
        });

        // paginação
        document.getElementById("pageInfo").innerText =
            `Página ${data.number + 1} de ${data.totalPages}`;
        document.getElementById("prevBtn").disabled = data.first;
        document.getElementById("nextBtn").disabled = data.last;

        currentPageCartao = data.number;
    } catch (error) {
        document.getElementById("tabela-cartoes").innerHTML =
            "<tr><td colspan='7'>❌ Não foi possível carregar os cartões.</td></tr>";
    }

    // eventos dos botões
    document.getElementById("prevBtn").addEventListener("click", () => {
        if (currentPageCartao > 0) carregarCartoes(currentPageCartao - 1);
    });

    document.getElementById("nextBtn").addEventListener("click", () => {
        carregarCartoes(currentPageCartao + 1);
    });
}

function verificaCamposCartao() {
    // pega os campos
    const bandeira = document.getElementById("bandeira");
    const numero = document.getElementById("numero");
    const nome = document.getElementById("nome");
    const vencimento = document.getElementById("vencimento");
    const limite = document.getElementById("limite");

    // remove erros anteriores
    [bandeira, numero, nome, vencimento, limite].forEach(campo => campo.classList.remove("input-error"));

    let valido = true;

    // valida campos obrigatórios
    [bandeira, numero, nome, vencimento, limite].forEach(campo => {
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

async function salvarInclusaoCartao() {
    // pega os campos
    const usuarioLogado = sessionStorage.getItem("usuarioLogado");
    if (!usuarioLogado) {
        sessionStorage.setItem("signupSuccess", "❌ Usuário não logado. Favor logar novamente.");
        window.location.href = "index.html";
    }
    const bandeira = document.getElementById("bandeira");
    const numero = document.getElementById("numero");
    const nome = document.getElementById("nome");
    const vencimento = document.getElementById("vencimento");
    const limite = document.getElementById("limite");

    if (!verificaCamposCartao()) {
        return;
    }

    // se passou na validação, envia
    const cartao = {
        bandeira: bandeira.value.trim(),
        numero: numero.value.trim(),
        nome: nome.value.trim(),
        vencimento: vencimento.value.trim(),
        limite: limite.value.trim(),
        usuario: usuarioLogado
    };

    try {
        const response = await fetch("/cartoesCredito", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cartao)
        });

        if (response.ok) {
            const mensagem = await response.text();
            document.getElementById("feedback-message").innerText = "✅ Cartão de Crédito criado com sucesso!";
            sessionStorage.setItem("signupSuccess", "✅ Cartão de Crédito incluído com sucesso!");
            handleActionId('cartao', 'listar');
        } else {
            document.getElementById("feedback-message").innerText = "❌ Erro ao criar Cartão de Crédito. Tente novamente.";
        }
    } catch (error) {
        document.getElementById("feedback-message").innerText = "❌ Falha na conexão com o servidor.";
    }
}

async function salvarEdicaoCartao() {
    // pega os campos
    const campoIdCartao = document.getElementById("idCartao");
    const bandeira = document.getElementById("bandeira");
    const numero = document.getElementById("numero");
    const nome = document.getElementById("nome");
    const vencimento = document.getElementById("vencimento");
    const limite = document.getElementById("limite");

    if (!verificaCamposCartao()) {
        return;
    }

    // se passou na validação, envia
    const cartao = {
        bandeira: bandeira.value.trim(),
        numero: numero.value.trim(),
        nome: nome.value.trim(),
        vencimento: vencimento.value.trim(),
        limite: limite.value.trim()
    };
    const idCartao = campoIdCartao.value.trim();

    try {
        const usuarioLogado = sessionStorage.getItem("usuarioLogado");
        if (!usuarioLogado || !idCartao) {
            sessionStorage.setItem("signupSuccess", "❌ Usuário não logado. Favor logar novamente.");
            window.location.href = "index.html";
        }
        const response = await fetch("/cartoesCredito/" + idCartao, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(cartao)
        });

        if (response.ok) {
            const mensagem = await response.text();
            document.getElementById("feedback-message").innerText = "✅ Cartao de Crédito atualizado com sucesso!";
            sessionStorage.setItem("signupSuccess", "✅ Cartão de Crédito atualizado com sucesso!");
            handleActionId('cartao', 'listar');
        } else {
            document.getElementById("feedback-message").innerText = "❌ Erro ao atualizar o Cartao de Crédito. Tente novamente.";
        }
    } catch (error) {
        document.getElementById("feedback-message").innerText = "❌ Falha na conexão com o servidor.";
    }
}

async function salvarExclusaoCartao() {
    const campoIdCartao = document.getElementById("idCartao");
    console.log("salvarExclusaoCartao");
    const resposta = confirm("Deseja realmente excluir o Cartão de Crédito do sistema?");
    if (!resposta) {
        // usuário clicou em Cancelar
        document.getElementById("feedback-message").innerText = "⚠️ A exclusão do Cartão de Crédito foi cancelada.";
        return;
    }
    const idCartao = campoIdCartao.value.trim();

    try {
        const usuarioLogado = sessionStorage.getItem("usuarioLogado");
        if (!usuarioLogado || !idCartao) {
            sessionStorage.setItem("signupSuccess", "❌ Usuário não logado. Favor logar novamente.");
            window.location.href = "index.html";
        }
        const response = await fetch("/cartoesCredito/" + idCartao, {
            method: "DELETE"
        });

        if (response.ok) {
            const mensagem = await response.text();
            sessionStorage.setItem("signupSuccess", "✅ Cartão de Crédito excluído com sucesso!");
            handleActionId('cartao', 'listar');
        } else {
            document.getElementById("feedback-message").innerText = "❌ Erro ao excluir o Cartão de Crédito. Tente novamente.";
        }
    } catch (error) {
        document.getElementById("feedback-message").innerText = "❌ Falha na conexão com o servidor.";
    }
}