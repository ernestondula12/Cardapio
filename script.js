//Pegando o id do nosso menu
const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

//Array que vai receber uma lista e essa lista será para os nossos produtos que estaremos adicionando no carrinho.
let cart = [];

//Logica para abrir o modal
cartBtn.addEventListener("click", function(){
    updateCartModal();
    cartModal.style.display = "flex"
})

//Lógica para fechar o modal
cartModal.addEventListener("click", function(event){
    //Logica para fechar o modal se caso o click for para fora do modal
    if(event.target == cartModal){
        cartModal.style.display = "none"
    }
})

//Lógica para fechar o modal clicando no botão fechar
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

//Lógica para adicionar os produtos no carrinho, acessando a partir da nossa Div menu
menu.addEventListener("click", function(event){
    //console.log(event.target);

    //Verificando o elemento clicado que tem dentro se caso foi clicado nele ou perto dele existe um parente
    //Verificano se a classe que representa o filho esta dentro do Pai
    let parentButton = event.target.closest(".add-to-cart-btn");

    //Verificando se o clique foi dado a um elemento fora do botão com icone ou dentro do botão com icone
    if(parentButton){
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));

        //Chamando a função responsavel para adicionar os produtos no carrinho
        addToCart(name,price)
    }
})

//Função para adicionar no carrinho
function addToCart(name, price){
    //Criando uma variavel que vai receber o item que esta sendo adicionado no carrinho
    const existingItem = cart.find(item => item.name === name);

    //Verificando se um determinado produto já existe na lista de produtos que estão no carrinho
    if(existingItem){
        //Se o item existir na lista simplesmente devemos aumentar a quantidade + 1
        existingItem.quantity += 1;
        return;
    }else{
        
    cart.push({
        name,
        price,
        quantity: 1,
    })
}

   //Chamando a nossa função que vai atualizar o nosso modal e ela será chamada em casos especificos
   updateCartModal()
}

//Função que vai atualizar o nosso carrinho
function updateCartModal(){

    //Zerando a nossa div onde estarão os itens da nosso carrinho
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        //Estilizando os elementos dentro do modal
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        //Trbalhando nos nossos elementos que poderão mostrar os nossos elementos
        cartItemElement.innerHTML = `

            <div class="flex items-center justify-between">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p>Quantidade: ${item.quantity}</p>
                    <p class="font-medium">R$ ${item.price.toFixed(2)}</p>
                </div>
                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>
            </div>

        `

        //Caluclando o total de todos os itens do carrinho
        total += item.price * item.quantity;

        //Adicionando os nossos elementos dentro da nossa div de renderização
        cartItemsContainer.appendChild(cartItemElement)
    })

    //Adicionando o nosso valor dos itens em nossa div cartTotal
    cartTotal.textContent = total.toLocaleString("pt-BR",{
        style: "currency",
        currency: "BRL"
    })

    //Acessando o noss elemento responsavel por conta cada item que nós adicionamos no carrinho
    cartCounter.innerHTML = cart.length;
}

//Função para remover os itens do Carrinho
cartItemsContainer.addEventListener("click", function(event){
    //Verificando se o elemento clicado contém o elemento a classe para remoção do item
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

       
        removeItemCart(name);
    }
})

 //Função para remover o item ou a quantidade adicionada no mesmo
 function removeItemCart(name){
    //Verificando o indice o elemento a ser eliminado
    const index = cart.findIndex(item => item.name === name);

    if(index != -1){
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

 //Trabalhando na lógica do nosso input, onde poderemos passar o endereço de entrega
 addressInput.addEventListener("input", function(event){
    //Pegando o valor digitado no campo
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500");
        addressWarn.classList.add("hidden");
    }
 })

 //Trabalhando na lógica para finalizar os pedidos no carrinho
 checkoutBtn.addEventListener("click", function(event){

   const isOpen = checkRestaurantOpen();

    if(!isOpen){
        
        Toastify({

            text: "Ops! o restaurante esta fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
        }).showToast();
        return;
    }

    if(cart.length == 0) return;

    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        return;
    }

    //Enviar o pedido para api do whatsap
    const cartItems = cart.map((item) => {
        return(
            `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems);
    const phone = "926531706"

    //Redirecionando na API do whatsapp
    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank");

    //Após o envio dos dados queremos zerar o modal
    cart = [];
    updateCartModal();
 })

 //Trabalhando na lógica para verificar se o restaurante esta aberto
 //Verificar a hora e manipular o card horario
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
    //true = o restaurante esta aberto
}

//Nessa parte do código estamos trabalhando na lógica de que quando o restaurante estiver aberto adicionamos uma cor diferente ao nosso span
const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

//Verificando o mesmo "isOpen"
if(isOpen){
    //Se caso estiver aberto adiciona essas cores
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
}else{
    //Caso far-se-a o inverso das cores
    spanItem.classList.remove("bg-green-500");
    spanItem.classList.add("bg-red-500");
}
