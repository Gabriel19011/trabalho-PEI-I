document.addEventListener("DOMContentLoaded", () => {
  const downloadLink = document.querySelector(".linkDownload");

  function carregarEConverterJSON() {
    fetch("data.json")
      .then((response) => response.json())
      .then((jsonData) => {
        const diasDaSemana = [
          "sabado",
          "domingo",
          "segunda",
          "terca",
          "quarta",
          "quinta",
          "sexta",
        ];

        // Função para obter o item do cardápio ou uma string vazia
        const obterItem = (dia, indice) => {
          const semana = jsonData.find((semana) => semana[dia] && semana[dia][indice]);
          return semana ? semana[dia][indice] || "" : "";
        };

        // Criar um array de arrays para representar a planilha
        const dadosPlanilha = [diasDaSemana]; // Cabeçalho
        for (let i = 0; i < 10; i++) {
          // Ajustar o número 10 conforme necessário para a quantidade máxima de itens
          dadosPlanilha.push(
            diasDaSemana.map((dia) => obterItem(dia, i))
          );
        }

        // Criar a planilha
        const worksheet = XLSX.utils.aoa_to_sheet(dadosPlanilha);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Cardapio");
        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });

        const blob = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = "cardapio.xlsx"; 
      })
      .catch((error) => console.error("Erro ao carregar JSON:", error));
  }

  downloadLink.addEventListener("click", carregarEConverterJSON);
});