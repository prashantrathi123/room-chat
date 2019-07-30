var express=require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);
const PORT = process.env.PORT || 5000;



app.use(express.static(__dirname+'/views'));
app.get('/', function(req, res) {
   res.render("index.ejs");
});
usersid = [];
usernm=[];
var people=[];
var room=[];
io.on('connection', function(socket) {
   console.log('A user connected');
   socket.on('setUsername', function(data) {
      console.log(data);
      socket.join(data.id);
     
          people[data.name]=socket.id;
          room.push({data:data,socket:socket.id});console.log(room[0].data);
         console.log(socket.id);
         var person=[];
       for(var i=0;i<room.length;i++)
      {  if(room[i].data.id==data.id)
        {person.push(room[i].data.name);}
     }console.log(person.length);
         socket.emit('userSet', {username: data});
      io.sockets.in(data.id).emit('person',person);
   });
   
     socket.on('disconnect',function(){
         console.log('disconnect' +socket.id);var w;
           for(var i=0;i<room.length;i++){if(room[i].socket==socket.id){w=room[i].data.id;room.splice(i,1)}}
         
          var person=[];
       for(var i=0;i<room.length;i++)
      {  if(room[i].data.id==w)
        {person.push(room[i].data.name);}
     }console.log(person.length);
       console.log(w);
       io.sockets.in(w).emit('person',person);
      });
   socket.on('msg', function(data) {
      //Send message to everyone
      var reciever=data.reciever;
      var sender=data.sender;
       console.log("rec"+people[reciever]);
       console.log("sender:"+people[sender]);
       
      io.sockets.in(reciever).emit('newmsg',{data:data});
   })
});


http.listen(PORT, function() {
   console.log('listening on localhost:3000'+PORT);});