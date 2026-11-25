// Configuración opcional de Tailwind
if (typeof tailwind !== 'undefined') {
    tailwind.config = {
        theme: {
            extend: {
                colors: {
                    pastelBlue: '#E0F2FE',
                    deepBlue: '#0369A1',
                    pastelPurple: '#F3E8FF',
                    deepPurple: '#6B21A8',
                }
            }
        }
    };
}

// Catálogo de prendas únicas con categoría y talla fija
const products = [
    { id: 1, category: 'chaquetas', categoryLabel: 'Chaquetas', name: 'Chaqueta Denim Custom', price: 79.00, size: 'XL', image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80', description: 'Chaqueta vaquera intervenida a mano con parches exclusivos. Pieza única.' },
    { id: 2, category: 'camisetas', categoryLabel: 'Camisetas', name: 'Camiseta Vintage Aesthetic', price: 28.50, size: 'M', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80', description: 'Diseño retro lavado a la piedra. Prenda única de colección.' },
    { id: 3, category: 'gorros', categoryLabel: 'Gorros', name: 'Gorro Beanie Pastel Knit', price: 22.00, size: 'Talla única', image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=600&q=80', description: 'Gorro de punto suave con acabado exclusivo y unidad única.' },
    { id: 4, category: 'camisetas', categoryLabel: 'Camisetas', name: 'Camiseta Boxy Fit Lilac', price: 32.00, size: 'L', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80', description: 'Corte boxy de algodón grueso. Prenda única disponible.' },
    { id: 5, category: 'chaquetas', categoryLabel: 'Chaquetas', name: 'Chaqueta Overshirt Urbana', price: 64.00, size: 'M', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80', description: 'Sobrecamisa estructurada de edición única con bolsillos frontales.' },
    { id: 6, category: 'gorros', categoryLabel: 'Gorros', name: 'Gorro Cap Clásica Bordada', price: 24.50, size: 'Ajustable único', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80', description: 'Gorra de algodón con detalle bordado. Única unidad en stock.' }
];

let cart = [];
let activeCategory = 'todas';

function filterCategory(category) {
    activeCategory = category;

    document.querySelectorAll('.filter-btn').forEach(btn => {
        const isSelected = btn.dataset.cat === category;
        btn.classList.toggle('filter-btn-active', isSelected);
        btn.classList.toggle('filter-btn-inactive', !isSelected);
    });

    renderProducts();
}

function renderProducts() {
    const grid = document.getElementById('product-grid');
    const filtered = activeCategory === 'todas'
        ? products
        : products.filter(p => p.category === activeCategory);

    if (filtered.length === 0) {
        grid.innerHTML = `<p class="text-slate-700 col-span-full text-center py-8">No hay prendas disponibles en esta sección ahora mismo.</p>`;
        return;
    }

    grid.innerHTML = filtered.map(p => `
        <div class="product-card bg-white rounded-2xl border border-purple-200 overflow-hidden flex flex-col justify-between">
            <div>
                <div class="relative h-64 overflow-hidden bg-slate-100 border-b border-purple-100">
                    <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover object-center" loading="lazy">
                    <span class="absolute top-3 left-3 bg-white text-purple-950 text-xs font-bold px-3 py-1 rounded-full border border-purple-300">
                        Talla fija: ${p.size}
                    </span>
                    <span class="absolute top-3 right-3 bg-sky-100 text-sky-950 text-xs font-bold px-3 py-1 rounded-full border border-sky-300">
                        ${p.categoryLabel}
                    </span>
                </div>
                <div class="p-6">
                    <h3 class="text-lg font-bold text-slate-950 mb-1">${p.name}</h3>
                    <p class="text-slate-700 text-xs mb-4">${p.description}</p>
                    <span class="text-xl font-extrabold text-purple-900">${p.price.toFixed(2)} €</span>
                </div>
            </div>
            <div class="p-6 pt-0">
                <button onclick="addToCart(${p.id})" class="w-full bg-purple-100 hover:bg-purple-900 text-purple-950 hover:text-white font-semibold py-3 rounded-xl transition border border-purple-300 flex items-center justify-center gap-2">
                    <i class="fa-solid fa-cart-plus"></i> Añadir al Carrito
                </button>
            </div>
        </div>
    `).join('');
}

function toggleCart() {
    document.getElementById('cart-drawer').classList.toggle('hidden');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        alert('Al tratarse de una prenda única, ya has añadido este artículo.');
        return;
    }
    cart.push({ ...product, quantity: 1 });
    updateCartUI();
    toggleCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function updateCartUI() {
    const countEl = document.getElementById('cart-count');
    const itemsEl = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');

    countEl.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (cart.length === 0) {
        itemsEl.innerHTML = `<p class="text-slate-600 text-center py-8">Tu carrito está vacío</p>`;
        totalEl.textContent = '0.00 €';
        return;
    }

    let total = 0;
    itemsEl.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `
            <div class="flex items-center justify-between py-4">
                <div class="flex items-center gap-3">
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-xl border border-purple-200" loading="lazy">
                    <div>
                        <h4 class="text-sm font-bold text-slate-950">${item.name}</h4>
                        <p class="text-xs text-slate-700">Talla única: ${item.size}</p>
                        <span class="text-xs font-bold text-purple-900">${item.price.toFixed(2)} €</span>
                    </div>
                </div>
                <button onclick="removeFromCart(${item.id})" class="text-red-700 hover:text-red-900 p-2" aria-label="Eliminar artículo"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
    }).join('');

    totalEl.textContent = total.toFixed(2) + ' €';
}

function checkout() {
    if (cart.length === 0) {
        alert('El carrito está vacío.');
        return;
    }
    alert('Redirigiendo a pasarela de pago segura con cifrado SSL...');
    cart = [];
    updateCartUI();
    toggleCart();
}

function handleContact(e) {
    e.preventDefault();
    const email = document.getElementById('contact-email').value;
    const termsAccepted = document.getElementById('check-terms').checked;
    const privacyAccepted = document.getElementById('check-privacy').checked;
    const timestamp = new Date().toISOString();

    const consentRecord = {
        email: email,
        termsAccepted: termsAccepted,
        privacyAccepted: privacyAccepted,
        timestamp: timestamp
    };
    console.log('Registro de consentimiento trazable guardado:', consentRecord);

    alert('¡Mensaje enviado con éxito! Consentimiento registrado correctamente.');
    e.target.reset();
}

function acceptCookies() {
    document.getElementById('cookie-banner').style.display = 'none';
}

function rejectCookies() {
    document.getElementById('cookie-banner').style.display = 'none';
}

function openModal(type) {
    const modal = document.getElementById('legal-modal');
    const content = document.getElementById('modal-content');
    modal.classList.remove('hidden');

    if (type === 'terminos') {
        content.innerHTML = `
            <h3 class="text-lg font-bold text-slate-950 mb-2">Términos y Condiciones</h3>
            <p>Las presentes condiciones regulan la venta de prendas de ropa exclusivas y únicas en nuestra plataforma. El usuario se compromete a hacer un uso lícito de la web.</p>
            <p>Al ser artículos únicos, la disponibilidad se actualiza en tiempo real de forma automática.</p>
        `;
    } else if (type === 'privacidad') {
        content.innerHTML = `
            <h3 class="text-lg font-bold text-slate-950 mb-2">Política de Privacidad (RGPD)</h3>
            <p>Tratamos tus datos exclusivamente para gestionar tus pedidos y solicitudes de contacto. Los datos no se ceden a terceros salvo obligación legal.</p>
            <p>Puedes ejercer tus derechos de acceso, rectificación y supresión escribiendo a soporte@aurastore.es.</p>
        `;
    } else if (type === 'reembolso') {
        content.innerHTML = `
            <h3 class="text-lg font-bold text-slate-950 mb-2">Política de Reembolso y Retracto</h3>
            <p>De acuerdo con la legislación de comercio electrónico, el cliente dispone de un plazo de 5 a 14 días hábiles desde la recepción del pedido para ejercer su derecho de retracto.</p>
            <p>El artículo devuelto debe conservar sus condiciones originales y etiquetas.</p>
        `;
    } else if (type === 'cookies') {
        content.innerHTML = `
            <h3 class="text-lg font-bold text-slate-950 mb-2">Política de Cookies</h3>
            <p>Utilizamos cookies técnicas necesarias para el funcionamiento del carrito de compras y cookies analíticas para mejorar la experiencia de navegación.</p>
        `;
    }
}

function closeModal() {
    document.getElementById('legal-modal').classList.add('hidden');
}

window.addEventListener('DOMContentLoaded', renderProducts);
