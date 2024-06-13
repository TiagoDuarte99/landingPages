const lang = document.documentElement.lang;

const messageDivContact = document.getElementById('messageApiContact');
const closeButtonContact1 = document.getElementById('closeModalContact1');
const closeButtonContact2 = document.getElementById('closeModalContact2');

const nameInput = document.getElementById('name');
const email = document.getElementById('email');
const city = document.getElementById('city');
const phoneNumber = document.getElementById('phoneNumber');
const company = document.getElementById('company');
const message = document.getElementById('message');
const politics = document.getElementById('politics');


closeButtonContact1.addEventListener('click', clearMessageContact);
closeButtonContact2.addEventListener('click', clearMessageContact);
function clearMessageContact() {
  messageDivContact.innerHTML = '';
  nameInput.value = '';
  email.value = '';
  city.value = '';
  phoneNumber.value = '';
  company.value = '';
  message.value = '';
  politics.checked = false
}

document.getElementById('buttonContact').addEventListener('click', async function () {

  const loaderEmail = document.getElementById('loaderEmail');
  loaderEmail.style.display = 'block';


  // Define o URL para enviar o formulário
  const url = `${urlBase}sendEmail`;


  // Chama grecaptcha.execute() para obter o token do reCAPTCHA
  grecaptcha.ready(function () {
    grecaptcha.execute('6LfQT50pAAAAALU2JP8QSEjBo8nZVpEQiaGJjwi4', { action: 'submit' }).then(async function (token) {

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: nameInput.value,
          email: email.value,
          city: city.value,
          phoneNumber: phoneNumber.value,
          company: company.value,
          message: message.value,
          politics: politics.checked,
          valueLang: lang,
          recaptchaToken: token,
          page: namePage
        }),
      });

      // Processa a resposta do backend
      const data = await response.json();
      if (data.success) {
        messageDivContact.innerHTML = '<div class="alert alert-success">' + data.message + '</div>';
        loaderEmail.style.display = 'none';

      } else {
        let errorMessageHTML = '<div class="alert alert-warning">';
        for (const key in data.errors) {
          if (data.errors.hasOwnProperty(key)) {
            const errorMessages = data.errors[key];
            errorMessages.forEach(errorMessage => {
              errorMessageHTML += '<p>' + errorMessage + '</p>';
            });
          }
        }
        errorMessageHTML += '</div>';
        messageDivContact.innerHTML = errorMessageHTML;
        loaderEmail.style.display = 'none';
      }
    });
  });
});

function validateForm() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phoneNumber = document.getElementById('phoneNumber').value;
  const city = document.getElementById('city').value;
  const company = document.getElementById('company').value;
  const message = document.getElementById('message').value;
  const isChecked = document.getElementById('politics').checked;

  const button = document.getElementById('buttonContact');

  button.disabled = !name || !email || !phoneNumber || !city || !company || !message || !isChecked;
}

document.getElementById('contact-form').addEventListener('change', validateForm);