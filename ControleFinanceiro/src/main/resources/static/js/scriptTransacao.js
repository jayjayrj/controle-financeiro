async function carregarTransacao(id) {
    try {
        const response = await fetch(`/transacoes/${id}`);
        if (!response.ok) {
            throw new Error("Erro ao buscar transação");
        }
        const transacao = await response.json();
        preencherCamposTransacao(transacao);
    } catch (error) {
        console.error(error);
        document.getElementById("feedback-message").innerText = "❌ Não foi possível carregar os dados.";
    }
}

async function carregarSelectsTransacoes() {
    console.log("Entrei no carregarSelectsTransacoes");
    try {
        console.log("Iniciei o carregamento de contas");
        // Chama o endpoint do controller
        const response = await fetch("/contas/listar");
        const data = await response.json();
        console.log("carregarSelectsTransacoes fiz o fetch de contas");

        // O endpoint retorna um Page<ContaCorrenteResponseDTO>, então os dados estão em data.content
        const contas = data.content;

        const select = document.getElementById("idConta");
        console.log("carregarSelectsTransacoes instanciei o select de contas");

        contas.forEach(conta => {
            const option = document.createElement("option");
            option.value = conta.id;
            option.textContent = conta.nomeBanco + " - " + conta.numeroConta;
            select.appendChild(option);
            console.log("carregarSelectsTransacoes for conta.nomeBanco " + conta.nomeBanco);
        });
    } catch (error) {
        console.error("Erro ao carregar contas: ", error);
    }

    try {
        console.log("Iniciei o carregamento de cartões");
        // Chama o endpoint do controller
        const response = await fetch("/cartoesCredito/listar");
        const data = await response.json();
        console.log("carregarSelectsTransacoes fiz o fetch de cartoes");

        // O endpoint retorna um Page<ContaCorrenteResponseDTO>, então os dados estão em data.content
        const cartoes = data.content;

        const select = document.getElementById("idCartao");
        console.log("carregarSelectsTransacoes instanciei o select de cartoes");

        cartoes.forEach(cartao => {
            const option = document.createElement("option");
            option.value = cartao.id;
            option.textContent = cartao.bandeira + " - " + cartao.numero;
            select.appendChild(option);
            console.log("carregarSelectsTransacoes for cartao.bandeira " + cartao.bandeira);
        });
    } catch (error) {
        console.error("Erro ao carregar cartoes: ", error);
    }
}

async function preencherSelectsTransacao() {
    await carregarSelectsTransacoes();
    console.log("Vou popular o idConta com " + sessionStorage.getItem("idConta"));
    document.getElementById("idConta").value = sessionStorage.getItem("idConta");
    sessionStorage.removeItem("idConta");
    console.log("Vou popular o idCartao com " + sessionStorage.getItem("idCartao"));
    document.getElementById("idCartao").value = sessionStorage.getItem("idCartao");
    sessionStorage.removeItem("idCartao");
}

