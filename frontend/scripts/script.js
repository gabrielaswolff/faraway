document.addEventListener('DOMContentLoaded', (event) => {
    const elementos = [
        { id: 'inicio', url: '/frontend/html/index.html' },
        { id: 'cart-icon', url: '/frontend/html/carrinho.html' },
        { id: 'canetaGpt', url: '/frontend/html/caneta.html' },
        { id: 'dimensionFly', url: '/frontend/html/dimension.html' },
        { id: 'pedrasGigaSize', url: '/frontend/html/pedras.html' },
        { id: 'gnomos', url: '/frontend/html/gnomos.html' },
        { id: 'camiseta', url: '/frontend/html/camiseta.html' },
        { id: 'login', url: '/frontend/html/login.html' },
        { id: 'strogonoff', url: '/frontend/html/strogonoff.html' },
        { id: 'babyTee', url: '/frontend/html/babyTee.html' },
        { id: 'vacina', url: '/frontend/html/vacina.html' },
        { id: 'celular', url: '/frontend/html/celular.html' },
        { id: 'cascalho', url: '/frontend/html/cascalho.html' },
        { id: 'pocaoAmor', url: '/frontend/html/pocaoAmor.html' },
        { id: 'dois', url: '/frontend/html/dois.html' },
        { id: 'adicionarC', url: '/frontend/html/carrinho.html' },
        { id: 'pagInicial', url: '/frontend/html/index.html' },
        { id: 'comprar', url: '/frontend/html/comprar.html' },
        { id: 'ecobag', url: '/frontend/html/admin.html' },
        { id: 'voltar', url: null, action: () => window.history.back() }
    ];

    elementos.forEach(({ id, url, action }) => {
        const element = document.getElementById(id);
        if (element) {
            if (action) {
                element.addEventListener('click', action);
            } else {
                element.addEventListener('click', () => {
                    window.location.href = url;
                });
            }
        }
    });

    const checkoutForm = document.getElementById('checkout-form');
    const checkoutContainer = document.getElementById('checkout-container');
    const loadingScreen = document.getElementById('loading-screen');

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (event) => {
            event.preventDefault();
            if (checkoutContainer) checkoutContainer.style.display = 'none';
            if (loadingScreen) loadingScreen.style.display = 'flex';

            setTimeout(() => {
                window.location.href = '/frontend/html/pagina-de-sucesso.html';
            }, 4000);
        });
    }
});


// CARRINHO

