// Cart Page Functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Display cart items immediately
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    displayCartItems();
    updateAuthUI();
    if (document.getElementById('logoutBtn')) {
      document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });
    }
  });
} else {
  displayCartItems();
  updateAuthUI();
  if (document.getElementById('logoutBtn')) {
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }
}
  const container = document.getElementById('cartItems');
  
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="alert alert-info">
        Your cart is empty. <a href="index.html">Continue shopping</a>
      </div>
    `;
    document.getElementById('checkoutButtons').style.display = 'none';
    return;
  }

  container.innerHTML = cart.map((item, index) => `
    <div class="card mb-3">
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col-md-2">
            <div style="width: 100%; height: 80px; background-color: #e9ecef; display: flex; align-items: center; justify-content: center; border-radius: 0.5rem;">
              <span style="font-size: 2rem;">📦</span>
            </div>
          </div>
          <div class="col-md-5">
            <h5>${item.name}</h5>
            <p class="text-muted">Price: $${item.price.toFixed(2)}</p>
          </div>
          <div class="col-md-3">
            <div class="input-group">
              <button class="btn btn-outline-secondary btn-sm" onclick="updateQuantity(${index}, -1)">−</button>
              <input type="text" class="form-control form-control-sm text-center" value="${item.quantity}" readonly style="width: 50px;">
              <button class="btn btn-outline-secondary btn-sm" onclick="updateQuantity(${index}, 1)">+</button>
            </div>
          </div>
          <div class="col-md-2">
            <p class="fw-bold">$${(item.price * item.quantity).toFixed(2)}</p>
          </div>
          <div class="col-md-2 text-end">
            <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">Remove</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  updateOrderSummary();
}

// Update quantity
function updateQuantity(index, change) {
  cart[index].quantity += change;
  
  if (cart[index].quantity <= 0) {
    removeFromCart(index);
  } else {
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
  }
}

// Remove from cart
function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  displayCartItems();
  
  if (cart.length === 0) {
    document.getElementById('checkoutButtons').style.display = 'block';
    document.getElementById('loginPrompt').style.display = 'none';
  }
}

// Update order summary
function updateOrderSummary() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
  document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// Proceed to checkout
function proceedToCheckout() {
  if (!isLoggedIn()) {
    document.getElementById('checkoutButtons').style.display = 'none';
    document.getElementById('loginPrompt').style.display = 'block';
    return;
  }

  if (cart.length === 0) {
    alert('Your cart is empty');
    return;
  }

  // Process order
  processOrder();
}

// Process order
async function processOrder() {
  try {
    const items = cart.map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }));

    const response = await createOrder(items);

    // Show success message
    const alert = document.createElement('div');
    alert.className = 'alert alert-success alert-dismissible fade show';
    alert.innerHTML = `
      <strong>Order placed successfully!</strong> Order ID: ${response.orderId}. Total: $${response.totalAmount.toFixed(2)}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.insertBefore(alert, document.body.firstChild);

    // Clear cart
    cart = [];
    localStorage.removeItem('cart');

    setTimeout(() => {
      window.location.href = 'orders.html';
    }, 2000);
  } catch (err) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger alert-dismissible fade show';
    alert.innerHTML = `
      <strong>Error!</strong> ${err.message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.insertBefore(alert, document.body.firstChild);
  }
}

// Display cart items
function displayCartItems() {
