const chalk = require("chalk");

const severityResolver = {
  critical: num =>
    num ? chalk.red.bold(`${num} Critical`) : chalk.red.bold(`Critical`),
  high: num => (num ? chalk.red(`${num} High`) : chalk.red(`High`)),
  moderate: num =>
    num ? chalk.yellow(`${num} Moderate`) : chalk.yellow(`Moderate`),
  low: num =>
    num ? chalk.yellowBright(`${num} Low`) : chalk.yellowBright(`Low`),
  info: num =>
    num ? chalk.yellowBright(`${num} Info`) : chalk.yellowBright(`Info`)
};

module.exports = {
  severityResolver
};
