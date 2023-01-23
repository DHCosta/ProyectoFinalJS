let carrito = [];
let carrito_ls = get_carrito_localStorage();


/*la siguiente validacion la he agregado por si se llegase a borrar el carrito manualmente desde el browser 
(no debiera suceder nunca en un uso normal de la pagina)*/
if (carrito_ls === null){
    guardar_localStorage (carrito)
}
else 
    carrito = carrito_ls
actualizar_badge_carrito();
renderizar_carrito ();
actualizar_total_carrito();


const renderizarCursos = async () => {
    const contenedor_cursos = document.getElementById("cont_cursos")

    const resp = await fetch('http://localhost:5500/data/data.json');
    const data = await resp.json();

    data.forEach((curso) => {
        let div = document.createElement('div');
        div.innerHTML = `
            <img src="${curso.imagen}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title my-3">${curso.nombre}</h5>
                <p class="card-text">${curso.detalle}</p>
                <div class="d-flex align-items-end mt-5">
                    <button type="button" class="btn btn-primary btn-lg botonComprar">
                        <i class="bi bi-cart-plus" aria-hidden="true"></i>
                    </button>
                    <p class="ms-auto mt-auto precio">$${curso.precio}</p>
                </div>
            </div>
        `
        div.className = "card col-3 mx-5 mb-5";
        contenedor_cursos.append(div);    
    })

    let btn_compra = document.querySelectorAll(".botonComprar");

    for( let boton of btn_compra){
    boton.addEventListener("click" , agregar_a_carrito);
    }
}

renderizarCursos();

function renderizar_carrito (){
    carrito = get_carrito_localStorage();
    carrito.forEach((curso) => listar_en_carrito(curso));
}

function guardar_localStorage (carrito){

    let carrito_JSON = JSON.stringify(carrito);
    localStorage.setItem("carrito" , carrito_JSON);
}

function get_carrito_localStorage (){
    let carrito_en_LS = localStorage.getItem("carrito");
    return JSON.parse(carrito_en_LS);
}

function actualizar_badge_carrito(){

    let badge_carrito = document.getElementById("badge_carrito")
    let recupero_carrito = JSON.parse(localStorage.getItem("carrito"));

    (recupero_carrito !=null) ? (badge_carrito.innerText = recupero_carrito.length) : (badge_carrito.innerText = 0)
}

function actualizar_total_carrito(){
    let total_c = 0;

    carrito.forEach((item) => {
        total_c  += parseInt(item.precio.slice(1),10);
    });

    let total = document.getElementById("total");
    total.textContent = "$"+total_c;

}

function listar_en_carrito(curso){

    let fila = document.createElement("tr");
    fila.innerHTML = `<th><img src="${curso.img}" class="img_carrito" alt="algo"></th>
                      <th class="fs-4 fw-light">${curso.nombre}</th>
                      <th class="fs-4 fw-light">${curso.precio}</th>
                      <th><button class="btn btn-danger borrar_elemento">x</button></th>
                      `;    

    let tabla = document.getElementById("tbody");
    tabla.append( fila );

    let btn_borrar = document.querySelectorAll(".borrar_elemento");
    for( let boton of btn_borrar){
        boton.addEventListener("click" , borrar_producto);
    }
    
}

function existe(nombre) {
    return carrito.find(curso => curso.nombre === nombre);
}

function agregar_a_carrito(e){

    let nombre_producto;
    let img_producto;
    let precio;

    if(e.target.type != "button"){
        let hijo = e.target;
        let padre = hijo.parentNode;
        let abuelo = padre.parentNode;
        let tatarabuelo = abuelo.parentNode;
        let tataratatarabuelo = tatarabuelo.parentNode;
        
        nombre_producto = tatarabuelo.querySelector("h5").textContent;
        img_producto =  tataratatarabuelo.querySelector("img").src;
        precio = abuelo.querySelector("p").textContent;
    } 
    else {
        let hijo = e.target;
        let padre = hijo.parentNode;
        let abuelo = padre.parentNode;
        let tatarabuelo = abuelo.parentNode;
        
        nombre_producto = abuelo.querySelector("h5").textContent;
        img_producto =  tatarabuelo.querySelector("img").src;
        precio = padre.querySelector("p").textContent;
    }

    const toastLiveExample = document.getElementById('liveToast')

    if (existe(nombre_producto)) {
        const toast = new bootstrap.Toast(toastLiveExample)
        toast.show()
    }
    else {

        let producto = {
            nombre: nombre_producto,
            img: img_producto,
            precio: precio
        };

        carrito.push(producto);

        guardar_localStorage (carrito);
        actualizar_badge_carrito();
        listar_en_carrito(producto);
        actualizar_total_carrito();
    }
}

function borrar_producto(e){

    let abuelo = e.target.parentNode.parentNode;

    carrito = get_carrito_localStorage();
    carrito.splice(abuelo.rowIndex-1, 1);

    guardar_localStorage(carrito);

    actualizar_badge_carrito();
    abuelo.remove();
    actualizar_total_carrito();
}


let btn_vaciar_carrito = document.getElementById("vaciar_carrito");
btn_vaciar_carrito.addEventListener("click" , vaciar_carrito);

function vaciar_carrito(){
    carrito = [];
    guardar_localStorage (carrito);

    let old_tbody = document.getElementById("tbody");
    let new_tbody = document.createElement("tbody");
    new_tbody.id = "tbody";
    old_tbody.parentNode.replaceChild(new_tbody, old_tbody)

    actualizar_badge_carrito();
    actualizar_total_carrito();
}
