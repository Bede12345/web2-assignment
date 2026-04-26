const http = require('http');
const fs = require('fs');
const url = require('url');

const DATA_FILE = './data.json';
const PORT = 3001;

const readData = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}
