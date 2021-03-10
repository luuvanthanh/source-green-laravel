import { pickBy, omit } from 'lodash';
import { extend } from 'umi-request';
import Cookies from 'universal-cookie';
import variables from './variables';

const cookies = new Cookies();

const request = extend({
  prefix: API_URL,
  maxCache: 10,
});

const removeParams = (params) => {
  return omit(
    pickBy(params, (value) => value !== null && value !== undefined),
    'page',
    'limit',
  );
};

// request options
request.interceptors.request.use(async (url, options) => {
  const access_token = cookies.get('access_token');
  const token_type = cookies.get('token_type');
  if (access_token && token_type) {
    return {
      options: {
        ...options,
        params: removeParams(options.params),
        headers: {
          Authorization: `${token_type} ${access_token}`,
        },
        interceptors: true,
      },
    };
  }
  return {
    options: {
      ...options,
      interceptors: true,
    },
  };
});

// response interceptor, handling response
request.interceptors.response.use(
  (response) => {
    if (response.status === variables.STATUS_204) {
      return {
        ...response,
        status: response.status,
      };
    }
    return response;
  },
  (error) => error,
);

// middleware response and request
request.use(async (ctx, next) => {
  await next();
});

export default request;
