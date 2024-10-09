async function adicionarAoCarrinho(productId) {
    const userData = JSON.parse(localStorage.getItem('informacoes'));
    if (!userData) {
        alert('vc precisa estar logado para adicionar ao carrinho.');
        return;
    }

    const userId = userData.id;
    const quantity = 1; // produtos por vez

    try {
        const response = await fetch('http://localhost:3004/carrinho/adicionar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: userId, product_id: productId, quantity })
        });

        const result = await response.json();
        alert(result.message);
    } catch (error) {
        console.error('erro', error);
        alert('erro');
    }
}

async function listarCarrinho() {
    const userData = JSON.parse(localStorage.getItem('informacoes'));
    if (!userData) {
        alert('vc precisa logar para ter acesso ao carrinho');
        return;
    }

    const userId = userData.id;

    try {
        const response = await fetch(`http://localhost:3004/carrinho/${userId}`);
        if (!response.ok) {
            throw new Error('erro');
        }

        const result = await response.json();

        if (result.success) {
            const carrinhoContainer = document.getElementById('carrinho-itens');
            carrinhoContainer.innerHTML = ''; // limpar carrinho

            let totalPreco = 0; 

            if (result.data.length === 0) {
                carrinhoContainer.innerHTML = '<p>carrinho vazio</p>';
                return;
            }

            result.data.forEach(item => {
            
                totalPreco += item.price * item.quantity;

                carrinhoContainer.innerHTML += `
                    <div class="carrinho-item">
                        <img src="http://localhost:3004/uploads/${item.image}" alt="${item.name}">
                        <p>${item.name}</p>
                        <p>R$${item.price}</p>
                        <input type="number" value="${item.quantity}" min="1" onchange="editarQuantidade(${item.id}, this.value)">
                        <button onclick="removerDoCarrinho(${item.id})">Remover</button>
                    </div>
                `;
            });

            // Atualiza o total no HTML
            document.getElementById('total-preco').textContent = totalPreco.toFixed(2);
        } else {
            alert(result.message);  
        }
    } catch (error) {
        console.error('erro na listagem', error);
        alert('erro ');
    }
}


async function removerDoCarrinho(product_id) {

    const userData = JSON.parse(localStorage.getItem('informacoes'));
    if (!userData) {
        alert('vc precisa estar logado para remover do carrinho.');
        return;
    }

    const user_id = userData.id;

    try {
        const response = await fetch(`http://localhost:3004/carrinho/remover/${product_id}/${user_id}`, {
            method: 'DELETE'
        });

        const result = await response.json();
        alert(result.message);
        listarCarrinho();  
    } catch (error) {
        console.error('erro', error);
        alert('erro ao deletar');
    }
}

async function editarQuantidade(productId, novaQuantidade) {
    const userData = JSON.parse(localStorage.getItem('informacoes'));
    if (!userData) {
        alert('você precisa estar logado para editar a quantidade.');
        return;
    }

    const userId = userData.id;

    try {
        const response = await fetch('http://localhost:3004/carrinho/editar', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: userId,
                product_id: productId,
                quantity: novaQuantidade
            })
        });

        const result = await response.json();
        if (result.success) {
            alert(result.message);
            listarCarrinho(); 
        } else {
            alert('erro:' + result.message);
        }
    } catch (error) {
        console.error('esse erro ai', error);
        alert('erro ao editar');
    }
}

