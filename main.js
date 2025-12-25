const readline = require('readline');
const categories = require('./categories');
const items = require('./items');
const orders = require('./orders');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function showMenu() {
    console.log('\n========== نظام المطعم ==========');
    console.log('1. إضافة صنف');
    console.log('2. عرض الأصناف');
    console.log('3. إضافة وجبة');
    console.log('4. عرض الوجبات');
    console.log('5. عرض الوجبات حسب الصنف');
    console.log('6. إنشاء طلب جديد');
    console.log('7. إضافة وجبة للطلب');
    console.log('8. طباعة فاتورة');
    console.log('9. خروج');
    console.log('=================================\n');
}

function handleChoice(choice) {
    switch (choice) {
        case '1':
            rl.question('أدخل اسم الصنف: ', (name) => {
                const newCategory = categories.addCategory(name);
                console.log(`تم إضافة الصنف "${newCategory.name}" بنجاح!`);
                showMenuAndPrompt();
            });
            break;
            
        case '2':
            categories.listCategories();
            showMenuAndPrompt();
            break;
            
        case '3':
            rl.question('أدخل اسم الوجبة: ', (name) => {
                rl.question('أدخل سعر الوجبة: ', (priceInput) => {
                    const price = parseFloat(priceInput);
                    if (isNaN(price) || price <= 0) {
                        console.error('السعر يجب أن يكون رقم أكبر من 0!');
                        showMenuAndPrompt();
                        return;
                    }
                    
                    rl.question('أدخل رقم الصنف: ', (categoryIdInput) => {
                        const categoryId = parseInt(categoryIdInput);
                        
                        try {
                            const newItem = items.addItem(name, price, categoryId);
                            console.log(`تم إضافة الوجبة "${newItem.name}" بنجاح!`);
                            showMenuAndPrompt();
                        } catch (error) {
                            console.error('حدث خطأ:', error.message);
                            showMenuAndPrompt();
                        }
                    });
                });
            });
            break;
            
        case '4':
            items.listItems();
            showMenuAndPrompt();
            break;
            
        case '5':
            rl.question('أدخل رقم الصنف: ', (categoryIdInput) => {
                const categoryId = parseInt(categoryIdInput);
                items.listItemsByCategory(categoryId);
                showMenuAndPrompt();
            });
            break;
            
        case '6':
            rl.question('أدخل اسم الزبون: ', (customerName) => {
                const newOrder = orders.createOrder(customerName);
                console.log(`تم إنشاء طلب جديد برقم ${newOrder.id} للزبون ${newOrder.customerName}`);
                showMenuAndPrompt();
            });
            break;
            
        case '7':
            rl.question('أدخل رقم الطلب: ', (orderIdInput) => {
                const orderId = parseInt(orderIdInput);
                const order = orders.getOrderById(orderId);
                
                if (!order) {
                    console.error('الطلب غير موجود!');
                    showMenuAndPrompt();
                    return;
                }
                
                rl.question('أدخل رقم الوجبة: ', (itemIdInput) => {
                    const allItems = items.getAllItems();
                    const itemId = parseInt(itemIdInput);
                    const item = allItems.find(i => i.id === itemId);
                    
                    if (!item) {
                        console.error('الوجبة غير موجودة!');
                        showMenuAndPrompt();
                        return;
                    }
                    
                    rl.question('أدخل الكمية: ', (qtyInput) => {
                        const qty = parseInt(qtyInput);
                        
                        if (isNaN(qty) || qty <= 0) {
                            console.error('الكمية يجب أن تكون رقم أكبر من 0!');
                            showMenuAndPrompt();
                            return;
                        }
                        
                        try {
                            const success = orders.addItemToOrder(orderId, item, qty);
                            if (success) {
                                console.log('تم إضافة الوجبة إلى الطلب بنجاح!');
                            } else {
                                console.error('فشل إضافة الوجبة إلى الطلب!');
                            }
                            showMenuAndPrompt();
                        } catch (error) {
                            console.error('حدث خطأ:', error.message);
                            showMenuAndPrompt();
                        }
                    });
                });
            });
            break;
            
        case '8':
            rl.question('أدخل رقم الطلب: ', (orderIdInput) => {
                const orderId = parseInt(orderIdInput);
                const order = orders.getOrderById(orderId);
                orders.printInvoice(order);
                showMenuAndPrompt();
            });
            break;
            
        case '9':
            console.log('شكراً لاستخدامكم نظام المطعم. إلى اللقاء!');
            rl.close();
            break;
            
        default:
            console.log('خيار غير صالح. الرجاء اختيار رقم من 1 إلى 9.');
            showMenuAndPrompt();
            break;
    }
}

function showMenuAndPrompt() {
    showMenu();
    rl.question('اختر رقم الخيار: ', handleChoice);
}

console.log('مرحباً بك في نظام إدارة المطعم!');
showMenuAndPrompt();