O presente projeto utilizou rotas rodadas na porta 3007 e classificadas como: 

Cadastro do Usuário
Login do Usuário
Cadastro de produtos (acesso somente por ADMINS)
Carrinho

A seguir os exemplos de como acessar as rotas no THUNDER CLIENT


// CADASTRO DE USUÁRIOS


MÉTODO: POST (/usuario/cadastrar)

exemplo:

{
“name”: “criarConta”,
“email”: “criarConta@gmail.com”,
“password”: “123”,
“cpf_number”: “7890876789”
{

MÉTODO: GET (/usuarios/listar)

exemplo:

{
“name”: “criarConta”
}

MÉTODO: PUT (/usuario/editar/:id)

exemplo:

{
  "name": "arroba2",
  "email": "arroba@gmail.com",
  "password": "password"
}

MÉTODO: DELETE (usuario/deletar/:id)

exemplo:

{

  "name": "CriarConta",
  "email": “CriarConta@gmail.com
}




// LOGIN DO USUÁRIO


MÉTODO: POST LOGIN (/login) 

exemplo:

{
“email”: “criarConta@gmail.com”,
“password”: “criarConta”
}

MÉTODO: POST LOGOUT (/logout)

exemplo:

{
“email”: “criarConta@gmail.com”,
“password”: “criarConta”
}


// CADASTRO DE PRODUTOS


MÉTODO: POST (/produto/cadastrar)

{
“name”: “produto”,
“description”: “produto para cabelos”,
“image_url”: https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.adrenaline.com.br%2Fgames%2Fminecraft-alcanca-a-marca-de-300-milhoes-de-copias-vendidas%2F&psig=AOvVaw1gIknz3p7bX9yZPfevsnCY&ust=1725719140811000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPCuuvbCrogDFQAAAAAdAAAAABAE”,
“adminPassword”: “senha”
} 

MÉTODO: GET (/produtos/listar)

{
“name”: “produto”
}

PUT(/produto/editar/:3)

{
“name”: “produto atualizado”
}


MÉTODO: DELETE (/produto/deletar/:id)


{
“name”: “produto”
}



// CARRINHO

MÉTODO: POST (/carrinho/adicionar)

{
  "user_id": 2,
  "product_id": 1,
  "quantity": 2
}

MÉTODO: GET (/carrinho/:user_id)

{
  "user_id": 5
}

MÉTODO: DELETE (/carrinho/remover/:id)

{
  "user_id": 5
}




















