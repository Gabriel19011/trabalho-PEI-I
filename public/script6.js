// Buscar o JSON e converter em objeto
fetch('datapedido.json')
  .then(response => response.json())
  .then(pedidos => {
    // Ordenar os pedidos por dataHora
    pedidos.sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora));

    // Criar o HTML
    const listaPedidos = document.getElementById('lista-pedidos');

    // Exibir os pedidos
    pedidos.forEach(pedido => {
      const itemPedido = document.createElement('li');
      itemPedido.textContent = `**Nome:** ${pedido.nome} | **Pedido:** ${pedido.pedidoItens} | **Observação:** ${pedido.observacao} | **Data/Hora:** ${pedido.dataHora}`;
      listaPedidos.appendChild(itemPedido);
    });
  });