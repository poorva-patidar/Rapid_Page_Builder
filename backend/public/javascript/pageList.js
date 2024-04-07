if (!document.cookie) {
  location.href = "./login.html";
}

const logoutIcon = document.getElementById("logout");
const searchBar = document.getElementById("search-bar");
const dropdownlist = document.getElementById("dropdown-list");

getAllPagesList();
getAvatar();

searchBar.addEventListener("input", search);
dropdownlist.addEventListener("click", filterByTag);

logoutIcon.addEventListener("click", () => {
  document.cookie = document.cookie + ";max-age=0";
  location.href = "./login.html";
});

function addPageListener() {
  location.href = "createPage.html";
}

async function getAllPagesList() {
  try {
    const token = document.cookie.split(";")[0].split("=")[1];

    const response = await fetch("http://localhost:3030/pages", {
      method: "GET",
      headers: {
        authorization: "Bearer " + token,
      },
    });

    const jsonObj = await response.json();
    const loadingMessage = document.getElementById("loading-msg");
    if (jsonObj.status === "success") {
      loadingMessage.innerText = "fetching pages...";
      const allPagesList = jsonObj.data.pages;
      loadingMessage.classList.add("d-none");
      showList(allPagesList);
    } else {
      console.log(jsonObj.message);
      loadingMessage.innerText = "No pages found";
    }
  } catch (err) {
    console.log(err);
  }
}

function showList(myPagesList) {
  const pageList = document.getElementsByTagName("tbody")[0];
  myPagesList.forEach((page) => {
    pageList.append(createRow(page));
  });
}

function createRow(page) {
  const tr = document.createElement("tr");
  tr.id = page._id;

  const title = document.createElement("td");
  title.innerText = page.title;
  title.className = "py-3";

  const url = document.createElement("td");
  url.innerText = page.pageUrl;
  url.className = "py-3";

  const createdBy = document.createElement("td");
  createdBy.innerText = page.createdBy;
  createdBy.className = "py-3";

  const createdAt = document.createElement("td");
  createdAt.innerText = getFormattedDate(page.createdAt);
  createdAt.className = "py-3";

  const modifiedAt = document.createElement("td");
  modifiedAt.innerText = getFormattedDate(page.modifiedAt);
  modifiedAt.className = "py-3";

  const statustd = document.createElement("td");
  statustd.className = "py-3";
  const status = document.createElement("span");
  status.innerText = page.status;
  status.id = `${page.status}-tag`;
  statustd.append(status);

  tr.append(title, url, createdBy, createdAt, modifiedAt, statustd);
  return tr;
}

function getFormattedDate(dateString) {
  const date = new Date(dateString);
  return (
    date.toLocaleDateString("en-GB") + " , " + date.toLocaleTimeString("en-US")
  );
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
    if (data.type === "text/html" || data.type === "application/json") {
      profile.setAttribute("src", "../images/profile-default.svg");
    } else {
      const dataString = window.URL.createObjectURL(data);
      profile.setAttribute("src", dataString);
    }
  } catch (err) {
    console.log(err);
  }
}

function search(event) {
  let list = document.querySelectorAll("tr");
  let value = event.target.value;
  let regex = new RegExp(value, "gi");
  list.forEach((listItem, index) => {
    if (index !== 0) {
      let title = listItem.firstElementChild.innerText;
      if (!regex.test(title)) {
        listItem.classList.add("d-none");
      } else {
        listItem.classList.remove("d-none");
      }
    }
  });
}

function filterByTag(event) {
  event.preventDefault();
  let list = document.querySelectorAll("tr");
  if (event.target.id !== "all") {
    list.forEach((listItem, index) => {
      let status = listItem.lastElementChild.innerText;
      if (index !== 0) {
        if (status !== event.target.id) {
          listItem.classList.add("d-none");
        } else {
          listItem.classList.remove("d-none");
        }
      }
    });
  } else {
    list.forEach((listItem, index) => {
      if (index !== 0) {
        listItem.classList.remove("d-none");
      }
    });
  }
}
