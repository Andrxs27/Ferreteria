const apiUrl = 'http://localhost:3000/productos';

const productoForm = document.getElementById('productoForm');
const idProductoInput = document.getElementById('idProducto');
const nombreInput = document.getElementById('nombre');
const categoriaInput = document.getElementById('categoria');
const precioInput = document.getElementById('precio');
const stockInput = document.getElementById('stock');
const tablaProductosBody = document.getElementById('tablaProductosBody');

// Cargar productos al iniciar la página
window.onload = () => {
    cargarProductos();
};

// Función para cargar los productos y mostrarlos en la tabla
function cargarProductos() {
    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            tablaProductosBody.innerHTML = ''; // Limpiar tabla
            data.forEach(producto => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${producto.idProducto}</td>
                    <td>${producto.nombre}</td>
                    <td>${producto.categoria}</td>
                    <td>${producto.precio}</td>
                    <td>${producto.stock}</td>
                    <td>
                        <button class="edit-btn" onclick="editarProducto('${producto.idProducto}')">Editar</button>
                        <button class="delete-btn" onclick="eliminarProducto('${producto.idProducto}')">Eliminar</button>
                    </td>
                `;
                tablaProductosBody.appendChild(tr);
            });
        })
        .catch(err => alert('Error cargando productos: ' + err));
}

// Guardar o actualizar producto
productoForm.addEventListener('submit', e => {
    e.preventDefault();

    const idProducto = idProductoInput.value.trim();
    const nombre = nombreInput.value.trim();
    const categoria = categoriaInput.value.trim();
    const precio = precioInput.value.trim();
    const stock = stockInput.value.trim();

    if (!idProducto || !nombre || !categoria || !precio || !stock) {
        alert('Por favor complete todos los campos.');
        return;
    }

    const productoData = { idProducto, nombre, categoria, precio, stock };

    // Si existe el ID, hacemos PUT (editar); si no, POST (crear)
    const metodo = existeProducto(idProducto) ? 'PUT' : 'POST';
    const url = metodo === 'POST' ? apiUrl : `${apiUrl}/${idProducto}`;

    fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoData),
    })
        .then(res => {
            if (!res.ok) return res.json().then(e => Promise.reject(e.error));
            return res.json();
        })
        .then(() => {
            alert(metodo === 'POST' ? 'Producto agregado' : 'Producto actualizado');
            limpiarFormulario();
            cargarProductos();
        })
        .catch(err => alert('Error: ' + err));
});

// Verifica si ya existe un producto con ese ID (solo en frontend para saber si es PUT o POST)
function existeProducto(idProducto) {
    return Array.from(tablaProductosBody.children).some(
        row => row.children[0].textContent === idProducto
    );
}

// Llenar el formulario para editar
function editarProducto(idProducto) {
    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            const producto = data.find(p => p.idProducto === idProducto);
            if (!producto) {
                alert('Producto no encontrado');
                return;
            }
            idProductoInput.value = producto.idProducto;
            nombreInput.value = producto.nombre;
            categoriaInput.value = producto.categoria;
            precioInput.value = producto.precio;
            stockInput.value = producto.stock;
        });
}

// Eliminar producto
function eliminarProducto(idProducto) {
    if (!confirm('¿Seguro que quieres eliminar este producto?')) return;

    fetch(`${apiUrl}/${idProducto}`, { method: 'DELETE' })
        .then(res => {
            if (!res.ok) throw new Error('Error al eliminar producto');
            return res.json();
        })
        .then(() => {
            alert('Producto eliminado');
            cargarProductos();
        })
        .catch(err => alert(err));
}

// Limpiar formulario
function limpiarFormulario() {
    idProductoInput.value = '';
    nombreInput.value = '';
    categoriaInput.value = '';
    precioInput.value = '';
    stockInput.value = '';
}