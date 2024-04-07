const { exec } = require("child_process");

// Create the script file
exec(`echo "cd ${__dirname}/" > script.sh`, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
});

exec(`echo "node publishBlog.js" >> script.sh`, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
});

// Define the cron job command to run every minute
const cronCommand = `* * * * * ${__dirname}/../script.sh`;

exec(`chmod +x ${__dirname}/../script.sh`, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
});

// Add the cron job to the crontab
exec(`echo "${cronCommand}" | crontab -`, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});
