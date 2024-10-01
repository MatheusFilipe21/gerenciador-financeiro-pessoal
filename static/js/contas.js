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

$("#contaModal").on("show.bs.modal", async function (event) {
  var button = $(event.relatedTarget);
  var acao = button.data("acao");
  var id = button.data("id");
  var nome = button.data("nome");
  var pessoaId = button.data("pessoa-id");

  var modal = $(this);
  var salvarBtn = modal.find("#modalSalvarAlteracoes");
  var pessoaSelect = modal.find("#pessoaSelect");

  await carregarPessoas(pessoaSelect, pessoaId);

  switch (acao) {
    case "criar":
      prepararModalParaCriacao(modal, salvarBtn, pessoaSelect);
      break;
    case "editar":
      prepararModalParaEdicao(modal, salvarBtn, id, nome, pessoaSelect);
      break;
    case "excluir":
      prepararModalParaExclusao(modal, salvarBtn, id, nome, pessoaSelect);
      break;
  }
});

async function carregarPessoas(pessoaSelect, pessoaId = null) {
  try {
    const pessoas = await buscarTodasPessoas();

    pessoaSelect.empty();
    pessoaSelect.append('<option selected disabled>Selecione uma pessoa</option>');

    pessoas.forEach(pessoa => {
      const option = $('<option>').val(pessoa.id).text(pessoa.nome);

      if (pessoaId && pessoa.id == pessoaId) {
        option.prop('selected', true);
      }

      pessoaSelect.append(option);
    });
  } catch (error) {
    exibirNotificacao("Erro ao carregar as pessoas.", true);
  }
}

function prepararModalParaCriacao(modal, salvarBtn, pessoaSelect) {
  var inputNome = modal.find("#nomeConta");
  var nomeContaErro = modal.find("#nomeContaErro");
  var pessoaSelectErro = modal.find("#pessoaSelectErro");
  
  modal.find(".modal-title").text("Criar Nova Conta");
  inputNome.val("").prop("disabled", false);
  pessoaSelect.val("Selecione uma pessoa").prop("disabled", false);
  salvarBtn.text("Criar").removeClass("btn-danger").addClass("btn-primary");

  inputNome.off("input").on("input", function() {
    nomeContaErro.hide();
  });

  pessoaSelect.off("change").on("change", function() {
    pessoaSelectErro.hide();
  });

  salvarBtn.off("click").on("click", async function () {
    if (!validar(inputNome, nomeContaErro, pessoaSelect, pessoaSelectErro)) {
      return;
    }

    const novoId = await criarConta(inputNome.val(), pessoaSelect.val());

    if (novoId) {
      const novaConta = await buscarContaPorId(novoId);

      $("table tbody").append(novaContaHtml(novaConta));

      verificarListaDeContas();
    }

    modal.modal("hide");
  });
}

function prepararModalParaEdicao(modal, salvarBtn, id, nome, pessoaSelect) {
  var inputNome = modal.find("#nomeConta");
  var nomeContaErro = modal.find("#nomeContaErro");
  var pessoaSelectErro = modal.find("#pessoaSelectErro");
  
  modal.find(".modal-title").text("Editar Conta");
  inputNome.val(nome).prop("disabled", false);
  pessoaSelect.prop("disabled", false);
  salvarBtn
    .text("Salvar alterações")
    .removeClass("btn-danger")
    .addClass("btn-primary");

  inputNome.off("input").on("input", function() {
    nomeContaErro.hide();
  });

  pessoaSelect.off("change").on("change", function() {
    pessoaSelectErro.hide();
  });

  salvarBtn.off("click").on("click", async function () {
    if (!validar(inputNome, nomeContaErro, pessoaSelect, pessoaSelectErro)) {
      return;
    }

    const novoNome = inputNome.val();
    const pessoaId = pessoaSelect.val();

    await atualizarConta(id, novoNome, pessoaId);

    $(`#conta_${id} td:first`).text(novoNome);
    $(`#conta_${id} td:nth-child(2)`).text(pessoaSelect.find("option:selected").text());

    $(`#conta_${id} [data-acao="editar"]`).data("nome", novoNome);
    $(`#conta_${id} [data-acao="editar"]`).data("pessoa-id", pessoaId);
    $(`#conta_${id} [data-acao="excluir"]`).data("nome", novoNome);
    $(`#conta_${id} [data-acao="excluir"]`).data("pessoa-id", pessoaId);

    modal.modal("hide");
  });
}

function prepararModalParaExclusao(modal, salvarBtn, id, nome, pessoaSelect) {
  var inputNome = modal.find("#nomeConta");
  
  modal.find(".modal-title").text("Excluir Conta");
  inputNome.val(nome).prop("disabled", true);
  pessoaSelect.prop("disabled", true);
  salvarBtn.text("Excluir").removeClass("btn-primary").addClass("btn-danger");

  salvarBtn.off("click").on("click", async function () {
    await excluirConta(id);

    $(`#conta_${id}`).remove();

    verificarListaDeContas();

    modal.modal("hide");
  });
}

function validar(inputNome, nomeContaErro, pessoaSelect, pessoaSelectErro) {
  let isValido = true;

  if (!inputNome.val()) {
    nomeContaErro.text("O nome não pode estar vazio.").show();
    isValido = false;
  } else {
    nomeContaErro.hide();
  }

  if (!pessoaSelect.val() || pessoaSelect.val() === "Selecione uma pessoa") {
    pessoaSelectErro.text("Você deve selecionar uma pessoa.").show();
    isValido = false;
  } else {
    pessoaSelectErro.hide();
  }

  return isValido;
}

function novaContaHtml(novaConta) {
  return `
<tr id="conta_${novaConta.id}">
  <td class="align-middle">${novaConta.nome}</td>

  <td class="align-middle">${novaConta.pessoa.nome}</td>

  <td class="text-center">
    <button
      class="btn btn-sm mb-1 btn-warning"
      data-bs-toggle="modal"
      data-bs-target="#contaModal"
      data-id="${novaConta.id}"
      data-nome="${novaConta.nome}"
      data-pessoa-id="${novaConta.pessoa.id}"
      data-acao="editar"
    >
      <i class="fa-solid fa-pen text-light"></i>
    </button>

    <button
      class="btn btn-sm mb-1 btn-danger"
      data-bs-toggle="modal"
      data-bs-target="#contaModal"
      data-id="${novaConta.id}"
      data-nome="${novaConta.nome}"
      data-pessoa-id="${novaConta.pessoa.id}"
      data-acao="excluir"
    >
      <i class="fa-solid fa-trash"></i>
    </button>
  </td>
</tr>
`;
}
