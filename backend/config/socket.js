const {Server}=require('socket.io')
const {createClient}=require('redis')
const {createAdapter}=require('@socket.io/redis-adapter')

let io;

async function initSocket(httpsServer) {
    io=new Server(httpsServer,{
        cors:{
            origin
        }
    })
}