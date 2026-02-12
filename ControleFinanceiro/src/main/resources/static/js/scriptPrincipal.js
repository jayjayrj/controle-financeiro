function cancelAction(modulo, acao) {
    const feedbackArea = document.getElementById('action-feedback');
    feedbackArea.classList.add('hidden');
    if (modulo && acao) {
        handleAction(modulo, acao);
    } else {
        window.location.href = "principal.html";
    }
}

const defaultConfig = {
    background_color: "#f8f9fa",
    header_color: "#1e3a8a",
    nav_color: "#3b82f6",
    card_color: "#ffffff",
    text_color: "#1f2937",
    system_title: "Sistema de Controle Financeiro",
    welcome_message: "Bem-vindo ao seu painel financeiro",
    dashboard_subtitle: "Gerencie suas finanças de forma inteligente"
};

async function onConfigChange(config) {
    try {
        const app = document.getElementById('app');
        const header = document.getElementById('header');
        const nav = document.getElementById('nav');
        const cards = document.querySelectorAll('.card');
        const footer = document.getElementById('footer');
        const dropdownButtons = document.querySelectorAll('.dropdown button');
        const feedbackArea = document.getElementById('action-feedback');

        const backgroundColor = config.background_color || defaultConfig.background_color;
        const headerColor = config.header_color || defaultConfig.header_color;
        const navColor = config.nav_color || defaultConfig.nav_color;
        const cardColor = config.card_color || defaultConfig.card_color;
        const textColor = config.text_color || defaultConfig.text_color;

        app.style.background = backgroundColor;
        app.style.color = textColor;

        header.style.background = headerColor;
        header.style.color = '#ffffff';

        nav.style.background = navColor;

        dropdownButtons.forEach(btn => {
            btn.style.color = '#ffffff';
        });

        cards.forEach(card => {
            card.style.background = cardColor;
            card.style.color = textColor;
        });

        feedbackArea.style.background = cardColor;
        feedbackArea.style.color = textColor;

        footer.style.borderColor = textColor + '20';

        document.getElementById('system-title').textContent = config.system_title || defaultConfig.system_title;
        document.getElementById('welcome-message').textContent = config.welcome_message || defaultConfig.welcome_message;
        document.getElementById('dashboard-subtitle').textContent = config.dashboard_subtitle || defaultConfig.dashboard_subtitle;
    } catch(error) {
        console.log("Erro tratado em onConfigChange " + error.value);
    }
}

