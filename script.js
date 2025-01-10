let conversas=[];
let participantes=[];
let campoUsuario=prompt("Qual o seu nome?");
let horaAtualEmBrasilia = obterHoraBrasilia();
let publicoouprivado="";
let destinatario="";
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
while (!campoUsuario) {
  campoUsuario = prompt("O nome não pode estar vazio. Por favor, insira seu nome:");
}
  entrarNaSala();

function mostrarUsuarios() {
  const usuarios = document.querySelector('.usuarios');
  usuarios.classList.toggle('escondido');
  usuarios.classList.toggle('mostrar'); 
  const escuro = document.querySelector('.escuro');
  escuro.classList.toggle('escondido');
  escuro.classList.toggle('mostrar'); 
  
}



function formaEnvio(p1){
  publicoouprivado = p1.children[1].innerHTML;
  console.log(publicoouprivado);
  const todosOsBotoes = document.querySelectorAll(".formadeenvio .b");

  todosOsBotoes.forEach(botao => {
    botao.classList.add("selecionador");
    botao.classList.add("mostrar");

  })

  const check = p1.querySelector(".b");
  if(check){
    check.classList.remove("selecionador");
    check.classList.remove("mostrar");
  }

}
function paraquemEnviar(p1){
  destinatario = p1.children[1].innerHTML;
  const todosOsBotoes = document.querySelectorAll(".quemenviar .b");
  todosOsBotoes.forEach(botao => {
    botao.classList.add("selecionador");
    botao.classList.add("mostrar");

  })

  const check = p1.querySelector(".b");
  if(check){
    check.classList.remove("selecionador");
    check.classList.remove("mostrar");
  }

}
function renderizarParticipantes(){
  const ul=document.querySelector(".quemenviar");
  ul.innerHTML="";

  for (let i=0;i<participantes.length;i++){
    ul.innerHTML+=`
    
    <li onclick="paraquemEnviar(this)">
  <ion-icon name="person-circle"></ion-icon> 
  <label class="a" for="reservado"> ${participantes[i].name} </label>
  <ion-icon class="b selecionador" name="checkmark-sharp"></ion-icon>
    </li>`;
  }
}

function buscarParticipantes(){
  axios.get("https://mock-api.driven.com.br/api/v6/uol/participants/c2ce79dc-5717-4d56-abe8-e4fa0244db39")
 .then(processarParticipantes)
 .catch();
 
 }
 function processarParticipantes(resposta){
   console.log(resposta)
   participantes=resposta.data;
   
   renderizarParticipantes();
 }

function renderizarConversas(){
  const ul=document.querySelector(".mensagens");
  ul.scrollIntoView();
  ul.innerHTML="";

  for (let i=0;i<conversas.length;i++){
    ul.innerHTML+=`
    <li>
  (${conversas[i].time}) ${conversas[i].from} para ${conversas[i].to}: ${conversas[i].text}
    </li>`;

    const ultimaMensagem = ul.lastChild;
    if(ultimaMensagem){
      ultimaMensagem.scrollIntoView({behavior: "smooth"})
    }

  }
}
function entrarNaSala(){
  const usuario = {name:campoUsuario};
  axios.post(`https://mock-api.driven.com.br/api/v6/uol/participants/c2ce79dc-5717-4d56-abe8-e4fa0244db39`,
    usuario)
    .then(()=> {
     console.log("Usuário entrou na sala");
       setInterval(manterStatusOnline, 3000); //Enviar status a cada 3 segundos
       buscarConversas();
      })
    .catch(error =>{
       if (error.response.status === 400) {
       campoUsuario = prompt("Nome já em uso. Por favor, escolha outro nome:");
       entrarNaSala();
       } else {
       console.error("Erro ao entrar na sala:", error);
       }
       });
       }
  
function manterStatusOnline() {
        const usuario = { name: campoUsuario };
        axios.post(`https://mock-api.driven.com.br/api/v6/uol/status/c2ce79dc-5717-4d56-abe8-e4fa0244db39`, usuario)
        .then(() =>{
        console.log("Status online mantido");
        console.log(`Status de ativo enviado para o usuário: ${campoUsuario}`);
        })
      .catch(error=> {console.error("Erro ao manter status online:", error); });
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


// Chamando a função e armazenando o resultado em uma variável


console.log(horaAtualEmBrasilia); // Exemplo: 15:30:00



function adicionarConversas(){
  
  const texto=document.querySelector(".mensagem").value;

  if(!texto){
    alert("A menssagem não pode ser vazia");
    return;
  }
  const novaConversa={
    from: todos,
    to: check,
    text: texto,
    type: publicoouprivado,
    time:horaAtualEmBrasilia
  }
  axios.post("https://mock-api.driven.com.br/api/v6/uol/messages/c2ce79dc-5717-4d56-abe8-e4fa0244db39", novaConversa)
  
  .then(receberResposta)
  .catch(mostrarErro);
  
}

function receberResposta(resposta){
  console.log(resposta);
  alert(`A menssagem foi adicionada com sucesso`)
  
  document.querySelector(".mensagem").value="";
  
  buscarConversas();
}

function mostrarErro(){
  console.error("Error",error)
  alert("Ocorreu um erro, tente mais tarde!")
}
//setTimeout(function() {
//  window.location.reload(false);
//}, 5000);
setInterval(buscarConversas, 5000);


setInterval(buscarParticipantes,5000);