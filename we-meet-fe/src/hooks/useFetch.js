import { useState, useCallback } from "react";
import axios from "axios";

// axios 인스턴스 생성
const api = axios.create({
  baseURL: "https://api.example.com",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 인터셉터 설정
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

// GET 요청 훅
export const useAxiosGet = (url) => {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  const getData = useCallback(
    async (params = {}) => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const data = await api.get(url, { params });
        setState({ data, loading: false, error: null });
        return data;
      } catch (error) {
        setState({ data: null, loading: false, error });
        throw error;
      }
    },
    [url]
  );

  return { ...state, refetch: getData };
};

// POST 요청 훅
export const useAxiosPost = () => {
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null,
  });

  const postData = useCallback(async (url, body, config = {}) => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const data = await api.post(url, body, config);
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      setState({ data: null, loading: false, error });
      throw error;
    }
  }, []);

  return { ...state, execute: postData };
};

// PUT 요청 훅
export const useAxiosPut = () => {
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null,
  });

  const putData = useCallback(async (url, body, config = {}) => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const data = await api.put(url, body, config);
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      setState({ data: null, loading: false, error });
      throw error;
    }
  }, []);

  return { ...state, execute: putData };
};

// DELETE 요청 훅
export const useAxiosDelete = () => {
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null,
  });

  const deleteData = useCallback(async (url, config = {}) => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const data = await api.delete(url, config);
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      setState({ data: null, loading: false, error });
      throw error;
    }
  }, []);

  return { ...state, execute: deleteData };
};

// 범용 Axios 훅
export const useAxios = () => {
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null,
  });

  const request = useCallback(async (method, url, data = null, config = {}) => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const response = await api.request({
        method,
        url,
        data,
        ...config,
      });
      setState({ data: response, loading: false, error: null });
      return response;
    } catch (error) {
      setState({ data: null, loading: false, error });
      throw error;
    }
  }, []);

  return { ...state, request };
};
