const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Conecta-se ao mesmo arquivo de banco de dados que o seu servidor utiliza.
const dbPath = path.join(__dirname, 'ecommerce.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        return console.error('Erro ao conectar ao banco de dados:', err.message);
    }
    console.log('✅ Conectado ao banco de dados para adicionar os produtos.');
});

// ✅ AQUI FICA A LISTA DE ROUPAS QUE VOCÊ QUER CADASTRAR
const produtosParaAdicionar = [
    {
        nome: "Bermuda Marrom",
        descricao: "Bermuda casual, ideal para o dia a dia.",
        preco: 119.90,
        urlImagem: "bermarrom.jpg",
        estoque: 45
    },
    {
        nome: "Bermuda Bege",
        descricao: "Bermuda de sarja com ótimo caimento.",
        preco: 129.90,
        urlImagem: "bermbege.jpg",
        estoque: 55
    },
    {
        nome: "Bermuda Cinza",
        descricao: "Bermuda confortável para diversas ocasiões.",
        preco: 119.90,
        urlImagem: "bermcinza.jpg",
        estoque: 60
    },
    {
        nome: "Bermuda Preta",
        descricao: "Peça essencial no guarda-roupa masculino.",
        preco: 139.90,
        urlImagem: "bermpreta.jpg",
        estoque: 70
    },
    {
        nome: "Bermuda Verde Militar",
        descricao: "Bermuda cargo com estilo e funcionalidade.",
        preco: 149.90,
        urlImagem: "bermverde.jpg",
        estoque: 35
    },
    {
        nome: "Boné Estilizado Modelo 1",
        descricao: "Boné com aba curva, ajustável.",
        preco: 89.90,
        urlImagem: "bone1.jpg",
        estoque: 80
    },
    {
        nome: "Boné Estilizado Modelo 2",
        descricao: "Boné de design moderno para complementar seu look.",
        preco: 99.90,
        urlImagem: "bone2.jpg",
        estoque: 75
    },
    {
        nome: "Calça de Moletom Cinza",
        descricao: "Calça de moletom para máximo conforto.",
        preco: 189.90,
        urlImagem: "/imgprodutos/calca1.jpg",
        estoque: 50
    },
    {
        nome: "Calça Jeans Clássica",
        descricao: "Calça jeans com lavagem tradicional.",
        preco: 219.90,
        urlImagem: "calca1.jpg",
        estoque: 40
    },
    {
        nome: "Calça Cargo Bege",
        descricao: "Calça cargo com múltiplos bolsos.",
        preco: 239.90,
        urlImagem: "calca2.jpg",
        estoque: 38
    },
    {
        nome: "Calça de Sarja Preta",
        descricao: "Calça de sarja com corte slim.",
        preco: 209.90,
        urlImagem: "calca3.jpg",
        estoque: 42
    },
    {
        nome: "Calça Jeans Destroyed",
        descricao: "Calça jeans com detalhes rasgados.",
        preco: 249.90,
        urlImagem: "calca4.jpg",
        estoque: 30
    },
    {
        nome: "Calça Chino Caramelo",
        descricao: "Calça chino versátil e elegante.",
        preco: 229.90,
        urlImagem: "calca5.jpg",
        estoque: 48
    },
    {
        nome: "Calça Jogger Preta",
        descricao: "Calça jogger confortável e estilosa.",
        preco: 199.90,
        urlImagem: "calca6.jpg",
        estoque: 52
    },
    {
        nome: "Calça Jeans Escura",
        descricao: "Calça jeans com lavagem escura, fácil de combinar.",
        preco: 219.90,
        urlImagem: "calca7.jpg",
        estoque: 60
    },
    {
        nome: "Calça de Alfaiataria Cinza",
        descricao: "Calça de alfaiataria para um look formal.",
        preco: 259.90,
        urlImagem: "calca8.jpg",
        estoque: 33
    },
    {
        nome: "Calça Cargo Verde",
        descricao: "Calça cargo em tom verde militar.",
        preco: 239.90,
        urlImagem: "calca9.jpg",
        estoque: 29
    },
    {
        nome: "Calça Jogger Cinza",
        descricao: "Calça jogger de moletom.",
        preco: 199.90,
        urlImagem: "calca11.jpg",
        estoque: 41
    },
    {
        nome: "Calça Social Preta",
        descricao: "Calça social com corte impecável.",
        preco: 269.90,
        urlImagem: "calca12.jpg",
        estoque: 37
    },
    {
        nome: "Calça Jeans Clara",
        descricao: "Calça jeans com lavagem clara e moderna.",
        preco: 229.90,
        urlImagem: "calca13.jpg",
        estoque: 44
    },
    {
        nome: "Camisa Social Azul",
        descricao: "Camisa social de algodão, manga longa.",
        preco: 179.90,
        urlImagem: "camiazul.jpg",
        estoque: 65
    },
    {
        nome: "Camisa de Linho Bege",
        descricao: "Camisa de linho, perfeita para o verão.",
        preco: 189.90,
        urlImagem: "camibege.jpg",
        estoque: 58
    },
    {
        nome: "Camisa Jeans Azul",
        descricao: "Camisa jeans, uma peça coringa.",
        preco: 199.90,
        urlImagem: "camiblue.jpg",
        estoque: 53
    },
    {
        nome: "Camiseta Básica Branca",
        descricao: "Camiseta 100% algodão, essencial.",
        preco: 79.90,
        urlImagem: "camibranca.jpg",
        estoque: 120
    },
    {
        nome: "Camisa Estampada Laranja",
        descricao: "Camisa com estampa vibrante.",
        preco: 159.90,
        urlImagem: "camilaranj.jpg",
        estoque: 40
    },
    {
        nome: "Camisa Listrada",
        descricao: "Camisa com listras verticais.",
        preco: 169.90,
        urlImagem: "camilistrada.jpg",
        estoque: 60
    },
    {
        nome: "Camisa de Flanela Marrom",
        descricao: "Camisa xadrez de flanela.",
        preco: 189.90,
        urlImagem: "camimarrom.jpg",
        estoque: 47
    },
    {
        nome: "Camisa Militar",
        descricao: "Camisa com estampa camuflada.",
        preco: 179.90,
        urlImagem: "camimilita.jpg",
        estoque: 39
    },
    {
        nome: "Camiseta Básica Preta",
        descricao: "Camiseta 100% algodão, essencial.",
        preco: 79.90,
        urlImagem: "camipreta.jpg",
        estoque: 130
    },
    {
        nome: "Camisa Gola Alta (Suéter Fino)",
        descricao: "Suéter fino de malha, gola alta.",
        preco: 199.90,
        urlImagem: "camisueter.jpg",
        estoque: 55
    },
    {
        nome: "Camisa Social Verde",
        descricao: "Camisa social em tom verde escuro.",
        preco: 179.90,
        urlImagem: "camiverde.jpg",
        estoque: 62
    },
    {
        nome: "Camisa Social Vermelha",
        descricao: "Camisa social de algodão, cor vibrante.",
        preco: 179.90,
        urlImagem: "camivermelha.jpg",
        estoque: 43
    },
    {
        nome: "Camisa Branca Manga Curta",
        descricao: "Camisa de botão branca, manga curta.",
        preco: 159.90,
        urlImagem: "camiwhite.jpg",
        estoque: 70
    },
    {
        nome: "Jaqueta Corta-vento Preta",
        descricao: "Jaqueta corta-vento leve e funcional.",
        preco: 249.90,
        urlImagem: "jacketpreta.jpg",
        estoque: 40
    },
    {
        nome: "Jaqueta Listrada",
        descricao: "Jaqueta bomber com listras.",
        preco: 279.90,
        urlImagem: "jacklistrada.jpg",
        estoque: 35
    },
    {
        nome: "Jaqueta Corta-vento Laranja",
        descricao: "Jaqueta corta-vento em cor vibrante.",
        preco: 249.90,
        urlImagem: "jaquetalaranja.jpg",
        estoque: 33
    },
    {
        nome: "Jaqueta Jeans Azul",
        descricao: "Jaqueta jeans clássica, indispensável.",
        preco: 299.90,
        urlImagem: "jazul.jpg",
        estoque: 50
    },
    {
        nome: "Jaqueta Puffer Cinza",
        descricao: "Jaqueta acolchoada para dias frios.",
        preco: 349.90,
        urlImagem: "jcinza.jpg",
        estoque: 30
    },
    {
        nome: "Jaqueta de Couro",
        descricao: "Jaqueta de couro sintético, estilo rocker.",
        preco: 399.90,
        urlImagem: "jcouro.jpg",
        estoque: 25
    },
    {
        nome: "Jaqueta Estofada",
        descricao: "Jaqueta acolchoada com capuz.",
        preco: 359.90,
        urlImagem: "jestofado.jpg",
        estoque: 28
    },
    {
        nome: "Jaqueta Bomber Preta",
        descricao: "Jaqueta bomber versátil e moderna.",
        preco: 289.90,
        urlImagem: "jpreto.jpg",
        estoque: 45
    },
    {
        nome: "Jaqueta Suéter",
        descricao: "Jaqueta de malha com zíper.",
        preco: 229.90,
        urlImagem: "jsueter.jpg",
        estoque: 38
    },
    {
        nome: "Jaqueta Verde",
        descricao: "Jaqueta casual em tom verde.",
        preco: 269.90,
        urlImagem: "jverde.jpg",
        estoque: 41
    },
    {
        nome: "Moletom com Capuz Preto",
        descricao: "Moletom canguru, um clássico do streetwear.",
        preco: 219.90,
        urlImagem: "mblack.jpg",
        estoque: 60
    },
    {
        nome: "Moletom com Capuz Jeans",
        descricao: "Moletom com textura que imita jeans.",
        preco: 239.90,
        urlImagem: "mjeans.jpg",
        estoque: 40
    },
    {
        nome: "Moletom com Capuz Marrom",
        descricao: "Moletom canguru em cor terrosa.",
        preco: 219.90,
        urlImagem: "mmarrom.jpg",
        estoque: 55
    },
    {
        nome: "Moletom Básico",
        descricao: "Moletom gola careca, 100% algodão.",
        preco: 199.90,
        urlImagem: "moletom.jpg",
        estoque: 70
    },
    {
        nome: "Moletom Gola Careca Preto",
        descricao: "Moletom básico para o dia a dia.",
        preco: 199.90,
        urlImagem: "mpreto.jpg",
        estoque: 68
    },
    {
        nome: "Suéter de Lã",
        descricao: "Suéter de lã para os dias mais frios.",
        preco: 249.90,
        urlImagem: "msueter.jpg",
        estoque: 42
    },
    {
        nome: "Moletom Tom Terroso",
        descricao: "Moletom gola careca em cor terrosa.",
        preco: 199.90,
        urlImagem: "mterroso.jpg",
        estoque: 53
    },
    {
        nome: "Óculos de Sol Clássico",
        descricao: "Óculos de sol com armação preta e proteção UV.",
        preco: 149.90,
        urlImagem: "oculos1.jfif",
        estoque: 80
    },
    {
        nome: "Óculos de Sol Aviador",
        descricao: "Óculos de sol modelo aviador, atemporal.",
        preco: 169.90,
        urlImagem: "oculos2.jfif",
        estoque: 75
    },
    {
        nome: "Tênis Old School Modelo 1",
        descricao: "Tênis de skate com design clássico.",
        preco: 299.90,
        urlImagem: "old1.jfif",
        estoque: 50
    },
    {
        nome: "Tênis Old School Modelo 2",
        descricao: "Tênis casual com listra lateral.",
        preco: 299.90,
        urlImagem: "old2.jfif",
        estoque: 48
    },
    {
        nome: "Sapato Social Preto",
        descricao: "Sapato social de couro sintético.",
        preco: 279.90,
        urlImagem: "sap1.jpg",
        estoque: 40
    },
    {
        nome: "Bota de Couro Marrom",
        descricao: "Bota robusta para um look casual.",
        preco: 349.90,
        urlImagem: "sap2.jpg",
        estoque: 35
    },
    {
        nome: "Tênis Branco Básico",
        descricao: "Tênis branco, versátil e fácil de combinar.",
        preco: 259.90,
        urlImagem: "tenis1.jpg",
        estoque: 60
    },
    {
        nome: "Tênis Esportivo",
        descricao: "Tênis para corrida e atividades físicas.",
        preco: 319.90,
        urlImagem: "tenis3.jpg",
        estoque: 55
    }
];

