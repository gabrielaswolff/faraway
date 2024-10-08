async function logar(event) {
    event.preventDefault();

    const email = document.getElementById('email_login').value;
    const password = document.getElementById('password_login').value;

    const data = { email, password };
    
    const response = await fetch("http://localhost:3004/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    let results = await response.json();

    if (results.success) {
        let userData = results.data;
        localStorage.setItem('informacoes', JSON.stringify({
            id: userData.id,
            nome: userData.nome,
            email: userData.email,
            perfil: userData.perfil
        }));

        alert(results.message);
        window.location.href = "/frontend/html/index.html";
    } else {
        alert(results.message);
    }
}

// -------------------------------------------------------------------------------------------------------------------

function sair() {
    localStorage.removeItem('informacoes');
    alert('Você foi deslogado');
    window.location.href = "/frontend/html/index.html";
}

function signUp() {
    window.location.href = "/frontend/html/cadastro.html";
}

function signIn() {
    window.location.href = "/frontend/html/login.html";
}

//---------------------------------------------------------------------------------------

window.addEventListener("DOMContentLoaded", () => {
    listarProdutos();
    
    const userInfo = localStorage.getItem("informacoes");
    if (userInfo) {
        let html = document.getElementById('informacoes');
        let dados = JSON.parse(userInfo);
        
        const cadastrarProdutoElement = document.getElementById('cadastrar_produto');
        if (cadastrarProdutoElement) {
            cadastrarProdutoElement.style.display = dados.perfil === 'admin' ? 'block' : 'none';
        }

        if (html) {
            html.innerHTML = `<div style="display: flex; flex-direction: column; align-items: end">
                ${dados.nome} (${dados.perfil}) ${dados.email}
            </div>`;
            html.style.display = 'block';
        } else {
            console.error("Elemento 'informacoes' não encontrado.");
        }
    }
});

//------------------------------------------------------------------------------------------

async function cadastrarProduto(event) {
    event.preventDefault();

    const title = document.getElementById('name').value;
    const price = Number(document.getElementById('price').value);
    const file = document.getElementById('file').files[0];
    const descricao = document.getElementById('description').value;

    let formData = new FormData();
    formData.append('name', title);
    formData.append('price', price);
    formData.append('file', file);
    formData.append('description', descricao);

    const response = await fetch('http://localhost:3004/produto/cadastrar', {
        method: "POST",
        body: formData
    });

    const results = await response.json();
    alert(results.message);
}

async function listarProdutos() {
    const response = await fetch('http://localhost:3004/produtos/listar', {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const results = await response.json();

    if (results.success) {
        let productData = results.data;
        const images = 'http://localhost:3004/uploads/';
        let html = document.getElementById('card_produto');
        
        if (html) {
            html.innerHTML = ""; 

            let dados = JSON.parse(localStorage.getItem('informacoes'));
            const cartIcon = document.getElementById('cart-icon');

            productData.forEach(product => {
                let card = `<div class="cards">
                    <img src="${images + product.image}">
                    <p>${product.name}</p>
                    <span class="product-price">R$${product.price}</span>`;
                
                if (dados && dados.perfil !== 'admin') {
                    card += `<button class="button" onclick="adicionarAoCarrinho(${product.id})">Adicionar ao Carrinho</button>`;
                }

                if (dados && dados.perfil === 'admin') {
                    card += `<button id="abrirPopUp" class="edicaoFormulario" onclick="exibirFormularioEdicao('${product.id}',
                     '${product.name}', ${product.price}, '${product.description}')">Editar</button>
                    <button class="edicaoFormulario" onclick="excluirProduto('${product.id}')">Excluir</button>`;
                }

                card += `</div>`;
                html.innerHTML += card;
            });
        } 
    } else {
        alert(results.message);
    }
}

function exibirFormularioEdicao(id, name, price, description) {
    document.getElementById('product_id').value = id;
    document.getElementById('product_name').value = name;
    document.getElementById('product_price').value = price;
    document.getElementById('product_description').value = description;
    document.getElementById('formulario_edicao').style.display = 'block'; 
}

async function editarProduto(event) {
    event.preventDefault();

    const id = document.getElementById('product_id').value;
    const name = document.getElementById('product_name').value;
    const price = Number(document.getElementById('product_price').value);
    const description = document.getElementById('product_description').value;
    const file = document.getElementById('file').files[0];

    let formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('description', description);
    if (file) {
        formData.append('file', file);
    }

    const response = await fetch(`http://localhost:3004/produto/editar/${id}`, {
        method: 'PUT',
        body: formData
    });

    const results = await response.json();
    alert(results.message);
    if (results.success) {
        listarProdutos(); 
        document.getElementById('formulario_edicao').style.display = 'none'; // Oculta o formulário após a atualização
    }
}

async function excluirProduto(id) {
    const response = await fetch(`http://localhost:3004/produto/excluir/${id}`, { 
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const results = await response.json();
    alert(results.message);
    if (results.success) {
        listarProdutos(); 
    }
}

// ---------------------------------------------------------------

// async function listarProdutos() {
//     const response = await fetch('http://localhost:3004/produtos/listar', {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json"
//         }
//     });

//     const results = await response.json();

//     if (results.success) {
//         let productData = results.data;
//         const images = 'http://localhost:3004/uploads/';
//         let html = document.getElementById('card_produto');
        
//         if (html) {
//             html.innerHTML = ""; // Limpa o conteúdo anterior

//             let dados = JSON.parse(localStorage.getItem('informacoes'));
//             productData.forEach(product => {
//                 let card = `<div class="cards">
//                     <img src="${images + product.image}" alt="${product.name}">
//                     <p>${product.name}</p>
//                     <span class="product-price">R$${product.price}</span>`;

//                 if (dados && dados.perfil !== 'admin') {
//                     card += `<button class="button" onclick="adicionarAoCarrinho(${product.id})">Adicionar ao Carrinho</button>`;
//                 }

//                 if (dados && dados.perfil === 'admin') {
//                     card += `<button class="edicaoFormulario" onclick="exibirFormularioEdicao('${product.id}', '${product.name}', ${product.price}, '${product.description}')">Editar</button>
//                     <button class="edicaoFormulario" onclick="excluirProduto('${product.id}')">Excluir</button>`;
//                 }

//                 card += `</div>`;
//                 html.innerHTML += card;
//             });
//         } else {
//             console.error("Elemento 'card_produto' não encontrado.");
//         }
//     } else {
//         alert(results.message);
//     }
// }


// async function removerDoCarrinho(productId) {
//     const userInfo = JSON.parse(localStorage.getItem('informacoes'));
//     const userId = userInfo.user_id;

//     const response = await fetch(`http://localhost:3004/carrinho/remover/${productId}/${userId}`, {
//         method: "DELETE",
//         headers: {
//             "Content-Type": "application/json"
//         }
//     });

//     const result = await response.json();
//     if (result.success) {
//         alert("Produto removido do carrinho.");
//         carregarCarrinho(); // Atualiza a lista de itens no carrinho
//     } else {
//         alert("Erro ao remover produto.");
//     }
// }

// async function adicionarAoCarrinho(productId) {
//     const userInfo = JSON.parse(localStorage.getItem('informacoes')); 
    
//     if (!userInfo || !userInfo.user_id) {
//         alert("Você precisa estar logado para adicionar produtos ao carrinho.");
//         window.location.href = "/frontend/html/login.html";
//         return;
//     }

//     const userId = userInfo.user_id;  // Pega o ID do usuário
//     const quantidade = 1;  // Define a quantidade padrão ao adicionar

//     const response = await fetch("http://localhost:3004/carrinho/adicionar", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//             user_id: userId,
//             product_id: productId,
//             quantity: quantidade
//         })
//     });

//     const result = await response.json();

//     if (result.success) {
//         alert("Produto adicionado ao carrinho!");
//     } else {
//         alert("Erro ao adicionar o produto ao carrinho.");
//     }
// }
