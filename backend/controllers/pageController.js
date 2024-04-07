const Page = require("../models/pageModel");
const fs = require("fs");
const path = require("path");

const addPage = async (req, res) => {
  try {
    const {
      title,
      subText,
      content,
      createdBy,
      createdAt,
      modifiedAt,
      status,
      publishTime,
      pageUrl,
      showAuthor,
    } = req.body;

    const attachment = req.file?.path ?? "";
    const userId = req.userId;

    const page = await Page.create({
      title,
      subText,
      content,
      attachment,
      userId,
      createdBy,
      createdAt,
      modifiedAt,
      status,
      publishTime,
      pageUrl,
      showAuthor,
    });

    res.status(201).json({
      status: "success",
      date: {
        page,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};

const draftPage = async (req, res) => {
  try {
    const {
      title,
      subText,
      content,
      createdBy,
      createdAt,
      modifiedAt,
      status,
      pageUrl,
      showAuthor,
    } = req.body;

    const attachment = req.file?.path ?? "";
    const userId = req.userId;

    const page = await Page.create({
      title,
      subText,
      content,
      attachment,
      userId,
      createdBy,
      createdAt,
      modifiedAt,
      status,
      pageUrl,
      showAuthor,
    });

    res.status(201).json({
      status: "success",
      date: {
        page,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};

const getPages = async (req, res) => {
  
  try {
    const pages = await Page.find(
      {},
      "_id title pageUrl createdBy createdAt modifiedAt status"
    );

    if (pages.length === 0) {
      return res.status(404).json({
        status: "failed",
        message: "No pages found",
      });
    }

    res.status(200).json({
      status: "success",
      count: pages.length,
      data: {
        pages,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};

const getMyPages = async (req, res) => {
  try {
    const mypages = await Page.find(
      { userId: req.userId },
      "_id title subText status"
    );

    if (mypages.length === 0) {
      return res.status(404).json({
        status: "failed",
        message: "No pages found",
      });
    }

    res.status(200).json({
      status: "success",
      count: mypages.length,
      data: {
        mypages,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};

const getPage = async (req, res) => {
  try {
    const page = await Page.findOne({
      userId: req.userId,
      _id: req.params.id,
    });

    if (!page) {
      return res.status(404).json({
        status: "failed",
        message: "No page found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        page,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};

const updatePage = async (req, res) => {
  try {
    req.body.modifiedAt = Date.now();
    const page = await Page.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!page) {
      return res.status(404).json({
        status: "failed",
        message: "No page found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        page,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};

const showPage = async (req, res) => {
  try {
    const pageUrl = req.originalUrl.slice(5);
    const page = await Page.findOne({ pageUrl });

   
    if (!page) {
      return res.redirect("/html/404.html");
    }

    if (page.status !== 'published') {
      return res.redirect("/html/404.html");
    }

    let dataObj = {
      title: page.title,
      subtext: page.subText,
      publishDate: new Date(page.publishTime).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      content: page.content,
      showAuthor: page.showAuthor,
      attachment: false,
    }

    if(page.attachment){
      dataObj.linkview = "http://localhost:3030/getattachment/" + page.attachment;
      dataObj.linkdownload = "http://localhost:3030/download/" + page.attachment;
      dataObj.attachment = "true";
    } 


    if(page.showAuthor){
      dataObj.createdBy = page.createdBy;
    }

    res.render("template", dataObj);
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};

const deletePage = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id, "attachment");
    const { deletedCount } = await Page.deleteOne({ _id: req.params.id });

    if (!deletedCount) {
      res.status(404).json({
        status: "failed",
        message: "Page not found!",
      });
    }

    if(page.attachment){
      fs.unlink(path.join(__dirname, "..", page.attachment), (err) => {
        if (err) {
          console.log(err.message);
        } else {
          console.log("attachment deleted");
        }   
      });
    }
    
    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};

const getPublishedPages = async (req, res) => {
  try {
    const pages = await Page.find(
      { status: "published"},
      "_id title subText pageUrl publishTime"
    );

    if (pages.length === 0) {
      return res.status(404).json({
        status: "failed",
        message: "No pages found",
      });
    }

    res.status(200).json({
      status: "success",
      count: pages.length,
      data: {
        pages,
      },
    });
    
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
}

module.exports = {
  addPage,
  getPages,
  draftPage,
  getMyPages,
  getPage,
  updatePage,
  showPage,
  deletePage,
  getPublishedPages,
};

emailMessage = ``;
