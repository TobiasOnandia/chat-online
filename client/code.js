import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js'


const getUsername = async () => {
    const username = localStorage.getItem('username')
    if(username){
        return username
    }

    const res = await fetch('https://random-data-api.com/api/users/random_user')
    const { username: randomUsername } = await res.json()

    localStorage.setItem('username', randomUsername)
    return randomUsername

}


const socket = io({
    auth: {
        serverOffset: 0,
        username: await getUsername()
    }
})

const form = document.getElementById("form")
const input = document.getElementById("MsgInput")
const messages = document.getElementById("messages")
const nameUser = document.querySelector(".user")



socket.on("chat message", (msg, serverOffset, username) => {
    const item = `<li>
    <p>${msg}</p>
    <small>${username} </small>
    </li>`
    messages.insertAdjacentHTML("beforeend", item)
    socket.auth.serverOffset = serverOffset

    //controlar el scroll

    messages.scrollTop = messages.scrollHeight

})

form.addEventListener("submit", (e) =>{
    e.preventDefault()
    
    if(input.value){
        socket.emit("chat message", input.value)
        input.value = ""
    }
})

