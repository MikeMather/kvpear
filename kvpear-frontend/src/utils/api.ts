import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

type SharedRequestType = {
  isDone: boolean;
  isLoading: boolean;
  error: any;
}

type ApiResultType = {
  data: any;
  isOk: boolean;
}

type RequestOptionsType = {
  textBody?: boolean;
  headers?: {[key: string]: string};
  successMessage?: string;
  errorMessage?: string;
}

type useApiType = SharedRequestType & {
  post: (path: string, body: any, options?: RequestOptionsType) => Promise<ApiResultType>;
  patch: (path: string, body: any, options?: RequestOptionsType) => Promise<ApiResultType>;
  get: (path: string, params?: any, options?: RequestOptionsType) => Promise<ApiResultType>;
  del: (path: string, options?: RequestOptionsType) => Promise<any>;
}

export const useApi = (): useApiType => {
  const [isDone, setIsDone] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const sendRequest = async (path: string, method: string, body?: any, params?: any, options?: RequestOptionsType): 
    Promise<{ data: any, isOk: boolean }> => {
    setIsDone(false);
    setIsLoading(true);
    let data;
    let isOk = false;
    let url = path;
    if (params && Object.keys(params).length > 0) {
      const paramsString = new URLSearchParams(params).toString();
      url = `${url}?${paramsString}`;
    }
    const headers = options?.headers || {};
    try {
      let res;
      if (method === 'GET') {
        res = await fetch(url, { method, headers });
      } else {
        let reqBody: string;
        if (options?.textBody) {
          reqBody = body;
        } else {
          reqBody = JSON.stringify(body);
        }
        res = await fetch(url, { 
          method, 
          body: body ? reqBody : undefined, 
          headers: { 
            'Content-Type': 'application/json',
            ...headers
          }
        });
      }
      const isTextResponse = res.headers.get('content-type')?.includes('text');
      if (isTextResponse) {
        data = await res.text();
      } else {
        data = await res.json();
      }
      isOk = res.ok;
      if (!isOk) {
        setError(data?.message || 'Something went wrong');
        if (options?.errorMessage) {
          toast.error(options.errorMessage);
        } else {
          toast.error(data?.message || 'Something went wrong');
        }
      } else {
        if (options?.successMessage) {
          toast.success(options.successMessage);
        }
      }
    } catch (error: any) {
      setError(error?.message || 'Something went wrong');
      if (options?.errorMessage) {
        toast.error(options.errorMessage);
      } else {
        toast.error(data?.message || 'Something went wrong');
      }
    } finally {
      setIsLoading(false);
      setIsDone(true);
      return {
        data,
        isOk
      };
    }
  }

  const get = async (path: string, params?: any, options?: RequestOptionsType): Promise<ApiResultType> => {
    return await sendRequest(path, 'GET', {}, params, options);
  }

  const post = async (path: string, body: any, options?: RequestOptionsType): Promise<ApiResultType> => {
    return await sendRequest(path, 'POST', body, {}, options);
  }

  const patch = async (path: string, body: any, options?: RequestOptionsType): Promise<ApiResultType> => {
    return await sendRequest(path, 'PATCH', body, {}, options);
  }

  const del = async (path: string, options?: RequestOptionsType): Promise<ApiResultType> => {
    return await sendRequest(path, 'DELETE', {}, options);
  }

  return { post, get, patch, del, isDone, isLoading, error };
}

export const serialize = (obj: any): any => {
  return JSON.parse(JSON.stringify(obj));
}

export const urlSafeRegex = /^[a-zA-Z0-9-_:]+$/;

export const isUrlSafe = (str: string): boolean => {
  return urlSafeRegex.test(str);
}

// strips white spaces or new lines
export const stripWhiteSpace = (val: string) => {
  return val.replace(/\s/g, '');
}