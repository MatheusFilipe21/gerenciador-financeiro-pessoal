$(document).ready(function () {
    verificarListaDeCategorias();
  });
  function verificarListaDeCategorias() {
    const tabelaCorpo = $("table tbody");
    const linhas = tabelaCorpo.find("tr");
    if (linhas.length === 0) {
      tabelaCorpo.append(`
        <tr>
          <td colspan="3" class="text-center">Nenhuma categoria cadastrada.</td>
        </tr>
      `);
    } else {
      tabelaCorpo.find("tr:contains('Nenhuma categoria cadastrada.')").remove();
    }
  }
