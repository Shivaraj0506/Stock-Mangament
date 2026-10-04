let stocks = [];
let bill = [];

const stockForm = document.getElementById('stock-form');
const stockList = document.getElementById('stock-list');
const searchInput = document.getElementById('search');
const billingForm = document.getElementById('billing-form');
const billingItem = document.getElementById('billing-item');
const billingQty = document.getElementById('billing-qty');
const billList = document.getElementById('bill-list');
const billTotal = document.getElementById('bill-total');

// Add Stock Item
stockForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('item-name').value.trim();
    const quantity = parseInt(document.getElementById('quantity').value.trim());
    const price = parseFloat(document.getElementById('price').value.trim());

    if (name && quantity && price >= 0) {
        stocks.push({ name, quantity, price });
        displayStocks(stocks);
        updateBillingDropdown();
        stockForm.reset();
    }
});

// Delete Stock Item
function deleteStock(index) {
    stocks.splice(index, 1);
    displayStocks(stocks);
    updateBillingDropdown();
}

// Display Stock Items
function displayStocks(stocksToDisplay) {
    stockList.innerHTML = '';
    stocksToDisplay.forEach((stock, index) => {
        const row = `<tr>
            <td>${stock.name}</td>
            <td>${stock.quantity}</td>
            <td>${stock.price.toFixed(2)}</td>
            <td><button class="delete-btn" onclick="deleteStock(${index})">Delete</button></td>
        </tr>`;
        stockList.innerHTML += row;
    });
}

// Update dropdown in billing section
function updateBillingDropdown() {
    billingItem.innerHTML = '<option value="">Select Item</option>';
    stocks.forEach((stock, idx) => {
        billingItem.innerHTML += `<option value="${idx}">${stock.name} (In Stock: ${stock.quantity})</option>`;
    });
}

// Search Stock Items
searchInput.addEventListener('input', function() {
    const query = this.value.trim().toLowerCase();
    const filtered = stocks.filter(
        s => s.name.toLowerCase().includes(query)
    );
    displayStocks(filtered);
});

// Billing
billingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const itemIdx = billingItem.value;
    const qty = parseInt(billingQty.value.trim());

    if (itemIdx === "" || !qty || qty < 1) {
        alert("Please select an item and enter a valid quantity.");
        return;
    }

    const stockItem = stocks[itemIdx];
    if (qty > stockItem.quantity) {
        alert("Not enough stock available.");
        return;
    }

    // Check if item already in bill
    const billIdx = bill.findIndex(b => b.name === stockItem.name);
    if (billIdx > -1) {
        // Update quantity and subtotal
        if (bill[billIdx].qty + qty > stockItem.quantity) {
            alert("Not enough stock for this item in the bill.");
            return;
        }
        bill[billIdx].qty += qty;
        bill[billIdx].subtotal = bill[billIdx].qty * stockItem.price;
    } else {
        bill.push({
            name: stockItem.name,
            price: stockItem.price,
            qty: qty,
            subtotal: qty * stockItem.price
        });
    }

    // Reduce stock
    stockItem.quantity -= qty;
    displayStocks(stocks);
    updateBillingDropdown();
    displayBill();
    billingForm.reset();
});

// Display Bill
function displayBill() {
    billList.innerHTML = '';
    let total = 0;
    bill.forEach(item => {
        const row = `<tr>
            <td>${item.name}</td>
            <td>${item.price.toFixed(2)}</td>
            <td>${item.qty}</td>
            <td>${item.subtotal.toFixed(2)}</td>
        </tr>`;
        billList.innerHTML += row;
        total += item.subtotal;
    });
    billTotal.textContent = total.toFixed(2);
}

// Initial display
displayStocks(stocks);
updateBillingDropdown();
displayBill();

// Expose deleteStock to global scope for onclick
window.deleteStock = deleteStock;