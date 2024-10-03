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

$("#categoriaModal").on("show.bs.modal", async function (event) {
  var button = $(event.relatedTarget);
  var acao = button.data("acao");

  var modal = $(this);
  var salvarBtn = modal.find("#modalSalvarAlteracoes");

  switch (acao) {
    case "criar":
      prepararModalParaCriacao(modal, salvarBtn);
      break;
  }
});

function prepararModalParaCriacao(modal, salvarBtn) {
  var inputNome = modal.find("#nomeCategoria");
  var nomeCategoriaErro = modal.find("#nomeCategoriaErro");
  var inputsTipo = modal.find('input[name="tipo"]');
  
  modal.find(".modal-title").text("Criar Nova Categoria");
  inputNome.val("").prop("disabled", false);
  inputsTipo.each(function() {
    $(this).prop("disabled", false);
  });
  salvarBtn.text("Criar").removeClass("btn-danger").addClass("btn-primary");

  inputNome.off("input").on("input", function() {
    nomeCategoriaErro.hide();
  });

  salvarBtn.off("click").on("click", async function () {
    if (!validarNome(inputNome, nomeCategoriaErro)) {
      return;
    }

    var inputTipoSelecionado = modal.find('input[name="tipo"]:checked');

    const novoId = await criarCategoria(inputNome.val(), inputTipoSelecionado.val());

    if (novoId) {
      const novaCategoria = await buscarCategoriaPorId(novoId);

      $("table tbody").append(novaCategoriaHtml(novaCategoria));

      verificarListaDeCategorias();
    }

    modal.modal("hide");
  });
}

function validarNome(inputNome, nomePessoaErro) {
  if (!inputNome.val()) {
    nomePessoaErro.text("O nome não pode estar vazio.").show();

    return false;
  } else {
    nomePessoaErro.hide();

    return true;
  }
}

function novaCategoriaHtml(novaCategoria) {
  return `
<tr id="categoria_${novaCategoria.id}">
  <td class="align-middle">${novaCategoria.nome}</td>
  <td class="align-middle">${novaCategoria.tipo}</td>
</tr>
`;
}
