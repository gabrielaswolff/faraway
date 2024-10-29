const upload = require('./multer');
const express = require('express');
const cors = require('cors');
const connection = require('./db_config');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const baseUrl = "http://localhost:3004"
const porta = process.env.PORT || 3004;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: { 
      title: 'MINHA API',
      version: '1.0.0',
      description: 'A simple Express API with Swagger documentation',
    },
    servers: [
      { url: 'http://localhost:3004' },
    ],
  },
  apis: ['/src/server', 'src/*.js'], 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.listen(porta, () => console.log(`Servidor rodando na porta ${porta}`));


//-----------------------------------------------------------------------------

// CADASTRO DO USUARIO

/**
    @swagger
 * /usuario/cadastrar:
 *   post:
 *     summary: Cadastro de um novo usuário
 *     description: Cria um novo usuário no sistema com nome, email, senha e CPF.
 *     tags:
 *       - Usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               cpf_number:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     password:
 *                       type: string
 *       400:
 *         description: Nome ou email já cadastrado
 *       500:
 *         description: Erro no servidor
 */

app.post('/usuario/cadastrar', (request, response) => {
    const { name, email, password, cpf_number } = request.body;

    let checkQuery = 'SELECT * FROM users WHERE name = ? OR email = ?';
    connection.query(checkQuery, [name, email], (err, results) => {

        if (err) {
            console.error('Erro', err);
            return response.status(500).json({ success: false, message: 'erro', data: err });
        }
        if (results.length > 0) {
            return response.status(400).json({ success: false, message: 'nome ou email já está cadastrado.' });
        }

        let query = 'INSERT INTO users(name, email, password, cpf_number) VALUES(?,?,?,?)';
        let params = [name, email, password, cpf_number];
        connection.query(query, params, (err, results) => {
            if (err) {
                console.error('erro ao cadastrar usuario', err);
                return response.status(500).json({ success: false, message: 'erro', data: err });
            }

            const newUser = {
                id: results.insertId,
                name,
                email,
                password, 
                perfil: 'user' 
            };


            response.status(201).json({
                success: true,
                message: 'sucesso pessoal',
                data: newUser 
            });
        });
    });

});



/**
 * @swagger
 * /usuarios/listar:
 *   get:
 *     summary: Lista todos os usuários
 *     description: Retorna uma lista de todos os usuários cadastrados no sistema.
 *     tags:
 *       - Usuário
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       cpf_number:
 *                         type: string
 *       400:
 *         description: Falha ao buscar usuários
 */

      
app.get('/usuarios/listar', (request, response) => {
    const query = 'select * from users';

    connection.query(query, (err, results) => {

    
    if(results) {
        response
        .status(200)
        .json({
            sucess: true,
            message: 'sucesso',
            data: results

        })
    } else {
        response
        .status(400)
        .json({
            sucess: false,
            message: 'sem sucesso',
            data: err
        })
    }

    })


})

/**
 * @swagger
 * /usuario/editar/{id}:
 *   put:
 *     summary: Edita as informações de um usuário
 *     description: Atualiza as informações de um usuário existente no sistema, como nome, CPF, email e senha.
 *     tags:
 *       - Usuário
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário a ser editado
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               cpf_number:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Edição realizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Erro ao editar usuário
 */


app.put('/usuario/editar/:id', (request, response) => {
    const { name, cpf_number, email, password } = request.body;
    const id = request.params.id;
    
    // Parâmetros para atualizar
    let params = [name, cpf_number, email, password, id];
    
    // Query para atualizar os campos
    let query = `
        UPDATE users
        SET name = ?, cpf_number = ?, email = ?, password = ?
        WHERE id = ?
    `;
    
    connection.query(query, params, (err, results) => {
        if (results) {
            response.status(200).json({
                success: true,
                message: 'Edição realizada com sucesso',
                data: results
            });
        } else {
            response.status(400).json({
                success: false,
                message: 'Erro ao editar',
                data: err
            });
        }
    });
});


/**
 * @swagger
 * /usuario/deletar/{id}:
 *   delete:
 *     summary: Deleta um usuário
 *     description: Remove um usuário do sistema pelo seu ID.
 *     tags:
 *       - Usuário
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário a ser deletado
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: string
 *       400:
 *         description: Erro ao deletar usuário
 */


app.delete('/usuario/deletar/:id', (request, response) => {
    let params = Array(
        request.params.id
    );

    let query = 'delete from users where id = ?;'

    connection.query(query, params, (err, results) => {
        if(results) {
            response
            .status(200)
            .json({
                sucess: true,
                message: 'sucesso pessoal :p',
                data: 'results'  
            })
        } else {
            response
            .status(400)
            .json({
                sucess: false,
                message: 'sem sucesso',
                data: err
            })
        }
    }
    )

})

// LOGIN 


