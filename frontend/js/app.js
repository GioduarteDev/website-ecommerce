// js/main.js

console.log("main.js carregado!");

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM completamente carregado. Iniciando funcionalidades...");

    // Chamar as funções de inicialização de outros módulos
    iniciarCarrossel();         // Inicia o carrossel (função do script.js)
    iniciarMenuMobile();        // Inicia o menu móvel (função do script.js)

    // 1. Carregar todos os produtos quando a página inicial for carregada
    carregarProdutosNaPagina(); // Chama a função do produtos.js sem termo de busca

    // 2. Configurar o evento de submit da barra de pesquisa
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Impede o envio padrão do formulário
            const searchTerm = document.getElementById('search-input').value.trim();
            carregarProdutosNaPagina(searchTerm); // Chama a função com o termo de busca
        });
    } else {
        console.warn('Formulário de busca (#search-form) não encontrado.');
    }

    // 3. Configurar o evento do botão "Ver todos os produtos"
    const verTodosBtn = document.getElementById('ver-todos-produtos-btn');
    if (verTodosBtn) {
        verTodosBtn.addEventListener('click', () => {
            document.getElementById('search-input').value = ''; // Limpa a barra de busca
            carregarProdutosNaPagina(); // Carrega todos os produtos sem filtro
        });
    } else {
        console.warn('Botão "Ver todos os produtos" (#ver-todos-produtos-btn) não encontrado.');
    }

    // 4. Futuramente: Inicializar login, carrinho, etc. aqui
    // configurarEventosLoginCadastro(); // Ex: Função que você definiria em login.js
    // inicializarCarrinho(); // Ex: Função que você definiria em carrinho.js
});