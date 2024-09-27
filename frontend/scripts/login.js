async function logar(event) {
    event.preventDefault();

    const email = document.getElementById('email_login').value;
    const password = document.getElementById('password_login').value;

    const data = {email, password}
    
    const response = await fetch("http://localhost:3007/login", {
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

function sair(){
    localStorage.removeItem('informacoes')
    window.location.href = "/frontend/html/index.html"
}

function signUp(){
    window.location.href = "/frontend/html/cadastro.html"
}

function signIn(){
    window.location.href = "/frontend/html/login.html"
}



window.addEventListener("load", () => {
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


async function cadastrarProduto(event) {
    event.preventDefault()

    const title = document.getElementById('name').value
    const price = Number(document.getElementById('price').value)
    const file = document.getElementById('file').files[0]

    let formData = new FormData();

    formData.append('name', title)
    formData.append('price', price)
    formData.append('file', file)
}
