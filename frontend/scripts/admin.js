document.getElementById('productForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const image_url = document.getElementById('image_url').value;
    const adminPassword = document.getElementById('adminPassword').value;

    const product = { name, description, price, image_url, adminPassword };

    fetch('http://localhost:3007/produto/cadastrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('sucesso');
            document.getElementById('productForm').reset();
        } else {
            alert('erro para cadastrar produto: ' + data.message);
        }
    })
    .catch(error => console.error('erro na requisição:', error));
});

document.addEventListener('DOMContentLoaded', function() {
  
    fetch('http://localhost:3007/produtos/listar')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const productList = document.createElement('ul');

                data.data.forEach(product => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${product.name} - R$${product.price}`;
                    
               
                    const editButton = document.createElement('button');
                    editButton.textContent = 'Editar';
                    editButton.onclick = () => editProduct(product.id);
                    listItem.appendChild(editButton);

                    const removeButton = document.createElement('button');
                    removeButton.textContent = 'Remover';
                    removeButton.onclick = () => removeProduct(product.id);
                    listItem.appendChild(removeButton);

                    productList.appendChild(listItem);
                });

                document.body.appendChild(productList);
            } else {
                alert('erro ao carregar produtos: ' + data.message);
            }
        })
        .catch(error => console.error('erro ao carregar produtos:', error));
});

function editProduct(productId) {
    const newName = prompt('Digite o novo nome do produto:');
    if (newName) {
        fetch(`http://localhost:3007/produto/editar/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName })
        })
        .then(response => response.json())
        .then(data => {
            if (data.sucess) {
                alert('produto editado');
                location.reload(); 
            } else {
                alert('erro ao editar produto: ' + data.message);
            }
        })
        .catch(error => console.error('Erro ao editar produto:', error));
    }
}

function removeProduct(productId) {
    if (confirm('Tem certeza que deseja remover este produto?')) {
        fetch(`http://localhost:3007/produto/deletar/${productId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.sucess) {
                alert('produto removido');
                location.reload(); 
            } else {
                alert('rrro ao remover produto: ' + data.message);
            }
        })
        .catch(error => console.error('erro ao remover produto:', error));
    }
}
