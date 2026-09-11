const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const DATA_FILE = path.join(DATA_DIR, 'visits.json');

const clients = new Set();

function readVisits() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Number(parsed.total) || 0;
  } catch (error) {
    return 0;
  }
}

function writeVisits(total) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify({ total }, null, 2));
}

let totalVisits = readVisits();

function broadcast() {
  const activeVisitors = clients.size;
  const payload = `data: ${JSON.stringify({ total: activeVisitors })}\n\n`;
  for (const client of clients) {
    client.write(payload);
  }
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

function serveStaticFile(res, requestPath) {
  const safePath = path.normalize(requestPath).replace(/^\/+/, '');
  const filePath = path.join(ROOT, safePath || 'index.html');

  if (!filePath.startsWith(ROOT)) {
    sendJson(res, 403, { error: 'Forbidden' });
    return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        sendJson(res, 404, { error: 'Not found' });
      } else {
        sendJson(res, 500, { error: 'Internal server error' });
      }
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentTypes = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon'
    };

    res.writeHead(200, {
      'Content-Type': contentTypes[ext] || 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store'
    });
    res.end(content);
  });
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  if (pathname === '/api/visits') {
    if (req.method === 'GET') {
      sendJson(res, 200, { total: clients.size });
      return;
    }

    if (req.method === 'POST') {
      sendJson(res, 200, { total: clients.size });
      return;
    }
  }

  if (pathname === '/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });

    clients.add(res);
    broadcast();

    res.write(': keepalive\n\n');

    req.on('close', () => {
      clients.delete(res);
      broadcast();
    });

    return;
  }

  serveStaticFile(res, pathname);
});

server.listen(PORT, () => {
  console.log(`Live visitor counter is running on http://localhost:${PORT}`);
});
