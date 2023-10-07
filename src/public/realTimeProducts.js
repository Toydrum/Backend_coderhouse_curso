
const socketClient = io();


const form = document.getElementById('form')
const inputProduct = document.getElementById('product')

form.onsubmit = (e)=>{
    e.preventDefault()
    const productName = inputProduct.value
    socketClient.emit('message', productName)
}

socketClient.on(`secondEvent`, info=>{
    console.log(`info sent:${info}`)
})