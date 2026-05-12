async function carregarCultura(cultura) {
  const resultado = document.getElementById("resultado");

  resultado.innerHTML = "<p>Carregando informações...</p>";

  try {
    const resposta = await fetch(`dados/${cultura}.json`);

    if (!resposta.ok) {
      throw new Error("Arquivo JSON não encontrado.");
    }

    const dados = await resposta.json();

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
