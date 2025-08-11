//menu mobile
let content = document.getElementById('content');
function clickMenu() {
    if (content.style.display == 'block') {
        content.style.display = 'none';
    }else {
        content.style.display = 'block';
    }
}
 
//script de votacao
let filmes = [];
let votosGeral = { positivos: 0, negativos: 0 };
 
// extrai os filmes iniciais do html
function initDataHtml() {
    // pega todas aquelas divs de filme
    const movieElements = document.querySelectorAll('.movie');
    
    //pra cada elemento(filme) repetimos esse processo abaixo pra colocar ele todo em um array
    movieElements.forEach(movie => {
        const filme = {
            //parse int pra converter pra número
            id: parseInt(movie.dataset.id),
            //dentro da div de filme ele pega o titulo pela tag h1 usando textConten
            titulo: movie.querySelector('h1').textContent,
            //replace para ajudar na formatação
            genero: movie.querySelector('h2').textContent.replace('Gênero: ', ''),
            descricao: movie.querySelector('p').textContent,
            //.src para pegar a url da nossa imagem dos filmes
            imagem: movie.querySelector('img').src,
            gostei: 0,
            naoGostei: 0
        };
        //colocando as informações do filme nesse array
        //ele vai fazer isso até nn ter mais filmes
        //por conta do forEach
        filmes.push(filme);
    });
    
    //zerar a quantidade de likes no inicio para nn sobrepor nada
    votosGeral = { positivos: 0, negativos: 0 };
    //guardar tudo
    salvarDados();
}
 
function carregarDados() {
    const filmesSalvos = localStorage.getItem('filmes');
    const votosSalvos = localStorage.getItem('votosGeral');

    if (filmesSalvos) filmes = JSON.parse(filmesSalvos);
    else filmes = [];
    if (votosSalvos) votosGeral = JSON.parse(votosSalvos);
    else votosGeral = { positivos: 0, negativos: 0 };
    showMovies();
}

function salvarDados() {
    localStorage.setItem('filmes', JSON.stringify(filmes));
    localStorage.setItem('votosGeral', JSON.stringify(votosGeral));
}
 
function votar(filmeId, tipoVoto) {
    //pega o primeiro filme com id fornecido na div clicada
    const filme = filmes.find(filme => filme.id === filmeId);
    //se nn tiver, volta
    if (!filme) return;
    
    if (tipoVoto === 'gostei') {
        filme.gostei++;
        votosGeral.positivos++;
    } else {
        filme.naoGostei++;
        votosGeral.negativos++;
    }
    salvarDados();
    attScreen();
}
 
function attScreen() {
    //atualiza cada filme
    filmes.forEach(filme => {
        //encontra a div certa do filme que bate com o id do filme (objeto atual)
    const filmeElement = document.querySelector(`.movie[data-id="${filme.id}"]`);
        if (filmeElement) {
            const likeBtn = filmeElement.querySelector('.like');
            const unlikeBtn = filmeElement.querySelector('.unlike');
            
            //atualizo o numero de like/dislike de cada filme
            if (likeBtn) likeBtn.textContent = `Gostei: ${filme.gostei}`;
            if (unlikeBtn) unlikeBtn.textContent = `Não gostei: ${filme.naoGostei}`;
        }
    });
    
    // Atualiza totais gerais (se estiver na página de votos)
    if (document.getElementById('grPositiveVotestNum')) {
        document.getElementById('grPositiveVotestNum').textContent = votosGeral.positivos;
        document.getElementById('grNegativeVotesNum').textContent = votosGeral.negativos;
        document.getElementById('grVotesNum').textContent = votosGeral.positivos + votosGeral.negativos;
    }
}
 
//pagina carrega e executa o carregamento dos dados no localstorage
//junto da demonstração dos likes
document.addEventListener('DOMContentLoaded', function() {
    carregarDados();
    attScreen();
    showMovies();
    configSearch();

    //cada botão de like eh descoberto o filme q ele pertence
    //dps faz a funcao dele de votar ja vir com o id do filme
    //junto com o tipo de voto
    document.querySelectorAll('.like').forEach(btn => {
const filmeId = parseInt(btn.closest('.movie').dataset.id);
        btn.onclick = () => votar(filmeId, 'gostei');
    });
    
    //mesma coisa só que com botao de unlike
    document.querySelectorAll('.unlike').forEach(btn => {
const filmeId = parseInt(btn.closest('.movie').dataset.id);
        btn.onclick = () => votar(filmeId, 'naoGostei');
        
    });
});
 
