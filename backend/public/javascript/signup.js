if(document.cookie){
  location.href = "./home.html";
}

const form = document.forms[0];
const name = form.elements.name;
const email = form.elements.email;
const password = form.elements.password;
const confirmPassword = form.elements.confirmPassword;4
const avatar = form.elements.avatar;

name.addEventListener("change", validateName);
email.addEventListener("change", validateEmail);
password.addEventListener("change", validatePassword);
confirmPassword.addEventListener("change", validateConfirmPassword);
form.addEventListener("submit", submitForm);


//------------------FORM SUBMISSION--------------------
function submitForm(event) {
  event.preventDefault();
  if (
    validateName() &&
    validateEmail() &&
    validatePassword() &&
    validateConfirmPassword()
  ) {
   
    sendData().then((response) => {
        if(response.status === "success"){
          location.href = "./login.html"; 
        } else {
          alert(response.message);
        }   
        clearForm();
    })
    return true;
  }
  alert("PLEASE CHECK THE INVALID FIELDS");
  return false;
}

async function sendData() {
  const formData = new FormData(form);
  formData.set("password", md5(password.value));
  formData.delete("confirmPassword");

  try {
    let response = await fetch("http://localhost:3030/signup", {
      method: "POST",
      body: formData,
    })
    return await response.json();
  } catch (error) {
    console.log("some error occured");
  }
}


//--------------------VALIDATION------------------------
function validateName() {
  let regEx = /^[a-zA-Z ]+$/;
  let div = document.getElementById("name-error");
  if (!regEx.test(name.value)) {
    return showMessage(name, div);
  } else {
    return hideMessage(name, div);
  }
}

function validateEmail() {
  let regEx = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,4})+$/;
  let div = document.getElementById("email-error");
  if (!regEx.test(email.value)) {
    return showMessage(email, div);
  } else {
    return hideMessage(email, div);
  }
}

function validatePassword() {
  let div = document.getElementById("password-error");
  if (password.value.length < 6 || password.value.split(" ").length > 1) {
    return showMessage(password, div);
  } else {
    return hideMessage(password, div);
  }
}

function validateConfirmPassword() {
  let div = document.getElementById("confirm-password-error");
  if (password.value !== confirmPassword.value) {
    return showMessage(confirmPassword, div);
  } else {
    return hideMessage(confirmPassword, div);
  }
}

function showMessage(elem, div) {
  elem.classList.add("border-danger");
  div.removeAttribute("hidden");
  return false;
}

function hideMessage(elem, div) {
  elem.classList.remove("border-danger");
  div.setAttribute("hidden", "true");
  return true;
}

function clearForm(){
  name.value = "";
  email.value = "";
  password.value = "";
  confirmPassword.value = "";
}