// --- O CÓDIGO ABAIXO FAZ A MÁGICA DE ADICIONAR NO BANCO ---

console.log("Iniciando o cadastro de novos produtos...");

const stmt = db.prepare("INSERT INTO produtos (nome, descricao, preco, urlImagem, estoque) VALUES (?, ?, ?, ?, ?)");

let produtosAdicionados = 0;
let produtosComErro = 0;
const totalProdutos = produtosParaAdicionar.length;

produtosParaAdicionar.forEach((produto, index) => {
    stmt.run(produto.nome, produto.descricao, produto.preco, produto.urlImagem, produto.estoque, function(err) {
        if (err) {
            // Se o produto já existir (ou der outro erro), ele avisa mas não para.
            console.error(`Erro ao adicionar o produto "${produto.nome}":`, err.message);
            produtosComErro++;
        } else {
            console.log(`> Produto "${produto.nome}" adicionado com sucesso! ID: ${this.lastID}`);
            produtosAdicionados++;
        }

        // Verifica se este é o último item para poder finalizar
        if (index === totalProdutos - 1) {
            finalizarProcesso();
        }
    });
});

function finalizarProcesso() {
    // Finaliza o processo e fecha a conexão com o banco
    stmt.finalize((err) => {
        if (err) {
            console.error('Erro ao finalizar o statement:', err.message);
        } else {
            console.log("-------------------------------------------------------");
            console.log("CADASTRO DE PRODUTOS FINALIZADO!");
            console.log(`${produtosAdicionados} produtos adicionados com sucesso.`);
            console.log(`${produtosComErro} produtos falharam ao adicionar.`);
            console.log("-------------------------------------------------------");
        }

        db.close((err) => {
            if (err) {
                console.error('Erro ao fechar o banco de dados:', err.message);
            } else {
                console.log('Conexão com o banco de dados fechada.');
            }
        });
    });
}

// Lida com o caso de a lista de produtos estar vazia
if (totalProdutos === 0) {
    console.log("Nenhum produto na lista para adicionar. Fechando conexão.");
    db.close();
}