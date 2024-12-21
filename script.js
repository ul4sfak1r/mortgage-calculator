const button = document.querySelector('button');
const inputFields = Array.from(document.querySelectorAll('input'));
const radioButtons = Array.from(document.querySelectorAll('input[type="radio"]'));
const clearAll = document.querySelector('.clear-all');

button.addEventListener('click', () => {
  const errorMessages = document.querySelectorAll('.error-message');
  errorMessages.forEach((error) => error.remove()); // Remove existing errors

  inputFields.forEach((field) => {
    field.classList.remove('red-border');
    const sibling = field.previousElementSibling || field.nextElementSibling;
    if (sibling) sibling.classList.remove('red-border', 'red-background');
  });

  let isRadioChecked = radioButtons.some((radio) => radio.checked);

  if (!isRadioChecked) {
    const radioError = document.getElementById('radio-buttons-div').nextElementSibling;
    if (!radioError) {
      document
        .getElementById('radio-buttons-div')
        .insertAdjacentHTML('afterend', '<p class="error-message">This field is required</p>');
    }
  }

  inputFields.forEach((field) => {
    if (field.value.trim() === '') {
      if (!field.classList.contains('red-border')) {
        field.closest('.input-div').insertAdjacentHTML('afterend', '<p class="error-message">This field is required</p>');
        field.classList.add('red-border');
        const sibling = field.previousElementSibling || field.nextElementSibling;
        if (sibling) sibling.classList.add('red-border', 'red-background');
      }
    }
  });

  if (inputFields.every((field) => field.value.trim() !== '') && isRadioChecked) {
    const noResultDiv = document.querySelector('.no-result-div');
    const hiddenDiv = document.querySelector('.hidden-div');
    const amount = parseFloat(document.getElementById('mortgage-amount').value);
    const term = parseFloat(document.getElementById('term').value);
    const annualRate = parseFloat(document.getElementById('rate').value);
    const type = document.querySelector('input[name="mortgage-type"]:checked').value;

    const monthlyRate = (annualRate / 100) / 12;
    const totalPayments = term * 12;

    let monthlyRepayment, totalRepayment;

    if (type === 'repayment') {
      monthlyRepayment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalPayments));
      totalRepayment = monthlyRepayment * totalPayments;
    } else if (type === 'interest-only') {
      monthlyRepayment = amount * monthlyRate;
      totalRepayment = monthlyRepayment * totalPayments;
    }

    document.querySelector('.monthly-repayment').textContent = `£${monthlyRepayment.toFixed(2)}`;
    document.querySelector('.total-repayment').textContent = `£${totalRepayment.toFixed(2)}`;
    noResultDiv.classList.add('hidden');
    hiddenDiv.classList.remove('hidden');
  }
});

clearAll.addEventListener('click', () => {
  inputFields.forEach((field) => {
    field.value = '';
    field.classList.remove('red-border');
    const sibling = field.previousElementSibling || field.nextElementSibling;
    if (sibling) sibling.classList.remove('red-border', 'red-background');
  });

  radioButtons.forEach((radio) => (radio.checked = false));

  const errorMessages = document.querySelectorAll('.error-message');
  errorMessages.forEach((error) => error.remove());

  const noResultDiv = document.querySelector('.no-result-div');
  const hiddenDiv = document.querySelector('.hidden-div');
  noResultDiv.classList.remove('hidden');
  hiddenDiv.classList.add('hidden');
});
