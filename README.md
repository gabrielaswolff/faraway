A FarAway 2.0 é um site de compras místico com produtos incomuns e únicos. 
Possui funcionalidades como: 

Cadastro e login de usuário;
Logout de usuário;
Opções de comprar um produto individualmente ou adicioná-lo ao carrinho de compras;
Edição dos produtos do carrinho pelo usuário;
Cadastro e edição de produtos acessíveis apenas pelo ADMIN.

O banco de dados utilizado em tal projeto é denominado como "FarAway", e foi desenvolvido na plataforma MYSQL.
Em relação ao ADMIN, cujo é o único usuário com permição para adicionar produtos novos na loja ou editá-los, possui a seguinte conta:

email: admin@gmail.com
senha: 123

Foram utilizadas rotas de cadastro e login de usuário, cadastro de produtos, carrinho de compras e uma rota apenas para a verificação da 
compra do usuário. 

ROTAS: 

// CADASTRO DE USUÁRIOS


MÉTODO: POST - CADASTRAR USUÁRIO

ROTA: /usuario/cadastrar

body:

{
“name”: “criarConta”,
“email”: “criarConta@gmail.com”,
“password”: “123”,
“cpf_number”: “7890876789”   
}

MÉTODO: GET - LISTAR USUÁRIOS  

ROTA: /usuarios/listar

body:

{
“name”: “criarConta”
}

MÉTODO: PUT - ATUALIZAR USUÁRIO

ROTA: /usuario/editar/:id

body:

{
  "name": "arroba2",
  "email": "arroba@gmail.com",
  "password": "password"
}

MÉTODO: DELETE - DELETAR USUÁRIO

ROTA: usuario/deletar/:id

body:

{

  "name": "CriarConta",
  "email": “CriarConta@gmail.com
}




// LOGIN DO USUÁRIO


MÉTODO: POST - LOGIN 

ROTA: /login

body:

{
“email”: “criarConta@gmail.com”,
“password”: “criarConta”
}

MÉTODO: POST - LOGOUT 

ROTA: /logout

exemplo:

{
“email”: “criarConta@gmail.com”,
“password”: “criarConta”
}


// CADASTRO DE PRODUTOS

METÓDO: POST - CADASTRAR PRODUTO  

ROTA: /produto/cadastrar

body:

{
  "name": "Produto Exemplo",
  "price": 100.0,
  "description": "Descrição do produto"
}

Essa rota precisa do envio da imagem via multipart/form-data



MÉTODO: GET - LISTAR PRODUTOS  

ROTA: /produto/editar/:id

body:

{
  "name": "Produto Exemplo",
  "price": 100.0,
  "description": "Descrição do produto"
}



MÉTODO: PUT - ATUALIZAR PRODUTO 

ROTA: /produto/editar/:id

body:

{
  "name": "Produto Exemplo",
  "price": 100.0,
  "description": "Descrição do produto"
}



// CARRINHO DE COMPRAS

MÉTODO: POST - ADICIONAR PRODUTO AO CARRINHO DO USUÁRIO 

ROTA: /carrinho/adicionar

body:

{
  "user_id": 1,
  "product_id": 2,
  "quantity": 3
}

MÉTODO: DELETE - DELETAR PRODUTO DO CARRINHO DO USUÁRIO

ROTA: /carrinho/remover/:product_id/:user_id

body:

{
  "user_id": 1,
  "product_id": 2,
  "quantity": 5
}


MÉTODO: PUT - ATUALIZAR CARRINHO DO USUÁRIO

ROTA: /carrinho/editar

body:

{
  "user_id": 1,
  "product_id": 2,
  "quantity": 5
}


MÉTODO: GET - LISTAR PRODUTOS DO CARRINHO DO USUÁRIO

ROTA: /carrinho/:user_id

body:

{
  "email": "usuario@gmail.com",
  "password": "senha123"
}


// COMPRA DO USUÁRIO

MÉTODO: POST - VERIFICAÇÃO DO EMAIL E SENHA DO USUÁRIO 

ROTA: /verificarCompra

body:

{
  "email": "usuario@gmail.com",
  "password": "senha123"
}



















