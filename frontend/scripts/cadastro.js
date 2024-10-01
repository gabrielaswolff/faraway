document.getElementById('formulario').addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const cpf_number = document.getElementById('cpf_number').value;

    const data = { name, email, password, cpf_number };
    
    try {
        const response = await fetch('http://localhost:3004/usuario/cadastrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const results = await response.json();

        if (results.success) {
            
            localStorage.setItem('informacoes', JSON.stringify(results.data));

           
            let html = document.getElementById('informacoes');
            let dados = JSON.parse(localStorage.getItem('informacoes'));

            html.innerHTML = `<div style="display: flex; flex-direction: column; align-items: end">
                                ${dados.perfil} 
                                ${dados.email} 
                              </div>`;

            html.style.display = 'block';


            alert(results.message);
        } else {
            alert(results.message);
        }
    } catch (error) {
        console.error('erro', error);
        alert('erro');
    }
});
