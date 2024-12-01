//Trabalho do PEI

const express = require("express");
const XLSX = require("xlsx");
const multer = require("multer");
const bodyParser = require("body-parser");
const app = express();
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const upload = multer({ dest: "uploads/" });

app.use(bodyParser.json());
app.use(express.static("public"));



app.post('/saveData', async (req, res) => {
  const dataPedido = req.body;

  // Adicionar data e hora ao pedido
  const dataAtual = new Date();
  const dataHora = dataAtual.toISOString();
  dataPedido.dataHora = dataHora;

  try {
    // Ler o arquivo existente (se houver)
    let pedidos = [];
    try {
      const data = await readFile('public/datapedido.json', 'utf8');
      pedidos = JSON.parse(data);
    } catch (err) {
      // Se o arquivo não existir (ENOENT) ou tiver um formato inválido, inicializa como um array vazio
      if (err.code === 'ENOENT' || err.name === 'SyntaxError') {
        pedidos = [];
      } else {
        console.error('Erro ao ler o arquivo:', err);
        return res.status(500).send({ message: 'Erro ao ler o arquivo.' });
      }
    }

    // Filtrar pedidos com data atual
    pedidos = pedidos.filter(pedido => {
      const dataPedidoDate = new Date(pedido.dataHora);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0); // Zera hora, minuto, segundo e milissegundos
      dataPedidoDate.setHours(0, 0, 0, 0); // Zera hora, minuto, segundo e milissegundos
      return dataPedidoDate.getDate() === hoje.getDate() &&
             dataPedidoDate.getMonth() === hoje.getMonth() &&
             dataPedidoDate.getFullYear() === hoje.getFullYear();
    });

    // Adicionar o novo pedido
    pedidos.push(dataPedido);

    // Gravar os dados atualizados no arquivo
    await writeFile('public/datapedido.json', JSON.stringify(pedidos, null, 2), 'utf8');

    console.log('Dados salvos com sucesso.');
    res.status(200).send({ message: 'Dados salvos com sucesso.' });
  } catch (err) {
    console.error('Erro ao salvar os dados:', err);
    res.status(500).send({ message: 'Erro ao salvar os dados.' });
  }
});


// app.delete('/excluirPedido/:index', async (req, res) => {
//   try {
//     const index = parseInt(req.params.index);
//     const data = await readFile('public/datapedido.json', 'utf8');
//     const pedidos = JSON.parse(data);

//     if (!isNaN(index) && index >= 0 && index < pedidos.length) {
//       pedidos.splice(index, 1);
//       await writeFile('public/datapedido.json', JSON.stringify(pedidos, null, 2), 'utf8');
//       res.json({ message: 'Pedido excluído com sucesso!' });
//     } else {
//       res.status(400).json({ message: 'Índice de pedido inválido.' });
//     }
//   } catch (err) {
//     console.error('Erro ao excluir pedido no servidor:', err);
//     res.status(500).json({ message: 'Erro ao excluir pedido.' });
//   }
// });



// app.post("/upload01", upload.single("file"), (req, res) => {
//   const workbook = XLSX.readFile(req.file.path);
//   const sheetNameList = workbook.SheetNames;
//   const jsonOutput = XLSX.utils.sheet_to_json(
//     workbook.Sheets[sheetNameList[0]],
//   );

//   res.json(jsonOutput);
// });

app.post("/upload01", upload.single("file"), async (req, res) => {
  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheetNameList = workbook.SheetNames;
    const jsonData = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheetNameList[0]]
    );

    const novoCardapio = [
      {
        sabado: jsonData.map((item) => item.sabado).filter(Boolean),
        domingo: jsonData.map((item) => item.domingo).filter(Boolean),
        segunda: jsonData.map((item) => item.segunda).filter(Boolean),
        terca: jsonData.map((item) => item.terca).filter(Boolean),
        quarta: jsonData.map((item) => item.quarta).filter(Boolean),
        quinta: jsonData.map((item) => item.quinta).filter(Boolean),
        sexta: jsonData.map((item) => item.sexta).filter(Boolean),
      },
    ];

    const dataJsonPath = path.join(__dirname, "public", "data.json");
    await writeFile(dataJsonPath, JSON.stringify(novoCardapio, null, 2), "utf8");

    console.log("Cardápio atualizado com sucesso!");
    res.send("Cardápio atualizado com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar cardápio:", error);
    res.status(500).send("Erro ao atualizar cardápio.");
  }
});



