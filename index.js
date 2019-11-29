const http = require('http');

const handler = (req, res) => {
  if (req.url === '/set') {
    res.writeHead(200, {
      'Content-Type': 'text/html',
      'Set-Cookie': `randomCookie=${new Date().toLocaleTimeString()}; Path=/; HttpOnly; SameSite=Lax`,
    });
    res.end('Cookie set');
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(
    `
    <h2>Cookie</h2>
    ${req.headers.cookie}
    <h2>Headers</h2><pre>
    \n${JSON.stringify(req.headers, null, 2)}
    </pre>
      `,
  );
};

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
http.createServer(handler).listen(port, () => {
  console.log(`Server is running at http://127.0.0.1:${port}`);
});
