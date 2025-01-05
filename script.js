let conversas=[];

function mostrarUsuarios() {
  const usuarios = document.querySelector('.usuarios');
  usuarios.classList.toggle('escondido');
  usuarios.classList.toggle('mostrar'); // Adiciona a classe 'mostrar' para efeitos visuais (opcional)
}

function renderizarConversas(){
  const ul=document.querySelector(".mensagens");
  ul.innerHTML="";

  for (let i=0;i<conversas.length;i++){
    ul.innerHTML+=`
    <li>
  (${horaAtualEmBrasilia}) ${conversas[i].from} para ${conversas[i].to}: ${conversas[i].text}
    </li>`;
  }
}

function buscarConversas(){
 const promessas=axios.get("https://mock-api.driven.com.br/api/v6/uol/messages/c2ce79dc-5717-4d56-abe8-e4fa0244db39");
promessas.then(processarListaConversa);
promessas.catch(mostrarErro)

}
function processarListaConversa(resposta){
  console.log(resposta)
  conversas=resposta.data;
  
  renderizarConversas();
}
function obterHoraBrasilia() {
  const options = {
    timeZone: 'America/Sao_Paulo',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  };
  const horaBrasilia = new Date().toLocaleString('pt-BR', options);
  return horaBrasilia;
}

// Chamando a função e armazenando o resultado em uma variável
const horaAtualEmBrasilia = obterHoraBrasilia();

console.log(horaAtualEmBrasilia); // Exemplo: 15:30:00
const campoUsuario=prompt("Qual o seu nome?");

//const entrarSala={
    //from: campoUsuario,
    //text: "entrou na sala...",
    //time: horaAtualEmBrasilia
  //}
  //console.log(entrarSala);


//const saiuSala={
    //from: campoUsuario,
    //text: "saiu da sala...",
    //time: horaAtualEmBrasilia
 // }
 // console.log(saiuSala);

function adicionarConversas(){
  
  const texto=document.querySelector(".mensagem");
  const novaConversa={
    from: campoUsuario,
    to: "nome do destinatário (Todos se não for um específico)",
    text: texto.value,
    type: "message"  // ou "private_message"
  }
  const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages/c2ce79dc-5717-4d56-abe8-e4fa0244db39", novaConversa);
  promessa.then(receberResposta);
  promessa.catch(mostrarErro);
  
}

function receberResposta(resposta){
  console.log(resposta);
  alert(`A ${resposta.data.from} foi adicionada com sucesso`)
  //const campoUsuario="adailson";
  //const campoDestinarário="Alana";
  //const campohorário=10;
  document.querySelector(".mensagem").value="";
  buscarConversas();
}

function mostrarErro(){
  alert("Ocorreu um erro, tente mais tarde!")
}

setInterval(buscarConversas,5000);


