const fs = require("fs/promises")
const path = require("path")
const crypto = require("crypto")

const secretKey = 'yourSecretKey';

class Database {
    constructor(table_name) {
        this.folderPath = './SecretDb';
        this.filePath = path.join('./SecretDb', `${table_name}.json`);
        this.createFolderIfNotExists();
    }

    async createFolderIfNotExists() {
        try {
            await fs.access(this.folderPath);
        } catch (error) {
            // Folder doesn't exist, create it
            await fs.mkdir(this.folderPath);
            console.log(`Folder "${this.folderPath}" created successfully.`);
        }
    }

    static encodeString(inputString) {
        const cipher = crypto.createCipher('aes-256-cbc', secretKey);
        let encodedString = cipher.update(inputString, 'utf-8', 'hex');
        encodedString += cipher.final('hex');
        return encodedString;
    }

    static decodeString(encodedString) {
        try {
            const decipher = crypto.createDecipher('aes-256-cbc', secretKey);
            let decodedString = decipher.update(encodedString, 'hex', 'utf-8');
            decodedString += decipher.final('utf-8');
            return decodedString;
        } catch (error) {
            console.error('Error decoding string:', error.message);
            throw error;
        }
    }

    async readDataFromFile() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async writeDataToFile(data) {
        await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
    }

    async create(newDataObj) {
        const existingData = await this.readDataFromFile();
        const new_data = Database.encodeString(JSON.stringify(newDataObj));
        const updatedData = [...existingData, new_data];
        await this.writeDataToFile(updatedData);
        return newDataObj;
    }

    async find() {
        const data = await this.readDataFromFile();
        return data.map((d) => {
            const decodedData = Database.decodeString(d);
            return typeof decodedData === 'string' ? JSON.parse(decodedData) : decodedData;
        });
    }
}

module.exports = Database;