async function carregarUsuario(id) {
    try {
        const response = await fetch(`http://localhost:8080/user/${id}`);
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

async function carregarBanco(id) {
    try {
        const response = await fetch(`http://localhost:8080/bancos/${id}`);
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
        const response = await fetch("http://localhost:8080/bancos/listar");
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

async function preencherSelectsBanco() {
    await carregarSelectBancos();
    console.log("Vou popular o idBanco com " + sessionStorage.getItem("idBanco"));
    document.getElementById("idBanco").value = sessionStorage.getItem("idBanco");
    sessionStorage.removeItem("idBanco");
}

async function carregarConta(id) {
    try {
        const response = await fetch(`http://localhost:8080/contas/${id}`);
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

async function carregarCartao(id) {
    try {
        const response = await fetch(`http://localhost:8080/cartoesCredito/${id}`);
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

async function carregarTransacao(id) {
    try {
        const response = await fetch(`http://localhost:8080/transacoes/${id}`);
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
        const response = await fetch("http://localhost:8080/contas/listar");
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
        const response = await fetch("http://localhost:8080/cartoesCredito/listar");
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


function preencherCamposPerfil(usuario) {
    try {
        document.getElementById("nome").value = usuario.nome;
        document.getElementById("email").value = usuario.email;
        document.getElementById("cadastroUsuario").value = usuario.usuario;
        document.getElementById("cadastroSenha").value = usuario.senha;
        document.getElementById("cadastroSenhaConfirm").value = usuario.senha;
    } catch (error) {
        console.error(error);
    }
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

function preencherCamposTransacao(transacao) {
    try {
        document.getElementById("idTransacao").value = transacao.id;
        document.getElementById("idConta").value = transacao.idConta;
        // Coloca na sessão para poder carregar tardiamente
        sessionStorage.setItem("idConta", transacao.idConta);
        document.getElementById("idCartao").value = transacao.idCartao;
        // Coloca na sessão para poder carregar tardiamente
        sessionStorage.setItem("idCartao", transacao.idCartao);
        document.getElementById("naturezaOperacao").value = transacao.naturezaOperacao;
        document.getElementById("data").value = transacao.data.substring(0, 10);
        document.getElementById("valor").value = transacao.valor;
        document.getElementById("quantidadeVezes").value = transacao.quantidadeVezes;
        selecionarTipoTransacao();
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
        console.log("Vou chamar: "+ `http://localhost:8080/bancos/listar?page=${page}&size=${pageSizeBanco}&sortBy=${sortByBanco}`);
        const response = await fetch(`http://localhost:8080/bancos/listar?page=${page}&size=${pageSizeBanco}&sortBy=${sortByBanco}`);
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

let currentPageConta = 0;
const pageSizeConta = 5;
const sortByConta = "nome";

async function carregarContas(page) {
    console.log("Entrei no carregarContas");
    try {
        console.log("Vou chamar: "+ `http://localhost:8080/contas/listar?page=${page}&size=${pageSizeConta}&sortBy=${sortByConta}`);
        const response = await fetch(`http://localhost:8080/contas/listar?page=${page}&size=${pageSizeConta}&sortBy=${sortByConta}`);
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
            tdAcoes.innerHTML = `| <a href="#" onclick="handleActionId('conta', 'editar', ${conta.id})" style="cursor:pointer">✏️</a> | <a href="#" onclick="handleActionId('conta', 'excluir', ${conta.id})" style="cursor:pointer">🗑️</a> |`;

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

let currentPageCartao = 0;
const pageSizeCartao = 5;
const sortByCartao = "nome";

async function carregarCartoes(page) {
    console.log("Entrei no carregarCartoes");
    try {
        console.log("Vou chamar: "+ `http://localhost:8080/cartoesCredito/listar?page=${page}&size=${pageSizeCartao}&sortBy=${sortByCartao}`);
        const response = await fetch(`http://localhost:8080/cartoesCredito/listar?page=${page}&size=${pageSizeCartao}&sortBy=${sortByCartao}`);
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
            tdAcoes.innerHTML = `| <a href="#" onclick="handleActionId('cartao', 'editar', ${cartao.id})" style="cursor:pointer">✏️</a> | <a href="#" onclick="handleActionId('cartao', 'excluir', ${cartao.id})" style="cursor:pointer">🗑️</a> |`;

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

let currentPageTransacao = 0;
const pageSizeTransacao = 5;
const sortByTransacao = "nome";

async function carregarTransacoes(page) {
    console.log("Entrei no carregarTransacoes");
    try {
        console.log("Vou chamar: "+ `http://localhost:8080/transacoes/listar?page=${page}&size=${pageSizeTransacao}&sortBy=${sortByTransacao}`);
        const response = await fetch(`http://localhost:8080/transacoes/listar?page=${page}&size=${pageSizeTransacao}&sortBy=${sortByTransacao}`);
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
            tdValor.textContent = transacao.valor;

            // coluna naturezaOperacao
            const tdNaturezaOperacao = document.createElement("td");
            tdNaturezaOperacao.textContent = transacao.naturezaOperacao;

            // coluna qtdRestante
            const tdQtdRestante = document.createElement("td");
            tdQtdRestante.textContent = transacao.quantidadeVezes;

            tr.appendChild(tdAcoes);
            tr.appendChild(tdData);
            tr.appendChild(tdValor);
            tr.appendChild(tdNaturezaOperacao);
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

function handleAction(modulo, acao) {
    console.log("Entrei no handleAction(modulo, acao)");
    handleActionId(modulo, acao, null);
}

function handleActionId(modulo, acao, id) {
    try{
        console.log("Entrei no handleActionId(modulo, acao, id)");
        const feedbackArea = document.getElementById('action-feedback');
        const feedbackIcon = document.getElementById('feedback-icon');
        const feedbackTitle = document.getElementById('feedback-title');
        const feedbackMessage = document.getElementById('feedback-message');

        const moduloNomes = {
            perfil: 'Perfil',
            banco: 'Banco',
            conta: 'Conta Corrente',
            cartao: 'Cartão de Crédito',
            transacao: 'Transação'
        };

        const acaoNomes = {
            incluir: 'Inclusão',
            editar: 'Edição',
            excluir: 'Exclusão',
            listar: 'Listar'
        };

        const icons = {
            incluir: '➕',
            editar: '✏️',
            excluir: '🗑️',
            listar: '📋'
        };

        feedbackIcon.textContent = icons[acao];
        feedbackTitle.textContent = `${acaoNomes[acao]} ${moduloNomes[modulo]}`;
        feedbackMessage.textContent = `Você selecionou a opção de ${acaoNomes[acao].toLowerCase()} para o módulo ${moduloNomes[modulo]}.`;

        console.log("Entrei no if do handleActionId.")
        // No caso de edição ou exclusão, carregar os dados
        console.log("acao = " + acao)
        console.log("modulo = " + modulo)

        // Verificando depois da página carregar
        if (acao === "editar" || acao === "excluir") {
            console.log("A ação é Edição ou Exclusão")
            if (modulo === "perfil") {
                console.log("O módulo é Perfil")
                const usuarioLogado = sessionStorage.getItem("usuarioLogado");
                carregarUsuario(usuarioLogado);
            } else if (modulo === "banco") {
                console.log("O módulo é Banco")
                carregarBanco(id);
            } else if (modulo === "conta") {
                console.log("O módulo é Conta")
                carregarConta(id);
            } else if (modulo === "cartao") {
                console.log("O módulo é Cartao")
                carregarCartao(id);
            } else if (modulo === "transacao") {
                console.log("O módulo é Transacao")
                carregarTransacao(id);
            }
        } else if (acao === "listar") {
            console.log("A ação é Listar")
            if (modulo === "banco") {
                console.log("O módulo é Banco")
                carregarBancos(0);
            } else if (modulo === "conta") {
                console.log("O módulo é Conta")
                carregarContas(0);
            } else if (modulo === "cartao") {
                console.log("O módulo é Cartao")
                carregarCartoes(0);
            } else if (modulo === "transacao") {
                console.log("O módulo é Transacap")
                carregarTransacoes(0);
            }
        }

        fetch(modulo.toLowerCase()+"/"+acao.toLowerCase()+".html")
            .then(response => response.text())
            .then(data => {
                const container = document.getElementById("action-content");
                container.innerHTML = data;

                // Executa scripts embutidos
                container.querySelectorAll("script").forEach(oldScript => {
                    const newScript = document.createElement("script");
                    if (oldScript.src) {
                        newScript.src = oldScript.src;
                    } else {
                        newScript.textContent = oldScript.textContent;
                    }
                    document.body.appendChild(newScript);
                });


                feedbackArea.classList.remove('hidden');
                feedbackArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            })
            .catch(error => console.error("Erro ao carregar:", error));

    } catch(error) {
        console.log("Erro tratado em handleAction" + error.value);
    }
}

document.addEventListener("DOMContentLoaded", handleAction);

if (window.elementSdk) {
    window.elementSdk.init({
        defaultConfig,
        onConfigChange,
        mapToCapabilities: (config) => ({
            recolorables: [
                {
                    get: () => config.background_color || defaultConfig.background_color,
                    set: (value) => {
                        config.background_color = value;
                        window.elementSdk.setConfig({ background_color: value });
                    }
                },
                {
                    get: () => config.header_color || defaultConfig.header_color,
                    set: (value) => {
                        config.header_color = value;
                        window.elementSdk.setConfig({ header_color: value });
                    }
                },
                {
                    get: () => config.nav_color || defaultConfig.nav_color,
                    set: (value) => {
                        config.nav_color = value;
                        window.elementSdk.setConfig({ nav_color: value });
                    }
                },
                {
                    get: () => config.card_color || defaultConfig.card_color,
                    set: (value) => {
                        config.card_color = value;
                        window.elementSdk.setConfig({ card_color: value });
                    }
                },
                {
                    get: () => config.text_color || defaultConfig.text_color,
                    set: (value) => {
                        config.text_color = value;
                        window.elementSdk.setConfig({ text_color: value });
                    }
                }
            ],
            borderables: [],
            fontEditable: undefined,
            fontSizeable: undefined
        }),
        mapToEditPanelValues: (config) => new Map([
            ["system_title", config.system_title || defaultConfig.system_title],
            ["welcome_message", config.welcome_message || defaultConfig.welcome_message],
            ["dashboard_subtitle", config.dashboard_subtitle || defaultConfig.dashboard_subtitle]
        ])
    });
}

onConfigChange(defaultConfig);

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
        const response = await fetch("http://localhost:8080/user/" + usuarioLogado, {
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
        const response = await fetch("http://localhost:8080/user/" + usuarioLogado, {
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
        const response = await fetch("http://localhost:8080/bancos", {
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
        const response = await fetch("http://localhost:8080/bancos/" + idBanco, {
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
        const response = await fetch("http://localhost:8080/bancos/" + idBanco, {
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
        const response = await fetch("http://localhost:8080/contas", {
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
        const response = await fetch("http://localhost:8080/contas/" + idConta, {
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
        const response = await fetch("http://localhost:8080/contas/" + idConta, {
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
        const response = await fetch("http://localhost:8080/cartoesCredito", {
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
        const response = await fetch("http://localhost:8080/cartoesCredito/" + idCartao, {
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
        const response = await fetch("http://localhost:8080/cartoesCredito/" + idCartao, {
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

function verificaCamposTransacao() {
    // pega os campos
    const tipoTransacao = document.getElementById("tipoTransacao");
    const idConta = document.getElementById("idConta");
    const idCartao = document.getElementById("idCartao");
    const naturezaOperacao = document.getElementById("naturezaOperacao");
    const data = document.getElementById("data");
    const valor = document.getElementById("valor");
    const quantidadeVezes = document.getElementById("quantidadeVezes");

    // remove erros anteriores
    [tipoTransacao, idConta, idCartao, naturezaOperacao, data, valor, quantidadeVezes].forEach(campo => campo.classList.remove("input-error"));

    let valido = true;

    console.log("O Tipo transação é " + tipoTransacao.value);
    // valida campos obrigatórios
    // se o tipo de transação for zero é cartão de crédito
    if (tipoTransacao.value === "0") {
        console.log("Tipo transação Cartão");
        [tipoTransacao, idCartao, naturezaOperacao, data, valor].forEach(campo => {
            if (!campo.value.trim()) {
                campo.classList.add("input-error"); // aplica borda/sublinhado vermelho
                valido = false;
            }
        });
    } else {
        console.log("Tipo transação Conta");
        [tipoTransacao, idConta, naturezaOperacao, data, valor].forEach(campo => {
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
    const idConta = document.getElementById("idConta");
    const idCartao = document.getElementById("idCartao");
    const naturezaOperacao = document.getElementById("naturezaOperacao");
    const data = document.getElementById("data");
    const valor = document.getElementById("valor");
    const quantidadeVezes = document.getElementById("quantidadeVezes");

    if (!verificaCamposTransacao()) {
        return;
    }

    console.log("O valor da data é: " + data.value);

    // se passou na validação, envia
    const transacao = {
        idConta: idConta.value.trim(),
        idCartao: idCartao.value.trim(),
        naturezaOperacao: naturezaOperacao.value.trim(),
        data: data.value.trim(),
        valor: valor.value.trim(),
        quantidadeVezes: quantidadeVezes.value.trim(),
        usuarioLogado: usuarioLogado
    };

    try {
        const response = await fetch("http://localhost:8080/transacoes", {
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
    const idConta = document.getElementById("idConta");
    const idCartao = document.getElementById("idCartao");
    const naturezaOperacao = document.getElementById("naturezaOperacao");
    const data = document.getElementById("data");
    const valor = document.getElementById("valor");
    const quantidadeVezes = document.getElementById("quantidadeVezes");

    if (!verificaCamposTransacao()) {
        return;
    }

    // se passou na validação, envia
    const transacao = {
        idConta: idConta.value.trim(),
        idCartao: idCartao.value.trim(),
        naturezaOperacao: naturezaOperacao.value.trim(),
        data: data.value.trim(),
        valor: valor.value.trim(),
        quantidadeVezes: quantidadeVezes.value.trim()
    };
    const idTransacao = campoIdTransacao.value.trim();

    try {
        const usuarioLogado = sessionStorage.getItem("usuarioLogado");
        if (!usuarioLogado || !idTransacao) {
            sessionStorage.setItem("signupSuccess", "❌ Usuário não logado. Favor logar novamente.");
            window.location.href = "index.html";
        }
        const response = await fetch("http://localhost:8080/transacoes/" + idTransacao, {
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
        const response = await fetch("http://localhost:8080/transacoes/" + idTransacao, {
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
        divCartao.style.display = "block";
        divConta.style.display = "none";
    } else if (tipoTransacao === "1") {
        divCartao.style.display = "none";
        divConta.style.display = "block";
    }
}

function validaData(valor) {
    // valida o formato AAAA-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
        return false;
    }

    const [ano, mes, dia] = valor.split("-").map(Number);

    const data = new Date(ano, mes - 1, dia);

    // verifica se a data criada corresponde à informada
    return data.getFullYear() === ano &&
           data.getMonth() === mes - 1 &&
           data.getDate() === dia;
}

function formatarDataBrasil(dataIso) {
    const [ano, mes, dia] = dataIso.substring(0, 10).split("-");
    return `${dia}/${mes}/${ano}`;
}

(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9ba50dcd466e5e0f',t:'MTc2NzgwNTY3Mi4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();

function logout() {
    sessionStorage.setItem("signupSuccess", "✅ Perfil excluído com sucesso!");
    sessionStorage.setItem("usuarioLogado", "");
    window.location.href = "index.html";
}