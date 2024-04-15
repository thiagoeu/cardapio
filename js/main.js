const menu = document.getElementById("menu");
const cartModal = document.getElementById("cart-modal");
const cartBtn = document.getElementById("cart-btn");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCount = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

// Carrrinho
let cart = [];

// abre cart modal
cartBtn.addEventListener("click" , function () {
    updateCartModal();
    cartModal.style.display = "flex"
})

// fecha modal clicando fora da caixa do pedido
cartModal.addEventListener("click" , function(event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function() {
    cartModal.style.display = "none"
})


menu.addEventListener("click", function(event){
    // faz a verificação se a classe esta no pai ou no filho
    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
    
        addToCart(name,price)
        // adiciona no carrinho
    }     


})


function addToCart(name, price) {
    const Multipleitems = cart.find(item => item.name == name)
    
    if(Multipleitems){
        return Multipleitems.quantity += 1; 
    }else{
        cart.push({
            name,
            price,
            quantity : 1,
        })
    }

    updateCartModal()

   
}

// Atualiza itens no carrinho
function updateCartModal() {
    cartItems.innerHTML = "";
    let total = 0;


    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium"> ${item.name} </p>
                    <p> Qtd: ${item.quantity} </p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)} </p>
                </div>

                <button data-name="${item.name}" class="remove-item-btn">
                    Remover
                </button>              
            
            </div>
        
        `
        total += item.price * item.quantity
        
        cartItems.appendChild(cartItemElement)

    })


    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })


    cartCount.innerHTML = cart.length
}

// Removendo items do carrinho
cartItems.addEventListener("click", function (event){
    if(event.target.classList.contains("remove-item-btn")) {
        const name = event.target.getAttribute("data-name")
        console.log(name)

        removeCartItem(name)
        
    }
})
// Removendo items do carrinho
function removeCartItem(name) {
    const index = cart.findIndex(item => item.name == name)

    if(index !== -1){
        const item = cart[index];
        console.log(item)

        if(item.quantity > 1){
           item.quantity -= 1
           
        }else{
            cart.splice(index,1)
        }
    }
    return updateCartModal();
}


// Validação de endereço para pedido
addressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value

    if (inputValue !== ""){
        addressWarn.classList.add("hidden")
        addressInput.classList.remove("border-red-500")
    }
})

// Finalização do Pedido + Enviar pedido para Whatsapp
checkoutBtn.addEventListener("click", function () {
    // Verifica se o restaurante está em horario de Funcionamento
    const isOpen = checkRestaurant()
    if (!isOpen){
        alert("FECHADO - Atendimento das 18:00 as 23:00")
        return
    }
    
    // Validações de pre-requisitos para realizar um pedido
    if (cart.length === 0){
        return
    }
    if (addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return
    }


    // Enviar pedido p/ wpp

    // lista os itens no carrinho
    const cartItems = cart.map((item)=> {
        return (
            `${item.name} Quantidade: ${item.quantity} Preço: R$ ${item.price} \n `
        )
    }).join("")

    // Calcula o total a ser pago.
    const totalValue = cart.reduce((total, item) => {
        return total + (item.quantity * item.price);
    }, 0);
    
    // Monta string para envio 
    const finalOrder = `${cartItems} \n Total: R$ ${totalValue.toFixed(2)}`

    const message = encodeURIComponent(finalOrder)
    const phone = "83996481008"
    window.open(`https://wa.me/${phone}?text=${message} \n Endereço: ${addressInput.value}`,"_blank")
    
})

// Validação de Horario de funcionamento
function checkRestaurant () {
    const data = new Date();
    const hora = data.getHours();

    return hora >= 18 && hora < 22;
}


// Alteração visual da tag de horario de funcionamento
const isOpen = checkRestaurant();
const spanItem = document.getElementById("date-span")
if (isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
    
}else{
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
    spanItem.textContent = 'Fechado (Horario de Funcionamento : terça a domingo - 18:00 as 23:00)'
    spanItem.classList.add("text-white")
}

