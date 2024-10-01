async function logar(event) {
    event.preventDefault();

    const email = document.getElementById('email_login').value;
    const password = document.getElementById('password_login').value;

    const data = {email, password}
    
    const response = await fetch("http://localhost:3004/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(data)
    })

    let results = await response.json();

    if (results.success) {
        let userData = results.data;
        localStorage.setItem('informacoes', JSON.stringify(userData));

        window.location.href = "/frontend/html/index.html"

        alert(results.message)
    } else{
        alert(results.message)
    }
    
}

// --------------------------------------------------------------------------------

function sair(){
    localStorage.removeItem('informacoes')
    alert('usuário deslogado')
    window.location.href = "/frontend/html/index.html"

}   

function signUp(){
    window.location.href = "/frontend/html/cadastro.html"
}

function signIn(){
    window.location.href = "/frontend/html/login.html"
}

// --------------------------------------------------------------------------------

window.addEventListener("load", () => {
    listarProdutos()
    
    if (localStorage.getItem("informacoes")) {
        let html = document.getElementById('informacoes')
        let dados = JSON.parse(localStorage.getItem('informacoes'))
        
        dados.perfil === 'admin' 
            ? document.getElementById('cadastrar_produto').style.display = 'block'
            : document.getElementById('cadastrar_produto').style.display = 'none'

        
            html.innerHTML = `<div style="display: flex; flex-direction: column; align-items: end">
             ${dados.perfil} ${dados.email}
            </div>`

             html.style.display = 'block'
    
    }
})

// ---------------------------------------------------------------------------------

async function cadastrarProduto(event) {
    event.preventDefault()

    const title = document.getElementById('name').value
    const price = Number(document.getElementById('price').value)
    const file = document.getElementById('file').files[0]
    const descricao = document.getElementById('description').value

    let formData = new FormData();

    formData.append('name', title)
    formData.append('price', price)
    formData.append('file', file)
    formData.append('description', descricao)

    const response = await fetch('http://localhost:3004/produto/cadastrar', {
        method: "POST",
        body: formData
    })

    const results = await response.json()

    if(results.success) {
        alert(results.message)
    } else {
        alert(results.message)
    }
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

        html.innerHTML = ""; 

        productData.forEach(product => {
            let card = `<div class="cards">
                <img src="${images + product.image}">
                <p>${product.name}</p>
                <span class="product-price">R$${product.price}</span>`;

      
            let dados = JSON.parse(localStorage.getItem('informacoes'));
            if (dados && dados.perfil === 'admin') {
                card += `<button class="edicaoFormularo" onclick="exibirFormularioEdicao('${product.id}', '${product.name}', ${product.price}, '${product.description}')">Editar</button>
                         <button onclick="excluirProduto('${product.id}')">Excluir</button>`;
            }

            card += `</div>`;
            html.innerHTML += card;
        });
    } else {
        alert(results.message);
    }
}

// --------------------------------------------------------------------------------------

async function editarProduto(event) {
    event.preventDefault();

    const id = document.getElementById('product_id').value;
    const name = document.getElementById('product_name').value;
    const price = document.getElementById('product_price').value;
    const description = document.getElementById('product_description').value;
    const file = document.getElementById('product_image').files[0];

    let formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('description', description);
    
    if (file) {
        formData.append('file', file);
    }

    const response = await fetch(`http://localhost:3004/produto/editar/${id}`, {
        method: "PUT",
        body: formData
    });

    const results = await response.json();

    if (results.success) {
        alert('Produto atualizado com sucesso');
        document.getElementById('formulario_edicao').style.display = 'none'; 
        listarProdutos(); 
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



async function excluirProduto(id) {
    const response = await fetch(`http://localhost:3004/produto/excluir/${id}`, { 
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const results = await response.json();
    if (results.success) {
        alert('Produto excluído com sucesso');
        listarProdutos(); 
    } else {
        alert('Erro ao excluir produto');
    }
}
