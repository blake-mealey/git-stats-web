import { createHandler } from './util/create-handler';

interface Message {
  message: string;
}

export const handler = createHandler<any, any, Message>(async () => {
  return {
    statusCode: 200,
    body: {
      message: 'typed response',
    },
  };
});
