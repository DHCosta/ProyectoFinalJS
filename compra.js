let carrito_ls = get_carrito_localStorage();
renderizar_compra();
renderizar_cant_cursos();
actualizar_total_compra();


/* Renderiza el Label de cantidad de cursos seleccionados para la compra */
function renderizar_cant_cursos(){
    const cant_cursos = document.getElementById("cant_cursos");
    cant_cursos.textContent = "Cursos (" + carrito_ls.length + ")";
}

/* Renderiza el Carrito con los cursos almacenados en el LocalStorage */
function renderizar_compra() {
    const compra = document.getElementById("items_compra")

    carrito_ls.forEach((item_carrito) => {
        let item = document.createElement("li");
        item.className = "list-group-item bg-body-tertiary d-flex justify-content-between align-items-center py-3";

        item.innerHTML = `<span class="d-flex justify-content-start align-items-center gap-4">
                            <img src="${item_carrito.img}" class="img_carrito_compra" alt="algo">
                            <p id="item_nombre_curso" class="item_nombre_curso fs-3 fw-normal pt-3">${item_carrito.nombre}</p>
                       </span>
                       <span class="d-flex justify-content-end align-items-center gap-5">
                            <p class="fs-3 fw-light pt-3">${item_carrito.precio}</p>
                            <button class="btn btn-danger borrar_elemento">x</button>
                       </span>
                      `;
        compra.append(item);    
    })

    let btn_borrar = document.querySelectorAll(".borrar_elemento");
    for( let boton of btn_borrar){
        boton.addEventListener("click" , borrar_curso);
    }
}


/* Gestionar LocalStorage */
function get_carrito_localStorage (){
    let carrito_en_LS = localStorage.getItem("carrito");
    return JSON.parse(carrito_en_LS);
}

function guardar_localStorage (carrito){

    let carrito_JSON = JSON.stringify(carrito);
    localStorage.setItem("carrito" , carrito_JSON);
}


/* Borrar item de la compra */
function borrar_curso(e){

    let abuelo = e.target.parentNode.parentNode;
    let padre = abuelo.firstChild;

    let indice_a_borrar = carrito_ls.findIndex((item) => item.nombre === padre.querySelector(".item_nombre_curso").innerText);

    carrito_ls.splice(indice_a_borrar , 1);

    guardar_localStorage(carrito_ls);

    abuelo.remove();
    renderizar_cant_cursos();
    actualizar_total_compra()
}


//Calcular el precio total del Carrito y renderiza el componente
function actualizar_total_compra(){
    let total_c = 0;

    carrito_ls.forEach((item) => {
        total_c  += parseInt(item.precio.slice(1),10);
    });

    let total = document.getElementById("total_compra");
    total.textContent = "$"+total_c;

}