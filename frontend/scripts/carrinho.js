function getUserIdFromLocalStorage() {
    const userInfo = localStorage.getItem('informacoes');
    
    if (userInfo) {
        const user = JSON.parse(userInfo);
        return user.id; 
    }

    return null;
}



async function adicionarAoCarrinho(productId, quantidade = 1) {

    const userId = getUserIdFromLocalStorage();

    if (!userId) {
        alert('você precisa fazer login antes');
        return;
    }

    const data = {
        user_id: userId,
        product_id: productId,
        quantity: quantidade
    };

    const response = await fetch('http://localhost:3004/carrinho/adicionar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },

        body: JSON.stringify(data)
        
    });

    const result = await response.json();


    if (result.success) {
        alert(result.message);

    } else {
        alert(result.message); 
    }
}

async function carregarCarrinho() {
    const userInfo = localStorage.getItem('informacoes');
    if (!userInfo) {
        alert('você precisa fazer login');
        return;
    }

    const userId = JSON.parse(userInfo).id;

    const response = await fetch(`http://localhost:3004/carrinho/${userId}`);

    const result = await response.json();

    if (result.success) {
        const carrinhoDiv = document.getElementById('carrinho-itens');
        carrinhoDiv.innerHTML = ''; 

        let totalGeral = 0;  

        result.data.forEach(item => {
            const totalItem = item.price * item.quantity;
            totalGeral += totalItem; 

            carrinhoDiv.innerHTML += `
                <div class="item-carrinho" id="item-${item.id}">
                    <h3>${item.product_name}</h3>
                    <div class="quantidade">
                        <button class="quantidadeMenos" onclick="alterarQuantidade(-1, ${item.id})">-</button>
                        <input class="quantidade-input" type="text" value="${item.quantity}" min="1" onchange="editarQuantidade(${item.id}, this.value)">
                        <button class="quantidadeMais" onclick="alterarQuantidade(1, ${item.id})">+</button>
                    </div>
                    <p> R$${totalItem.toFixed(2)}</p>
                    <button class="removerBotao" onclick="removerProduto(${item.id})">Remover</button>
                </div>`;
        });

        carrinhoDiv.innerHTML += `
            <div class="totalCarrinho">
                <h3>Total R$${totalGeral.toFixed(2)}</h3>
            </div>`;
        
    } else {
        alert(result.message);
    }
}

async function editarQuantidade(cartItemId, novaQuantidade) {
    const response = await fetch(`http://localhost:3004/carrinho/editar/${cartItemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: novaQuantidade })
    });

    const result = await response.json();

    if (result.success) {
        alert('quantidade atualizada');
        carregarCarrinho(); 
    } else {
        alert('erro');
    }
}

function alterarQuantidade(change, cartItemId) {
    const input = document.querySelector(`#item-${cartItemId} .quantidade-input`);
    let novaQuantidade = parseInt(input.value) + change;
    
    if (novaQuantidade < 1) novaQuantidade = 1; 
    
    input.value = novaQuantidade;
    editarQuantidade(cartItemId, novaQuantidade); 
}

async function removerProduto(cartItemId) {
    const response = await fetch(`http://localhost:3004/carrinho/remover/${cartItemId}`, {
        method: 'DELETE'
    });

    const result = await response.json();

    if (result.success) {
        alert('produto removido');
        document.getElementById(`item-${cartItemId}`).remove(); 
    } else {
        alert('erro');
    }
}

carregarCarrinho();
