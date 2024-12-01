document.addEventListener('DOMContentLoaded', function () {
  function obterDiaDaSemana() {
    const diasSemana = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];
    const dataAtual = new Date();
    const diaAtual = diasSemana[dataAtual.getDay()];
    return diaAtual;
  }

  function preencherLista(jsonData) {
    const checkboxesDiv = document.getElementById('checkboxes');
    const diaAtual = obterDiaDaSemana();
    const itemsDoDia = jsonData.find(item => item.hasOwnProperty(diaAtual));

    if (itemsDoDia) {
      const listaItens = document.createElement('ul'); // Cria uma lista não ordenada
      itemsDoDia[diaAtual].forEach(item => {
        const itemLista = document.createElement('li'); // Cria um item de lista
        itemLista.textContent = `${item}`; // Adiciona o item à lista
        listaItens.appendChild(itemLista); 
      });
      checkboxesDiv.appendChild(listaItens); 
    } else {
      const mensagemErro = document.createElement('p');
      mensagemErro.textContent = `Não há itens disponíveis para o dia ${diaAtual}.`;
      checkboxesDiv.appendChild(mensagemErro);
    }
  }

  function carregarJson() {
    fetch('data.json')
      .then(response => response.json())
      .then(data => preencherLista(data))
      .catch(error => console.error('Erro ao carregar JSON:', error));
  }

  carregarJson();
});