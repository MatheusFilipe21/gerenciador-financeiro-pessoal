var urlApiPessoas = "/api/pessoas";

async function buscarTodasPessoas() {
    try {
      const response = await fetch(urlApiPessoas, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error();
      }
  
      const pessoas = await response.json();
      return pessoas;
    } catch (error) {
      exibirNotificacao("Erro ao recuperar as pessoas.", true);
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

async function atualizarPessoa(id, nome) {
  try {
    const response = await fetch(`${urlApiPessoas}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nome: nome }),
    });

    if (!response.ok) {
      throw new Error();
    }

    exibirNotificacao("Pessoa atualizada com sucesso!", false);
  } catch (error) {
    exibirNotificacao("Erro ao atualizar a pessoa.", true);
  }
}

async function excluirPessoa(id) {
  try {
    const response = await fetch(`${urlApiPessoas}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error();
    }

    exibirNotificacao("Pessoa excluída com sucesso!", false);
  } catch (error) {
    exibirNotificacao("Erro ao excluir a pessoa.", true);
  }
}

var urlApiContas = "/api/contas";

async function buscarTodasContas() {
  try {
    const response = await fetch(urlApiContas, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error();
    }

    const contas = await response.json();
    return contas;
  } catch (error) {
    exibirNotificacao("Erro ao recuperar as contas.", true);
  }
}

async function buscarContaPorId(id) {
  try {
    const response = await fetch(`${urlApiContas}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error();
    }

    const conta = await response.json();
    return conta;
  } catch (error) {
    exibirNotificacao("Erro ao recuperar a conta.", true);
  }
}

async function criarConta(nome, pessoaId) {
  try {
    const response = await fetch(urlApiContas, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nome: nome, pessoa: { id: pessoaId } }),
    });

    if (!response.ok) {
      throw new Error();
    }

    const id = response.headers.get("Location").split("/").pop();

    exibirNotificacao("Conta criada com sucesso!", false);

    return id;
  } catch (error) {
    exibirNotificacao("Erro ao criar a conta.", true);
  }
}
