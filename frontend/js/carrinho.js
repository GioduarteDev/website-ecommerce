// ARQUIVO: carrinho.js (VERSÃO FINAL COMPLETA - 10/06/2025)

// --- CONFIGURAÇÃO ---
const CART_STORAGE_KEY = 'abelarStoreCarrinho';
const FAVORITES_STORAGE_KEY = 'abelarStoreFavoritos';

// Dados para a seção de recomendações
const recommendationsData = [
    { name: 'Acessório Unissex', price: 179, image: 'ftscarri/acess1.jfif' },
    { name: 'Anel Bubble', price: 188, image: 'ftscarri/acess2.jfif' },
    { name: 'Colar Dourado', price: 330, image: 'ftscarri/acess3.jfif' },
    { name: 'Coletânea Colar', price: 330, image: 'ftscarri/acess4.jfif' }
];

// --- FUNÇÕES GERAIS ---
function getCarrinho() { return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || []; }
function salvarCarrinho(carrinho) { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(carrinho)); }
function getFavoritos() { return JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY)) || []; }
function salvarFavoritos(favoritos) { localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoritos)); }

// Função para formatar moeda
function formatCurrency(value) { return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }


// --- FUNÇÕES DE AÇÃO DO CARRINHO ---
function adicionarAoCarrinho(id, nome, preco, imagem) {
    const carrinho = getCarrinho();
    const produtoExistente = carrinho.find(item => item.id === id);
    if (produtoExistente) {
        produtoExistente.quantidade += 1;
    } else {
        carrinho.push({ id, nome, preco, imagem, quantidade: 1 });
    }
    salvarCarrinho(carrinho);
    atualizarContadorHeader();
    alert(`"${nome}" foi adicionado ao carrinho!`);
}

function removerItemDoCarrinho(id) {
    let carrinho = getCarrinho();
    carrinho = carrinho.filter(item => item.id !== id);
    salvarCarrinho(carrinho);
    atualizarTudoNaTela();
}

function atualizarQuantidadeItem(id, novaQuantidade) {
    let carrinho = getCarrinho();
    const item = carrinho.find(p => p.id === id);
    if (item) {
        if (novaQuantidade > 0) {
            item.quantidade = novaQuantidade;
        } else {
            removerItemDoCarrinho(id); // Se a quantidade for 0 ou menos, remove o item
            return; // Sai da função para evitar re-renderização dupla
        }
    }
    salvarCarrinho(carrinho);
    atualizarTudoNaTela();
}

// --- FUNÇÕES VISUAIS ---
function atualizarTudoNaTela() {
    atualizarContadorHeader();

    // Atualiza a página do carrinho, se ela estiver aberta
    if (document.getElementById('carrinho-final-container')) {
        renderizarPaginaFinalDoCarrinho();
    }
    
    // Atualiza a seção de recomendações, se ela existir na página
    if (document.getElementById('recommendations-container')) {
        renderizarRecomendacoes();
    }
}

function atualizarContadorHeader() {
    const totalItens = getCarrinho().reduce((total, item) => total + item.quantidade, 0);
    const contadorElemento = document.getElementById('cart-count');
    if (contadorElemento) contadorElemento.textContent = totalItens;
}

function renderizarPaginaFinalDoCarrinho() {
    const container = document.getElementById('carrinho-final-container');
    if (!container) return; // Se não estiver na página do carrinho, não faz nada.
    
    const carrinho = getCarrinho();
    container.innerHTML = '';
    let subtotal = 0;

    if (carrinho.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 40px; color: #555;"><p>Seu carrinho está vazio.</p><a href="../index.html" style="color: #000; text-decoration: underline; margin-top: 10px; display: inline-block;">Continuar comprando</a></div>';
        document.getElementById('subtotal-valor').textContent = 'R$ 0,00';
        document.getElementById('frete-valor').textContent = 'R$ 0,00';
        document.getElementById('total-valor').textContent = 'R$ 0,00';
        return;
    }

    carrinho.forEach(item => {
        const imagemSrc = item.imagem;
        const precoNumerico = parseFloat(item.preco);
        const subtotalItem = precoNumerico * item.quantidade;
        subtotal += subtotalItem;
        const itemHTML = `
            <div class="item-carrinho-final" data-id="${item.id}">
                <div class="detalhes">
                    <img src="${imagemSrc}" alt="${item.nome}">
                    <div class="info-produto">
                        <span class="nome-produto">${item.nome}</span>
                        <span class="preco-unitario">${formatCurrency(precoNumerico)}</span>
                    </div>
                </div>
                <div class="quantidade">
                    <button class="btn-qty" data-id="${item.id}" data-change="-1">-</button>
                    <span>${item.quantidade}</span>
                    <button class="btn-qty" data-id="${item.id}" data-change="1">+</button>
                </div>
                <div class="subtotal-item">${formatCurrency(subtotalItem)}</div>
                <button class="btn-remover-final" data-id="${item.id}">&times;</button>
            </div>`;
        container.innerHTML += itemHTML;
    });

    const frete = subtotal > 300 ? 0 : 25.00;
    document.getElementById('subtotal-valor').textContent = formatCurrency(subtotal);
    document.getElementById('frete-valor').textContent = frete > 0 ? formatCurrency(frete) : 'Grátis';
    document.getElementById('total-valor').textContent = formatCurrency(subtotal + frete);

    ligarControlesDoCarrinhoFinal();
}

function ligarControlesDoCarrinhoFinal() {
    document.querySelectorAll('.btn-qty').forEach(btn => {
        btn.onclick = function() {
            const item = getCarrinho().find(p => p.id === this.dataset.id);
            if (item) atualizarQuantidadeItem(this.dataset.id, item.quantidade + parseInt(this.dataset.change));
        };
    });
    document.querySelectorAll('.btn-remover-final').forEach(btn => {
        btn.onclick = function() { if (confirm('Tem certeza?')) removerItemDoCarrinho(this.dataset.id); };
    });
}

function renderizarRecomendacoes() {
    const recommendationsContainer = document.getElementById('recommendations-container');
    if (!recommendationsContainer) return;

    recommendationsContainer.innerHTML = '';
    recommendationsData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<img src="${item.image}" alt="${item.name}"><p>${item.name} - ${formatCurrency(item.price)}</p>`;
        recommendationsContainer.appendChild(card);
    });
}


// --- INICIALIZAÇÃO ---
// Roda o código quando o HTML da página terminar de carregar
document.addEventListener('DOMContentLoaded', atualizarTudoNaTela);