/**
 * @swagger
 * /login:
 *   post:
 *     summary: Realiza o login do usuário
 *     description: Autentica um usuário pelo email e senha.
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     perfil:
 *                       type: string
 *       400:
 *         description: Erro no login (senha incorreta ou email não cadastrado)
 */


app.post('/login', (request, response) => {
    let params  = Array(
        request.body.email
    )

    let query = "select id, name, email, password, perfil from users where email = ?";

    connection.query(query, params, (err, results) => {
        if(results.length > 0 ) {

            let senhaDigitada = request.body.password
            let senhaBanco = results[0].password

            if(senhaBanco == senhaDigitada) {
                response
                .status(200)
                .json({
                    success: true, 
                    message: "sucesso pessoal",
                    data: results[0]
                })
            
            } else{
                response
                .status(400)
                .json({
                    success: false,
                    message: "verifique sua senha"
                })
                
            }
           
        } else {
            response
            .status(400)
            .json({
                success: false,
                message: "email não cadastrado"
            })
        }
        
    })
})


// CARRINHO 



/**
 * @swagger
 * /carrinho/adicionar:
 *   post:
 *     summary: Adiciona um produto ao carrinho
 *     description: Adiciona um produto ao carrinho de um usuário ou atualiza a quantidade caso já exista no carrinho.
 *     tags:
 *       - Carrinho
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               product_id:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Quantidade atualizada no carrinho
 *       201:
 *         description: Produto adicionado ao carrinho
 *       500:
 *         description: Erro ao adicionar/atualizar o carrinho
 */


app.post('/carrinho/adicionar', (req, res) => {
    const { user_id, product_id, quantity } = req.body;

    const checkQuery = 'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?';
    connection.query(checkQuery, [user_id, product_id], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'erro na ver' });
        }
        if (results.length > 0) {
            const updateQuery = 'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?';
            const newQuantity = results[0].quantity + quantity;
            connection.query(updateQuery, [newQuantity, user_id, product_id], (err, results) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'erro para atualizar' });
                }
                res.status(200).json({ success: true, message: 'Esse produto já está em seu carrinho, então a quantidade foi atualizada.' });
            });
        } else {
            const insertQuery = 'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)';
            connection.query(insertQuery, [user_id, product_id, quantity], (err, results) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'não tá dando certo' });
                }
                res.status(201).json({ success: true, message: 'produto adicionado ao carrinho' });
            });
        }
    });
});

/**
 * @swagger
 * /carrinho/remover/{product_id}/{user_id}:
 *   delete:
 *     summary: Remove um produto do carrinho
 *     description: Remove um produto específico do carrinho de um usuário.
 *     tags:
 *       - Carrinho
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         description: ID do produto a ser removido
 *         schema:
 *           type: integer
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produto removido com sucesso
 *       500:
 *         description: Erro ao remover o produto
 */


app.delete('/carrinho/remover/:product_id/:user_id', (req, res) => {
    const { product_id, user_id } = req.params;

    const query = 'DELETE FROM cart_items WHERE product_id = ? AND user_id = ?';
    connection.query(query, [product_id, user_id], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'erro' });
        }
        res.status(200).json({ success: true, message: 'produto removido do carrinho' });
    });
});


/**
 * @swagger
 * /carrinho/editar:
 *   put:
 *     summary: Edita a quantidade de um produto no carrinho
 *     description: Atualiza a quantidade de um produto já existente no carrinho.
 *     tags:
 *       - Carrinho
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               product_id:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Quantidade atualizada com sucesso
 *       500:
 *         description: Erro ao atualizar a quantidade
 */


app.put('/carrinho/editar', (req, res) => {
    const { user_id, product_id, quantity } = req.body;

    const updateQuery = 'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?';
    connection.query(updateQuery, [quantity, user_id, product_id], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'erro ao atualizar' });
        }
        res.status(200).json({ success: true, message: 'quantidade atualizada! sucesso' });
    });
});


/**
 * @swagger
 * /carrinho/{user_id}:
 *   get:
 *     summary: Lista os produtos no carrinho de um usuário
 *     description: Retorna os produtos no carrinho de um usuário específico.
 *     tags:
 *       - Carrinho
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produtos listados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       price:
 *                         type: number
 *                       image:
 *                         type: string
 *                       quantity:
 *                         type: integer
 *       500:
 *         description: Erro ao listar produtos
 */


app.get('/carrinho/:user_id', (req, res) => {
    const { user_id } = req.params;

    const query = `
        SELECT p.id, p.name, p.price, p.image, ci.quantity
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.user_id = ?;
    `;

    connection.query(query, [user_id], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'erro' });
        }
        res.status(200).json({ success: true, data: results });
    });
});



// COMPRA 

/**
 * @swagger
 * /verificarCompra:
 *   post:
 *     summary: Verificar credenciais do usuário para compra.
 *     description: Verifica se o email e senha fornecidos correspondem a um usuário válido no sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: O email do usuário.
 *               password:
 *                 type: string
 *                 description: A senha do usuário.
 *     responses:
 *       200:
 *         description: Usuário verificado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Email ou senha incorretos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: Erro no servidor.
 */

