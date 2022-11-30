import Axios from 'axios';
// import Helpers from 'src/services/helpers';

const axios = Axios.create();

/**
 * @description Interceptor REQUEST Axios
 * @param {object} config - Axios data
 * @return {function(*): *}
 */
const requestInterceptor = (config) => {
  const BASE_URL = 'https://covid19-brazil-api.now.sh/api';
  config.url = BASE_URL + config.url;
  return config;
};

/**
 * @description Interceptor RESPONSE Axios
 * @param {object} config - Axios data
 * @return {function(*): *}
 */
const responseInterceptor = (response) => response;

/**
 * @description Callback to response Axios
 * @param {object} config - Axios data
 * @return {function(*): *}
 */
const failResponseInterceptor = (err) => {
  throw err;
};

axios.interceptors.request.use(requestInterceptor);
axios.interceptors.response.use(responseInterceptor, failResponseInterceptor);

export default axios;
