document.getElementById('dynamicForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Evita o envio do formulário

  // Coleta os valores dos campos de texto
  const nome = document.getElementById('nome').value;
  const observacao = document.getElementById('observacao').value;

  // Coleta todos os checkboxes dentro do div #checkboxes
  const checkboxes = document.querySelectorAll('#checkboxes input[type="checkbox"]:checked');
  let items = [];

  // Adiciona o valor dos checkboxes selecionados ao array items
  checkboxes.forEach(function(checkbox) {
    items.push(checkbox.value);
  });

  // Junta os itens em uma única string separada por vírgulas
  const selectedItems = items.join(', ');

  // Cria o objeto JSON com os dados do pedido
  const dataPedido = {
    nome: nome,
    selectedItems: selectedItems,
    observacao: observacao
  };

  // Envia os dados para o servidor usando fetch
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
  })
  .catch(error => {
    console.error('Erro:', error);
  });
});
