import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { LogoutUser } from '../redux/slice/userSlice';
import toast from "react-hot-toast"

const BASE_URL = import.meta.env.VITE_BACKEND || 'http://localhost:5000';

function getAccessToken() {
  const token = localStorage.getItem('token');
  return token || null;
}

const userRequest = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
});

const publicRequest = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
});


userRequest.interceptors.request.use((config) => {
    const newToken = getAccessToken();
    if (newToken) {
      config.headers.token = `Bearer ${newToken}`;
    }
    return config;
});


const useAxios = () => {
    const dispatch = useDispatch()

    userRequest.interceptors.response.use(
        (response) => response,
        async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const { data } = await userRequest.get('/auth/refresh');
                localStorage.setItem('token', data);
                originalRequest.headers.token = `Bearer ${data}`;
                return axios(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh failed', refreshError);
                dispatch(LogoutUser())
                toast.error(refreshError.response.data.message || "Sesstion Expired!!!")
            }
        }
        return Promise.reject(error);
        }
    );

    return { publicRequest, userRequest };
};

export default useAxios;
