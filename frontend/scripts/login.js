document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3007/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        
        console.log(data); 

        if (data.message === 'Login realizado com sucesso.') {
            localStorage.setItem('userId', data.userId);
            alert(data.message); 
            window.location.href = "/frontend/html/carrinho.html"; 
        } else {
            alert(data.message); 
        }
    } catch (error) {
        console.error('erro:', error);
        alert('erro ao fazer login');
    }
});
