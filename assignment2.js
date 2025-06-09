/*
          FOR TESTING-
            1. Make sure you have Node.js installed on your system.
            2. run this file using the command: node assignment2.js in the directory where this file is located.
            3. The server will start on http://localhost:3000
            4. To test the endpoints, use your browser or a tool like curl/Postman:
          CREATE A FILE => http://localhost:3000/create?name=arpit.txt&content=Hello This is Arpit Soni,intern from celebal technologies
            output-> ✅ File 'test.txt' created successfully.

          READ A FILE => http://localhost:3000/read?name=arpit.txt
          output-> 📄 Content of 'arpit.txt':
          DELETE A FILE => http://localhost:3000/delete?name=arpit.txt
            output-> 🗑️ File 'arpit.txt' deleted successfully.
          */


const http = require('http');   // HTTP server
const fs = require('fs');       // File system operations
const path = require('path');   // Path resolution
const url = require('url');     // URL parsing

const PORT = 3000;
const FILES_DIR = path.join(__dirname, 'files');

// Ensure the 'files' directory exists at startup
if (!fs.existsSync(FILES_DIR)) {
    fs.mkdirSync(FILES_DIR);
}

const server = http.createServer((req, res) => {
    // Parse URL and query parameters
    const { pathname, query } = url.parse(req.url, true);

    // Helper: Build absolute file path inside FILES_DIR
    const getFilePath = (fileName) => path.join(FILES_DIR, fileName);

    switch (pathname) {
        case '/create': {
            // Validate input
            const fileName = query.name || 'arpit.txt';
            const content = query.content || 'Empty content';
            const filePath = getFilePath(fileName);

            fs.writeFile(filePath, content, (err) => {
                if (err) {
                    res.writeHead(500);
                    return res.end('Error: Could not create file.');
                }
                res.writeHead(200);
                res.end(`✅ File '${fileName}' created successfully.`);
            });
            break;
        }

        case '/read': {
            const fileName = query.name;
            if (!fileName) {
                res.writeHead(400);
                return res.end('Error: Please specify the file name to read.');
            }
            const filePath = getFilePath(fileName);

            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    res.writeHead(404);
                    return res.end(`Error: File '${fileName}' not found.`);
                }
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(`📄 Content of '${fileName}':\n\n${data}`);
            });
            break;
        }

        case '/delete': {
            const fileName = query.name;
            if (!fileName) {
                res.writeHead(400);
                return res.end('Error: Please specify the file name to delete.');
            }
            const filePath = getFilePath(fileName);

            fs.unlink(filePath, (err) => {
                if (err) {
                    res.writeHead(404);
                    return res.end(`Error: File '${fileName}' not found or already deleted.`);
                }
                res.writeHead(200);
                res.end(`🗑️ File '${fileName}' deleted successfully.`);
            });
            break;
        }

        default: {
            // Fallback for unknown routes
            res.writeHead(404);
            res.end(
                `Invalid route. Available endpoints:\n` +
                `→ /create?name=filename.txt&content=yourText\n` +
                `→ /read?name=filename.txt\n` +
                `→ /delete?name=filename.txt`
            );
        }
    }
});

server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
/*      IMPORTANT 
        
// Note: This code is designed to run in a Node.js environment and will not work in a browser.


*/
/**
 * Project Aim:
 * ------------
 * Utilize Node.js core modules (File System, Path, HTTP) to implement a basic
 * file management tool that can create, read, and delete files via HTTP endpoints.
 * No external dependencies are used.
 * 
 * /**
 * Simple File Management Tool using Node.js Core Modules
 * ------------------------------------------------------
 * This server exposes REST-style endpoints to create, read, and delete files
 * using only Node.js built-in modules: http, fs, path, and url.
 * 
 * Endpoints:
 *   - /create?name=filename.txt&content=yourText
 *   - /read?name=filename.txt
 *   - /delete?name=filename.txt
 *
 * ------------------------------------------------------

 *  All files are stored in the 'files' subdirectory created automatically.
 *  No external dependencies are required; only Node.js core modules are used.
 */
