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

function handleAction(modulo, acao) {
    console.log("Entrei no handleAction(modulo, acao)");
    handleActionId(modulo, acao, null);
}

function handleActionId(modulo, acao, id) {
    try{
        const usuarioLogado = sessionStorage.getItem("usuarioLogado");
        if (!usuarioLogado) {
            sessionStorage.setItem("signupSuccess", "❌ Usuário não logado. Favor logar novamente.");
            window.location.href = "index.html";
            return;
        }

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
                console.log("O módulo é Transacao")
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