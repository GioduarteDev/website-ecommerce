// js/produtos.js

/**
 * Função para buscar produtos do backend e exibi-los no HTML.
 * Opcionalmente, pode receber um termo de busca para filtrar.
 * @param {string} termoBusca - O termo de pesquisa (nome do produto, descrição).
 */
async function carregarProdutosNaPagina(termoBusca = '') {
    console.log(`Tentando carregar produtos com termo: "${termoBusca}"`);
    try {
        let url = 'http://localhost:3000/produtos';
        if (termoBusca) {
            // Se houver um termo de busca, adicionamos como parâmetro na URL
            url += `?q=${encodeURIComponent(termoBusca)}`;
        }

        const response = await fetch(url); // Rota do seu backend para produtos

        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status} - ${response.statusText}`);
        }

        const produtos = await response.json();
        console.log('Produtos recebidos:', produtos);

        const containerProdutos = document.getElementById('container-produtos');
        if (!containerProdutos) {
            console.error('Elemento #container-produtos não encontrado no HTML.');
            return;
        }

        containerProdutos.innerHTML = ''; // Limpa qualquer conteúdo existente

        if (produtos.length === 0) {
            containerProdutos.innerHTML = '<p>Nenhum produto encontrado que corresponda à sua busca.</p>';
            return;
        }

        produtos.forEach(produto => {
            const produtoDiv = document.createElement('div');
            produtoDiv.className = 'produto-item';

            produtoDiv.innerHTML = `
                <img src="${produto.urlImagem || 'https://via.placeholder.com/150'}" alt="${produto.nome}">
                <h3>${produto.nome}</h3>
                <p>${produto.descricao || 'Sem descrição.'}</p>
                <p class="preco">R$ ${produto.preco.toFixed(2)}</p>
                <button data-id="${produto.id}" class="adicionar-carrinho">Adicionar ao Carrinho</button>
            `;
            containerProdutos.appendChild(produtoDiv);
        });

    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        const containerProdutos = document.getElementById('container-produtos');
        if (containerProdutos) {
             containerProdutos.innerHTML = '<p style="color: red;">Não foi possível carregar os produtos. Verifique se o servidor está rodando ou se a URL da API está correta.</p>';
        }
    }
}