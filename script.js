// Variáveis globais usadas pela parte da IA
// Elas guardam qual cultura foi selecionada e os dados carregados do arquivo JSON.
// Assim, quando o usuário fizer uma pergunta para a IA, o sistema saberá
// sobre qual cultura ele está perguntando.
let culturaAtual = null;
let dadosCulturaAtual = null;

async function carregarCultura(cultura) {
  const resultado = document.getElementById("resultado");

  resultado.innerHTML = "<p>Carregando informações...</p>";

  try {
    const resposta = await fetch(`dados/${cultura}.json`);

    if (!resposta.ok) {
      throw new Error("Arquivo JSON não encontrado.");
    }

    const dados = await resposta.json();

    // Parte importante para a IA:
    // Aqui guardamos a cultura selecionada e todo o conteúdo do JSON.
    // Esses dados serão enviados junto com a pergunta do usuário para o backend,
    // permitindo que a IA responda com base na cultura escolhida.
    culturaAtual = cultura;
    dadosCulturaAtual = dados;

    mostrarInformacoes(dados);

  } catch (erro) {
    resultado.innerHTML = `
      <p class="erro">
        Erro ao carregar as informações da cultura.
      </p>
      <p>
        Verifique se o arquivo JSON existe dentro da pasta dados.
      </p>
    `;

    console.error(erro);
  }
}

function mostrarInformacoes(dados) {
  const resultado = document.getElementById("resultado");

  resultado.innerHTML = `
    <h2>${dados.cultura}</h2>

    <p><strong>Descrição:</strong> ${dados.descricao}</p>

    <h3>Clima ideal</h3>
    <p>${dados.climaIdeal}</p>

    <h3>Tipo de solo recomendado</h3>
    <p>${dados.soloRecomendado}</p>

    <h3>Época de plantio</h3>
    <p>${dados.epocaPlantio}</p>

    <h3>Dicas de manejo</h3>
    <ul>
      ${dados.dicasManejo.map(dica => `<li>${dica}</li>`).join("")}
    </ul>

    <h3>Principais cuidados</h3>
    <ul>
      ${dados.cuidados.map(cuidado => `<li>${cuidado}</li>`).join("")}
    </ul>

    <h3>Sugestões gerais</h3>
    <ul>
      ${dados.sugestoes.map(sugestao => `<li>${sugestao}</li>`).join("")}
    </ul>
  `;
}

// Função responsável por consultar a IA.
// Ela pega a chave temporária digitada pelo usuário,
// a pergunta feita e os dados da cultura selecionada.
// Depois envia tudo para o backend na rota /api/orientar.
//
// Importante:
// A chave não é salva no navegador.
// Depois da consulta, o campo da chave é limpo.
async function consultarIa() {
  const chaveIa = document.getElementById("chaveIa").value.trim();
  const perguntaIa = document.getElementById("perguntaIa").value.trim();
  const respostaIa = document.getElementById("respostaIa");

  respostaIa.classList.remove("erro");

  if (!dadosCulturaAtual) {
    respostaIa.classList.add("erro");
    respostaIa.textContent = "Selecione uma cultura antes de consultar a IA.";
    return;
  }

  if (!chaveIa) {
    respostaIa.classList.add("erro");
    respostaIa.textContent = "Digite uma chave temporária de IA.";
    return;
  }

  if (!perguntaIa) {
    respostaIa.classList.add("erro");
    respostaIa.textContent = "Digite uma pergunta para a IA.";
    return;
  }

  respostaIa.textContent = "Consultando a IA...";

  try {
    const resposta = await fetch("/api/orientar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chaveIa: chaveIa,
        cultura: culturaAtual,
        dadosCultura: dadosCulturaAtual,
        pergunta: perguntaIa
      })
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(resultado.erro || "Erro ao consultar a IA.");
    }

    respostaIa.textContent = resultado.resposta;

    // Limpa a chave depois da consulta.
    // Isso ajuda a evitar que ela fique visível ou armazenada no campo.
    document.getElementById("chaveIa").value = "";

  } catch (erro) {
    respostaIa.classList.add("erro");
    respostaIa.textContent = "Erro: " + erro.message;
  }
}
