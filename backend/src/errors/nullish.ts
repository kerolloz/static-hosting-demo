export const throwWhenNullish = <T extends Error>(error: T): never => {
  throw error;
};
