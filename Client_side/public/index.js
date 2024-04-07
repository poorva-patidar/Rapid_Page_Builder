const pageListDiv = document.getElementById("page-list");
const noPageFound = document.getElementById("no-page-found");
const loadingMessage = document.getElementById("loading-msg");
const pagesFoundDiv = document.getElementById("pages-found");

getPagesList();

async function getPagesList() {
  try {
    const response = await fetch("http://localhost:3030/publishedpages", {
      method: "GET",
    });

    const jsonObj = await response.json();

    if (jsonObj.status === "success") {
      const pagesList = jsonObj.data.pages;
      showList(pagesList);
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

function showList(pagesList) {
  pagesList.forEach((page) => {
    pageListDiv.append(createPageDiv(page));
  });
}

function createPageDiv(page) {
  console.log(page);
  const pageDiv = document.createElement("div");
  pageDiv.id = page.pageUrl;
  console.log(pageDiv);
  pageDiv.className = "border rounded-3 px-4 py-3 mx-5 mb-3";

  const titleDateDiv = document.createElement("div");
  titleDateDiv.className = "d-flex justify-content-between mb-3";

  const title = document.createElement("h5");
  title.innerText = page.title;

  const date = document.createElement("span");
  date.innerText = new Date(page.publishTime).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  titleDateDiv.append(title, date);

  const subText = document.createElement("p");
  subText.innerText = page.subText;
  subText.className = "mb-4";

  const viewBtn = document.createElement("button");
  viewBtn.className = "me-3";
  viewBtn.innerText = "View"
  viewBtn.addEventListener("click", viewPage);
  pageDiv.append(titleDateDiv, subText, viewBtn);
  return pageDiv;
}

async function viewPage(event){ 
  const url = event.target.parentElement.id;
  console.log(url);
  location.href = `${url}`;
}
