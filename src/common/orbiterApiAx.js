import axios from 'axios';
import openApiAx from "./openApiAx";

const orbiterApiAx = axios.create({
    baseURL: 'https://api.orbiter.finance',
    // baseURL:'http://ec2-54-238-20-18.ap-northeast-1.compute.amazonaws.com:9095',
    timeout: 30000,
    headers: {
        'Access-Control-Allow-Origin': '*',
    },
});

openApiAx.interceptors.response.use(
    function (response) {
      return response.data;
    },
    function (error) {
      return Promise.reject(error);
    }
);

export default orbiterApiAx;
