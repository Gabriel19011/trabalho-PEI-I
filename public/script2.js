// script2.js para salvar o pedido do cliente
document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.getElementById('login');
    const registerButton = document.getElementById('register');
    const container = document.getElementById('container');
    const signUpForm = document.querySelector('.sign-up');
    const signInForm = document.querySelector('.sign-in');

    loginButton.addEventListener('click', () => {
        container.classList.add('right-panel-active');
    });

    registerButton.addEventListener('click', () => {
        container.classList.remove('right-panel-active');
    });

    signInForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const nome = signInForm.querySelector('input[placeholder="Nome"]').value;
        const observacao = signInForm.querySelector('.obs').value;

        const checkboxes = document.querySelectorAll('#checkboxes input[type="checkbox"]:checked');
        let items = [];

        checkboxes.forEach(function(checkbox) {
            items.push(checkbox.value);
        });

        const pedidoItens = items.join(', ');

        const dataPedido = {
            nome: nome,
            pedidoItens: pedidoItens,
            observacao: observacao
        };

        fetch('/saveData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataPedido)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Erro ao salvar os dados.');
            }
        })
        .then(data => {
            console.log('Dados salvos com sucesso:', data);
            // Redireciona após o sucesso do fetch
            window.location.href = '../pedidoFinalizado';
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    });
});