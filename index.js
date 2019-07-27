#!/usr/bin/env node
const program = require("commander");
const action = require("./action");

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

if (program.fix) {
  action.fix(program);
} else {
  action.audit(program);
}
