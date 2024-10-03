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
  var id = button.data("id");
  var nome = button.data("nome");
  var tipo = button.data("tipo");

  var modal = $(this);
  var salvarBtn = modal.find("#modalSalvarAlteracoes");

  switch (acao) {
    case "criar":
      prepararModalParaCriacao(modal, salvarBtn);
      break;
    case "editar":
      prepararModalParaEdicao(modal, salvarBtn, id, nome, tipo);
      break;
  }
});

function prepararModalParaCriacao(modal, salvarBtn) {
  var inputNome = modal.find("#nomeCategoria");
  var nomeCategoriaErro = modal.find("#nomeCategoriaErro");
  var inputsTipo = modal.find('input[name="tipo"]');
  
  modal.find(".modal-title").text("Criar Nova Categoria");
  inputNome.val("").prop("disabled", false);
  inputsTipo.each(function(index) {
    $(this).prop("disabled", false);

    if (index === 0) {
      $(this).prop("checked", true);
    } else {
      $(this).prop("checked", false);
    }
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

function prepararModalParaEdicao(modal, salvarBtn, id, nome, tipo) {
  var inputNome = modal.find("#nomeCategoria");
  var nomeCategoriaErro = modal.find("#nomeCategoriaErro");
  var inputsTipo = modal.find('input[name="tipo"]');
  
  modal.find(".modal-title").text("Editar Categoria");
  inputNome.val(nome).prop("disabled", false);
  inputsTipo.each(function() {
    $(this).prop("checked", $(this).val() === tipo);
    $(this).prop("disabled", false);
  });
  salvarBtn
    .text("Salvar alterações")
    .removeClass("btn-danger")
    .addClass("btn-primary");

  inputNome.off("input").on("input", function() {
    nomeCategoriaErro.hide();
  });

  salvarBtn.off("click").on("click", async function () {
    if (!validarNome(inputNome, nomeCategoriaErro)) {
      return;
    }

    const novoNome = inputNome.val();
    const novoTipo = modal.find('input[name="tipo"]:checked').val();

    await atualizarCategoria(id, novoNome, novoTipo);

    $(`#categoria_${id} td:first`).text(novoNome);
    $(`#categoria_${id} td:nth-child(2)`).text(novoTipo);

    $(`#categoria_${id} [data-acao="editar"]`).data("nome", novoNome);
    $(`#categoria_${id} [data-acao="editar"]`).data("tipo", novoTipo);

    modal.modal("hide");
  });
}

function validarNome(inputNome, nomeCategoriaErro) {
  if (!inputNome.val()) {
    nomeCategoriaErro.text("O nome não pode estar vazio.").show();

    return false;
  } else {
    nomeCategoriaErro.hide();

    return true;
  }
}

function novaCategoriaHtml(novaCategoria) {
  return `
<tr id="categoria_${novaCategoria.id}">
  <td class="align-middle">${novaCategoria.nome}</td>

  <td class="align-middle">${novaCategoria.tipo}</td>

  <td class="text-center">
    <button
      class="btn btn-sm mb-1 btn-warning"
      data-bs-toggle="modal"
      data-bs-target="#categoriaModal"
      data-id="${novaCategoria.id}"
      data-nome="${novaCategoria.nome}"
      data-tipo="${novaCategoria.tipo}"
      data-acao="editar"
    >
      <i class="fa-solid fa-pen text-light"></i>
    </button>
  </td>
</tr>
`;
}
