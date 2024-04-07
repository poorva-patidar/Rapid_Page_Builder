if (!document.cookie) {
  location.href = "./login.html";
}

// -------------LOGOUT----------------------------------
const logoutIcon = document.getElementById("logout");
logoutIcon.addEventListener("click", () => {
  document.cookie = document.cookie + ";max-age=0";
  location.href = "./login.html";
});
//------------------------------------------------------


//--------------QUILL-----------------------------------
const quill = new Quill("#editor", {
  theme: "snow",
  modules: {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  },
});
//------------------------------------------------------

const form1 = document.forms[0];
const form2 = document.forms[1];
const modalForm = document.forms[2];

const pageTitle = document.getElementById("pageTitle");
const pageStatusSpan = document.getElementById("draft-tag");

const title = form1.elements.title;
const subText = form1.elements.subText;
const attachment = form1.elements.attachment;

const url = form2.elements.url;
const author = form2.elements.author;
const authorCheck = form2.elements.authorCheck;

const cancelBtn = document.getElementById("cancelBtn");
const saveBtn = document.getElementById("saveBtn");
const publishBtn = document.getElementById("publishBtn");
const modalPublishBtn = document.getElementById("modalPublishBtn");
const profile = document.getElementById("profilepic");
const preview = document.getElementById("preview");
const modalPublishDate = modalForm.elements.modalPublishDate;
const modalPublishTime = modalForm.elements.modalPublishTime;
let editPageId;
let publishTime;
let pageStatus = "draft";
let today = new Date();
let month = today.getMonth() + 1;
let date = today.getDate();
modalPublishDate.setAttribute("min", `${today.getFullYear()}-${month < 10 ? "0" + month: month}-${date < 10 ? "0" + date: date}`);

getAvatar();
renderEditPage();

cancelBtn.addEventListener("click", clearChanges);
saveBtn.addEventListener("click", postData);
modalPublishBtn.addEventListener("click", getPublishTime);
modalPublishBtn.addEventListener("click", postData);
title.addEventListener("change", changeTitle);
preview.addEventListener("click", showPreview);

function changeTitle(){
  if (title.value.trim() !== "") {
    pageTitle.innerText = title.value;
  } else {
    pageTitle.innerText = "No title";
  }
}

function clearChanges() {
  title.value = "";
  subText.value = "";
  attachment.value = "";
  url.value = "";
  author.value = "";
  pageTitle.innerText = "No title";
  publishTime = undefined;
  quill.deleteText(0, quill.getLength());
  pageStatusSpan.innerText = "Draft";
  pageStatusSpan.id = "draft-tag";

  if (authorCheck.checked) {
    authorCheck.checked = false;
  }
}

function getPublishTime() {
  if (!modalPublishDate.value || !modalPublishTime.value) {
    alert("please enter required fields");
    return false;
  }

  const time = modalPublishTime.value.split(":");
  const date = new Date(modalPublishDate.value);
  date.setHours(time[0]);
  date.setMinutes(time[1]);
  publishTime = date;
  pageStatus = "scheduled";
}

async function postData(event) {
  const content = quill.getSemanticHTML(0);
  if (!title.value || !content || !url.value || !author.value) {
    alert("Please enter required fields");
    return false;
  } else {
    sendData(event).then((response) => {
      if (response.status === "success") {
        alert("Page saved successfully");
        location.href = "./home.html";
      } else {
        if(response.message.includes("duplicate")){
          alert("URL MUST BE UNIQUE");
        } else {
          alert("SERVER ERROR PLEASE AGAIN LATER!");
        }
        console.log(response.message);
      }
    });
    return true;
  }
}

async function sendData(event) {
  const content = quill.getSemanticHTML(0);

  const data = new FormData(form1);
  data.append("content", content);
  data.append("createdBy", author.value);
  data.append("modifiedAt", Date.now());
  data.append("status", pageStatus);
  data.append("showAuthor", authorCheck.checked);
  let URL = url.value;
  let apiUrl = "http://localhost:3030/draftPage";
  let reqMethod = "POST";

  if(URL.startsWith("/")){
    data.append("pageUrl", URL);
  } else {
    data.append("pageUrl", "/" + URL);
  }

  if (event.target.id === "modalPublishBtn") {
    apiUrl = "http://localhost:3030/addPage";
    data.append("publishTime", publishTime);
    data.append("createdAt", Date.now());
  } else if ( event.target.id === "update" ) {
    apiUrl = `http://localhost:3030/updatePage/${editPageId}`;
    reqMethod = "PATCH";
    data.append("publishTime", publishTime);
  } else if( event.target.id === "updateDraft"){
    apiUrl = `http://localhost:3030/updatePage/${editPageId}`;
    reqMethod = "PATCH";
  }

  try {
    let response = await fetch(apiUrl, {
      method: reqMethod,
      headers: {
        Authorization: getToken(),
      },
      body: data,
    });
    return await response.json();
  } catch (error) {
    alert("Some error occurred. Please try again in some time!");
    console.log(error);
  }
}

function getToken() {
  return "Bearer " + document.cookie.split(";")[0].split("=")[1];
}

function renderEditPage() {
  let editPageInfo = JSON.parse(localStorage.getItem("editPage"));
  localStorage.removeItem("editPage");
  let editorBody = document.getElementsByClassName("ql-editor")[0];

  if (editPageInfo) {
    
    editPageId = editPageInfo._id;
    pageTitle.innerText = editPageInfo.title;
    title.value = editPageInfo.title;
    subText.value = editPageInfo.subText;
    editorBody.innerHTML = editPageInfo.content;
    url.value = editPageInfo.pageUrl;
    author.value = editPageInfo.createdBy;
    pageStatusSpan.innerText = editPageInfo.status;
    pageStatusSpan.id = `${editPageInfo.status}-tag`;
    modalPublishDate.value = "";
    modalPublishTime.value = "";

    if (editPageInfo.showAuthor) {
      authorCheck.checked = true;
    }

    publishBtn.innerText = "Update";
    modalPublishBtn.id = "update";
    modalPublishBtn.innerText = "Update";
    saveBtn.setAttribute("disabled", "true");
    saveBtn.classList.add("disabledBtn");

    if (editPageInfo.status === "draft") {
      saveBtn.removeAttribute("disabled");
      saveBtn.classList.remove("disabledBtn");
      saveBtn.id = "updateDraft";
    }
  }
}

async function getAvatar() {
  try {
  const response = await fetch("http://localhost:3030/file", {
    method: "GET",
    headers: {
      authorization: getToken(),
    },
  });

  const data = await response.blob();
  if(data.type === "text/html" || data.type === "application/json"){
    profile.setAttribute("src", "../images/profile-default.svg");
  } else {
    const dataString = window.URL.createObjectURL(data);
    profile.setAttribute("src", dataString);
  }
  
  } catch(err){
    console.log(err);
  }
}

function showPreview(){
  localStorage.setItem("createPreview", JSON.stringify({
    title: title.value,
    subText: subText.value,
    content: quill.getSemanticHTML(0),
    showAuthor: authorCheck.checked,
    status: pageStatus,
    publishDate: publishTime,
    createdBy: author.value,
  }));

  location.href = "./preview.html";
}