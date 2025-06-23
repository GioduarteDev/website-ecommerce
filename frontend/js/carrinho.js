// ARQUIVO: carrinho.js (VERSÃO COMPLETA ATUALIZADA)

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
function getCarrinho() { 
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || []; 
}

function salvarCarrinho(carrinho) { 
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(carrinho)); 
}

function getFavoritos() { 
    return JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY)) || []; 
}

function salvarFavoritos(favoritos) { 
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoritos)); 
}

function formatCurrency(value) { 
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); 
}

// --- FUNÇÕES DE AÇÃO DO CARRINHO ---
function adicionarAoCarrinho(id, nome, preco, imagem) {
    const carrinho = getCarrinho();
    const produtoExistente = carrinho.find(item => item.id === id);
    
    if (produtoExistente) {
        produtoExistente.quantidade += 1;
    } else {
        carrinho.push({ 
            id, 
            nome, 
            preco, 
            imagem, 
            quantidade: 1 
        });
    }
    
    salvarCarrinho(carrinho);
    atualizarContadorHeader();
    
    // Feedback visual
    const feedback = document.createElement('div');
    feedback.textContent = `"${nome}" adicionado ao carrinho!`;
    feedback.style.position = 'fixed';
    feedback.style.bottom = '20px';
    feedback.style.right = '20px';
    feedback.style.backgroundColor = '#4CAF50';
    feedback.style.color = 'white';
    feedback.style.padding = '10px 20px';
    feedback.style.borderRadius = '4px';
    feedback.style.zIndex = '1000';
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.remove();
    }, 3000);
}

function removerItemDoCarrinho(id) {
    let carrinho = getCarrinho();
    carrinho = carrinho.filter(item => item.id !== id);
    salvarCarrinho(carrinho);
    atualizarTudoNaTela();
}

function atualizarQuantidadeItem(id, novaQuantidade) {
    let carrinho = getCarrinho();
    const itemIndex = carrinho.findIndex(item => item.id === id);
    
    if (itemIndex !== -1) {
        if (novaQuantidade > 0) {
            carrinho[itemIndex].quantidade = novaQuantidade;
            salvarCarrinho(carrinho);
            
            // Atualização otimizada do DOM
            const qtyDisplay = document.querySelector(`.item-carrinho-final[data-id="${id}"] .qty-display`);
            const subtotalDisplay = document.querySelector(`.item-carrinho-final[data-id="${id}"] .subtotal-item`);
            
            if (qtyDisplay) qtyDisplay.textContent = novaQuantidade;
            if (subtotalDisplay) {
                const preco = parseFloat(carrinho[itemIndex].preco);
                subtotalDisplay.textContent = formatCurrency(preco * novaQuantidade);
            }
            
            // Atualiza totais
            atualizarTotaisCarrinho();
        } else {
            removerItemDoCarrinho(id);
        }
    }
}

function atualizarTotaisCarrinho() {
    const carrinho = getCarrinho();
    const subtotal = carrinho.reduce((sum, item) => sum + (parseFloat(item.preco) * item.quantidade), 0);
    const frete = subtotal > 300 ? 0 : 25.00;
    
    document.getElementById('subtotal-valor').textContent = formatCurrency(subtotal);
    document.getElementById('frete-valor').textContent = frete > 0 ? formatCurrency(frete) : 'Grátis';
    document.getElementById('total-valor').textContent = formatCurrency(subtotal + frete);
}

// --- FUNÇÕES VISUAIS ---
function atualizarTudoNaTela() {
    atualizarContadorHeader();

    if (document.getElementById('carrinho-final-container')) {
        renderizarPaginaFinalDoCarrinho();
    }
    
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
    if (!container) return;
    
    const carrinho = getCarrinho();
    container.innerHTML = '';
    
    if (carrinho.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #555;">
                <p>Seu carrinho está vazio.</p>
                <a href="../index.html" style="color: #000; text-decoration: underline; margin-top: 10px; display: inline-block;">
                    Continuar comprando
                </a>
            </div>`;
        
        document.getElementById('subtotal-valor').textContent = 'R$ 0,00';
        document.getElementById('frete-valor').textContent = 'R$ 0,00';
        document.getElementById('total-valor').textContent = 'R$ 0,00';
        return;
    }

    carrinho.forEach(item => {
        const precoNumerico = parseFloat(item.preco);
        const subtotalItem = precoNumerico * item.quantidade;
        
        const itemHTML = `
            <div class="item-carrinho-final" data-id="${item.id}">
                <div class="detalhes">
                    <div class="info-produto">
                        <span class="nome-produto">${item.nome}</span>
                        <span class="preco-unitario">${formatCurrency(precoNumerico)}</span>
                    </div>
                </div>
                <div class="quantidade">
                    <button class="btn-qty" data-id="${item.id}" data-change="-1">-</button>
                    <span class="qty-display">${item.quantidade}</span>
                    <button class="btn-qty" data-id="${item.id}" data-change="1">+</button>
                </div>
                <div class="subtotal-item">${formatCurrency(subtotalItem)}</div>
                <button class="btn-remover-final" data-id="${item.id}">&times;</button>
            </div>`;
        
        container.insertAdjacentHTML('beforeend', itemHTML);
    });

    atualizarTotaisCarrinho();
    ligarControlesDoCarrinhoFinal();
}

function ligarControlesDoCarrinhoFinal() {
    document.querySelectorAll('.btn-qty').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = this.dataset.id;
            const change = parseInt(this.dataset.change);
            const item = getCarrinho().find(item => item.id === itemId);
            
            if (item) {
                const newQty = item.quantidade + change;
                atualizarQuantidadeItem(itemId, newQty);
            }
        });
    });

    document.querySelectorAll('.btn-remover-final').forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('Tem certeza que deseja remover este item?')) {
                removerItemDoCarrinho(this.dataset.id);
            }
        });
    });
}

function renderizarRecomendacoes() {
    const container = document.getElementById('recommendations-container');
    if (!container) return;

    container.innerHTML = '';
    recommendationsData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <p>${item.name} - ${formatCurrency(item.price)}</p>
        `;
        container.appendChild(card);
    });
}

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', function() {
    atualizarTudoNaTela();
    
    // Evento para o botão de finalizar compra
    const checkoutBtn = document.querySelector('.checkout-button');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (getCarrinho().length === 0) {
                alert('Seu carrinho está vazio!');
                return;
            }
            // Aqui você pode adicionar redirecionamento para checkout
            console.log('Finalizando compra...');
        });
    }
});