app.post('/verificarCompra', (req, res) => {
    const { email, password } = req.body;


    let query = "SELECT id FROM users WHERE email = ? AND password = ?";


    connection.query(query, [email, password], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'erro' });
        }

        if (results.length > 0) {
            res.status(200).json({ success: true, message: 'certinho' });
        } else {
            res.status(404).json({ success: false, message: 'email ou senha incorretos' });
        }
    });
});


// -----------------------------------------------------------------------------------------


// CADASTRAR PRODUTO INTERFAE ADMIN



/**
 * @swagger
 * /produto/cadastrar:
 *   post:
 *     summary: Cadastrar um novo produto.
 *     description: Permite que um administrador cadastre um novo produto no sistema, incluindo o envio de uma imagem.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: O nome do produto.
 *               price:
 *                 type: number
 *                 description: O preço do produto.
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: A imagem do produto.
 *               description:
 *                 type: string
 *                 description: A descrição do produto.
 *     responses:
 *       201:
 *         description: Produto cadastrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Falha ao cadastrar o produto.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */

app.post('/produto/cadastrar', upload.single('file'), (request, response) => {
    let params = Array(
        request.body.name,
        request.body.price,
        request.file.filename,
        request.body.description
    )

    let query = 'insert into products(name, price, image,  description) values(?,?,?,?)';

    connection.query(query, params, (err, results) => {
        if(results) {
            response
                .status(201)
                .json({
                    success: true,
                    message: "sucesso",
                    data: results
                })
        }else {
            response
            .status(400)
            .json({
                success: false,
                message: "sem sucesso",
                data: err
            })
        }
    })
})


app.use('/uploads', express.static(__dirname + '\\public'))



/**
 * @swagger
 * /produtos/listar:
 *   get:
 *     summary: Listar todos os produtos.
 *     description: Retorna uma lista de todos os produtos cadastrados no sistema.
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       price:
 *                         type: number
 *                       image:
 *                         type: string
 *                       description:
 *                         type: string
 *       400:
 *         description: Falha ao listar os produtos.
 */


app.get('/produtos/listar', (request, response) => {
    let query = "select * from products";

    connection.query(query, (err, results) => {
        if(results) {
            response
            .status(200)
            .json({
                success: true,  
                message: "sucesso",
                data: results
            })
        } else {
            response
            .status(400 )
            .json({
                success: false,
                message: "sem sucesso",
                data: results
            })

        }
    })
})



/**
 * @swagger
 * /produto/editar/{id}:
 *   put:
 *     summary: Editar um produto.
 *     description: Permite que um administrador edite as informações de um produto existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do produto a ser editado.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               file:
 *                 type: string
 *                 format: binary
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso.
 *       400:
 *         description: Falha ao atualizar o produto.
 *       404:
 *         description: Produto não encontrado.
 */

app.put('/produto/editar/:id', upload.single('file'), (req, res) => {
    const productId = req.params.id;
    const { name, price, description } = req.body;

    let query;
    let params;

    if (req.file) {
        
        query = 'UPDATE products SET name = ?, price = ?, image = ?, description = ? WHERE id = ?';
        params = [name, price, req.file.filename, description, productId];
    } else {

        query = 'UPDATE products SET name = ?, price = ?, description = ? WHERE id = ?';
        params = [name, price, description, productId];
    }

    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(400).json({ success: false, message: "erro", error: err });
        }
        if (results.affectedRows > 0) {
            res.status(200).json({ success: true, message: "produto atualizado", data: results });
        } else {
            res.status(404).json({ success: false, message: "erro" });
        }
    });
});



/**
 * @swagger
 * /produto/excluir/{id}:
 *   delete:
 *     summary: Excluir um produto.
 *     description: Remove um produto do sistema pelo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do produto a ser excluído.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produto excluído com sucesso.
 *       400:
 *         description: Falha ao excluir o produto.
 *       404:
 *         description: Produto não encontrado.
 */


app.delete('/produto/excluir/:id', (request, response) => {
    const productId = request.params.id;

    if (!productId) {
        return response.status(400).json({
            success: false,
            message: "problema no id"
        });
    }
    
    let query = 'DELETE FROM products WHERE id = ?';

    connection.query(query, [productId], (err, results) => {
        if (err) {
            console.error('erro', err);
            return response.status(500).json({
                success: false,
                message: "erro",
                error: err.message
            });
        }

        if (results.affectedRows > 0) {
            response.status(200).json({
                success: true,
                message: "produto excluido. sucesso",
                data: results
            });
        } else {
            response.status(404).json({
                success: false,
                message: "tem que ver isso ai, nao funcionou",
                data: results
            });
        }
    });
});

