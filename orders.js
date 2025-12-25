const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data', 'orders.json');

function readData() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            return [];
        }
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function saveData(orders) {
    try {
        const dir = path.dirname(DATA_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(DATA_FILE, JSON.stringify(orders, null, 2));
    } catch (error) {
    }
}

function createOrder(customerName) {
    const orders = readData();
    
    let newId = 1;
    if (orders.length > 0) {
        const maxId = Math.max(...orders.map(order => order.id));
        newId = maxId + 1;
    }
    
    const newOrder = {
        id: newId,
        customerName: customerName,
        orderItems: []
    };
    
    orders.push(newOrder);
    saveData(orders);
    return newOrder;
}

function addItemToOrder(orderId, item, qty) {
    if (qty <= 0) {
        throw new Error('الكمية يجب أن تكون أكبر من 0');
    }
    
    const orders = readData();
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex === -1) {
        return false;
    }
    
    const orderItem = {
        itemId: item.id,
        name: item.name,
        price: item.price,
        qty: qty,
        lineTotal: item.price * qty
    };
    
    orders[orderIndex].orderItems.push(orderItem);
    saveData(orders);
    return true;
}

function getOrderById(orderId) {
    const orders = readData();
    return orders.find(order => order.id === orderId);
}

function getOrderTotal(order) {
    if (!order || !order.orderItems || order.orderItems.length === 0) {
        return 0;
    }
    
    return order.orderItems.reduce((total, item) => {
        return total + item.lineTotal;
    }, 0);
}

function printInvoice(order) {
    if (!order) {
        console.log('الطلب غير موجود.');
        return;
    }
    
    console.log('\n========== الفاتورة ==========');
    console.log(`رقم الطلب: ${order.id}`);
    console.log(`اسم الزبون: ${order.customerName}`);
    console.log('------------------------------');
    console.log('العناصر المشتراة:');
    console.log('------------------------------');
    
    if (order.orderItems.length === 0) {
        console.log('لا توجد عناصر في هذا الطلب.');
    } else {
        order.orderItems.forEach(item => {
            console.log(`${item.name} | ${item.price} د.ك x ${item.qty} = ${item.lineTotal} د.ك`);
        });
    }
    
    console.log('------------------------------');
    const total = getOrderTotal(order);
    console.log(`المجموع الكلي: ${total} د.ك`);
    console.log('==============================\n');
}

module.exports = {
    createOrder,
    addItemToOrder,
    getOrderById,
    getOrderTotal,
    printInvoice
};