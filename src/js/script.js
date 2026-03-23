// 1. Seletores
const meuModal = document.getElementById('modal');
const containerItens = document.getElementById('itensCarrinho');
const campoTotal = document.getElementById('valorTotal');
const fecharModal = document.querySelector('.fechar');
const btnCarrinhoIcone = document.getElementById('abrirCarrinho');
const notificacaoContainer = document.getElementById('notificacao-container');
const btnFinalizar = document.getElementById('btnFinalizar');

// Seleciona apenas botões de compra que estão dentro dos cards de produto
const botoesAdicionar = document.querySelectorAll('.produto--card .btn');

let carrinho = [];

// 2. Funções

// Função que desenha a lista de itens dentro do Modal
function renderizarCarrinho() {
    containerItens.innerHTML = "";
    let somaTotal = 0;

    carrinho.forEach((item, index) => {
        const elementoItem = document.createElement('div');
        elementoItem.classList.add('carrinho--item');

        elementoItem.innerHTML = `
            <img src="${item.imagem}" alt="${item.nome}" style="width: 50px; height: 50px; border-radius: 5px; object-fit: cover;">
            <div class="item--info">
                <p><strong>${item.nome}</strong></p>
                <p>${item.preco}</p>
            </div>
            <button class="btn-remover" onclick="removerItem(${index})">❌</button>
        `;

        containerItens.appendChild(elementoItem);

        // Tratamento do preço para soma
        const valorNumerico = parseFloat(item.preco.replace('R$', '').replace('.', '').replace(',', '.').trim());
        somaTotal += valorNumerico;
    });

    campoTotal.textContent = somaTotal.toLocaleString('pt-br', { minimumFractionDigits: 2 });
}

// Função para a Notificação Flutuante (Toast)
function mostrarNotificacao(nomeProduto) {
    // Criamos a div da notificação
    const novaNotificacao = document.createElement('div');

    novaNotificacao.classList.add('notificacao');
    novaNotificacao.innerHTML = `✅ <strong>${nomeProduto}</strong> adicionado!`;

    // Adiciona ao container fixo que está no seu HTML
    notificacaoContainer.appendChild(novaNotificacao);

    // Remove a mensagem após 2 segundos
    setTimeout(() => {
        novaNotificacao.style.opacity = '0'; // Efeito de fade out
        setTimeout(() => novaNotificacao.remove(), 300); // Remove do HTML após o fade
    }, 2000);
}

// Função global para remover itens (necessário window. para o onclick do HTML funcionar)
window.removerItem = function (index) {
    carrinho.splice(index, 1);
    renderizarCarrinho();
}

// 3. Eventos

// Clique no ícone do carrinho (Menu superior) - ABRE O MODAL
btnCarrinhoIcone.addEventListener('click', (event) => {
    event.preventDefault();
    renderizarCarrinho();
    meuModal.classList.add('ativo');
});

// Clique no botão Adicionar (Card do produto) - APENAS NOTIFICA
botoesAdicionar.forEach((botao) => {
    botao.addEventListener('click', (event) => {
        const card = event.target.closest('.produto--card');

        // Verifica se o clique foi em um card válido
        if (card) {
            const novoProduto = {
                nome: card.querySelector('h3').textContent,
                preco: card.querySelector('span').textContent,
                imagem: card.querySelector('img').src
            };

            carrinho.push(novoProduto);

            // 1. Mostra a mensagem flutuante
            mostrarNotificacao(novoProduto.nome);

            // 2. Atualiza os dados internamente (sem abrir o modal)
            renderizarCarrinho();
        }
    });
});

// Função para enviar o pedido
btnFinalizar.addEventListener('click', () => {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    // 1. Monta a lista de produtos para o texto
    let mensagem = "Olá! Gostaria de fazer um pedido:\n\n";

    carrinho.forEach(item => {
        mensagem += `• ${item.nome} - ${item.preco}\n`;
    });

    mensagem += `\n*Total: R$ ${campoTotal.textContent}*`;
    mensagem += "\n\nPor favor, aguardo o retorno sobre a entrega!";

    // 2. Codifica para URL e redireciona para o WhatsApp
    // Substitua pelo SEU número (DDI + DDD + Número)
    const numeroWhats = "5519971583399";
    const linkZap = `https://wa.me/${numeroWhats}?text=${encodeURIComponent(mensagem)}`;

    window.open(linkZap, "_blank");
});

// Fechar modal no botão X
fecharModal.addEventListener('click', () => {
    meuModal.classList.remove('ativo');
});

// Fechar modal ao clicar na parte escura (fundo)
window.addEventListener('click', (event) => {
    if (event.target == meuModal) {
        meuModal.classList.remove('ativo');
    }
});