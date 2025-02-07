let price = 3.26;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];

const changeDueDisplay = document.getElementById('change-due');
const cashInput = document.getElementById('cash');
const purchaseButton = document.getElementById('purchase-btn');
const priceDisplay = document.getElementById('price-screen');
const drawerDisplay = document.getElementById('cash-drawer-display');

const formatChangeDisplay = (status, change) => {
  changeDueDisplay.innerHTML = `<p>Status: ${status}</p>`;
  changeDueDisplay.innerHTML += change
    .map(
      ([denomination, amount]) => `<p>${denomination}: $${amount}</p>`
    )
    .join('');
};

const processPayment = () => {
  const cashInserted = Math.round(Number(cashInput.value) * 100);
  const totalPrice = Math.round(price * 100);

  if (cashInserted < totalPrice) {
    alert('Customer does not have enough money to purchase the item');
    cashInput.value = '';
    return;
  }

  if (cashInserted === totalPrice) {
    changeDueDisplay.innerHTML = '<p>No change due - customer paid with exact cash</p>';
    cashInput.value = '';
    return;
  }

  let changeAmount = cashInserted - totalPrice;
  const reversedCid = [...cid]
    .reverse()
    .map(([denomination, amount]) => [denomination, Math.round(amount * 100)]);

  const denominationValues = [10000, 2000, 1000, 500, 100, 25, 10, 5, 1];
  const result = { status: 'OPEN', change: [] };
  const totalCashInDrawer = reversedCid.reduce((accum, [, amount]) => accum + amount, 0);

  if (totalCashInDrawer < changeAmount) {
    changeDueDisplay.innerHTML = '<p>Status: INSUFFICIENT_FUNDS</p>';
    return;
  }

  if (totalCashInDrawer === changeAmount) {
    result.status = 'CLOSED';
  }

  for (let i = 0; i < reversedCid.length; i++) {
    if (changeAmount >= denominationValues[i] && changeAmount > 0) {
      const [denomination, total] = reversedCid[i];
      const possibleChange = Math.min(total, changeAmount);
      const count = Math.floor(possibleChange / denominationValues[i]);
      const changeToGive = count * denominationValues[i];
      changeAmount -= changeToGive;

      if (count > 0) {
        result.change.push([denomination, changeToGive / 100]);
      }
    }
  }

  if (changeAmount > 0) {
    changeDueDisplay.innerHTML = '<p>Status: INSUFFICIENT_FUNDS</p>';
    return;
  }

  formatChangeDisplay(result.status, result.change);
  updateUI(result.change);
};

const checkPayment = () => {
  if (!cashInput.value) return;
  processPayment();
};

const updateUI = change => {
  const currencyNameMap = {
    PENNY: 'Pennies',
    NICKEL: 'Nickels',
    DIME: 'Dimes',
    QUARTER: 'Quarters',
    ONE: 'Ones',
    FIVE: 'Fives',
    TEN: 'Tens',
    TWENTY: 'Twenties',
    'ONE HUNDRED': 'Hundreds'
  };

  if (change) {
    change.forEach(([denomination, amount]) => {
      const targetCurrency = cid.find(([denominationName, _]) => denominationName === denomination);
      targetCurrency[1] = (Math.round(targetCurrency[1] * 100) - Math.round(amount * 100)) / 100;
    });
  }

  cashInput.value = '';
  priceDisplay.textContent = `Total: $${price}`;
  drawerDisplay.innerHTML = `<p><strong>In drawer: </strong></p>
    ${cid
      .map(
        ([denomination, amount]) =>
          `<p>${currencyNameMap[denomination]}: $${amount}</p>`
      )
      .join('')}
  `;
};

purchaseButton.addEventListener('click', checkPayment);

updateUI();
