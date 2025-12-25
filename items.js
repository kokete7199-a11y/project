const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data', 'items.json');

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

function saveData(items) {
    try {
        const dir = path.dirname(DATA_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
    } catch (error) {
    }
}

function getAllItems() {
    return readData();
}

function addItem(name, price, categoryId) {
    if (typeof price !== 'number' || price <= 0) {
        throw new Error('السعر يجب أن يكون رقم أكبر من 0');
    }
    
    const items = readData();
    
    let newId = 1;
    if (items.length > 0) {
        const maxId = Math.max(...items.map(item => item.id));
        newId = maxId + 1;
    }
    
    const newItem = {
        id: newId,
        name: name,
        price: price,
        categoryId: categoryId
    };
    
    items.push(newItem);
    saveData(items);
    return newItem;
}

function listItems() {
    const items = getAllItems();
    
    if (items.length === 0) {
        console.log('لا توجد وجبات حالياً.');
        return;
    }
    
    console.log('\n=== الوجبات ===');
    items.forEach(item => {
        console.log(`${item.id}. ${item.name} - ${item.price} د.ك - الصنف: ${item.categoryId}`);
    });
    console.log('================\n');
}

function listItemsByCategory(categoryId) {
    const items = getAllItems();
    const filteredItems = items.filter(item => item.categoryId === categoryId);
    
    if (filteredItems.length === 0) {
        console.log(`لا توجد وجبات للصنف ${categoryId}.`);
        return;
    }
    
    console.log(`\n=== الوجبات للصنف ${categoryId} ===`);
    filteredItems.forEach(item => {
        console.log(`${item.id}. ${item.name} - ${item.price} د.ك`);
    });
    console.log('===========================\n');
}

module.exports = {
    getAllItems,
    addItem,
    listItems,
    listItemsByCategory
};