function preencherCamposTransacao(transacao) {
    try {
        document.getElementById("idTransacao").value = transacao.id;
        // Preenche radio naturezaOperacao
        const radio = document.querySelector(
            `input[name="naturezaOperacao"][value="${transacao.naturezaOperacao}"]`
        );
        if (radio) {
            radio.checked = true;
        }
        // preenche o tipo de transação com base no que vem do banco
        if (transacao.idConta) {
            document.getElementById("tipoTransacao").value = 1;
        } else {
            document.getElementById("tipoTransacao").value = 0;
        }
        document.getElementById("idConta").value = transacao.idConta;
        // Coloca na sessão para poder carregar tardiamente
        sessionStorage.setItem("idConta", transacao.idConta);
        document.getElementById("idCartao").value = transacao.idCartao;
        // Coloca na sessão para poder carregar tardiamente
        sessionStorage.setItem("idCartao", transacao.idCartao);
        document.getElementById("descricao").value = transacao.descricao;
        document.getElementById("data").value = transacao.data.substring(0, 10);
        document.getElementById("valor").value = transacao.valor;
        // Despesa Mensal = -3, Parcela Única = -2, Parcelado = -1
        var radioQtdVezes = null;
        if (transacao.quantidadeVezes === -3) {
            radioQtdVezes = document.querySelector(`input[name="radioQtdVezes"][value="-3"]`);
            if (radioQtdVezes) {
                radioQtdVezes.checked = true;
            }
            toggleParcelasTransacao("-3");
        } else if (transacao.quantidadeVezes === -2) {
            radioQtdVezes = document.querySelector(`input[name="radioQtdVezes"][value="-2"]`);
            if (radioQtdVezes) {
                radioQtdVezes.checked = true;
            }
            toggleParcelasTransacao("-2");
        } else {
            radioQtdVezes = document.querySelector(`input[name="radioQtdVezes"][value="-1"]`);
            if (radioQtdVezes) {
                radioQtdVezes.checked = true;
            }
            document.getElementById("parcelaAtual").value = transacao.parcelaAtual;
            document.getElementById("quantidadeVezes").value = transacao.quantidadeVezes;
            toggleParcelasTransacao("-1");
        }
        selecionarTipoTransacao();
    } catch (error) {
        console.error(error);
    }
}

let currentPageTransacao = 0;
const pageSizeTransacao = 5;
const sortByTransacao = "nome";

async function carregarTransacoes(page) {
    console.log("Entrei no carregarTransacoes");
    try {
        console.log("Vou chamar: "+ `/transacoes/listar?page=${page}&size=${pageSizeTransacao}&sortBy=${sortByTransacao}`);
        const response = await fetch(`/transacoes/listar?page=${page}&size=${pageSizeTransacao}&sortBy=${sortByTransacao}`);
        console.log("Fiz a consulta");
        if (!response.ok) throw new Error("Erro ao buscar transacoes");
        console.log("Passei da consulta");

        const data = await response.json(); // objeto Page do Spring
        const tabela = document.getElementById("tabela-transacoes");
        tabela.innerHTML = "";

        // renderiza os bancos em formato de tabela
        data.content.forEach(transacao => {
            console.log("Entrei no for");
            const tr = document.createElement("tr");

            // coluna acoes
            const tdAcoes = document.createElement("td");
            tdAcoes.innerHTML = `| <a href="#" onclick="handleActionId('transacao', 'editar', ${transacao.id})" style="cursor:pointer">✏️</a> | <a href="#" onclick="handleActionId('transacao', 'excluir', ${transacao.id})" style="cursor:pointer">🗑️</a> |`;

            // coluna data
            const tdData = document.createElement("td");
            tdData.textContent = formatarDataBrasil(transacao.data);

            // coluna valor
            const tdValor = document.createElement("td");
            // Formatar como moeda BRL
            const valorFormatado = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(transacao.valor);

            tdValor.textContent = valorFormatado;

            // Aplicar cor conforme natureza
            if (transacao.naturezaOperacao === 0) {
                tdValor.classList.add("valor-despesa");
            } else {
                tdValor.classList.add("valor-receita");
            }

            // coluna descricao
            const tdDescricao = document.createElement("td");
            tdDescricao.textContent = transacao.descricao;

            // coluna qtdRestante
            const tdQtdRestante = document.createElement("td");
            // Despesa Mensal = -3, Parcela Única = -2, Parcelado = -1
            if (transacao.quantidadeVezes === -3) {
                tdQtdRestante.textContent = "Mensal"
            } else if (transacao.quantidadeVezes === -2) {
                tdQtdRestante.textContent = "Única"
            } else {
                tdQtdRestante.textContent = "Parcela " + transacao.parcelaAtual + " de " + transacao.quantidadeVezes;
            }

            tr.appendChild(tdAcoes);
            tr.appendChild(tdData);
            tr.appendChild(tdValor);
            tr.appendChild(tdDescricao);
            tr.appendChild(tdQtdRestante);

            tabela.appendChild(tr);
        });

        // paginação
        document.getElementById("pageInfo").innerText =
            `Página ${data.number + 1} de ${data.totalPages}`;
        document.getElementById("prevBtn").disabled = data.first;
        document.getElementById("nextBtn").disabled = data.last;

        currentPageTransacao = data.number;
    } catch (error) {
        document.getElementById("tabela-transacoes").innerHTML =
            "<tr><td colspan='7'>❌ Não foi possível carregar os transacoes.</td></tr>";
    }

    // eventos dos botões
    document.getElementById("prevBtn").addEventListener("click", () => {
        if (currentPageTransacao > 0) carregarTransacoes(currentPageTransacao - 1);
    });

    document.getElementById("nextBtn").addEventListener("click", () => {
        carregarTransacoes(currentPageTransacao + 1);
    });
}

