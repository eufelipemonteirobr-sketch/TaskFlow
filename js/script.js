// 1. Elementos do DOM
const formulario = document.getElementById("form-tarefa");
const input = document.getElementById("input-tarefa");
const lista = document.getElementById("lista-tarefas");

// Elementos dos botões de filtro
const btnTodas = document.getElementById("filtro-todas");
const btnPendentes = document.getElementById("filtro-pendentes");
const btnConcluidas = document.getElementById("filtro-concluidas");

// Elemento do botão de limpar tudo
const btnLimpar = document.getElementById("limpar-tarefas");

// Elementos dos contadores
const spanTotal = document.getElementById("total-tarefas");
const spanPendentes = document.getElementById("tarefas-pendentes");
const spanConcluidas = document.getElementById("tarefas-concluidas");

// 2. Estado da Aplicação
let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
let filtroAtual = "todas";

// 3. Função para Salvar no LocalStorage
function salvarNoLocalStorage() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

// 4. Função de Filtro
function filtrarTarefas(tipo) {
  if (tipo === "pendentes") {
    return tarefas.filter((tarefa) => tarefa.concluida === false);
  }
  if (tipo === "concluidas") {
    return tarefas.filter((tarefa) => tarefa.concluida === true);
  }
  return tarefas;
}

// 5. Função: Atualizar Contadores
function atualizarContadores() {
  const total = tarefas.length;
  const concluidas = tarefas.filter(
    (tarefa) => tarefa.concluida === true,
  ).length;
  const pendentes = tarefas.filter(
    (tarefa) => tarefa.concluida === false,
  ).length;

  spanTotal.textContent = total;
  spanConcluidas.textContent = concluidas;
  spanPendentes.textContent = pendentes;
}

// 6. Função para Renderizar (Desenhar) as tarefas na tela
function renderizarTarefas() {
  lista.innerHTML = "";

  const tarefasFiltradas = filtrarTarefas(filtroAtual);

  if (tarefasFiltradas.length === 0) {
    const itemMensagem = document.createElement("li");

    if (filtroAtual === "pendentes") {
      itemMensagem.textContent = "Nenhuma tarefa pendente.";
    } else if (filtroAtual === "concluidas") {
      itemMensagem.textContent = "Nenhuma tarefa concluída.";
    } else {
      itemMensagem.textContent = "Você ainda não possui tarefas.";
    }

    itemMensagem.classList.add("mensagem-vazia");
    lista.appendChild(itemMensagem);
  } else {
    tarefasFiltradas.forEach((tarefa) => {
      const novaTarefa = document.createElement("li");

      const spanTexto = document.createElement("span");
      spanTexto.textContent = tarefa.texto;

      if (tarefa.concluida) {
        spanTexto.classList.add("concluida");
      }

      // Botão Concluir / Desfazer
      const botaoConcluir = document.createElement("button");
      botaoConcluir.textContent = tarefa.concluida ? "Desfazer" : "Concluir";
      botaoConcluir.addEventListener("click", () => {
        tarefa.concluida = !tarefa.concluida;
        salvarNoLocalStorage();
        renderizarTarefas();
      });

      // NOVO: 1. Criar o botão chamado botaoEditar
      const botaoEditar = document.createElement("button");
      botaoEditar.textContent = "Editar";

      // 2. Adicionar o evento click para a lógica de edição
      botaoEditar.addEventListener("click", () => {
        // Abre o prompt com o texto atual da tarefa pré-preenchido
        const novoTexto = prompt("Edite o texto da tarefa:", tarefa.texto);

        // Valida se o usuário não deixou vazio e não cancelou o prompt
        if (novoTexto !== null && novoTexto.trim() !== "") {
          // 3. O novo texto substituirá o anterior no array de dados
          tarefa.texto = novoTexto.trim();

          // 4. O LocalStorage será atualizado
          salvarNoLocalStorage();

          // 5. A lista será renderizada novamente
          renderizarTarefas();
        } else if (novoTexto !== null) {
          alert("O texto da tarefa não pode ficar vazio!");
        }
      });

      // Botão Excluir
      const botaoExcluir = document.createElement("button");
      botaoExcluir.textContent = "Excluir";
      botaoExcluir.addEventListener("click", () => {
        tarefas = tarefas.filter((t) => t.id !== tarefa.id);
        salvarNoLocalStorage();
        renderizarTarefas();
      });

      // Monta os elementos inserindo o botão Editar entre eles
      novaTarefa.appendChild(spanTexto);
      novaTarefa.appendChild(botaoConcluir);
      novaTarefa.appendChild(botaoEditar); // Inserido na interface
      novaTarefa.appendChild(botaoExcluir);
      lista.appendChild(novaTarefa);
    });
  }

  atualizarContadores();
}

// 7. Eventos dos Botões de Filtro
btnTodas.addEventListener("click", () => {
  filtroAtual = "todas";
  renderizarTarefas();
});

btnPendentes.addEventListener("click", () => {
  filtroAtual = "pendentes";
  renderizarTarefas();
});

btnConcluidas.addEventListener("click", () => {
  filtroAtual = "concluidas";
  renderizarTarefas();
});

// 8. Evento do Botão Limpar Todas as Tarefas
btnLimpar.addEventListener("click", () => {
  const confirmarExclusao = confirm(
    "Tem certeza que deseja excluir todas as tarefas? Esta ação não pode ser desfeita.",
  );

  if (confirmarExclusao) {
    tarefas = [];
    salvarNoLocalStorage();
    renderizarTarefas();
  }
});

// 9. Evento de Envio do Formulário (Cadastro)
formulario.addEventListener("submit", (event) => {
  event.preventDefault();

  const textoTarefa = input.value.trim();

  if (textoTarefa === "") {
    return alert("Digite uma tarefa!");
  }

  const novaTarefaObjeto = {
    id: Date.now(),
    texto: textoTarefa,
    concluida: false,
  };

  tarefas.push(novaTarefaObjeto);

  salvarNoLocalStorage();
  renderizarTarefas();

  input.value = "";
});

// 10. Executa ao carregar a página pela primeira vez
renderizarTarefas();
