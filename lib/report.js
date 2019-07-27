const Table = require("cli-table");
const chalk = require("chalk");
const { severityResolver } = require("./utils");

module.exports = function report(issues, metadata) {
  if (issues.length == 0) {
    console.log(
      `🎉  No vulnerabilities found in ${
        metadata.totalDependencies
      } scanned packages 🎉`
    );
  }

  let issueCount = {
    info: 0,
    low: 0,
    moderate: 0,
    high: 0,
    critical: 0
  };

  if (issues.length === 0) {
    return;
  }

  issues.forEach(i => {
    i.findings.forEach(fi => {
      issueCount[i.severity]++;

      const table = new Table({
        head: [severityResolver[i.severity](), chalk.white.bold(i.title)]
      });

      table.push(
        ["Package", `${i.module_name}@${chalk.blue.bold(fi.version)}`],
        [
          "Dependency Type",
          fi.dev !== true ? chalk.red("Production") : chalk.yellow("Dev")
        ],
        ["CVE", i.cves.join(",")],
        ["CWE", i.cwe],
        ["Vulnerable", chalk.red(i.vulnerable_versions)],
        ["Patched", chalk.green(i.patched_versions)],
        ["Recommendation", i.recommendation],
        ["Paths", fi.paths.join("\n")],
        ["More info", i.url]
      );
      console.log(table.toString());
    });
  });

  console.error(
    `🚨 ${chalk.red(
      issueCount.info +
        issueCount.low +
        issueCount.moderate +
        issueCount.high +
        issueCount.critical
    )} vulnerabilities found 🚨`
  );

  for (let severity in issueCount) {
    if (issueCount[severity]) {
      console.error(`  ${severityResolver[severity](issueCount[severity])}`);
    }
  }
};
