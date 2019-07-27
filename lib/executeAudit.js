const { exec } = require("child_process");

async function executeAuditFix({ force, production }) {
  return new Promise(resolve => {
    exec(
      `npm audit fix ${force ? "--force" : ""} ${
        production ? "--production" : ""
      }`,
      (err, stdout, stderr) => {
        if (stdout) {
          resolve(stdout);
        }

        resolve("");
      }
    );
  });
}

async function executeAudit() {
  return new Promise(resolve => {
    exec("npm audit --json", (err, stdout) => {
      if (stdout) {
        resolve(JSON.parse(stdout));
      }

      resolve({});
    });
  });
}

module.exports = {
  executeAuditFix,
  executeAudit
};
