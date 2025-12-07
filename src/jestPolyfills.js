// src/jestPolyfills.js
import { TextEncoder, TextDecoder } from 'util';
import 'web-streams-polyfill/es2018';
import { BroadcastChannel } from 'broadcast-channel';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.BroadcastChannel = BroadcastChannel;

