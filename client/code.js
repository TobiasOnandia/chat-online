import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js'

const socket = io({
    auth: {
        serverOffset: 0,
        username: 'tobias'
    }
})

const form = document.getElementById("form")
const input = document.getElementById("MsgInput")
const messages = document.getElementById("messages")
const nameUser = document.querySelector(".user")

socket.on("chat message", (msg, serverOffset) => {
    const item = `<li>${msg}</li>`
    messages.insertAdjacentHTML("beforeend", item)
    socket.auth.serverOffset = serverOffset
})

form.addEventListener("submit", (e) =>{
    e.preventDefault()
    
    if(input.value){
        socket.emit("chat message", input.value)
        input.value = ""
    }
})

