const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data', 'categories.json');

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

function saveData(categories) {
    try {
        const dir = path.dirname(DATA_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(DATA_FILE, JSON.stringify(categories, null, 2));
    } catch (error) {
    }
}

function getAllCategories() {
    return readData();
}

function addCategory(name) {
    const categories = readData();
    
    let newId = 1;
    if (categories.length > 0) {
        const maxId = Math.max(...categories.map(cat => cat.id));
        newId = maxId + 1;
    }
    
    const newCategory = {
        id: newId,
        name: name
    };
    
    categories.push(newCategory);
    saveData(categories);
    return newCategory;
}

function listCategories() {
    const categories = getAllCategories();
    
    if (categories.length === 0) {
        console.log('لا توجد أصناف حالياً.');
        return;
    }
    
    console.log('\n=== الأصناف ===');
    categories.forEach(category => {
        console.log(`${category.id}. ${category.name}`);
    });
    console.log('================\n');
}

function findCategoryById(id) {
    const categories = getAllCategories();
    return categories.find(category => category.id === id);
}

module.exports = {
    getAllCategories,
    addCategory,
    listCategories,
    findCategoryById
};