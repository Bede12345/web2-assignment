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

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (pathname === '/movies' && method === 'GET') {
        const movies = readData();
        const id = parsedUrl.query.id;
        
        if (id) {
            const movie = movies.find(m => m.id === parseInt(id));
            if (movie) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(movie));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Movie not found' }));
            }
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(movies));
        }
    }

    else if (pathname === '/movies' && method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

req.on('end', () => {
            try {
                const newMovie = JSON.parse(body);
                const movies = readData();
                const id = movies.length > 0 ? Math.max(...movies.map(m => m.id)) + 1 : 1;
                newMovie.id = id;
                movies.push(newMovie);
                writeData(movies);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newMovie));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
    }
    
else if (pathname === '/movies' && method === 'PUT') {
        const id = parsedUrl.query.id;
        if (!id) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'ID required' }));
            return;
        }
        
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const updates = JSON.parse(body);
                const movies = readData();
                const index = movies.findIndex(m => m.id === parseInt(id));
                
                if (index !== -1) {
                    movies[index] = { ...movies[index], ...updates, id: parseInt(id) };
                    writeData(movies);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(movies[index]));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Movie not found' }));
                }

} catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
    }

    else if (pathname === '/movies' && method === 'DELETE') {
        const id = parsedUrl.query.id;
        if (!id) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'ID required' }));
            return;
        }
            
const movies = readData();
        const index = movies.findIndex(m => m.id === parseInt(id));
        
        if (index !== -1) {
            const deleted = movies.splice(index, 1);
            writeData(movies);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(deleted[0]));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Movie not found' }));
        }
    }

    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Route not found' }));
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log('GET /movies - Get all movies');
    console.log('GET /movies?id=1 - Get movie by ID');
    console.log('POST /movies - Create a new movie');
    console.log('PUT /movies?id=1 - Update a movie');
    console.log('DELETE /movies?id=1 - Delete a movie');
});
