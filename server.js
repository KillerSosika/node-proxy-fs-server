
const connect = require('connect');
const http = require('http');
const fs = require('fs');
const crossroads = require('crossroads');
const httpProxy = require('http-proxy');

const base = __dirname + '/public';

// Создание прокси-сервера
httpProxy.createServer((req, res, proxy) => {
    if (req.url.match(/^\/node\//)) {
        proxy.proxyRequest(req, res, {
            host: 'localhost',
            port: 8000
        });
    } else {
        proxy.proxyRequest(req, res, {
            host: 'localhost',
            port: 8124
        });
    }
}).listen(9000);

// Добавление маршрута для запросов динамического ресурса
crossroads.addRoute('/node/{id}/', function(id) {
    console.log('Accessed node ' + id);
});

// Динамический файловый сервер
http.createServer((req, res) => {
    crossroads.parse(req.url);
    res.end('That\'s all');
}).listen(8000);

// Статический файловый сервер
http.createServer(connect()
    .use(connect.favicon())
    .use(connect.logger('dev'))
    .use(connect.static(base))
).listen(8124);

console.log('Proxy server running on port 9000');
console.log('Dynamic server running on port 8000');
console.log('Static server running on port 8124');