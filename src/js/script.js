// 1. Seletores de Elementos
const meuModal = document.getElementById('modal');
const containerItens = document.getElementById('itensCarrinho');
const campoTotal = document.getElementById('valorTotal');
const fecharModal = document.querySelector('.fechar');
const btnCarrinhoIcone = document.getElementById('abrirCarrinho');
const notificacaoContainer = document.getElementById('notificacao-container');
const btnFinalizar = document.getElementById('btnFinalizar');
const contadorVisual = document.querySelector('.contador');
const botoesAdicionar = document.querySelectorAll('.produto--card .btn');

// --- Lógica do Carrinho (Apenas na Memória RAM) ---
// Agora o carrinho começa sempre vazio ao carregar a página
let carrinho = [];

// --- Funções de Interface ---

function atualizarContadorVisual() {
    if (contadorVisual) {
        const totalUnidades = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
        contadorVisual.textContent = totalUnidades;
        contadorVisual.style.display = totalUnidades === 0 ? "none" : "flex";
    }
}

function mostrarNotificacao(nome) {
    const toast = document.createElement('div');
    toast.className = 'notificacao';
    toast.innerHTML = `✅ <strong>${nome}</strong> no carrinho!`;
    notificacaoContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// --- Funções de Controle do Carrinho (Expostas ao Window) ---

window.adicionarUm = function(index) {
    carrinho[index].quantidade += 1;
    renderizarCarrinho();
    atualizarContadorVisual();
}

window.removerItem = function(index) {
    if (carrinho[index].quantidade > 1) {
        carrinho[index].quantidade -= 1;
    } else {
        carrinho.splice(index, 1);
    }
    renderizarCarrinho();
    atualizarContadorVisual();
}

window.excluirLinha = function(index) {
    carrinho.splice(index, 1);
    renderizarCarrinho();
    atualizarContadorVisual();
}

// --- Renderização Principal ---

function renderizarCarrinho() {
    containerItens.innerHTML = "";
    let somaTotal = 0;

    carrinho.forEach((item, index) => {
        const valorNumerico = parseFloat(item.preco.replace('R$', '').replace('.', '').replace(',', '.').trim());
        const subtotal = valorNumerico * item.quantidade;
        somaTotal += subtotal;

        const elementoItem = document.createElement('div');
        elementoItem.classList.add('carrinho--item');
        
        elementoItem.innerHTML = `
            <img src="${item.imagem}" alt="${item.nome}" style="width: 50px; height: 50px; border-radius: 5px; object-fit: cover;">
            <div class="item--info" style="flex: 1; margin-left: 10px;">
                <p><strong>${item.nome}</strong></p>
                <div class="qtd--controles">
                    <button class="btn-qtd" onclick="removerItem(${index})">−</button>
                    <span>${item.quantidade}</span>
                    <button class="btn-qtd" onclick="adicionarUm(${index})">＋</button>
                    <span style="font-size: 0.8em; color: #777; margin-left: 5px;">(un. ${item.preco})</span>
                </div>
            </div>
            <button class="btn-excluir-item" onclick="excluirLinha(${index})">❌</button>
        `;
        containerItens.appendChild(elementoItem);
    });

    campoTotal.textContent = somaTotal.toLocaleString('pt-br', { minimumFractionDigits: 2 });
}

// --- Eventos ---

botoesAdicionar.forEach((botao) => {
    botao.addEventListener('click', (event) => {
        const card = event.target.closest('.produto--card');
        if (card) {
            const nome = card.querySelector('h3').textContent;
            const preco = card.querySelector('span').textContent;
            const imagem = card.querySelector('img').src;

            const itemExistente = carrinho.find(item => item.nome === nome);
            
            if (itemExistente) {
                itemExistente.quantidade += 1;
            } else {
                carrinho.push({ nome, preco, imagem, quantidade: 1 });
            }

            mostrarNotificacao(nome);
            atualizarContadorVisual();
            if(meuModal.classList.contains('ativo')) renderizarCarrinho();
        }
    });
});

btnCarrinhoIcone.addEventListener('click', (e) => { 
    e.preventDefault(); 
    renderizarCarrinho(); 
    meuModal.classList.add('ativo'); 
});

fecharModal.addEventListener('click', () => meuModal.classList.remove('ativo'));

window.addEventListener('click', (e) => { 
    if(e.target == meuModal) meuModal.classList.remove('ativo'); 
});

btnFinalizar.addEventListener('click', () => {
    if (carrinho.length === 0) return alert("Carrinho vazio!");

    let msg = "Olá! Gostaria de fazer um pedido:\n\n";
    
    carrinho.forEach(item => {
        msg += `• ${item.quantidade}x ${item.nome} (${item.preco})\n`;
    });

    msg += `\n*Total: R$ ${campoTotal.textContent}*`;
    
    window.open(`https://wa.me/5519971583399?text=${encodeURIComponent(msg)}`, "_blank");
});

// Inicialização (Sempre vazio agora)
atualizarContadorVisual();