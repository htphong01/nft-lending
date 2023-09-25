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

  // OPERATOR ACCOUNT
  OPERATOR_ACCOUNT_PRIVATE_KEY: process.env.OPERATOR_ACCOUNT_PRIVATE_KEY,

  // Web3 host
  NETWORK_RPC_URL:
    process.env.NETWORK_RPC_URL || 'https://rpc-kura.cross.technology/',
  WXCR_ADDRESS:
    process.env.WXCR_ADDRESS || '0x3b3f35c81488c49b370079fd05cfa917c83a38a9',
  COLLECTION_ADDRESS:
    process.env.COLLECTION_ADDRESS ||
    '0x25baf69a46923c0db775950b0ef96e6018343a36',
  LENDING_POOL_ADDRESS:
    process.env.LENDING_POOL_ADDRESS ||
    '0xa01d399346e76bd863f726366c31789b2fc43ad9',
  LOAN_ADDRESS:
    process.env.LOAN_ADDRESS || '0x1f2cd935b0ca5b7e9ee2f98970d1bb78797ba6d8',
  CHAIN_ID: process.env.CHAIN_ID || '5555',
};
