import { Context, Handler } from 'aws-lambda';

interface RawEvent {
  path: string;
  httpMethod: 'POST' | 'PUT' | 'PATCH' | 'GET' | 'DELETE';
  headers: Record<string, string>;
  queryStringParameters: Record<string, string>;
  body?: string;
  isBase64Encoded: boolean;
}

interface Event<TBody> {
  path: string;
  httpMethod: 'POST' | 'PUT' | 'PATCH' | 'GET' | 'DELETE';
  headers: Record<string, string>;
  queryStringParameters: Record<string, string>;
  body?: TBody;
  isBase64Encoded: boolean;
}

interface RawResponse {
  statusCode: 200;
  body?: string;
}

interface Response<TBody> {
  statusCode: 200;
  body?: TBody;
}

export function createHandler<TEventBody = any, TResponseBody = any>(
  func: (
    event: Event<TEventBody>,
    context: Context
  ) => Promise<Response<TResponseBody>>
) {
  let handler: Handler<RawEvent, RawResponse> = async (rawEvent, context) => {
    const eventBody = rawEvent.body ? JSON.parse(rawEvent.body) : undefined;
    const event: Event<TEventBody> = {
      ...rawEvent,
      body: eventBody,
    };

    const response = await func(event, context);

    const responseBody = response.body
      ? JSON.stringify(response.body)
      : undefined;
    const rawResponse: RawResponse = {
      ...response,
      body: responseBody,
    };

    return rawResponse;
  };

  return handler;
}
