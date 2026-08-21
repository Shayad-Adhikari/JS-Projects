const balanceEl = document.getElementById("balance");
const incomeAmountEl = document.getElementById("income-amount");
const expenseAmountEl = document.getElementById("expense-amount");
const transactionListEl = document.getElementById("transaction-list");
const transactionFormEl = document.getElementById("transaction-form");
const descriptionEl = document.getElementById("description");
const amountEl = document.getElementById("amount");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

transactionFormEl.addEventListener("submit", addTransaction);

function addTransaction(e) {
  e.preventDefault();

  // get form values
  const description = descriptionEl.value.trim();
  const amount = parseFloat(amountEl.value);

  transactions.push({
    id: Date.now(),
    description,
    amount,
  });

  localStorage.setItem("transactions", JSON.stringify(transactions));

  updateTransactionList();
  updateSummary();

  transactionFormEl.reset();
}

function updateTransactionList() {
  transactionListEl.innerHTML = "";

  const sortedTransactions = [...transactions].reverse();

  sortedTransactions.forEach((transaction) => {
    const transactionEl = createTransactionElement(transaction);
    transactionListEl.appendChild(transactionEl);
  });
}

function createTransactionElement(transaction) {
  const li = document.createElement("li");
  li.classList.add("transaction");
  li.classList.add(transaction.amount > 0 ? "income" : "expense");

  li.innerHTML = `
    <span>${transaction.description}</span>
    <span>
  
    ${formatCurrency(transaction.amount)}
      <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    </span>
  `;

  return li;
}

function updateSummary() {
  // 100, -50, 200, -200 => 50
  const balance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);

  const income = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const expenses = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  // update ui => todo: fix the formatting
  balanceEl.textContent = formatCurrency(balance);
  incomeAmountEl.textContent = formatCurrency(income);
  expenseAmountEl.textContent = formatCurrency(expenses);
}

function formatCurrency(number) {
  const formattedNumber = Math.abs(number).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return number < 0
    ? "-रु " + formattedNumber
    : "रु " + formattedNumber;
}
function removeTransaction(id) {
  // filter out the one we wanted to delete
  transactions = transactions.filter((transaction) => transaction.id !== id);

  localStorage.setItem("transactions", JSON.stringify(transactions));

  updateTransactionList();
  updateSummary();
}

// initial render
updateTransactionList();
updateSummary();