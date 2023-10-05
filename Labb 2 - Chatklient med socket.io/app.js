'use strict';

const express = require('express'); 
const app = express(); 
const http = require('http').createServer(app); 
const jsdom = require('jsdom'); 
const fs = require('fs'); 
const cookieParser = require('cookie-parser'); 
const io = require('socket.io')(http);
const cookie = require('cookie'); //används för cookieObjekt vaiablen. för att parsa kakan 

//middlewear 
app.use(cookieParser());
app.use(express.urlencoded( {extended : true} ));
/*express.urlencoded() is a method inbuilt in express to recognize the incoming Request Object as strings or arrays. 
This method is called as a middleware in your application using the code: app.use(express.urlencoded()); 
Behövs för att köra post och put requests */

//startar upp en http server som lyssnar på port 302
http.listen(302, function(){
    console.log('servern är igång'); 
});

app.get('/', function(req, res){
    //skapar en variabel som innehåller kakan nicknameCookie för att sedan kolla om kakan finns eller inte 
    let nicknameCookie = req.cookies.nicknameCookie; 

    if(nicknameCookie == null){
        console.log('kakan finns ej'); 
        res.sendFile(__dirname +'/loggain.html'); //om inte, skicka till loggain sidan
    }else {
        console.log('Kakan finns'); 
        res.sendFile(__dirname + '/index.html'); //om finns, skickar till chattsidan
    }
});

app.get('/loggain', function(req, res){ //get anrop mot /loggain som läser in filen loggain.html
    res.sendFile(__dirname + '/loggain.html'); 
});

app.post('/', function(req, res){
    console.log('Post anrop mot loggain'); 

    fs.readFile(__dirname + '/loggain.html', function(err, data){
        console.log(req.body.nickname); 
        res.cookie('nicknameCookie', req.body.nickname, {maxAge : 1000 * 60 * 60}); 
        //kaka nicknameCookie skapas som innehåller värdet från html elementent med namn nickname i loggain.html 

            try{
                //kontrollerar att namn är längre än 3 tecken 
                if(req.body.nickname.length < 3) throw new Error('nickname är för kort'); 
                res.redirect('/'); //om inte, skicka tillbaka app.get '/', där kontrolleras om kakan finns eller inte 

            }catch(error){
                console.log(error); 
            }       
    });  
});

//middlewere som gör att vi kommer åt innehållet i filen client.script.js
app.use('/client-script.js', express.static(__dirname + '/client-script.js'));

//io.on anropas för en användare ansluter via socket, när användare ansluter mot port 302
io.on('connection', (socket) => {
    console.log('Ny användare anslöt via socket...');

    let cookieString = socket.handshake.headers.cookie; //via cookie modulen (const cookie = require('cookie'); )hämtas cookiesträngen
    let cookieObject = cookie.parse(cookieString); //cookiesträngen parsars sedan via cookie.parse
    let date = new Date().toLocaleDateString('sv-SE'); //datum variabel som innehåller dagens datum


    //Tar emot data från client-script socket (socket.emit('meddelande',)
    socket.on('meddelande', (data) =>{

    let msg = data.messageID;  //hämtar ut data från client-script socket. hämtar text från textelementent

    //io.emit skickar info till client-script så vi kan hämta data för att bygga DOM:en i (socket.on('message', (data) =>{)
    io.emit('message' ,{
        'datum': date,
        'nyttMsg': msg,
        'namn': cookieObject.nicknameCookie,
        //namnen används när vi bygger DOM:en för att hämta datan (data.nyttMsg)

    });

});

});
