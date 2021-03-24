import { Context, Handler } from 'aws-lambda';

type StatusCode = 200;
type HttpMethod = 'POST' | 'PUT' | 'PATCH' | 'GET' | 'DELETE';
type HeaderKeys = 'Authorization' | 'Content-Type';

interface CommonEvent<TParamKeys extends string = string> {
  path: string;
  httpMethod: HttpMethod;
  headers: Record<HeaderKeys, string>;
  queryStringParameters: Record<TParamKeys, string>;
  isBase64Encoded: boolean;
}

interface RawEvent extends CommonEvent {
  body?: string;
}

interface Event<TBody, TParamKeys extends string>
  extends CommonEvent<TParamKeys> {
  body?: TBody;
}

interface CommonResponse {
  statusCode: StatusCode;
}

interface RawResponse extends CommonResponse {
  body?: string;
}

interface Response<TBody> extends CommonResponse {
  body?: TBody;
}

export function createHandler<
  TEventBody = any,
  TParamKeys extends string = string,
  TResponseBody = any
>(
  func: (
    event: Event<TEventBody, TParamKeys>,
    context: Context
  ) => Promise<Response<TResponseBody>>
) {
  let handler: Handler<RawEvent, RawResponse> = async (rawEvent, context) => {
    const eventBody = rawEvent.body ? JSON.parse(rawEvent.body) : undefined;
    const event: Event<TEventBody, TParamKeys> = {
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