function verificaCamposTransacao() {
    // pega os campos
    const tipoTransacao = document.getElementById("tipoTransacao");
    const idConta = document.getElementById("idConta");
    const idCartao = document.getElementById("idCartao");
    const descricao = document.getElementById("descricao");
    const data = document.getElementById("data");
    const valor = document.getElementById("valor");
    const radioQtdVezes = document.querySelector('input[name="radioQtdVezes"]:checked').value;

    // remove erros anteriores
    [tipoTransacao, idConta, idCartao, descricao, data, valor].forEach(campo => campo.classList.remove("input-error"));

    let valido = true;

    console.log("O Tipo transação é " + tipoTransacao.value);
    // valida campos obrigatórios
    // se o tipo de transação for zero é cartão de crédito
    if (tipoTransacao.value === "0") {
        console.log("Tipo transação Cartão");
        [tipoTransacao, idCartao, descricao, data, valor].forEach(campo => {
            if (!campo.value.trim()) {
                campo.classList.add("input-error"); // aplica borda/sublinhado vermelho
                valido = false;
            }
        });
    } else {
        console.log("Tipo transação Conta");
        [tipoTransacao, idConta, descricao, data, valor].forEach(campo => {
            if (!campo.value.trim()) {
                campo.classList.add("input-error"); // aplica borda/sublinhado vermelho
                valido = false;
            }
        });
    }

    console.log("A data informada é " + data.value);

    if (!validaData(data.value)) {
        console.log("A data foi inválida");
        data.classList.add("input-error"); // aplica borda/sublinhado vermelho
        valido = false;
    }

    // Despesa Mensal = -3, Parcela Única = -2, Parcelado = -1
    if (radioQtdVezes === "-1") {
        const parcelaAtual = document.getElementById("parcelaAtual");
        const quantidadeVezes = document.getElementById("quantidadeVezes");
        [parcelaAtual, quantidadeVezes].forEach(campo => campo.classList.remove("input-error"));
        [parcelaAtual, quantidadeVezes].forEach(campo => {
            if (!campo.value.trim()) {
                campo.classList.add("input-error"); // aplica borda/sublinhado vermelho
                valido = false;
            }
        });
    }

    if (!valido) {
        document.getElementById("feedback-message").innerText = "⚠️ Preencha todos os campos corretamente.";
    }
    return valido;
}

