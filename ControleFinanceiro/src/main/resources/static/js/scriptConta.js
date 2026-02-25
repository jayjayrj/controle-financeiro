async function carregarConta(id) {
    try {
        const response = await fetch(`/contas/${id}`);
        if (!response.ok) {
            throw new Error("Erro ao buscar conta");
        }
        const conta = await response.json();
        preencherCamposConta(conta);
    } catch (error) {
        console.error(error);
        document.getElementById("feedback-message").innerText = "❌ Não foi possível carregar os dados.";
    }
}

function preencherCamposConta(conta) {
    try {
        document.getElementById("idConta").value = conta.id;
        document.getElementById("idBanco").value = conta.idBanco;
        // Coloca na sessão para poder carregar tardiamente
        sessionStorage.setItem("idBanco", conta.idBanco);
        document.getElementById("agencia").value = conta.numeroAgencia;
        document.getElementById("conta").value = conta.numeroConta;
        document.getElementById("saldo").value = conta.saldo;
    } catch (error) {
        console.error(error);
    }
}

let currentPageConta = 0;
const pageSizeConta = 5;
const sortByConta = "nome";

async function carregarContas(page) {
    console.log("Entrei no carregarContas");
    try {
        console.log("Vou chamar: "+ `/contas/listar?page=${page}&size=${pageSizeConta}&sortBy=${sortByConta}`);
        const response = await fetch(`/contas/listar?page=${page}&size=${pageSizeConta}&sortBy=${sortByConta}`);
        console.log("Fiz a consulta");
        if (!response.ok) throw new Error("Erro ao buscar contas");
        console.log("Passei da consulta");

        const data = await response.json(); // objeto Page do Spring
        const tabela = document.getElementById("tabela-contas");
        tabela.innerHTML = "";

        // renderiza os bancos em formato de tabela
        data.content.forEach(conta => {
            console.log("Entrei no for");
            const tr = document.createElement("tr");

            // coluna acoes
            const tdAcoes = document.createElement("td");
            tdAcoes.innerHTML = `<a href="#" onclick="handleActionId('conta', 'editar', ${conta.id})" title="Editar conta" style="cursor:pointer">✏️</a> | <a href="#" onclick="handleActionId('conta', 'excluir', ${conta.id})" title="Excluir conta" style="cursor:pointer">🗑️</a> | <a href="#" onclick="handleActionId('conta', 'sumario', ${conta.id})" title="Exibir resumo de transações" style="cursor:pointer">📈</a>`;

            // coluna banco
            const tdBanco = document.createElement("td");
            tdBanco.textContent = conta.nomeBanco;

            // coluna agencia
            const tdAgencia = document.createElement("td");
            tdAgencia.textContent = conta.numeroAgencia;

            // coluna conta
            const tdConta = document.createElement("td");
            tdConta.textContent = conta.numeroConta;

            // coluna saldo
            const tdSaldo = document.createElement("td");
            tdSaldo.textContent = conta.saldo;

            tr.appendChild(tdAcoes);
            tr.appendChild(tdBanco);
            tr.appendChild(tdAgencia);
            tr.appendChild(tdConta);
            tr.appendChild(tdSaldo);

            tabela.appendChild(tr);
        });

        // paginação
        document.getElementById("pageInfo").innerText =
            `Página ${data.number + 1} de ${data.totalPages}`;
        document.getElementById("prevBtn").disabled = data.first;
        document.getElementById("nextBtn").disabled = data.last;

        currentPageConta = data.number;
    } catch (error) {
        document.getElementById("tabela-contas").innerHTML =
            "<tr><td colspan='7'>❌ Não foi possível carregar os contas.</td></tr>";
    }

    // eventos dos botões
    document.getElementById("prevBtn").addEventListener("click", () => {
        if (currentPageConta > 0) carregarContas(currentPageConta - 1);
    });

    document.getElementById("nextBtn").addEventListener("click", () => {
        carregarContas(currentPageConta + 1);
    });
}

