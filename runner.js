const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const render = require('./render');

const forbiddenDirs = ['node_modules'];

class Runner {
  constructor() {
    this.testFiles = [];
    this.beforeEaches = [];
    this.tests = [];

    global.render = render;

    global.beforeEach = fn => {
      this.beforeEaches.push(fn);
    };

    global.it = (desc, fn) => {
      this.tests.push(async () => {
        this.beforeEaches.forEach(func => func());

        try {
          await fn();
          console.log(chalk.green(`\tOK - ${desc}`));
        } catch (err) {
          const message = err.message.replace(/\n/g, '\n\t\t');
          console.log(chalk.red(`\tX - ${desc}`));
          console.log(chalk.red('\t', message));
        }
      });
    };
  }

  async runTests() {
    for (let file of this.testFiles) {
      this.beforeEaches = [];
      this.tests = [];
      console.log(chalk.gray(`---- ${file.shortName}`));

      try {
        require(file.name);
        await Promise.all(this.tests.map(f => f()));
      } catch (err) {
        console.log(chalk.red(err));
      }
    }
  }

  async collectFiles(targetPath) {
    const files = await fs.promises.readdir(targetPath);

    for (let file of files) {
      const filepath = path.join(targetPath, file);
      const stats = await fs.promises.lstat(filepath);

      if (stats.isFile() && file.includes('.test.js')) {
        this.testFiles.push({ name: filepath, shortName: file });
      } else if (stats.isDirectory() && !forbiddenDirs.includes(file)) {
        const childFiles = await fs.promises.readdir(filepath);

        files.push(...childFiles.map(f => path.join(file, f)));
      }
    }
  }
}

module.exports = Runner;
