// diagnostic-server.js
const net = require('net');

const checkPort = (port) => {
    return new Promise((resolve) => {
        const server = net.createServer();
        
        server.once('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`Port ${port} is in use`);
                resolve(false);
            }
        });
        
        server.once('listening', () => {
            server.close();
            console.log(`Port ${port} is available`);
            resolve(true);
        });
        
        server.listen(port);
    });
};

const testPorts = async () => {
    console.log('Testing ports...');
    const ports = [3000, 3001, 4000, 5000, 8080, 8081];
    
    for (const port of ports) {
        await checkPort(port);
    }
};

testPorts().then(() => {
    console.log('Port test complete');
    process.exit(0);
});
