import {
  isError,
  QueryClient,
  QueryClientProvider,
  useMutation,
  UseMutationOptions,
} from "react-query";
import { ReactElement } from "react";
import { UseMutateAsyncFunction } from "react-query";

export type ServerQueryDisplayProps = UseMutationOptions & {
  onIdleShow: (
    mutateAsync: UseMutateAsyncFunction<any, unknown, void, any>
  ) => ReactElement;
  onLoadingShow?: (failureCount: number) => ReactElement;
  onSuccessShow?: (data: any) => ReactElement;
  onErrorShow?: (error: Error, failureCount: number) => ReactElement;
  onPausedShow?: (failureCount: number) => ReactElement;
};

export function ServerQueryDisplay({
  onIdleShow,
  onLoadingShow,
  onSuccessShow,
  onErrorShow,
  onPausedShow,
  ...mutationProps
}: ServerQueryDisplayProps) {
  const {
    mutateAsync,
    isLoading,
    isSuccess,
    isError,
    isPaused,
    error,
    data,
    failureCount,
  } = useMutation({ ...mutationProps });

  return (
    <QueryClientProvider client={new QueryClient()}>
      {isLoading && onLoadingShow && onLoadingShow(failureCount)}

      {isSuccess && onSuccessShow && onSuccessShow(data)}

      {isError && onErrorShow && onErrorShow(error as Error, failureCount)}

      {isPaused && onPausedShow && onPausedShow(failureCount)}

      {!(isLoading && onLoadingShow) &&
        !(isSuccess && onSuccessShow) &&
        !(isError && onErrorShow) &&
        !(isPaused && onPausedShow) &&
        onIdleShow(mutateAsync)}
    </QueryClientProvider>
  );
}
