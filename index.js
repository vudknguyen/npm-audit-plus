#!/usr/bin/env node
const fs = require("fs");
const chalk = require("chalk");
const path = require("path");
const { exec } = require("child_process");
const Table = require("cli-table");
const program = require("commander");

program.version("0.0.1");
program
  .option(
    "--fix",
    "Automatically install compatible updates to vulnerable dependencies"
  )
  .option(
    "--force",
    "Install semver-major updates to toplevel dependencies, not just semver-compatible ones"
  )
  .option("--production", "Only audit production packages");

program.parse(process.argv);

async function executeNPMAudit() {
  return new Promise((resolve) => {
    exec("npm audit --json", (err, stdout) => {
      if (stdout) {
        resolve(JSON.parse(stdout));
      }

      resolve({});
    });
  });
}


async function runFix() {
  return new Promise((resolve) => {
    exec(`npm audit fix ${program.force ? '--force' : ''} ${program.production ? '--production' : ''}`, (err, stdout, stderr) => {
      if (stdout) {
        console.log(stdout);
        resolve(stdout);
      }

      resolve('');
    })
  })
}

if(program.fix) {
  return runFix();
}

const severityResolver = {
  critical: chalk.red.bold("Critical"),
  high: chalk.red("High"),
  moderate: chalk.yellow("Moderate"),
  low: chalk.yellowBright("Low"),
  info: chalk.yellowBright("Info")
};

const severityResolverWithNum = {
  critical: num => chalk.red.bold(`${num} Critical`),
  high: num => chalk.red(`${num} High`),
  moderate: num => chalk.yellow(`${num} Moderate`),
  low: num => chalk.yellowBright(`${num} Low`),
  info: num => chalk.yellowBright(`${num} Info`)
};

function report(issues, metadata) {
  if (issues.length == 0) {
    console.log(
      `🎉  No vulnerabilities found in ${
        metadata.totalDependencies
      } scanned packages 🎉`
    );
  }

  let total = 0,
    info = 0,
    low = 0,
    moderate = 0,
    high = 0,
    critical = 0;

  if (issues.length > 0) {
    issues.forEach(i => {
      i.findings.forEach(fi => {
        total++;

        switch (i.severity) {
          case "info":
            info++;
            break;
          case "low":
            low++;
            break;
          case "moderate":
            moderate++;
            break;
          case "high":
            high++;
            break;
          case "critical":
            critical++;
            break;
        }

        const table = new Table({
          head: [severityResolver[i.severity], chalk.white.bold(i.title)]
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

    console.error(`🚨 ${chalk.red(total)} vulnerabilities found 🚨`);
    if (info) {
      console.error(`  ${severityResolverWithNum["info"](info)}`);
    }
    if (low) {
      console.error(`  ${severityResolverWithNum["low"](low)}`);
    }
    if (moderate) {
      console.error(`  ${severityResolverWithNum["moderate"](moderate)}`);
    }
    if (high) {
      console.error(`  ${severityResolverWithNum["high"](high)}`);
    }
    if (critical) {
      console.error(`  ${severityResolverWithNum["critical"](critical)}`);
    }
  }
}

function filter(advisories, exceptions, onlyProduction) {
  let issues = [];

  // Filter exceptions list
  for (let key in advisories) {
    if (advisories.hasOwnProperty(key)) {
      const advisory = advisories[key];

      if (
        exceptions.indexOf(advisory.url) === -1 &&
        exceptions.indexOf(advisory.cwe) === -1 &&
        exceptions.findIndex(e => advisory.cves.indexOf(e) > -1) === -1
      ) {
        issues.push(advisory);
      }
    }
  }

  // Only production
  if (onlyProduction) {
    console.log('here');
    console.log(issues[2]);
    issues = issues.map(i => ({ ...i, findings: i.findings.filter(f => !f.dev)}))
    .filter(i => i.findings.length > 0);
    console.log(issues);
  }

  return issues;
}

async function audit() {
  let auditRes = await executeNPMAudit();

  const rcPath = path.join(process.cwd(), ".naprc")
  const rc = fs.existsSync(rcPath) ? JSON.parse(fs.readFileSync(rcPath, "utf-8")) : {exceptions: []};

  const { exceptions } = rc;
  const { advisories, metadata } = auditRes;
  const issues = filter(advisories, exceptions, program.production);

  report(issues, metadata);
}

audit();
