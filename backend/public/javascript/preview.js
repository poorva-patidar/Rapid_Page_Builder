// if (!document.cookie) {
//     location.href = "./login.html";
// }

const previewPage = JSON.parse(localStorage.getItem("previewPage"));
const createPreview = JSON.parse(localStorage.getItem("createPreview"));
let page;

const pageTitle = document.getElementById("page-title");
const pageSubText = document.getElementById("sub-text");
const pagePublishDate = document.getElementById("publish-date");
const pageContent = document.getElementById("page-content");
const author = document.getElementById("author");
const backLink = document.getElementById("back-link");

if (previewPage) {
    page = previewPage;
  } else {
    page = createPreview;
    backLink.href = "./createPage.html";
  }

pageTitle.innerText = page.title;
pageSubText.innerText = page.subText;
pageContent.innerHTML = page.content;
if (page.status === "draft") {
  pagePublishDate.innerText = "Publish date: Month DD, YYYY";
} else {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  pagePublishDate.innerText =
    "Publish date: " +
    new Date(page.publishTime).toLocaleDateString("en-US", options);
}

if(page.showAuthor){
    author.innerText = page.createdBy;
}

localStorage.clear();