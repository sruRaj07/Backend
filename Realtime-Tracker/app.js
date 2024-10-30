
const express = require("express");
const app = express();
app.use(express.static('public')); // Ensure 'public' has script.js and other assets
const path = require("path");
const http = require("http"); // we need http server to run socket.io

const socketio = require("socket.io");

const server = http.createServer(app);//creating "app" server

const io = socketio(server); // to get all the features

app.set("view engine","ejs"); // view engine setup is done 
app.set(express.static(path.join(__dirname, "public"))); // public folder set up is done


// handle the unique connection reuest
io.on("connection", function(socket){
    // data received from socket and now send to all the frontends
    socket.on("send-location", function(data) {
        io.emit("receive-location", {id: socket.id, ...data});
    });

    // if the user get disconnected
    socket.on("disconnect", function() {
        io.emit("user-disconnected", socket.id);
    });
    console.log("connected successfully");
});
app.get("/", function(req,res){
    res.render("index");
});

server.listen(3000);