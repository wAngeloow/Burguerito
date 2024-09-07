const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarm = document.getElementById("address-warm")
const obsInput = document.getElementById("obs")

let cart = [];

/* MOSTRA NO CONSOLE O ITEM QUE FOI CLICADO PELO USUÁRIO
menu.addEventListener("click", function(event){
    console.log(event.target)
})
*/

//ABRIR MODAL DO CARRINHO
cartBtn.addEventListener("click", function() {
    updateCartModal()
    cartModal.style.display = "flex"
})

//FECHAR MODAL QUANDO CLICAR FORA
cartModal.addEventListener("click", function(){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

//FECHAR MODAL AO APERTAR "FECHAR"
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

//ADICIONAR ITEM AO CARRINHO
menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")
    if (parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = Number(parentButton.getAttribute("data-price"))
        Toastify({
            text: "Item adicionado ao carrinho!",
            duration: 700,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "orange",
            },
            onClick: function(){} // Callback after click
          }).showToast();
        addToCart(name, price)
    } 
})

//FUNÇÃO PARA ADICIONAR NO CARRINHO
function addToCart(name, price){

    const existingItem = cart.find(item => item.name === name) //SE O ITEM JÁ EXISTE, ADICIONAR QUANTIDADE+1
    if(existingItem){
        existingItem.quantity += 1
    }else{
        cart.push({
            name,
            price,
            quantity: 1,   
           })
    }

    updateCartModal()
}

//ATUALIZA O CARRINHO
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;
    
    cart.forEach(item => {
        const cartItemElement = document.createElement("div")
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-bold">${item.name}</p>
                <p>Quantidade:</p>
                <p class="font-medium mt-2">R$${Number(item.price).toFixed(2).replace(".", ",")}</p>
            </div>
            <div class="flex items-center space-x-2">
                <button class="remove-from-cart-btn bg-gray-500 px-2 py-1 rounded-3xl text-white" data-name="${item.name}">
                <i class="fas fa-minus pointer-events-none"></i>
                </button>
                 <p class="text-lg">${item.quantity}</p>
                <button class="add-from-cart-btn bg-gray-500 px-2 py-1 rounded-3xl text-white" data-name="${item.name}">
                <i class="fas fa-plus pointer-events-none"></i>
                </button>
            </div>
        </div>`

        total += item.price * item.quantity; //PREÇO DO ITEM VEZES A QUANTIDADE DE ITENS

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    const TotalItems = cart.reduce((total, item) => total+item.quantity, 0);
    cartCounter.innerHTML = `(${TotalItems})`
}

//FUNÇÃO PARA REMOVER ITEM DO CARRINHO PELO MODAL
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }
        cart.splice(index, 1);
        updateCartModal();
    }
}

//FUNÇÃO PARA ADICIONAR ITEM DO CARRINHO PELO MODAL
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("add-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        addItemCart(name)
    }
})

function addItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];
        item.quantity += 1;
        updateCartModal();
    }
}

//PEGAR ENDEREÇO
addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if (inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarm.classList.add ("hidden") //REMOVE O AVISO QUANDO FOR DIGITADO O ENDEREÇO
    }
})


//FINALIZAR PEDIDO
checkoutBtn.addEventListener("click", function(){

    /*const isOpen = checkRestaurantOpen();
    if(!isOpen){
        Toastify({
            text: "O restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
            onClick: function(){} // Callback after click
          }).showToast();
    }*/
    

    if (cart.length === 0) return; //VERIFICA SE TEM ITEM NO CARRINHO, SE NÃO TIVER NÃO ACONTECE NADA
    if (addressInput.value === ""){
        addressWarm.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    //ENVIAR PEDIDO PARA WHATSAPP
    const cartItems = cart.map((item) => {
        return (
            `${item.name} - Qtd: ${item.quantity}`
        )
    }).join("\n")
    const greeting = "Olá, boa noite!";
    const orderMessage = "*_PEDIDO:_*"
    const address = `*_ENDEREÇO:_* ${addressInput.value}`;
    const obs = `*_OBS:_* ${obsInput.value}`;
    const totalAmout = `*_TOTAL:_* ${cartTotal.textContent}`;
    const message = encodeURIComponent(`${greeting}\n\n${orderMessage}\n${cartItems}\n\n${address}\n${obs}\n${totalAmout}\n`);
    const phone = "989975565"

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank")
    cartModal.style.display = "none"
    cart = []; //LIMPA CARRINHO AO MANDAR PEDIDO VIA WHATSAPP
    updateCartModal();
    Toastify({
        text: "Pedido enviado com sucesso!",
        duration: 5000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "green",
        },
        onClick: function(){} // Callback after click
      }).showToast();
})

//VERIFICAR HORÁRIO DE FUNCIONAMENTO DO RESTAURANTE
/*function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora< 00; //true - RESTAURANTE ABERTO
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if (isOpen){
    spanItem.classList.remove("bg-red-500") //REMOVE VERMELHO
    spanItem.classList.add("bg-green-600") //ADD VERDE
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}*/