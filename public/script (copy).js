document.addEventListener('DOMContentLoaded', function () {
    // Função para identificar o dia da semana
    function obterDiaDaSemana() {
        const diasSemana = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];
        const dataAtual = new Date();
        const diaAtual = diasSemana[dataAtual.getDay()];
        return diaAtual;
    }

    // Função para preencher o formulário com os itens do JSON
    function preencherFormulario(jsonData) {
        const checkboxesDiv = document.getElementById('checkboxes');
        const diaAtual = obterDiaDaSemana();

        // Verificar se o dia atual está presente no JSON
        const itemsDoDia = jsonData.find(item => item.hasOwnProperty(diaAtual));

        if (itemsDoDia) {
            // Adicionar checkboxes para os itens do dia atual
            itemsDoDia[diaAtual].forEach(item => {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = item;
                checkbox.name = item;
                checkbox.value = item;
                //Classe para input
                checkbox.classList.add('form-check-input');

                const label = document.createElement('label');
                label.htmlFor = checkbox.id;
                label.textContent = item;
                //Classe para label
                label.classList.add('form-check-label');

                checkboxesDiv.classList.add('form-check');
                checkboxesDiv.appendChild(checkbox);
                checkboxesDiv.appendChild(label);
            });
        } else {
            // Se o dia atual não estiver presente no JSON
            const mensagemErro = document.createElement('p');
            mensagemErro.textContent = `Não há itens disponíveis para o dia ${diaAtual}.`;
            checkboxesDiv.appendChild(mensagemErro);
        }
    }

    // Função para carregar o JSON
    function carregarJson() {
        fetch('data.json')
            .then(response => response.json())
            .then(data => preencherFormulario(data))
            .catch(error => console.error('Erro ao carregar JSON:', error));
    }

    // Chamamos a função para carregar o JSON assim que o DOM estiver pronto
    carregarJson();
});