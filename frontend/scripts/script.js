document.addEventListener('DOMContentLoaded', (event) => {
    const elementos = [
        { id: 'inicio', url: '/frontend/html/index.html' },
        { id: 'cart-icon', url: '/frontend/html/carrinho.html' },
        { id: 'canetaGpt', url: '/frontend/html/caneta.html' },
        { id: 'dimensionFly', url: '/frontend/html/dimension.html' },
        { id: 'pedrasGigaSize', url: '/frontend/html/pedras.html' },
        { id: 'gnomos', url: '/frontend/html/gnomos.html' },
        { id: 'camiseta', url: '/frontend/html/camiseta.html' },
        { id: 'strogonoff', url: '/frontend/html/strogonoff.html' },
        { id: 'babyTee', url: '/frontend/html/babyTee.html' },
        { id: 'vacina', url: '/frontend/html/vacina.html' },
        { id: 'celular', url: '/frontend/html/celular.html' },
        { id: 'cascalho', url: '/frontend/html/cascalho.html' },
        { id: 'pocaoAmor', url: '/frontend/html/pocaoAmor.html' },
        { id: 'dois', url: '/frontend/html/dois.html' },
        { id: 'adicionarC', url: '/frontend/html/carrinho.html' },
        { id: 'pagInicial', url: '/frontend/html/index.html' },
        { id: 'comprar1', url: '/frontend/html/comprar.html' },
        { id: 'voltar', url: null, action: () => window.history.back() }
    ];



// -----------------------------------------------------------------------------------------------------------------------------------------------
    
elementos.forEach(({ id, url, action }) => {
        const element = document.getElementById(id);
        if (element) {
            if (action) {
                element.addEventListener('click', action);
            } else {
                element.addEventListener('click', () => {
                    window.location.href = url;
                });
            }
        }
    });
    
    const formularioCompra2 = document.getElementById('formularioCompra');

    const comprar2 = document.getElementById('comprar');
    
    const telaCarregamento2 = document.getElementById('telaCarregamento');
    
    if (formularioCompra2) {
        formularioCompra2.addEventListener('submit', async (event) => {
            event.preventDefault();
    
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
    
            try {
                const response = await fetch('http://localhost:3004/verificarCompra', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password }) 
                });
    
                const result = await response.json();
    
                if (!result.success) {
                   
                    alert(result.message);
                    return;
                } else {
                
                    if (comprar2) comprar2.style.display = 'none';
                    if (telaCarregamento2) telaCarregamento2.style.display = 'flex';
    
               
                    setTimeout(() => {
                        window.location.href = '/frontend/html/pagina-de-sucesso.html';
                    }, 4000);
                }
            } catch (error) {
                console.error('erro ao verificar email ou senha', error);
                alert('erro');
            }
        });
    }
       
   
});


function carregarPerfil() {
          
    let dados = JSON.parse(localStorage.getItem('informacoes'));
    
    if (dados && dados.perfil) {

      let html = document.getElementById('informacoes');
      html.innerHTML = `<div style="display: flex; flex-direction: column; align-items: end">
                        ${dados.perfil}
                        </div>`

      html.style.display = 'block';
    } else {

      console.log('vc nao esta logado');
    }
  }

  window.onload = carregarPerfil;



  // Obter referências aos elementos
const abrirPopUpBtn = document.getElementById('abrirPopUp'); // referência correta ao botão
const formulario_edicao = document.getElementById('formulario_edicao');
const fecharPopUpBtn = document.getElementById('closePopup'); // Fechar botão

// Abrir o pop-up
abrirPopUpBtn.addEventListener('click', () => {
    formulario_edicao.style.display = 'flex'; // Mostrar o formulário de edição como flex
});

// Fechar o pop-up
fecharPopUpBtn.addEventListener('click', () => {
    formulario_edicao.style.display = 'none'; // Esconder o formulário de edição
});

// Fechar o pop-up clicando fora da caixa de conteúdo
window.addEventListener('click', (event) => {
    if (event.target === formulario_edicao) {
        formulario_edicao.style.display = 'none';
    }
});
