const express = require('express');
const cors = require('cors');
const connection = require('./db_config');

const porta = 3004;
const app = express();


app.use(cors());
app.use(express.json());


 
app.listen(porta, () => console.log(`rodando na porta ${porta}`));  
const upload = require('./multer');

// CADASTRO DO USUARIO

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
