$(document).ready(function () {
  verificarListaDePessoas();
});

function verificarListaDePessoas() {
  const tabelaCorpo = $("table tbody");
  const linhas = tabelaCorpo.find("tr");

  if (linhas.length === 0) {
    tabelaCorpo.append(`
      <tr>
        <td colspan="2" class="text-center">Nenhuma pessoa cadastrada.</td>
      </tr>
    `);
  } else {
    tabelaCorpo.find("tr:contains('Nenhuma pessoa cadastrada.')").remove();
  }
}
