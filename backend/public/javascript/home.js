if (!document.cookie) {
  location.href = "./login.html";
}

const logoutIcon = document.getElementById("logout");
const addBtn = document.getElementById("addPage");
const pageListDiv = document.getElementById("page-list");
const noPageFound = document.getElementById("no-page-found");
const loadingMessage = document.getElementById("loading-msg");
const pagesFoundDiv = document.getElementById("pages-found");
localStorage.clear();

function addPageListener(){
  location.href = "createPage.html";
}

logoutIcon.addEventListener("click", () => {
  document.cookie = document.cookie + ";max-age=0";
  location.href = "./login.html";
});

getMyPagesList();
getAvatar();

async function getMyPagesList() {
  try {
    const token = document.cookie.split(";")[0].split("=")[1];

    const response = await fetch("http://localhost:3030/mypages", {
      method: "GET",
      headers: {
        authorization: "Bearer " + token,
      },
    });

    const jsonObj = await response.json();

    if (jsonObj.status === "success") {  
      const myPagesList = jsonObj.data.mypages;
      showList(myPagesList);
    } else {
      noPageFound.classList.remove("d-none");
      pagesFoundDiv.classList.add("d-none");
      console.log(jsonObj.message);
    }
    loadingMessage.classList.add("d-none");
  } catch (err) {
    console.log(err);
  }
}

function showList(myPagesList){
  myPagesList.forEach(page => {
    pageListDiv.append(createPageDiv(page));
  });
}

function createPageDiv(page){
  const pageDiv = document.createElement("div");
  pageDiv.id = page._id;
  pageDiv.className = "border rounded-3 px-4 py-3 mx-5 mb-3";

  const titleStatusDiv = document.createElement("div");
  titleStatusDiv.className = "d-flex justify-content-between mb-3";

  const title = document.createElement("h5");
  title.innerText = page.title;

  const status = document.createElement("span");
  status.innerText = page.status;
  status.id = `${page.status}-tag`;

  titleStatusDiv.append(title, status);

  const subText = document.createElement("p");
  subText.innerText = page.subText;
  subText.className = "mb-4";

  const viewBtn = document.createElement("button");
  viewBtn.className = "me-3";
  viewBtn.addEventListener("click", editViewPreviewPage);
  
  if(page.status === "published"){ 
    viewBtn.id = "viewBtn";
    viewBtn.innerText = "View";
  } else {
    viewBtn.id = "previewBtn";
    viewBtn.innerText = "Preview";
  }
  
  const editBtn = document.createElement("button");
  editBtn.id = "editBtn";
  editBtn.innerText = "Edit";
  editBtn.className = "me-3 px-3 greenBtn";
  editBtn.addEventListener("click", editViewPreviewPage);

  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "Delete";
  deleteBtn.id = "deleteBtn";
  deleteBtn.addEventListener("click", deletePage);

  pageDiv.append(titleStatusDiv, subText, viewBtn, editBtn, deleteBtn);
  return pageDiv;
}

async function getAvatar() {
  const profile = document.getElementById("profilepic");
  try {
    const token = document.cookie.split(";")[0].split("=")[1];

  const response = await fetch("http://localhost:3030/file", {
    method: "GET",
    headers: {
      authorization: "Bearer " + token,
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

async function deletePage(event){
    const parentDiv = event.target.parentElement;
    const pageId = parentDiv.id;
    const token = document.cookie.split(";")[0].split("=")[1];
    try {
      let response = await fetch(`http://localhost:3030/deletePage/${pageId}`, {
        method: "DELETE",
        headers: {
          authorization: "Bearer " + token,
        }
      });
      parentDiv.remove();
    } catch(error){
      console.log(error);
    }
}

async function editViewPreviewPage(event){
  const btn = event.target;
  const parentDiv = btn.parentElement;
  const pageId = parentDiv.id;
  const token = document.cookie.split(";")[0].split("=")[1];
  try {
    let response = await fetch(`http://localhost:3030/page/${pageId}`, {
      method: "GET",
      headers: {
        authorization: "Bearer " + token,
      }
    });
    let jsonObj = await response.json();
    
    if(jsonObj.status === "success"){
      if(btn.id === "editBtn"){
        localStorage.setItem("editPage", JSON.stringify(jsonObj.data.page));
        location.href = "./createPage.html";
      } else if(btn.id === "viewBtn"){
        location.href = `http://localhost:5000${jsonObj.data.page.pageUrl}`;
      } else {
        localStorage.setItem("previewPage", JSON.stringify(jsonObj.data.page));
        location.href = "./preview.html";
      }
 
    } else {
      alert("SERVER ERROR! PLEASE TRY AGAIN IN SOME TIME");
    }   
  } catch(error){
    console.log(error);
  }
}












