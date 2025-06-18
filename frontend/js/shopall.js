// Este evento garante que o script só vai rodar depois que todo o HTML da página for carregado.
document.addEventListener('DOMContentLoaded', () => {
    
    // Pega o container no HTML onde vamos inserir os cards dos produtos.
    const container = document.getElementById('container-produtos');

    if (!container) {
        console.error('Erro Crítico: Elemento com id="container-produtos" não foi encontrado no HTML.');
        return;
    }

    // Função principal que busca os produtos na nossa API (backend)
    async function carregarProdutos() {
        try {
            // --- CORREÇÃO 1: A URL DA API ---
            // A rota correta que definimos no seu servidor.js é '/api/produtos'.
            const response = await fetch('http://localhost:3000/api/produtos');

            if (!response.ok) {
                // Lança um erro se a resposta do servidor não for bem-sucedida.
                throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
            }

            const produtos = await response.json();
            
            // Limpa a mensagem "Carregando produtos..."
            container.innerHTML = '';
            
            if (produtos.length === 0) {
                container.innerHTML = '<p>Nenhum produto foi encontrado no momento.</p>';
                return;
            }

            // Para cada produto recebido, cria um card e o adiciona no container.
            produtos.forEach(produto => {
                const card = document.createElement('div');
                card.className = 'produto-item';
                
                // --- CORREÇÃO 2: O CAMINHO DA IMAGEM ---
                // O servidor envia apenas o nome do arquivo (ex: 'bermarrom.jpg').
                // Aqui nós montamos o caminho completo que o HTML precisa (ex: 'imgprodutos/bermarrom.jpg').
                const imagePath = `imgprodutos/${produto.urlImagem}`;
                
                // Usando template literals para criar o HTML do card.
                // Note que o botão agora tem uma classe para podermos adicionar o evento depois.
                card.innerHTML = `
                    <img src="${imagePath}" 
                         alt="${produto.nome}"
                         onerror="this.onerror=null; this.src='imgprodutos/placeholder.png';">
                    <div class="produto-info">
                        <div>
                            <h3>${produto.nome}</h3>
                            <p class="preco">R$ ${produto.preco.toFixed(2).replace('.', ',')}</p>
                        </div>
                        <button class="comprar-btn" data-produto-id="${produto.id}">COMPRAR</button>
                    </div>
                `;
                container.appendChild(card);
            });

            // --- MELHORA OPCIONAL: Adicionar evento de clique nos botões ---
            // Em vez de usar 'onclick' no HTML, selecionamos todos os botões e adicionamos o evento aqui.
            // É uma prática mais moderna e organizada.
            container.querySelectorAll('.comprar-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const produtoId = button.dataset.produtoId; // Pega o ID do produto do atributo 'data-produto-id'
                    adicionarAoCarrinho(produtoId);
                });
            });

        } catch (error) {
            // Se acontecer qualquer erro, exibe no console e na página para o usuário.
            console.error('Falha ao carregar produtos:', error);
            container.innerHTML = '<p>Oops! Algo deu errado ao buscar os produtos. Por favor, tente recarregar a página.</p>';
        }
    }

    // Sua função para adicionar ao carrinho.
    function adicionarAoCarrinho(produtoId) {
        console.log(`Produto ${produtoId} adicionado ao carrinho!`);
        // Aqui você adicionaria a lógica real do carrinho no futuro.
        alert(`Produto ${produtoId} adicionado ao carrinho!`);
    }

    // Chama a função para carregar os produtos.
    carregarProdutos();
});