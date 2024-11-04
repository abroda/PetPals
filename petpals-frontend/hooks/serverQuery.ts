export type AsyncQuery = {
  path: string;
  method?: string;
  payload?: any;
  headers?: Record<string, string>;
  onOKResponse?: (payload: any) => any;
  onBadResponse?: (payload: any) => any;
  onJsonParseError?: (reason: any) => any;
  onError?: (error: Error) => any;
  onTimeout?: () => any;
  onStart?: () => void;
  onEnd?: () => void;
  asyncAbortController?: AbortController;
  retriesCount?: number;
  timeout?: number;
};

export const serverQuery = async ({
  path,
  method = "POST",
  payload = {}, // body or json payload that will be stringified
  headers = { "Content-Type": "application/json" },
  onOKResponse = (payload: any) => payload,
  onBadResponse = (payload: any) => payload.message,
  onJsonParseError = (reason: any) => `${reason}`,
  onError = (error: Error) => error.message,
  onTimeout = () => "Request timed out",
  onStart = () => {},
  onEnd = () => {},
  asyncAbortController,
  retriesCount = 3, // minimum 1
  timeout = 5000,
}: AsyncQuery) => {
  onStart();

  let abortController = asyncAbortController ?? new AbortController();
  let result = undefined;

  for (
    let retryNumber = 0;
    retryNumber < retriesCount && !result;
    retryNumber += 1
  ) {
    let timeoutId = timeout
      ? setTimeout(() => {
          abortController.abort(); // send abort signout on timeout
        }, timeout)
      : undefined;

    result = await fetch(path, {
      method: method,
      mode: "cors", // always uses cors
      headers: headers,
      body: JSON.stringify(payload),
      signal: abortController.signal, // aborts fetch when signal is received (timeout or send by the component on unmount)
    })
      .then((response: Response) => {
        return response
          .json()
          .then((payload) =>
            response.ok
              ? {
                  success: true,
                  returnValue: onOKResponse(payload),
                }
              : {
                  success: false,
                  returnValue: onBadResponse(payload),
                }
          )
          .catch((reason) => ({
            success: false,
            returnValue: onJsonParseError(reason),
          }));
      })
      .catch((error: Error) =>
        error.name === "AbortError"
          ? undefined // timeout or unmount
          : { success: false, returnValue: onError(error) }
      );

    if (timeoutId) {
      clearTimeout(timeoutId); // cleanup
    }
  }

  onEnd();

  return result ?? { success: false, returnValue: onTimeout() };
};
