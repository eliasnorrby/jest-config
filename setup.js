#!/usr/bin/env node
const path = require("path");
const fs = require("fs");
const yargs = require("yargs");
const hasYarn = require("has-yarn")();

const ora = require("ora");
const execa = require("execa");

const { log } = require("@eliasnorrby/log-util");

const pkgInstall = hasYarn ? "yarn add" : "npm install";
const pkgInstallDev = `${pkgInstall} -D`;

const peerDeps = "jest @types/jest ts-jest";

yargs
  .alias("v", "version")
  .usage("Usage: $0 [options]")
  .help("h")
  .alias("h", "help")
  .option("i", {
    describe: "Install this package",
    type: "boolean",
    alias: "install",
    default: true,
  })
  .describe("no-install", "Skip installing this package")
  .strict(true);

const argv = yargs.argv;

const packageName = "@eliasnorrby/jest-config";

if (!fs.existsSync("package.json")) {
  log.fail(
    "No package.json found in the current directory. Make sure you are in the project root. If no package.json exists yet, run `npm init` first.",
  );
  process.exit(1);
}

const jestConfigFile = fs.readFileSync(
  path.resolve(__dirname, "index.js"),
  "utf8",
);

const jestconfig = argv.install
  ? `\
module.exports = {
  ...require("${packageName}"),
  // Override settings here
};
`
  : `\
${jestConfigFile}
`;

// Config files to write
const CONFIG_FILES = {
  "jest.config.js": jestconfig,
};

const failedToWrite = {};

Object.entries(CONFIG_FILES).forEach(([fileName, contents]) => {
  if (!fs.existsSync(fileName)) {
    log.info(`Writing ${fileName}`);
    fs.writeFileSync(fileName, contents, "utf8");
  } else {
    log.skip(`${fileName} already exists`);
    failedToWrite[fileName] = true;
  }
});

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
pkg.scripts = pkg.scripts || {};
pkg.scripts.test = `jest`;
log.info("Writing test script to package.json");
fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2));

const spinner = ora({
  text: "Installing...",
  spinner: "growHorizontal",
  color: "blue",
});

const runCommand = async cmd => {
  try {
    spinner.start();
    await execa.command(cmd);
    spinner.stop();
  } catch (error) {
    spinner.stop();
    log.fail(error);
    process.exit(1);
  }
};

(async () => {
  log.info(`Installing peer dependencies (${peerDeps})`);
  await runCommand(`${pkgInstallDev} ${peerDeps}`);

  if (argv.install) {
    log.info(`Installing self (${packageName})`);
    await runCommand(`${pkgInstallDev} ${packageName}`);
  } else {
    log.skip("Skipping install of self");
  }

  log.ok("Done!");
})();
