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

$("#pessoaModal").on("show.bs.modal", async function (event) {
  var button = $(event.relatedTarget);
  var acao = button.data("acao");
  var id = button.data("id");
  var nome = button.data("nome");

  var modal = $(this);
  var inputNome = modal.find("#nomePessoa");
  var salvarBtn = modal.find("#modalSalvarAlteracoes");
  var nomePessoaErro = modal.find("#nomePessoaErro");

  switch (acao) {
    case "criar":
      prepararModalParaCriacao(modal, inputNome, salvarBtn, nomePessoaErro);
      break;
    case "editar":
      prepararModalParaEdicao(modal, inputNome, salvarBtn,nomePessoaErro, id, nome);
      break;
    case "excluir":
      prepararModalParaExclusao(modal, inputNome, salvarBtn, id, nome);
      break;
  }
});

function prepararModalParaCriacao(modal, inputNome, salvarBtn, nomePessoaErro) {
  modal.find(".modal-title").text("Criar Nova Pessoa");
  inputNome.val("").prop("disabled", false);
  salvarBtn.text("Criar").removeClass("btn-danger").addClass("btn-primary");

  inputNome.off("input").on("input", function() {
    nomePessoaErro.hide();
  });

  salvarBtn.off("click").on("click", async function () {
    if (!validarNome(inputNome, nomePessoaErro)) {
      return;
    }

    const novoId = await criarPessoa(inputNome.val());

    if (novoId) {
      const novaPessoa = await buscarPessoaPorId(novoId);

      $("table tbody").append(novaPessoaHtml(novaPessoa));

      verificarListaDePessoas();
    }

    modal.modal("hide");
  });
}

function prepararModalParaEdicao(modal, inputNome, salvarBtn, nomePessoaErro, id, nome) {
  modal.find(".modal-title").text("Editar Pessoa");
  inputNome.val(nome).prop("disabled", false);
  salvarBtn
    .text("Salvar alterações")
    .removeClass("btn-danger")
    .addClass("btn-primary");

    inputNome.off("input").on("input", function() {
      nomePessoaErro.hide();
    });

  salvarBtn.off("click").on("click", async function () {
    if (!validarNome(inputNome, nomePessoaErro)) {
      return;
    }

    const novoNome = inputNome.val();

    await atualizarPessoa(id, novoNome);

    $(`#pessoa_${id} td:first`).text(novoNome);

    $(`#pessoa_${id} [data-acao="editar"]`).data("nome", novoNome);
    $(`#pessoa_${id} [data-acao="excluir"]`).data("nome", novoNome);

    modal.modal("hide");
  });
}

function prepararModalParaExclusao(modal, inputNome, salvarBtn, id, nome) {
  modal.find(".modal-title").text("Excluir Pessoa");
  inputNome.val(nome).prop("disabled", true);
  salvarBtn.text("Excluir").removeClass("btn-primary").addClass("btn-danger");

  salvarBtn.off("click").on("click", async function () {
    await excluirPessoa(id);

    $(`#pessoa_${id}`).remove();

    verificarListaDePessoas();

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

function novaPessoaHtml(novaPessoa) {
  return `
<tr id="pessoa_${novaPessoa.id}">
  <td>${novaPessoa.nome}</td>

  <td class="text-center">
    <button class="btn btn-sm btn-warning" data-bs-toggle="modal" data-bs-target="#pessoaModal" data-id="${novaPessoa.id}" data-nome="${novaPessoa.nome}" data-acao="editar">
      <i class="fa-solid fa-pen text-light"></i>
    </button>
    
    <button class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#pessoaModal" data-id="${novaPessoa.id}" data-nome="${novaPessoa.nome}" data-acao="excluir">
      <i class="fa-solid fa-trash"></i>
    </button>
  </td>
</tr>
`;
}
