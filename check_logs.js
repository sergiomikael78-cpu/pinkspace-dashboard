const { spawn } = require('child_process');

const tail = spawn('cmd.exe', ['/c', 'npx wrangler tail pinkspace-mila'], {
  env: process.env
});

let output = '';
tail.stdout.on('data', (data) => {
  output += data.toString();
});
tail.stderr.on('data', (data) => {
  output += data.toString();
});

setTimeout(() => {
  console.log("Fetching URL...");
  fetch('https://pinkspace-mila.cahayaniermila.workers.dev/admin/create')
    .then(res => res.text())
    .then(text => {
      console.log("Fetch done, status code:", text.substring(0, 50));
      setTimeout(() => {
        console.log("Tail logs:");
        console.log(output);
        tail.kill();
        process.exit(0);
      }, 5000);
    }).catch(console.error);
}, 5000);