function verificaCamposConta() {
    // pega os campos
    const idBanco = document.getElementById("idBanco");
    const numeroAgencia = document.getElementById("agencia");
    const numeroConta = document.getElementById("conta");
    const saldo = document.getElementById("saldo");

    // remove erros anteriores
    [idBanco, numeroAgencia, saldo].forEach(campo => campo.classList.remove("input-error"));

    let valido = true;

    // valida campos obrigatórios
    [idBanco, numeroAgencia, saldo].forEach(campo => {
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

async function salvarInclusaoConta() {
    // pega os campos
    const usuarioLogado = sessionStorage.getItem("usuarioLogado");
    if (!usuarioLogado) {
        sessionStorage.setItem("signupSuccess", "❌ Usuário não logado. Favor logar novamente.");
        window.location.href = "index.html";
    }
    const idBanco = document.getElementById("idBanco");
    const numeroAgencia = document.getElementById("agencia");
    const numeroConta = document.getElementById("conta");
    const saldo = document.getElementById("saldo");

    if (!verificaCamposConta()) {
        return;
    }

    // se passou na validação, envia
    const conta = {
        idBanco: idBanco.value.trim(),
        numeroAgencia: numeroAgencia.value.trim(),
        numeroConta: numeroConta.value.trim(),
        saldo: saldo.value.trim(),
        idUsuario: usuarioLogado
    };

    try {
        const response = await fetch("/contas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(conta)
        });

        if (response.ok) {
            const mensagem = await response.text();
            document.getElementById("feedback-message").innerText = "✅ Conta Corrente criado com sucesso!";
            sessionStorage.setItem("signupSuccess", "✅ Conta Corrente incluído com sucesso!");
            handleActionId('conta', 'listar');
        } else {
            document.getElementById("feedback-message").innerText = "❌ Erro ao criar Conta Corrente. Tente novamente.";
        }
    } catch (error) {
        document.getElementById("feedback-message").innerText = "❌ Falha na conexão com o servidor.";
    }
}

async function salvarEdicaoConta() {
    // pega os campos
    const campoIdConta = document.getElementById("idConta");
    const idBanco = document.getElementById("idBanco");
    const numeroAgencia = document.getElementById("agencia");
    const numeroConta = document.getElementById("conta");
    const saldo = document.getElementById("saldo");

    if (!verificaCamposConta()) {
        return;
    }

    // se passou na validação, envia
    const conta = {
        idBanco: idBanco.value.trim(),
        numeroAgencia: numeroAgencia.value.trim(),
        numeroConta: numeroConta.value.trim(),
        saldo: saldo.value.trim()
    };
    const idConta = campoIdConta.value.trim();

    try {
        const usuarioLogado = sessionStorage.getItem("usuarioLogado");
        if (!usuarioLogado || !idConta) {
            sessionStorage.setItem("signupSuccess", "❌ Usuário não logado. Favor logar novamente.");
            window.location.href = "index.html";
        }
        const response = await fetch("/contas/" + idConta, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(conta)
        });

        if (response.ok) {
            const mensagem = await response.text();
            document.getElementById("feedback-message").innerText = "✅ Conta Corrente atualizado com sucesso!";
            sessionStorage.setItem("signupSuccess", "✅ Conta Corrente atualizado com sucesso!");
            handleActionId('conta', 'listar');
        } else {
            document.getElementById("feedback-message").innerText = "❌ Erro ao atualizar o Conta Corrente. Tente novamente.";
        }
    } catch (error) {
        document.getElementById("feedback-message").innerText = "❌ Falha na conexão com o servidor.";
    }
}

async function salvarExclusaoConta() {
    const campoIdConta = document.getElementById("idConta");
    console.log("salvarExclusaoConta");
    const resposta = confirm("Deseja realmente excluir o Conta Corrente do sistema?");
    if (!resposta) {
        // usuário clicou em Cancelar
        document.getElementById("feedback-message").innerText = "⚠️ A exclusão do Conta Corrente foi cancelada.";
        return;
    }
    const idConta = campoIdConta.value.trim();

    try {
        const usuarioLogado = sessionStorage.getItem("usuarioLogado");
        if (!usuarioLogado || !idConta) {
            sessionStorage.setItem("signupSuccess", "❌ Usuário não logado. Favor logar novamente.");
            window.location.href = "index.html";
        }
        const response = await fetch("/contas/" + idConta, {
            method: "DELETE"
        });

        if (response.ok) {
            const mensagem = await response.text();
            sessionStorage.setItem("signupSuccess", "✅ Conta Corrente excluído com sucesso!");
            handleActionId('conta', 'listar');
        } else {
            document.getElementById("feedback-message").innerText = "❌ Erro ao excluir o Conta Corrente. Tente novamente.";
        }
    } catch (error) {
        document.getElementById("feedback-message").innerText = "❌ Falha na conexão com o servidor.";
    }
}