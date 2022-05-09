export * from './chains';
export * from './erc-20';
export * from './farms';
export * from './routes';
export * from './social-media';
export * from './wallets';

export const isDevelopment = process.env.NODE_ENV === 'development';

export enum LoadingState {
  Idle,
  Fetching,
  Submitting,
  Updating,
}

export enum StakeState {
  Stake,
  Unstake,
}

export const NO_STATE_ERROR = '';