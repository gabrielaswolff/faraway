async function adicionarAoCarrinho(productId) {
    const userData = JSON.parse(localStorage.getItem('informacoes'));
    if (!userData) {
        alert('Você precisa estar logado para adicionar ao carrinho.');
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
        console.error('Erro ao adicionar ao carrinho:', error);
        alert('Ocorreu um erro ao tentar adicionar o produto ao carrinho.');
    }
}

async function listarCarrinho() {
    const userData = JSON.parse(localStorage.getItem('informacoes'));
    if (!userData) {
        alert('Você precisa estar logado para acessar o carrinho.');
        return;
    }

    const userId = userData.id;

    try {
        
        const response = await fetch(`http://localhost:3004/carrinho/${userId}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar os itens do carrinho');
        }

        const result = await response.json();

        if (result.success) {
            const carrinhoContainer = document.getElementById('carrinho-itens');
            carrinhoContainer.innerHTML = ''; // Limpa o carrinho

            if (result.data.length === 0) {
                carrinhoContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
                return;
            }


            result.data.forEach(item => {
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
        } else {
            alert(result.message);  
        }
    } catch (error) {
        console.error('Erro ao listar o carrinho:', error);
        alert('Ocorreu um erro ao tentar carregar o carrinho.');
    }
}


async function removerDoCarrinho(productId) {
    const userData = JSON.parse(localStorage.getItem('informacoes'));
    if (!userData) {
        alert('Você precisa estar logado para remover do carrinho.');
        return;
    }

    const userId = userData.id;

    try {
        const response = await fetch(`http://localhost:3004/carrinho/remover/${productId}/${userId}`, {
            method: 'DELETE'
        });

        const result = await response.json();
        alert(result.message);
        listarCarrinho();
    } catch (error) {
        console.error('Erro ao remover do carrinho:', error);
        alert('Ocorreu um erro ao tentar remover o produto do carrinho.');
    }
}
