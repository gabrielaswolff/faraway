async function addToCart(productId, quantity, price) {
    const userId = localStorage.getItem('userId');

    if (!userId) {
        alert('É necessário realizar o login.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3007/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ productId, quantity, price }),
        });

        const data = await response.json();

        if (data.success) {
            alert(data.message);
            displayCart();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('erro para adicionar produto', error);
        alert('erro para adicionar produto');
    }
}

async function displayCart() {
    const userId = localStorage.getItem('userId');

    if (!userId) {
        alert('É necessário realizar o login.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3007/cart`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();

        if (data.success) {
            const cartItems = data.items;
            let cartElement = document.getElementById('cart');
            cartElement.innerHTML = '';

            let totalPrice = 0;

            cartItems.forEach(item => {
                totalPrice += item.price * item.quantity;

                let listItem = document.createElement('li');
                listItem.className = 'cart-item';
                listItem.innerHTML = `
                    ${item.product_name}: ${item.quantity} unidade(s) - R$${item.price} cada
                    <button class="quantity-button plus" onclick="changeQuantity(${item.id}, 1)">+</button>
                    <button class="quantity-button minus" onclick="changeQuantity(${item.id}, -1)">-</button>
                    <button class="remove-button" onclick="removeFromCart(${item.id})">Remover</button>
                `;
                cartElement.appendChild(listItem);
            });

            let totalPriceElement = document.getElementById('total-price');
            if (!totalPriceElement) {
                totalPriceElement = document.createElement('div');
                totalPriceElement.id = 'total-price';
                document.querySelector('.cart-summary').insertBefore(totalPriceElement, document.getElementById('comprar'));
            }
            totalPriceElement.innerHTML = `Total: R$${totalPrice.toFixed(2)}`;
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Erro ao exibir o carrinho:', error);
        alert('Erro ao exibir o carrinho.');
    }
}
