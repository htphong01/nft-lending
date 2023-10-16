import axios from '@src/config/axios.conf';

export const importCollection = (params) => {
    return axios.post('/nfts/import', params)
}