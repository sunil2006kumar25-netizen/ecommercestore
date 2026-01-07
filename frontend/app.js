// Shopping Cart Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];
let currentCategory = 'all';
let currentProductId = null;

// Load products on page load
async function loadProducts() {
  try {
    products = await getProducts();
    displayProducts(products);
    updateAuthUI();
    updateCartCount();
  } catch (err) {
    console.error('Error loading products:', err);
    document.getElementById('productsContainer').innerHTML = 
      '<div class="col-12"><div class="alert alert-danger">Failed to load products. Please try again later.</div></div>';
  }
}

// Display products
function displayProducts(productsToDisplay) {
  const container = document.getElementById('productsContainer');
  
  if (productsToDisplay.length === 0) {
    container.innerHTML = '<div class="col-12"><div class="alert alert-info">No products found in this category.</div></div>';
    return;
  }

  container.innerHTML = productsToDisplay.map(product => `
    <div class="col-md-4 mb-4">
      <div class="card product-card h-100">
        <div style="width: 100%; height: 200px; background-color: #e9ecef; display: flex; align-items: center; justify-content: center;">
          <span style="color: #999; font-size: 3rem;">📦</span>
        </div>
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text text-muted" style="font-size: 0.9rem;">${product.description || 'Quality product'}</p>
          <p class="product-category">${product.category}</p>
          <p class="product-price">$${product.price.toFixed(2)}</p>
          <p class="text-secondary" style="font-size: 0.9rem;">Stock: ${product.stock}</p>
          <div class="btn-group w-100" role="group">
            <button type="button" class="btn btn-outline-primary btn-sm" onclick="viewProductDetails(${product.id})">View</button>
            <button type="button" class="btn btn-primary btn-sm" onclick="quickAddToCart(${product.id}, '${product.name}', ${product.price})">Add</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// Filter products by category
function filterByCategory(category) {
  currentCategory = category;
  
  // Update active button
  document.querySelectorAll('.list-group-item').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');

  if (category === 'all') {
    displayProducts(products);
  } else {
    const filtered = products.filter(p => p.category === category);
    displayProducts(filtered);
  }
}

// View product details
function viewProductDetails(productId) {
  const product = products.find(p => p.id === productId);
  if (product) {
    document.getElementById('productModalTitle').textContent = product.name;
    document.getElementById('productImage').src = 'https://via.placeholder.com/300?text=' + encodeURIComponent(product.name);
    document.getElementById('productDescription').textContent = product.description || 'High quality product';
    document.getElementById('productPrice').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('productStock').textContent = `In Stock: ${product.stock} units`;
    document.getElementById('quantity').value = 1;
    document.getElementById('quantity').max = product.stock;
    
    // Store current product ID for add to cart
    currentProductId = productId;
    
    new bootstrap.Modal(document.getElementById('productModal')).show();
  }
}

// Add to cart from modal
function addToCart() {
  const productId = currentProductId;
  const quantity = parseInt(document.getElementById('quantity').value);
  const product = products.find(p => p.id === productId);

  if (product) {
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        productId,
        name: product.name,
        price: product.price,
        quantity
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    // Show success message
    const alert = document.createElement('div');
    alert.className = 'alert alert-success alert-dismissible fade show';
    alert.innerHTML = `
      <strong>Added to cart!</strong> ${product.name} x${quantity} added successfully.
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.insertBefore(alert, document.body.firstChild);

    setTimeout(() => alert.remove(), 3000);

    // Close modal
    bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
  }
}

// Quick add to cart from product grid
function quickAddToCart(productId, productName, price) {
  const product = { id: productId, name: productName, price };
  const existingItem = cart.find(item => item.productId === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      productId,
      name: productName,
      price,
      quantity: 1
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();

  // Show success message
  const alert = document.createElement('div');
  alert.className = 'alert alert-success alert-dismissible fade show';
  alert.innerHTML = `
    <strong>Added!</strong> ${productName} added to cart.
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  document.body.insertBefore(alert, document.body.firstChild);

  setTimeout(() => alert.remove(), 2000);
}

// Update cart count
function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElement = document.getElementById('cartCount');
  if (cartCountElement) {
    cartCountElement.textContent = count;
  }
}

// Cart link navigation
if (document.getElementById('cartLink')) {
  document.getElementById('cartLink').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'cart.html';
  });
}

// Load products on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadProducts);
} else {
  loadProducts();
}
