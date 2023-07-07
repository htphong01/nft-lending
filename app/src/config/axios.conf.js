import axios from 'axios';

const env = import.meta.env.VITE_ENVIRONMENT

const API_URL = {
    development: 'http://localhost:3000',
    production: ''
}

const instance = axios.create({
    baseURL: API_URL[env],
    headers: {
        'Content-Type': 'application/json'
    }
});

export default instance;