async function salvarInclusaoTransacao() {
    // pega os campos
    const usuarioLogado = sessionStorage.getItem("usuarioLogado");
    if (!usuarioLogado) {
        sessionStorage.setItem("signupSuccess", "❌ Usuário não logado. Favor logar novamente.");
        window.location.href = "index.html";
    }
    const naturezaOperacao = document.querySelector('input[name="naturezaOperacao"]:checked').value;
    const idConta = document.getElementById("idConta");
    const idCartao = document.getElementById("idCartao");
    const descricao = document.getElementById("descricao");
    const data = document.getElementById("data");
    const valor = document.getElementById("valor");

    if (!verificaCamposTransacao()) {
        return;
    }

    console.log("O valor da data é: " + data.value);
    console.log("O valor da natureza é: " + naturezaOperacao);

    // Despesa Mensal = -3, Parcela Única = -2, Parcelado = -1
    const radioQtdVezes = document.querySelector('input[name="radioQtdVezes"]:checked').value;
    var parcelaAtual = 0;
    var quantidadeVezes = 0;
    if (radioQtdVezes === "-3") {
        parcelaAtual = 0;
        quantidadeVezes = -3;
    } else if (radioQtdVezes === "-2") {
        parcelaAtual = 0;
        quantidadeVezes = -2;
    } else if (radioQtdVezes === "-1") {
        parcelaAtual = document.getElementById("parcelaAtual").value.trim();
        quantidadeVezes = document.getElementById("quantidadeVezes").value.trim();
    }

    // se passou na validação, envia
    const transacao = {
        naturezaOperacao: naturezaOperacao,
        idConta: idConta.value.trim(),
        idCartao: idCartao.value.trim(),
        descricao: descricao.value.trim(),
        data: data.value.trim(),
        valor: valor.value.trim(),
        parcelaAtual: parcelaAtual,
        quantidadeVezes: quantidadeVezes,
        usuarioLogado: usuarioLogado
    };

    console.log("O JSON enviado foi: " + JSON.stringify(transacao));

    try {
        const response = await fetch("/transacoes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(transacao)
        });

        if (response.ok) {
            const mensagem = await response.text();
            document.getElementById("feedback-message").innerText = "✅ Transação criada com sucesso!";
            sessionStorage.setItem("signupSuccess", "✅ Transação incluída com sucesso!");
            handleActionId('transacao', 'listar');
        } else {
            document.getElementById("feedback-message").innerText = "❌ Erro ao criar Transação. Tente novamente.";
        }
    } catch (error) {
        document.getElementById("feedback-message").innerText = "❌ Falha na conexão com o servidor.";
    }
}

async function salvarEdicaoTransacao() {
    // pega os campos
    const campoIdTransacao = document.getElementById("idTransacao");
    const naturezaOperacao = document.querySelector('input[name="naturezaOperacao"]:checked').value;
    const idConta = document.getElementById("idConta");
    const idCartao = document.getElementById("idCartao");
    const descricao = document.getElementById("descricao");
    const data = document.getElementById("data");
    const valor = document.getElementById("valor");

    if (!verificaCamposTransacao()) {
        return;
    }

    // Despesa Mensal = -1, Parcela Única = 0, Parcelado = 1
    const radioQtdVezes = document.querySelector('input[name="radioQtdVezes"]:checked').value;
    var parcelaAtual = 0;
    var quantidadeVezes = 0;
    if (radioQtdVezes === "-3") {
        parcelaAtual = 0;
        quantidadeVezes = -3;
    } else if (radioQtdVezes === "-2") {
        parcelaAtual = 0;
        quantidadeVezes = -2;
    } else if (radioQtdVezes === "-1") {
        parcelaAtual = document.getElementById("parcelaAtual").value.trim();
        quantidadeVezes = document.getElementById("quantidadeVezes").value.trim();
    }

    // se passou na validação, envia
    const transacao = {
        naturezaOperacao: naturezaOperacao,
        idConta: idConta.value.trim(),
        idCartao: idCartao.value.trim(),
        descricao: descricao.value.trim(),
        data: data.value.trim(),
        valor: valor.value.trim(),
        parcelaAtual: parcelaAtual,
        quantidadeVezes: quantidadeVezes
    };
    const idTransacao = campoIdTransacao.value.trim();

    try {
        const usuarioLogado = sessionStorage.getItem("usuarioLogado");
        if (!usuarioLogado || !idTransacao) {
            sessionStorage.setItem("signupSuccess", "❌ Usuário não logado. Favor logar novamente.");
            window.location.href = "index.html";
        }
        const response = await fetch("/transacoes/" + idTransacao, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(transacao)
        });

        if (response.ok) {
            const mensagem = await response.text();
            document.getElementById("feedback-message").innerText = "✅ Transação atualizada com sucesso!";
            sessionStorage.setItem("signupSuccess", "✅ Transação atualizada com sucesso!");
            handleActionId('transacao', 'listar');
        } else {
            document.getElementById("feedback-message").innerText = "❌ Erro ao atualizar a Transação. Tente novamente.";
        }
    } catch (error) {
        document.getElementById("feedback-message").innerText = "❌ Falha na conexão com o servidor.";
    }
}

