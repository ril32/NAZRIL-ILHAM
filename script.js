document.addEventListener('DOMContentLoaded', () => {

    const products = [
        { id: 1, name: "T-Shirt Premium", price: 150000, image: "gambar1.jpg", description: "T-shirt berkualitas tinggi dari bahan katun 100% yang nyaman, cocok untuk kegiatan sehari-hari. Tersedia dalam berbagai ukuran dan warna." },
        { id: 2, name: "Celana Slim-fit", price: 350000, image: "celana.jpg", description: "Celana jeans model slim-fit yang stylish dan modern. Terbuat dari denim berkualitas tinggi yang tahan lama." },
        { id: 3, name: "Sepatu Formal", price: 500000, image: "sepatu.jpg", description: "Sneaker klasik yang nyaman dan serbaguna. Desainnya tak lekang oleh waktu, cocok untuk gaya kasual." },
        { id: 4, name: "Tas Selempang Kulit", price: 280000, image: "tas.jpg", description: "Tas selempang elegan berbahan kulit sintetis premium. Desain minimalis untuk tampilan profesional." },
        { id: 5, name: "Tas Selempang Kulit", price: 290000, image: "tas hitam.jpg", description: "Tas selempang elegan berbahan kulit sintetis premium. Desain minimalis untuk tampilan profesional." },
        { id: 2, name: "Celana Slim-fit", price: 333000, image: "celana cream.jpg", description: "Celana jeans model slim-fit yang stylish dan modern. Terbuat dari denim berkualitas tinggi yang tahan lama." },
         { id: 3, name: "Sepatu Formal", price: 500000, image: "sandal.jpg", description: "sandal klasik yang nyaman dan serbaguna. Desainnya tak lekang oleh waktu, cocok untuk gaya kasual." },
    ];

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const updateCartCount = () => {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = cart.length;
        }
    };

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
    };

    const renderProductList = () => {
        const productListContainer = document.querySelector('.grid-products');
        if (!productListContainer) return;

        productListContainer.innerHTML = '';
        products.forEach(product => {
            const productCard = document.createElement('a');
            productCard.href = `product.html?id=${product.id}`;
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-price">${formatRupiah(product.price)}</p>
                    <button class="btn btn-primary add-to-cart-btn" data-id="${product.id}">Tambah ke Keranjang</button>
                </div>
            `;
            productListContainer.appendChild(productCard);
        });

        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = parseInt(e.target.dataset.id);
                addToCart(productId);
            });
        });
    };

    // --- Fungsionalitas Halaman Detail Produk (product.html) ---
    const renderProductDetail = () => {
        const productDetailContainer = document.getElementById('product-detail');
        if (!productDetailContainer) return;

        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));
        const product = products.find(p => p.id === productId);

        if (product) {
            productDetailContainer.innerHTML = `
                <div class="product-detail-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-detail-info">
                    <h2>${product.name}</h2>
                    <p class="price">${formatRupiah(product.price)}</p>
                    <p class="description">${product.description}</p>
                    <div class="quantity-control">
                        <button id="decrease-qty">-</button>
                        <input type="text" id="product-qty" value="1" readonly>
                        <button id="increase-qty">+</button>
                    </div>
                    <button class="btn btn-primary add-to-cart-btn" data-id="${product.id}">Tambah ke Keranjang</button>
                </div>
            `;

            const qtyInput = document.getElementById('product-qty');
            document.getElementById('increase-qty').addEventListener('click', () => {
                qtyInput.value = parseInt(qtyInput.value) + 1;
            });
            document.getElementById('decrease-qty').addEventListener('click', () => {
                if (parseInt(qtyInput.value) > 1) {
                    qtyInput.value = parseInt(qtyInput.value) - 1;
                }
            });

            document.querySelector('.add-to-cart-btn').addEventListener('click', (e) => {
                e.preventDefault();
                const qty = parseInt(qtyInput.value);
                const productId = parseInt(e.target.dataset.id);
                addToCart(productId, qty);
            });
        } else {
            productDetailContainer.innerHTML = '<p>Produk tidak ditemukan.</p>';
        }
    };

    // --- Fungsionalitas Keranjang (cart.html) ---
    const renderCartItems = () => {
        const cartItemsContainer = document.getElementById('cart-items');
        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Keranjang Anda kosong.</p>';
            document.getElementById('checkout-btn').style.display = 'none';
        } else {
            document.getElementById('checkout-btn').style.display = 'block';
            cart.forEach(item => {
                const product = products.find(p => p.id === item.id);
                if (product) {
                    const itemTotal = product.price * item.quantity;
                    total += itemTotal;
                    const cartItem = document.createElement('div');
                    cartItem.classList.add('cart-item');
                    cartItem.innerHTML = `
                        <img src="${product.image}" alt="${product.name}">
                        <div class="cart-item-details">
                            <h3>${product.name}</h3>
                            <p>Harga: ${formatRupiah(product.price)}</p>
                            <p>Jumlah: ${item.quantity}</p>
                        </div>
                        <span class="cart-item-total">${formatRupiah(itemTotal)}</span>
                        <button class="remove-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                    `;
                    cartItemsContainer.appendChild(cartItem);
                }
            });
        }

        document.getElementById('cart-total').textContent = formatRupiah(total);

        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.id);
                removeFromCart(productId);
            });
        });
    };

    // --- Fungsionalitas Pembayaran (checkout.html) ---
    const renderCheckoutSummary = () => {
        const checkoutItemsContainer = document.getElementById('checkout-items');
        const checkoutTotalSpan = document.getElementById('checkout-total');
        if (!checkoutItemsContainer || !checkoutTotalSpan) return;

        checkoutItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            document.getElementById('checkout-section').innerHTML = '<h2>Keranjang Anda kosong. Silakan belanja terlebih dahulu.</h2>';
            return;
        }

        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                const itemTotal = product.price * item.quantity;
                total += itemTotal;
                const checkoutItem = document.createElement('div');
                checkoutItem.classList.add('checkout-item');
                checkoutItem.innerHTML = `
                    <span>${product.name} (x${item.quantity})</span>
                    <span>${formatRupiah(itemTotal)}</span>
                `;
                checkoutItemsContainer.appendChild(checkoutItem);
            }
        });

        checkoutTotalSpan.textContent = formatRupiah(total);
    };

    // --- Logika Keranjang ---
    const addToCart = (productId, quantity = 1) => {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ id: productId, quantity: quantity });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        alert('Produk berhasil ditambahkan ke keranjang!');
    };

    const removeFromCart = (productId) => {
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
    };

   

    // --- Inisialisasi Halaman ---
    const initializePage = () => {
        const path = window.location.pathname;
        updateCartCount();

        if (path.includes('index.html') || path === '/' || path.includes('Nazril_Store/')) {
            renderProductList();
        } else if (path.includes('product.html')) {
            renderProductDetail();
        } else if (path.includes('cart.html')) {
            renderCartItems();
        } else if (path.includes('checkout.html')) {
            renderCheckoutSummary();
        }
    };
    
    // --- Scroll Fade-in Animation ---
    const handleScrollAnimations = () => {
        const sections = document.querySelectorAll('.fade-in');
        const isInViewport = (element) => {
            const rect = element.getBoundingClientRect();
            return (rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85);
        };

        sections.forEach(section => {
            if (isInViewport(section)) {
                section.classList.add('visible');
            }
        });
    };
    
    // Hamburger Menu
    const hamburger = document.querySelector('.hamburger-menu');
    const nav = document.querySelector('.main-nav');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }

    // Checkout Form Handler (contoh)
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Pesanan Anda berhasil dibuat! (Ini adalah simulasi, tidak ada pemrosesan nyata)');
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            window.location.href = 'index.html';
        });
    }

    // Panggil fungsi inisialisasi dan animasi
    initializePage();
    handleScrollAnimations();
    window.addEventListener('scroll', handleScrollAnimations);
});