// app.post("/upload03", upload.single("file"), (req, res) => {
//   const workbook = XLSX.readFile(req.file.path);
//   const sheetName = workbook.SheetNames[0];
//   const sheet = workbook.Sheets[sheetName];
//   const data = XLSX.utils.sheet_to_html(sheet);

//   res.send(data);
// });



// app.get("/teste01", (req, res) => {
//   res.sendFile(__dirname + "/teste01.html");
// });

// app.get("/teste02", (req, res) => {
//   res.sendFile(__dirname + "/teste02.html");
// });

// app.get("/teste03", (req, res) => {
//   res.sendFile(__dirname + "/teste03.html");
// });
// app.get("/teste04", (req, res) => {
//   res.sendFile(__dirname + "/teste04.html");
// });




app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});



//////////Parte cliente do Lorenzo
app.get("/parteCliente", (req, res) => {
  //Caminho do arquivo
  res.sendFile(__dirname + "/cliente.html");
});

app.get("/pedidoFinalizado", (req, res) => {
  //Caminho do arquivo
  res.sendFile(__dirname + "/clientePedidoFinalizado.html");
});
////////////



//Parte 1 de Gabriel e Lucas - Onde o funcionario vai fazer o login ficticio
app.get("/parteFuncionario", (req, res) => {
  //Caminho do arquivo
  res.sendFile(__dirname + "/funcionarioLogin.html");
});

//Parte 2 de Gabriel e Lucas - Onde o funcionario vai escolher 3 opçoes entre enviar um cardapio e o outro seria ver os pedidos dos cliente
app.get("/logado", (req, res) => {
  //Caminho do arquivo
  res.sendFile(__dirname + "/funcionarioLogado.html");
});

//Parte 3 de Gabriel e Lucas - ver o cardapio de hj e download para do cardapio da semana inteira
app.get("/cardapioHoje", (req, res) => {
  //Caminho do arquivo
  res.sendFile(__dirname + "/cardapioHoje.html");
});

//Parte 4 de Gabriel e Lucas - Enviar o cardapio excel para ser convertido em json (é uma maneira tembem de atualizar o cardapio)
app.get("/cardapioAtualizar", (req, res) => {
  //Caminho do arquivo
  res.sendFile(__dirname + "/cardapioAtualizar.html");
});

//Parte 5 de Gabriel e Lucas - Ver os pedidos dos clientes
app.get("/checkPedidos", (req, res) => {
  //Caminho do arquivo
  res.sendFile(__dirname + "/listaPedidos.html");
});

app.get("/index", (req, res) => {
  //Caminho do arquivo
  res.sendFile(__dirname + "/index.html");
});



// app.post('/removerPedido', async (req, res) => {
//   const index = req.body.index;

//   try {
//     // 1. Ler o arquivo datapedido.json
//     const data = await readFile('datapedido.json', 'utf8');
//     const pedidos = JSON.parse(data);

//     // 2. Remover o pedido do array na posição 'index'
//     if (index >= 0 && index < pedidos.length) {
//       pedidos.splice(index, 1); // Remove 1 elemento na posição 'index'
//     } else {
//       return res.status(400).json({ message: 'Índice inválido.' });
//     }

//     // 3. Salvar o arquivo datapedido.json atualizado
//     await writeFile('datapedido.json', JSON.stringify(pedidos, null, 2), 'utf8');

//     res.json({ message: 'Pedido removido com sucesso!' });
//   } catch (error) {
//     console.error('Erro ao remover o pedido:', error);
//     res.status(500).json({ message: 'Erro ao remover o pedido.' });
//   }
// });





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