async function salvarExclusaoTransacao() {
    const campoIdTransacao = document.getElementById("idTransacao");
    console.log("salvarExclusaoTransacao");
    const resposta = confirm("Deseja realmente excluir a Transação do sistema?");
    if (!resposta) {
        // usuário clicou em Cancelar
        document.getElementById("feedback-message").innerText = "⚠️ A exclusão da Transação foi cancelada.";
        return;
    }
    const idTransacao = campoIdTransacao.value.trim();

    try {
        const usuarioLogado = sessionStorage.getItem("usuarioLogado");
        if (!usuarioLogado || !idTransacao) {
            sessionStorage.setItem("signupSuccess", "❌ Usuário não logado. Favor logar novamente.");
            window.location.href = "index.html";
        }
        const response = await fetch("/transacoes/" + idTransacao, {
            method: "DELETE"
        });

        if (response.ok) {
            const mensagem = await response.text();
            sessionStorage.setItem("signupSuccess", "✅ Transação excluída com sucesso!");
            handleActionId('transacao', 'listar');
        } else {
            document.getElementById("feedback-message").innerText = "❌ Erro ao excluir a Transação. Tente novamente.";
        }
    } catch (error) {
        document.getElementById("feedback-message").innerText = "❌ Falha na conexão com o servidor.";
    }
}

function selecionarTipoTransacao() {
    const tipoTransacao = document.getElementById("tipoTransacao").value;
    const divConta = document.getElementById("divConta");
    const divCartao = document.getElementById("divCartao");

    if (tipoTransacao === "0") {
        document.getElementById("idConta").value = '';
        divCartao.style.display = "block";
        divConta.style.display = "none";
    } else if (tipoTransacao === "1") {
        document.getElementById("idCartao").value = '';
        divCartao.style.display = "none";
        divConta.style.display = "block";
    }
}

function filtrarTransacoes(tipoTransacao) {
    console.log("filtrarTransacoes tipoTransacao = " + tipoTransacao);
    if (tipoTransacao === 0) {
        console.log("filtrarTransacoes Entrei no 0");
        document.getElementById("idConta").value = '';
        const select = document.getElementById("idCartao");
        document.getElementById("descricaoTipoTransacoes").textContent = "o Cartão de Crédito";
        document.getElementById("descricaoNomeTransacoes").textContent = select.options[select.selectedIndex].text;
    } else if (tipoTransacao === 1) {
        console.log("filtrarTransacoes Entrei no 1");
        document.getElementById("idCartao").value = '';
        const select = document.getElementById("idConta");
        document.getElementById("descricaoTipoTransacoes").textContent = " a Conta Corrente ";
        document.getElementById("descricaoNomeTransacoes").textContent = select.options[select.selectedIndex].text;
    }

    const contaId = document.getElementById("idConta").value;
    const cartaoId = document.getElementById("idCartao").value;

    console.log("filtrarTransacoes contaId = " + contaId + ", cartaoId = " + cartaoId);
    if (!contaId && !cartaoId) {
        document.getElementById("descricaoTipoTransacoes").textContent = "todas as";
        document.getElementById("descricaoNomeTransacoes").textContent = "Contas e Cartões";
        document.getElementById("tabela-transacoes").innerHTML = "";
        carregarTransacoes(0);
        return;
    }

    carregarTransacoesPorContaCartao(contaId, cartaoId, 0);

    toggleFiltrosTransacao();
}

