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

//MODAL DE IMAGEM
document.addEventListener('DOMContentLoaded', () => {
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');

    document.querySelectorAll('.open-modal').forEach(image => {
        image.addEventListener('click', (event) => {
            modalImage.src = event.target.src;
            imageModal.style.display = 'flex';
        });
    });

    imageModal.addEventListener('click', () => {
        imageModal.style.display = 'none';
    });
});

//BARRA DE ROLAGEM
window.addEventListener('load', function() {
    const scrollBar = document.getElementById('scroll-bar');
    
    function updateScrollBar() {
        const scrollPosition = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        const scrollPercentage = scrollPosition / (documentHeight - windowHeight);
        
        // Define a largura da barra de rolagem com base na porcentagem de rolagem
        scrollBar.style.width = `${scrollPercentage * 100}%`;
    }

    // Atualiza a barra de rolagem quando a página é carregada
    updateScrollBar();
    
    // Atualiza a barra de rolagem conforme o usuário rola
    document.addEventListener('scroll', updateScrollBar);
});

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

    const existingItem = cart.find(item => item.name === name) // Se o item já existe, adiciona quantidade+1
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
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;
    
    cart.forEach(item => {
        // Verifica se item.price e item.quantity são válidos
        if (item.price && item.quantity) {
            const cartItemElement = document.createElement("div");
            cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

            // Determina qual ícone mostrar com base na quantidade de itens
            const removeIconClass = item.quantity > 1 ? "fas fa-minus" : "fas fa-trash-alt";
            
            cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p>Quantidade: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$${Number(item.price).toFixed(2).replace(".", ",")}</p>
                </div>
                <div class="flex items-center space-x-2">
                    <button class="remove-from-cart-btn bg-gray-500 px-2 py-1 rounded-3xl text-white" data-name="${item.name}">
                    <i class="${removeIconClass} pointer-events-none"></i>
                    </button>
                     <p class="text-lg">${item.quantity}</p>
                    <button class="add-from-cart-btn bg-gray-500 px-2 py-1 rounded-3xl text-white" data-name="${item.name}">
                    <i class="fas fa-plus pointer-events-none"></i>
                    </button>
                </div>
            </div>`;

            total += item.price * item.quantity; // Preço do item vezes a quantidade de itens

            cartItemsContainer.appendChild(cartItemElement);
        } else {
            console.warn(`Item inválido: ${JSON.stringify(item)}`);
        }
    });

    // Formata o total e remove o espaço entre "R$" e o valor
    const formattedTotal = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).replace(/\s/g, '');

    cartTotal.textContent = formattedTotal; // Atualiza o total exibido

    const totalItems = cart.reduce((total, item) => total + (item.quantity || 0), 0);
    cartCounter.innerHTML = `(${totalItems})`;

    const additionalFields = document.getElementById('additional-fields');
    const checkoutBtn = document.getElementById('checkout-btn');
    const emptyCart = document.getElementById('empty-cart');
    const footerButtons = document.getElementById('footer-buttons');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const cartTitle = document.getElementById('cart-title');
    const cartTitleContainer = document.getElementById('cart-title-container');

    if (totalItems > 0) {
        additionalFields.classList.remove('hidden');
        checkoutBtn.classList.remove('hidden');
        clearCartBtn.classList.remove('hidden');
        emptyCart.classList.add('hidden');
        cartTitleContainer.classList.remove('hidden');
        cartTitle.style.display = 'block'; // Exibe o título
        footerButtons.classList.remove('centralized');
        footerButtons.style.justifyContent = 'space-between'; // Garante a distribuição entre os botões
    } else {
        additionalFields.classList.add('hidden');
        checkoutBtn.classList.add('hidden');
        clearCartBtn.classList.add('hidden');
        emptyCart.classList.remove('hidden');
        cartTotal.textContent = "R$0,00";
        cartTitleContainer.classList.add('hidden');
        cartTitle.style.display = 'none'; // Oculta o título
        footerButtons.classList.add('centralized');
        footerButtons.style.justifyContent = 'center'; // Centraliza o botão "Voltar"
    }
}

//FUNÇÃO PARA LIMPAR CARRINHO
function clearCart() {
    cart = []; // Limpa o array de itens do carrinho
    updateCartModal(); // Atualiza o modal do carrinho
}

//ADICIONA O EVENTO DE CLIQUE AO BOTÃODE LIMPAR CARRINHO
document.getElementById('clear-cart-btn').addEventListener('click', clearCart);


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
        addressWarm.classList.add ("hidden") // remove o aviso quando for digitado o endereço
    }
})

//PRECISA DE TROCO?
document.getElementById('payment-method').addEventListener('change', function() {
    var paymentMethod = this.value;
    var changeSection = document.getElementById('change-section');

    if (paymentMethod === 'money') {
        changeSection.classList.remove('hidden');
    } else {
        changeSection.classList.add('hidden');
    }
});


//FINALIZAR PEDIDO
checkoutBtn.addEventListener("click", function() {
    const isOpen = checkRestaurantOpen();

    if (!isOpen) {
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
            onClick: function() {} // Callback after click
        }).showToast();
        return; // Interrompe o processo se o restaurante estiver fechado
    }

    if (cart.length === 0) return; // Verifica se tem o item no carrinho, se não tiver nada acontece
    if (addressInput.value === "") {
        addressWarm.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    //VERIFICA SE FOI SELECIONADA UMA FORMA DE PAGAMENTO
    const paymentSelect = document.getElementById('payment-method');
    const paymentMethod = paymentSelect.value;

    if (paymentMethod === "") {
        paymentSelect.style.backgroundColor = '#fef2f2';
        paymentSelect.style.borderColor = '#ef4444';
        return;
    }

    //ENVIAR PEDIDO PARA WHATSAPP
    const cartItems = cart.map((item) => {
        return `${item.name} - Qtd: ${item.quantity}`;
    }).join("\n");
    const greeting = "Olá, boa noite!";
    const orderMessage = "*_PEDIDO:_*";
    const obsInput = document.getElementById('obs').value;
    const obs = obsInput ? `*_OBSERVAÇÕES:_* ${obsInput}` : "*_OBSERVAÇÕES:_* Sem observações!";
    const address = `*_ENDEREÇO:_* ${addressInput.value}`;
    const changeAmount = document.getElementById('change-amount').value;
    const change = changeAmount ? `*_TROCO:_* R$${changeAmount}` : "*_TROCO:_* Não necessário!";
    const totalAmount = `*_TOTAL:_* ${cartTotal.textContent}`;
    const message = encodeURIComponent(`${greeting}\n\n${orderMessage}\n${cartItems}\n\n${obs}\n\n${address}\n${change}\n${totalAmount}`);
    const phone = "000000000";

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
    cartModal.style.display = "none";
    cart = []; // Limpa carrinho ao enviar pedido via whatsapp
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
        onClick: function() {} // Callback after click
    }).showToast();
});

//VERIFICAR HORÁRIO DE FUNCIONAMENTO DO RESTAURANTE
function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 24; // true - RESTAURANTE ABERTO
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-500"); // Remove vermelho
    spanItem.classList.add("bg-green-600"); // Adiciona verde
} else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}