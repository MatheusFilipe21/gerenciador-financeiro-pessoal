var urlApiPessoas = "/api/pessoas";

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

  var modal = $(this);
  var inputNome = modal.find("#nomePessoa");
  var salvarBtn = modal.find("#modalSalvarAlteracoes");
  var nomePessoaErro = modal.find("#nomePessoaErro");

  switch (acao) {
    case "criar":
      prepararModalParaCriacao(modal, inputNome, salvarBtn, nomePessoaErro);
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
  <td class="align-middle">${novaPessoa.nome}</td>
</tr>
`;
}

async function criarPessoa(nome) {
  try {
    const response = await fetch(urlApiPessoas, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nome: nome }),
    });

    if (!response.ok) {
      throw new Error();
    }

    const id = response.headers.get("Location").split("/").pop();

    exibirNotificacao("Pessoa criada com sucesso!", false);

    return id;
  } catch (error) {
    exibirNotificacao("Erro ao criar a pessoa.", true);
  }
}

async function buscarPessoaPorId(id) {
  try {
    const response = await fetch(`${urlApiPessoas}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error();
    }

    const pessoa = await response.json();
    return pessoa;
  } catch (error) {
    exibirNotificacao("Erro ao recuperar a pessoa.", true);
  }
}