async function carregarTransacoesPorContaCartao(contaId, cartaoId, page) {
    try {
        const response = await fetch(
            `/transacoes/listarPorContaCartao?idConta=${contaId}&idCartao=${cartaoId}&page=${page}&size=${pageSizeTransacao}&sortBy=${sortByTransacao}`
        );

        if (!response.ok) throw new Error("Erro ao buscar transações");

        const data = await response.json();
        const tabela = document.getElementById("tabela-transacoes");
        const tfoot = document.getElementById("footer-transacoes");
        valorTotal = 0;

        tabela.innerHTML = "";
        tfoot.innerHTML = "";

        if (!data || !data.content || data.content.length === 0) {
            tabela.innerHTML =
                "<tr><td colspan='5'>⚠️ Nenhuma transação encontrada para o filtro informado.</td></tr>";
            return;
        }

        data.content.forEach(transacao => {
            const tr = document.createElement("tr");

            const tdAcoes = document.createElement("td");
            tdAcoes.innerHTML = `| <a href="#" onclick="handleActionId('transacao', 'editar', ${transacao.id})" style="cursor:pointer">✏️</a> | <a href="#" onclick="handleActionId('transacao', 'excluir', ${transacao.id})" style="cursor:pointer">🗑️</a> |`;

            const tdData = document.createElement("td");
            tdData.textContent = formatarDataBrasil(transacao.data);

            if (contaId != null && contaId !== "") {
                valorTotal = transacao.saldoConta;
            } else {
                valorTotal = transacao.limiteCartao;
            }

            const tdValor = document.createElement("td");
            // Formatar como moeda BRL
            const valorFormatado = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(transacao.valor);

            tdValor.textContent = valorFormatado;

            // Aplicar cor conforme natureza
            if (transacao.naturezaOperacao === 0) {
                tdValor.classList.add("valor-despesa");
            } else {
                tdValor.classList.add("valor-receita");
            }

            const tdDescricao = document.createElement("td");
            tdDescricao.textContent = transacao.descricao;

            const tdQtd = document.createElement("td");
            // Despesa Mensal = -3, Parcela Única = -2, Parcelado = -1
            if (transacao.quantidadeVezes === -3) {
                tdQtd.textContent = "Mensal"
            } else if (transacao.quantidadeVezes === -2) {
                tdQtd.textContent = "Única"
            } else {
                tdQtd.textContent = "Parcela " + transacao.parcelaAtual + " de " + transacao.quantidadeVezes;
            }

            tr.append(tdAcoes, tdData, tdValor, tdDescricao, tdQtd);
            tabela.appendChild(tr);
        });

        // ----- FOOTER -----

        const trTotal = document.createElement("tr");
        trTotal.style.fontWeight = "bold";
        trTotal.style.backgroundColor = "#f3f4f6";

        const tdLabel = document.createElement("td");
        tdLabel.colSpan = 4;
        tdLabel.style.textAlign = "right";

        const tdTotal = document.createElement("td");

        if (contaId != null && contaId !== "") {
            tdLabel.textContent = "Saldo atual";
        } else {
            tdLabel.textContent = "Limite restante";
        }

        tdTotal.textContent = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valorTotal);

        if (valorTotal < 0) {
            tdTotal.classList.add("valor-despesa");
        } else {
            tdTotal.classList.add("valor-receita");
        }

        trTotal.append(tdLabel, tdTotal);
        tfoot.appendChild(trTotal);

    } catch (error) {
        console.error(error);
    }
}

function toggleFiltrosTransacao() {

    const painel = document.getElementById("painelFiltros");
    const botao = document.getElementById("btnToggleFiltros");

    painel.classList.toggle("recolhido");

    if (painel.classList.contains("recolhido")) {
        botao.textContent = "⬇️ Filtros";
    } else {
        botao.textContent = "⬆️ Filtros";
    }
}

function toggleParcelasTransacao(valor) {
    const divParcelas = document.getElementById("divParcelas");

    // Despesa Mensal = -3, Parcela Única = -2, Parcelado = -1
    if (valor === "-1") {
        divParcelas.classList.remove("hidden");
    } else {
        document.getElementById("parcelaAtual").value = null;
        document.getElementById("quantidadeVezes").value = null;
        divParcelas.classList.add("hidden");
    }
}
