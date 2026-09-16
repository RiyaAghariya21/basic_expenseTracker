// Get elements from HTML
const expenseForm = document.getElementById("expenseForm");
const expenseName = document.getElementById("expenseName");
const expenseAmount = document.getElementById("expenseAmount");
const expenseCategory = document.getElementById("expenseCategory");
                                                                               
const expenseList = document.getElementById("expenseList");
const totalAmount = document.getElementById("totalAmount");

const searchInput = document.getElementById("searchInput");
const filterCategory = document.getElementById("filterCategory");


// Get expenses from localStorage
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];


// Add Expense
expenseForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const expense = {
        id: Date.now(),
        name: expenseName.value,
        amount: Number(expenseAmount.value),
        category: expenseCategory.value
    };

    expenses.push(expense);

    saveExpenses();

    expenseForm.reset();

    displayExpenses();
});


// Save expenses to localStorage
function saveExpenses() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}


// Display expenses
function displayExpenses() {

    const searchText = searchInput.value.toLowerCase();
    const selectedCategory = filterCategory.value;

    expenseList.innerHTML = "";

    let filteredExpenses = expenses.filter(function (expense) {

        const matchesSearch =
            expense.name.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "All" ||
            expense.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });


    filteredExpenses.forEach(function (expense) {

        const expenseItem = document.createElement("div");

        expenseItem.className = "expense-item";

        expenseItem.innerHTML = `
            <div class="expense-info">
                <div class="expense-name">
                    ${expense.name}
                </div>

                <div>
                    ₹${expense.amount}
                </div>

                <div class="expense-category">
                    Category: ${expense.category}
                </div>
            </div>

            <div class="expense-actions">

                <button onclick="editExpense(${expense.id})">
                    Edit
                </button>

                <button onclick="deleteExpense(${expense.id})">
                    Delete
                </button>

            </div>
        `;

        expenseList.appendChild(expenseItem);
    });

    calculateTotal(filteredExpenses);
}


// Delete Expense
function deleteExpense(id) {

    expenses = expenses.filter(function (expense) {
        return expense.id !== id;
    });

    saveExpenses();

    displayExpenses();
}


// Edit Expense
function editExpense(id) {

    const expense = expenses.find(function (expense) {
        return expense.id === id;
    });

    if (!expense) {
        return;
    }

    const newName = prompt("Enter expense name:", expense.name);
    const newAmount = prompt("Enter amount:", expense.amount);

    if (newName !== null && newAmount !== null) {

        expense.name = newName;
        expense.amount = Number(newAmount);

        saveExpenses();

        displayExpenses();
    }
}


// Calculate Total
function calculateTotal(list) {

    const total = list.reduce(function (sum, expense) {
        return sum + expense.amount;
    }, 0);

    totalAmount.textContent = total;
}


// Search
searchInput.addEventListener("input", function () {
    displayExpenses();
});


// Filter
filterCategory.addEventListener("change", function () {
    displayExpenses();
});


// Display saved expenses when page loads
displayExpenses();