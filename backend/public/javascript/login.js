if(document.cookie){
  location.href = "./home.html";
}

const form = document.forms[0];
const email = form.elements.email;
const password = form.elements.password;
email.addEventListener("change", validateEmail);
form.addEventListener("submit", login);

function validateEmail() {
  let regEx = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,4})+$/;
  let div = document.getElementById("email-error");
  if (!regEx.test(email.value)) {
    return showMessage(email, div);
  } else {
    return hideMessage(email, div);
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

function clearForm() {
  email.value = "";
  password.value = "";
}

function login(event) {
  event.preventDefault();
  if(validateEmail()){
    sendData().then((response) => {
      if(response.status === "success"){
        let date = new Date();
        date.setTime(date.getTime() + (3 * 60 * 60 * 1000));
        document.cookie = `token=${response.token};expires=${date.toUTCString()};`;
        location.href = "./home.html";
      } else {
        alert(response.message);
      }
      clearForm();
    });
    return true;
  }

  showError("Please enter valid email or password");
  return false;

}

async function sendData() {

  try {
    let response = await fetch("http://localhost:3030/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        password: md5(password.value),
      }),
    });
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

