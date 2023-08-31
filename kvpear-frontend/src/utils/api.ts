import { useEffect, useState } from 'react';

type SharedRequestType = {
  isDone: boolean;
  isLoading: boolean;
  error: any;
}

type useGetRequestType = SharedRequestType & {
  get: (path: string) => Promise<any>;
}

export const useGet = (): useGetRequestType => {
  const [isDone, setIsDone] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const get = async (path: string): Promise<{ data: any, isOk: boolean }> => {
    setIsDone(false);
    setIsLoading(true);
    let data;
    let isOk = false;
    try {
      const res = await fetch(path, {
        credentials: 'include',
      });
      data = await res.json();
      isOk = res.ok;
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
      setIsDone(true);
      return {
        data,
        isOk
      }
    }
  }

  return { get, isDone, isLoading, error };
}

type usePostType = SharedRequestType & {
  post: (path: string, body: any) => Promise<any>;
}

export const usePost = (): usePostType => {
  const [isDone, setIsDone] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const post = async (path: string, body: any): Promise<{ data: any, isOk: boolean }> => {
    setIsDone(false);
    setIsLoading(true);
    let data;
    let isOk = false;
    try {
      const res = await fetch(path, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      data = await res.json();
      isOk = res.ok;
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
      setIsDone(true);
      return {
        data,
        isOk
      };
    }
  }

  return { post, isDone, isLoading, error };
}