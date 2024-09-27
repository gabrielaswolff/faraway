document.getElementById('formulario').addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const cpf_number = document.getElementById('cpf_number').value;

    try {
        const response = await fetch('http://localhost:3007/usuario/cadastrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, cpf_number }),
        });

        const data = await response.json();

        if (data.success) {
            alert(data.message);
            window.location.href = "/frontend/html/index.html";
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('erro ao cadastrar usuario.');
    }
});

document.addEventListener('DOMContentLoaded', (event) => {
    const cartIcon = document.getElementById('cart-icon');
    cartIcon.addEventListener('click', () => {
        window.location.href = '/frontend/html/carrinho.html';
    });
});