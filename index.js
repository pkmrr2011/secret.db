const fs = require("fs/promises")
const path = require("path")


function applyCondition(item, condition) {
    const [key, value] = Object.entries(condition)[0];

    if (typeof value === 'object') {
        if (value.or) {
            if (!Array.isArray(value.or)) {
                throw new Error(`Invalid "or" condition format`);
            }
            return value.or.some(subCondition => applySubCondition(item[key], subCondition));
        } else {
            return applySubCondition(item[key], value);
        }
    } else {
        return item[key] === value;
    }
}

function generateRegex(itemValue,subValue, regexFlags = '') {
    let regex
    if (typeof subValue === "object") {
        if (Array.isArray(subValue)) {
            regex = new RegExp(`^${subValue[0]}.*${subValue[1] || ""}$`, regexFlags)
        } else {
            throw new Error("Unsupported like format");
        }
    } else {
        regex = new RegExp(subValue, regexFlags);
    }

    return regex.test(itemValue);
}

function applySubCondition(itemValue, subCondition) {
    const [subKey, subValue] = Object.entries(subCondition)[0];

    switch (subKey) {
        case 'eq': return itemValue === subValue;
        case 'ne': return itemValue !== subValue;
        case 'gte': return itemValue >= subValue;
        case 'lte': return itemValue <= subValue;
        case 'gt': return itemValue > subValue;
        case 'lt': return itemValue < subValue;
        case 'like':
            return generateRegex(itemValue,subValue, 'i')
        case 'LIKE':
            return generateRegex(itemValue,subValue)

        default: throw new Error(`Unsupported sub-condition: ${subKey}`);
    }
}



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
            await fs.mkdir(this.folderPath);
        }
    }

    static encodeString(inputString) {
        return btoa(inputString);
    }

    static decodeString(encodedString) {
        try {
            return atob(encodedString);
        } catch (error) {
            throw new Error('Error decoding string:', error.message)
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

    async create(newData) {
        const existingData = await this.readDataFromFile();
        let new_data;
    
        if(typeof newData === "object"){
            if (Array.isArray(newData)) {
                new_data = newData.map(newDataObj => Database.encodeString(JSON.stringify(newDataObj)));
            } else {
                new_data = [Database.encodeString(JSON.stringify(newData))];
            } 
        } else {
            new_data = [Database.encodeString(JSON.stringify({
                data: newData
            }))];
        }
    
        const updatedData = existingData.concat(new_data);
        await this.writeDataToFile(updatedData);
        
        return newData;
    }
    

    async find(query = {}) {
        const rawData = await this.readDataFromFile();

        let count = 0
        const total_count = rawData.length
        const limit = query.limit || Number.MAX_SAFE_INTEGER
        const offset = query.offset || 0
        let final_data = []

        let parsedData = rawData.map((rawItem) => {
            const decodedItem = Database.decodeString(rawItem);
            return typeof decodedItem === 'string' ? JSON.parse(decodedItem) : decodedItem;
        });


        if (query.where) {
            for (let i = offset; i < parsedData.length; i++) {
                const item = parsedData[i];
                const conditions = Object.entries(query.where).every(([key, value]) => {
                    if (key === 'or') {
                        if (!Array.isArray(value)) {
                            throw new Error(`Invalid "or" condition format`);
                        }
                        return value.some(condition => applyCondition(item, condition));
                    } else if (key === 'and') {
                        if (!Array.isArray(value)) {
                            throw new Error(`Invalid "or" condition format`);
                        }
                        return value.every(condition => applyCondition(item, condition));
                    } else {
                        return applyCondition(item, { [key]: value });
                    }
                });
                if(count < limit){
                    if (conditions) {
                        final_data.push(item)
                        count++
                    }
                } else {
                    break
                }

            }
        } else {
            final_data = parsedData
        }
        return {
            count: total_count,
            data: final_data
        }
    }

    async update(query={}) {
        if(!query.where || !query.data){
            throw new Error("Unsopperted update query")
        }
        const rawData = await this.readDataFromFile();
        const parsedData = rawData.map((rawItem) => {
            const decodedItem = Database.decodeString(rawItem);
            return typeof decodedItem === 'string' ? JSON.parse(decodedItem) : decodedItem;
        });

            let final_data = []
            const final_encoded_data = parsedData.map(item => {
                const conditions = Object.entries(query.where).every(([key, value]) => {
                    if (key === 'or') {
                        if (!Array.isArray(value)) {
                            throw new Error(`Invalid "or" condition format`);
                        }
                        return value.some(condition => applyCondition(item, condition));
                    } else if (key === 'and') {
                        if (!Array.isArray(value)) {
                            throw new Error(`Invalid "or" condition format`);
                        }
                        return value.every(condition => applyCondition(item, condition));
                    } else {
                        return applyCondition(item, { [key]: value });
                    }
                });

                if (conditions) {
                    item = { ...item, ...query.data };
                    final_data.push(item)
                }
                
                return Database.encodeString(JSON.stringify(item))
            });

        await this.writeDataToFile(final_encoded_data);
        
        return final_data;
    }

    async delete(query={}) {
        if(!query.where){
            throw new Error("Unsopperted delete query")
        }
        const rawData = await this.readDataFromFile();
        const parsedData = rawData.map((rawItem) => {
            const decodedItem = Database.decodeString(rawItem);
            return typeof decodedItem === 'string' ? JSON.parse(decodedItem) : decodedItem;
        });

        let delete_count =0
            let final_encoded_data = parsedData.filter(item => {
                const conditions = Object.entries(query.where).every(([key, value]) => {
                    if (key === 'or') {
                        if (!Array.isArray(value)) {
                            throw new Error(`Invalid "or" condition format`);
                        }
                        return value.some(condition => applyCondition(item, condition));
                    } else if (key === 'and') {
                        if (!Array.isArray(value)) {
                            throw new Error(`Invalid "or" condition format`);
                        }
                        return value.every(condition => applyCondition(item, condition));
                    } else {
                        return applyCondition(item, { [key]: value });
                    }
                });

                if(conditions){
                    delete_count++
                } 
                    return !conditions
            })
            final_encoded_data = final_encoded_data.map((item) => {
                return Database.encodeString(JSON.stringify(item));
              });

        await this.writeDataToFile(final_encoded_data);

        return `${delete_count} data has been deleted`;
    }
}
module.exports = Database;
