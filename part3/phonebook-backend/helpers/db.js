const { existsSync } = require('fs');
const { readFile, writeFile } = require('fs/promises');

class Database {
  constructor(path) {
    if (!existsSync(path)) {
      throw new Error('No database');
    }

    this.path = path;
  }

  async read() {
    try {
      const fileContent = await readFile(this.path, { encoding: 'utf-8' });
      let data = {};

      if (fileContent.length > 0) {
        data = JSON.parse(fileContent);
      }

      return data;
    } catch (err) {
      throw new Error(err);
    }
  }

  async save(data) {
    try {
      await writeFile(this.path, JSON.stringify(data)); 

      return true;
    } catch (err) {
      throw new Error(err);
    }
  }
}


module.exports = Database;
