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


let cart = [];

// open cart modal
cartBtn.addEventListener("click" , function () {
    cartModal.style.display = "flex"
})

// close modal
cartModal.addEventListener("click" , function(event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function() {
    cartModal.style.display = "none"
})


menu.addEventListener("click", function(event){
    //console.log(event.target)

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
    }


    cart.push({
        name,
        price,
        quantity : 1,
    })
}

// atualiza carrinhio
