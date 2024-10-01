$(document).ready(function () {
  verificarListaDeContas();
});

function verificarListaDeContas() {
  const tabelaCorpo = $("table tbody");
  const linhas = tabelaCorpo.find("tr");

  if (linhas.length === 0) {
    tabelaCorpo.append(`
      <tr>
        <td colspan="3" class="text-center">Nenhuma conta cadastrada.</td>
      </tr>
    `);
  } else {
    tabelaCorpo.find("tr:contains('Nenhuma conta cadastrada.')").remove();
  }
}
