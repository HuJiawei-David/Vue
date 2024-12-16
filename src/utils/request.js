// request.js
import axios from 'axios';

// Create a new axios instance
const request = axios.create({
    baseURL: 'http://localhost:9090',  // Backend API address
    timeout: 300000, // 300 seconds
    responseType: 'json', // 默认响应类型
});

// Request interceptor
request.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8';
    let user = JSON.parse(localStorage.getItem("user") || '{}');

    // If token exists, set it in the headers
    if (user && user.token) {
        config.headers['token'] = user.token;
    }

    return config;
}, error => {
    console.error('request error: ' + error);
    return Promise.reject(error);
});

// Response interceptor
request.interceptors.response.use(
    response => {
        let res = response.data;

        // Handle server responses that return strings
        if (typeof res === 'string') {
            res = res ? JSON.parse(res) : res;
        }
        return res;
    },
    error => {
        console.error('response error: ' + error);
        return Promise.reject(error);
    }
);

export default request;
