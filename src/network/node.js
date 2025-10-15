import WebSocket from 'ws';
import { Chain } from './core/chain.js';

export class Node {
  constructor(port) {
    this.port = port;
    this.sockets = [];
    this.blockchain = new Chain();
  }

  startServer() {
    const server = new WebSocket.Server({ port: this.port });
    server.on('connection', socket => this.connectSocket(socket));
    console.log(`Listening on port ${this.port}`);
  }

  connectSocket(socket) {
    this.sockets.push(socket);
    console.log('Socket connected');
    socket.on('message', message => this.handleMessage(JSON.parse(message)));
  }

  broadcast(data) {
    this.sockets.forEach(socket => socket.send(JSON.stringify(data)));
  }

  handleMessage(data) {
    if (data.type === 'NEW_BLOCK') {
      this.blockchain.addBlock(data.block);
    }
  }
}
