import dotenv from 'dotenv';
import Server from './models/Server';

//console.clear();
dotenv.config() ; const server = new Server() ; server.listen();
