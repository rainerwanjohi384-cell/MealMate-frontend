// src/setupTests.js
import '@testing-library/jest-dom';
import { server } from './mocks/server';
import { TextEncoder, TextDecoder } from 'util';

// Polyfill TextEncoder/TextDecoder for Jest (Node environment)
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Start API mock server before tests
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

