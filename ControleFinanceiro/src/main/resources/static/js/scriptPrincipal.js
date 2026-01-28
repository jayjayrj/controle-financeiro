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

async function carregarCartao(id) {
    try {
        const response = await fetch(`http://localhost:8080/cartoesCredito/${id}`);
        if (!response.ok) {
            throw new Error("Erro ao buscar cartão");
        }
        const banco = await response.json();
        preencherCamposCartao(banco);
    } catch (error) {
        console.error(error);
        document.getElementById("feedback-message").innerText = "❌ Não foi possível carregar os dados.";
    }
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

function handleAction(modulo, acao) {
    console.log("Entrei no handleAction(modulo, acao)");
    handleActionId(modulo, acao, null);
}

function handleActionId(modulo, acao, id) {
    console.log("Entrei no handleActionId(modulo, acao, id)");
    const feedbackArea = document.getElementById('action-feedback');
    const feedbackIcon = document.getElementById('feedback-icon');
    const feedbackTitle = document.getElementById('feedback-title');
    const feedbackMessage = document.getElementById('feedback-message');

    const moduloNomes = {
        perfil: 'Perfil',
        banco: 'Banco',
        cartao: 'Cartão de Crédito',
        investimentos: 'Investimentos'
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
        } else if (modulo === "cartao") {
            console.log("O módulo é Cartao")
            carregarCartao(id);
        }
    } else if (acao === "listar") {
        console.log("A ação é Listar")
        if (modulo === "banco") {
            console.log("O módulo é Banco")
            carregarBancos(0);
        } else if (modulo === "cartao") {
            console.log("O módulo é Cartao")
            carregarCartoes(0);
        }
    }

    // Carrega outro arquivo HTML e insere no DIV
    fetch(modulo.toLowerCase()+"/"+acao.toLowerCase()+".html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("action-content").innerHTML = data;
        })
        .catch(error => console.error("Erro ao carregar:", error));

    feedbackArea.classList.remove('hidden');
    feedbackArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

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

(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9ba50dcd466e5e0f',t:'MTc2NzgwNTY3Mi4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();

function logout() {
    sessionStorage.setItem("signupSuccess", "✅ Perfil excluído com sucesso!");
    sessionStorage.setItem("usuarioLogado", "");
    window.location.href = "index.html";
}