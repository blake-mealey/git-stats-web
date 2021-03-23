import { createHandler } from './util/create-handler';

export const handler = createHandler(async () => {
  return {
    statusCode: 200,
    body: {
      message: 'super hello',
    },
  };
});