//mostra os filmes apagando os novos e pulando os que já estão no html
//para colocá-los de volta toda vez que essa funcao for chamada
//assim podemos verificar se tem filme novo direto
function showMovies() {
    const container = document.querySelector('.movies');
    if (!container) return; // se não tiver o divzao, saimos, ou seja, tem q ta no index
    
    //seleciona todo filme cadastrado pelo ID
    const filmesCadastrados = document.querySelectorAll('.movie[data-id]');
    filmesCadastrados.forEach(filme => {
if (filme.dataset.id > 6) { //IDs > 6 são os cadastrados
            filme.remove(); //remove para nn sobrepor
        }
    });
    
    //aqui vamos adicionar todos os filmes do nosso array
    filmes.forEach(filme => {
        //pulamos os filmes que ja estao no html
        //assim economizamos espaço
if (filme.id <= 6) return;   
        //nossa div de filmes cadastrados
        const divFilme = document.createElement('div');
        //botar um class para pegar todo nosso CSS
        divFilme.className = 'movie';
        //colocamos o id do nosso objeto colocado ali em cima na arrow
        divFilme.dataset.id = filme.id;
        //aqui eh só copiar o que ta no nosso html
        divFilme.innerHTML = `
            <img src="${filme.imagem}" alt="${filme.titulo}">
            <h1>${filme.titulo}</h1>
            <h2>Gênero: ${filme.genero}</h2>
            <p>${filme.descricao}</p>
<button class="like" onclick="votar(${filme.id}, 'gostei')">Gostei: ${filme.gostei}</button>
<button class="unlike" onclick"votar(${filme.id}, 'naoGostei')">Não gostei: ${filme.naoGostei}</button>
        `;
        //por fim, enviamos toda essa config para container
        container.appendChild(divFilme);
    });
}

function cadastrarFilme() {
    //declaração de todos os campos que precisamos
    //para cadastrar um novo filme
    const titulo = document.getElementById('titulo').value.trim();
    const genero = document.getElementById('genero').value.trim();
    const imagem = document.getElementById('imagem').value.trim();
    const descricao = document.getElementById('descricao').value.trim();
    
    if (!titulo || !genero || !imagem) {
        alert('Preencha os campos obrigatórios!');
        return;
    }
 
    //todos os campos abaixo a serem preenchidos
    const novoFilme = {
        id: Date.now(),
        titulo,
        genero,
        imagem,
        descricao: descricao || 'Sem descrição',
        gostei: 0,
        naoGostei: 0
    };
    
    //colocando novo filme no array
    filmes.push(novoFilme);
    salvarDados();
    alert('Filme cadastrado!');
    document.querySelector('form').reset();
    showMovies();
}
function searching() {
    //variavel para capturar a palavra pesquisada
    const termo = document.getElementById('search').value.toLowerCase();
    //seleciono diretamente os filmes
    const filmes = document.querySelectorAll('.movie');
    
    filmes.forEach(filme => {
        //pego todos os titulos, genero e descricao para comparar depois
        //com o termo e assim fazer o efeito de pesquisa
        const titulo = filme.querySelector('h1').textContent.toLowerCase();
        const genero = filme.querySelector('h2').textContent.toLowerCase();
        const descricao = filme.querySelector('p').textContent.toLowerCase();
        
        //comparação que faz o efeito de pesquisa
        if (titulo.includes(termo) || genero.includes(termo) || descricao.includes(termo)) {
            //aqui deixa o filme aparecer na pesquisa
            filme.style.display = 'block';
        } else {
            //filme nao aparece
            filme.style.display = 'none';
        }
    });
}
function configSearch() {
    const searchInput = document.getElementById('search');

    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') searching();
        });
    }
}