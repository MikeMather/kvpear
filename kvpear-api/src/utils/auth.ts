import { FastifyRequest } from "fastify";

const exemptPaths = [
  '/health',
  '/documentation',
];

export const isAuthExempt = (req: FastifyRequest['raw']) => {
  // @ts-ignore
  const url = req.originalUrl;
  return exemptPaths.some(path => url.startsWith(path));
};