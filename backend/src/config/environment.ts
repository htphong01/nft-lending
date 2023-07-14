export const Environment = {
  SERVER_PORT: Number(process.env.SERVER_PORT || 3000),
  SOCKET_PORT: Number(process.env.SOCKET_PORT || 3001),
  SERVER_HOST: process.env.SERVER_HOST || 'http://localhost',

  // Redis Web socket client config
  REDIS_VOTE_HOST: process.env.REDIS_VOTE_HOST || 'localhost',
  REDIS_VOTE_PORT: Number(process.env.REDIS_VOTE_PORT || 6379),
  REDIS_VOTE_PASS: process.env.REDIS_VOTE_PASS,
  REDIS_VOTE_FAMILY: Number(process.env.REDIS_VOTE_FAMILY || 4),
  REDIS_VOTE_DB: Number(process.env.REDIS_VOTE_DB || 0),

  // Redis Order config
  REDIS_ORDER_HOST: process.env.REDIS_ORDER_HOST || 'localhost',
  REDIS_ORDER_PORT: Number(process.env.REDIS_ORDER_PORT || 6379),
  REDIS_ORDER_PASS: process.env.REDIS_ORDER_PASS,
  REDIS_ORDER_FAMILY: Number(process.env.REDIS_ORDER_FAMILY || 4),
  REDIS_ORDER_DB: Number(process.env.REDIS_ORDER_DB || 1),

  // Web3 host
  NETWORK_RPC_URL:
    process.env.NETWORK_RPC_URL || 'https://rpc-kura.cross.technology/',
  COLLECTION_ADDRESS:
    process.env.COLLECTION_ADDRESS ||
    '0xF31a2E258BeC65A46fb54cd808294Ce215070150',
  LENDING_POOL_ADDRESS:
    process.env.LENDING_POOL_ADDRESS ||
    '0x9E489999948549E4ba2F88AF304d2FE75602E30B',
  LOAN_ADDRESS:
    process.env.LOAN_ADDRESS || '0xFec95a1Fc4b667695693ea58F415BD3dA4F70CEE',
  CHAIN_ID: process.env.CHAIN_ID || '5555',
};
