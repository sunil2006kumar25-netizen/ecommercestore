// Orders Page Functionality
async function loadOrders() {
  try {
    if (!isLoggedIn()) {
      window.location.href = 'login.html';
      return;
    }

    const orders = await getUserOrders();
    displayOrders(orders);
    updateAuthUI();
  } catch (err) {
    console.error('Error loading orders:', err);
    document.getElementById('ordersContainer').innerHTML = 
      '<div class="alert alert-danger">Failed to load orders. Please try again later.</div>';
  }
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    loadOrders();
    if (document.getElementById('logoutBtn')) {
      document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });
    }
  });
} else {
  loadOrders();
  if (document.getElementById('logoutBtn')) {
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }
}

function displayOrders(orders) {
  const container = document.getElementById('ordersContainer');

  if (orders.length === 0) {
    container.innerHTML = '<div class="alert alert-info">You have no orders yet. <a href="index.html">Start shopping</a></div>';
    return;
  }

  container.innerHTML = `
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Date</th>
          <th>Items</th>
          <th>Total</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${orders.map(order => `
          <tr>
            <td>#${order.id}</td>
            <td>${new Date(order.created_at).toLocaleDateString()}</td>
            <td>${order.itemCount} item(s)</td>
            <td>$${order.total_amount.toFixed(2)}</td>
            <td>
              <span class="badge ${order.status === 'completed' ? 'bg-success' : 'bg-warning'}">
                ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </td>
            <td>
              <button class="btn btn-sm btn-primary" onclick="viewOrderDetails(${order.id})">View</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

async function viewOrderDetails(orderId) {
  try {
    const order = await getOrderById(orderId);
    displayOrderDetailsModal(order);
  } catch (err) {
    console.error('Error loading order details:', err);
    alert('Failed to load order details');
  }
}

function displayOrderDetailsModal(order) {
  const content = document.getElementById('orderDetailsContent');
  
  content.innerHTML = `
    <div class="mb-3">
      <h6>Order #${order.id}</h6>
      <p class="text-muted">
        ${new Date(order.created_at).toLocaleString()}<br>
        Status: <span class="badge ${order.status === 'completed' ? 'bg-success' : 'bg-warning'}">${order.status}</span>
      </p>
    </div>

    <h6 class="mt-4 mb-3">Order Items</h6>
    <div class="table-responsive">
      <table class="table table-sm">
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map(item => `
            <tr>
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>$${item.price.toFixed(2)}</td>
              <td>$${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="border-top pt-3">
      <div class="row">
        <div class="col-md-6"></div>
        <div class="col-md-6">
          <div class="d-flex justify-content-between mb-2">
            <span>Subtotal:</span>
            <span>$${(order.total_amount / 1.1).toFixed(2)}</span>
          </div>
          <div class="d-flex justify-content-between mb-2">
            <span>Tax (10%):</span>
            <span>$${(order.total_amount - (order.total_amount / 1.1)).toFixed(2)}</span>
          </div>
          <div class="d-flex justify-content-between fw-bold">
            <span>Total:</span>
            <span>$${order.total_amount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  new bootstrap.Modal(document.getElementById('orderDetailsModal')).show();
}


