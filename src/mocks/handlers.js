// src/mocks/handlers.js
import { rest } from 'msw';
import { mockMenu } from '../mockData';

export const handlers = [
  rest.get('/api/menu', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockMenu));
  }),
];

