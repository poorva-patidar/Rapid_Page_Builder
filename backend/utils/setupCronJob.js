const cron = require("cron");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const sendEmail = require("./email");
dotenv.config({ path: "../config.env" });

async function job() {
  const Page = require("../models/pageModel");
  const User = require("../models/userModel");
  const pages = await Page.find({ status: "scheduled" });

  for (let i = 0; i < pages.length; i++) {
    console.log(i);
    if (Date.now() >= pages[i].publishTime) {
      await Page.findByIdAndUpdate(pages[i]._id, { status: "published" });
    }

    if (
      Date.now() >= pages[i].publishTime.getTime() - 2 * 60 * 1000 &&
      !pages[i].emailSent
    ) {
      const user = await User.findById(pages[i].userId);
      const page = await Page.findByIdAndUpdate(
        pages[i]._id,
        { emailSent: true },
        {
          new: true,
          runValidators: true,
        }
      );

      try {
        sendEmail({
          email: user.email,
          message: `<!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Email</title>
              <link
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
                rel="stylesheet"
                integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
                crossorigin="anonymous"
              />
            </head>
            <body>
              <div class="container">
                <div class="d-flex flex-column justify-content-center text-justify border rounded-2 p-4 mt-3">
                  <h1 class="mt-3 mb-3 w-100">Greetings, ${user.name}</h1>
                  <h3>${page.title}</h3>
                  <div class="d-flex align-items-center justify-content-between w-100 px-2">
                    <p>${page.subText}</p>
                    <span>Date: ${new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}</span>
                  </div>
                  <div>Your page is going to publish in one hour!</div>
                  <div>Publish Time: ${new Date(
                    page.publishTime
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}</div>
                </div>
              </div>
            </body>
          </html>`,
        });
      } catch (error) {
        console.log(err);
        await Page.findByIdAndUpdate(pages[i]._id, { emailSent: false });
      }
    }
  }
}

const cronJob = new cron.CronJob("0 */1 * * * *", job, null, true);
