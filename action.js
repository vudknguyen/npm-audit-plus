const fs = require("fs");
const path = require("path");
const report = require("./lib/report");
const filter = require("./lib/filter");
const { executeAuditFix, executeAudit } = require("./lib/executeAudit");

async function fix(options) {
  const output = await executeAuditFix(options);

  console.log(output);
}

async function audit(options) {
  let auditRes = await executeAudit();
  const rcPath = path.join(process.cwd(), ".auditrc");
  const packagesPath = path.join(process.cwd(), "package.json");
  const rc = fs.existsSync(rcPath)
    ? JSON.parse(fs.readFileSync(rcPath, "utf-8"))
    : { exceptions: [] };

  const packages = fs.existsSync(packagesPath)
    ? JSON.parse(fs.readFileSync(packagesPath, "utf-8"))
    : { depedencies: [] };

  const { exceptions } = rc;
  const { advisories, resolves, metadata } = auditRes;
  const issues = filter(advisories, resolves, exceptions, packages, options);

  report(issues, metadata);
}

module.exports = {
  fix,
  audit
};
