# 🪐 FarAway

## 📌 Sobre o Projeto

**FarAway** é uma loja virtual de compras místicas, focada em produtos incomuns e únicos. O projeto foi desenvolvido como uma aplicação **Fullstack**, oferecendo uma experiência completa de e-commerce com autenticação de usuários, carrinho de compras e gerenciamento de produtos.

O sistema conta com dois tipos de usuários:

* **Usuário comum**: pode se cadastrar, fazer login, adicionar produtos ao carrinho e realizar compras.
* **Administrador (ADMIN)**: possui permissões exclusivas para cadastrar e editar produtos da loja.

---

## ⚙️ Funcionalidades

* Cadastro e login de usuários
* Logout de usuário
* Listagem de produtos
* Compra direta de produtos
* Carrinho de compras por usuário
* Edição de itens do carrinho (quantidade e remoção)
* Cadastro e edição de produtos (apenas ADMIN)
* Verificação de compra via autenticação

---

## 🛠️ Tecnologias Utilizadas

### Backend

* Node.js
* Express.js
* MySQL
* Multer (upload de imagens)

### Frontend

* HTML
* CSS
* JavaScript

---

## 🗄️ Banco de Dados

O banco de dados utilizado chama-se **`FarAway`**, desenvolvido em **MySQL**.

Tabelas principais:

* `users`
* `products`
* `cart_items`

---

## 👑 Conta de Administrador

> ⚠️ **Apenas o ADMIN pode cadastrar ou editar produtos**

Credenciais padrão:

* **Email:** [admin@gmail.com](mailto:admin@gmail.com)
* **Senha:** 123

---

## 🔐 Autenticação

O sistema utiliza rotas específicas para:

* Cadastro de usuários
* Login e logout
* Verificação de compra

---

## 📡 Rotas da API

### 👤 Usuários

#### ➕ Cadastrar Usuário

* **Método:** POST
* **Rota:** `/usuario/cadastrar`

```json
{
  "name": "CriarConta",
  "email": "criarConta@gmail.com",
  "password": "123",
  "cpf_number": "7890876789"
}
```

#### 📄 Listar Usuários

* **Método:** GET
* **Rota:** `/usuarios/listar`

#### ✏️ Atualizar Usuário

* **Método:** PUT
* **Rota:** `/usuario/editar/:id`

```json
{
  "name": "arroba2",
  "email": "arroba@gmail.com",
  "password": "password"
}
```

#### ❌ Deletar Usuário

* **Método:** DELETE
* **Rota:** `/usuario/deletar/:id`

---

### 🔑 Login

#### 🔓 Login do Usuário

* **Método:** POST
* **Rota:** `/login`

```json
{
  "email": "criarConta@gmail.com",
  "password": "criarConta"
}
```

#### 🔒 Logout

* **Método:** POST
* **Rota:** `/logout`

---

### 📦 Produtos

#### ➕ Cadastrar Produto (ADMIN)

* **Método:** POST
* **Rota:** `/produto/cadastrar`

```json
{
  "name": "Produto Exemplo",
  "price": 100.0,
  "description": "Descrição do produto"
}
```

> ⚠️ Esta rota requer envio de imagem via **multipart/form-data**

#### 📄 Listar Produtos

* **Método:** GET
* **Rota:** `/produto/listar`

#### ✏️ Editar Produto (ADMIN)

* **Método:** PUT
* **Rota:** `/produto/editar/:id`

```json
{
  "name": "Produto Exemplo",
  "price": 100.0,
  "description": "Descrição do produto"
}
```

---

### 🛒 Carrinho de Compras

#### ➕ Adicionar Produto ao Carrinho

* **Método:** POST
* **Rota:** `/carrinho/adicionar`

```json
{
  "user_id": 1,
  "product_id": 2,
  "quantity": 3
}
```

#### ❌ Remover Produto do Carrinho

* **Método:** DELETE
* **Rota:** `/carrinho/remover/:product_id/:user_id`

#### ✏️ Atualizar Quantidade do Produto

* **Método:** PUT
* **Rota:** `/carrinho/editar`

```json
{
  "user_id": 1,
  "product_id": 2,
  "quantity": 5
}
```

#### 📄 Listar Carrinho do Usuário

* **Método:** GET
* **Rota:** `/carrinho/:user_id`

---

### 💳 Compra

#### ✔️ Verificação de Compra

* **Método:** POST
* **Rota:** `/verificarCompra`

```json
{
  "email": "usuario@gmail.com",
  "password": "senha123"
}
```

---

## 📌 Observações Finais

* Este projeto tem fins educacionais
* Não utiliza criptografia de senha (bcrypt)
* Ideal para estudos de autenticação, CRUD e relacionamento com banco de dados

---

## ✨ Autoria

© 2026 — **FarAway Project**
