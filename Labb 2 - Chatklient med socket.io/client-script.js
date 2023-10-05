'use strict';

const socket = io(); 

//användare ansluter vi socket, client-script.js är länkat i index.html. 
//nu är vi i klientsidan på index.html

window.addEventListener('load', ()=>{  //lägger en load lyssnare på index.html
   document.querySelector('#btn').addEventListener('click', klickad);
   //hämtar ut knapp och lägger lyssnare vid klick 
});

function klickad(e){
 e.preventDefault(); 

 let msg = document.querySelector('#msg').value;  //hämtar ut värdet i text elementet

 try{
    if(msg.length < 3) throw new Error('Meddelande för kort'); 

    else{ //emit till app.js socket, texten som skrivits skickats över till servern
        socket.emit('meddelande', { //'meddelande, samma som i app.js (socket.on('meddelande', (data) =>{)
            messageID: msg
        });
    }
    document.querySelector('#msg').value = null; //rensar textrutan när knappen är tryckt 
 }catch(e){
    console.log(e); 
 }
}

//från io.emit('message' ,{ i app.js kan vi skicka med info som cookiestring och datum. skickar med data.
socket.on('message', (data) =>{
    console.log('Här ska DOM:en ändras');

    let chattrutan = document.querySelector('#flow');
    let chattDiv = document.createElement('div'); 
    chattrutan.appendChild(chattDiv);
    
    let chattDatum = document.createElement('p');
    let datumTxt = document.createTextNode(data.datum); 
    chattDatum.appendChild(datumTxt); 
    chattDiv.appendChild(chattDatum); 

    let chattnamn = document.createElement('p'); 
    let namnTxt = document.createTextNode(data.namn); 
    chattnamn.appendChild(namnTxt); 
    chattDiv.appendChild(chattnamn); 

    let chattMsg = document.createElement('p'); 
    let msgText = document.createTextNode(data.nyttMsg); 
    chattMsg.appendChild(msgText); 
    chattDiv.appendChild(chattMsg); 

}); 





  