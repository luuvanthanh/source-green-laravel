import { pickBy } from 'lodash';
import { extend } from 'umi-request';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const request = extend({
  prefix: API_SSO_URL,
  maxCache: 10,
});

// request options
request.interceptors.request.use(async (url, options) => {
  const access_token = cookies.get('access_token');
  const token_type = cookies.get('token_type');
  if (access_token && token_type) {
    const customOps = {
      ...options,
      params: pickBy(options.params, value => value),
      headers: {
        Authorization: `${token_type} ${access_token}`,
      },
      interceptors: true,
    };
    return {
      options: customOps,
    };
  }
  return {
    options: {
      ...options,
      interceptors: true
    },
  };
});

async function covertData(response) {
  return response;
}
// response interceptor, handling response
request.interceptors.response.use(
  response => covertData(response),
  error => error,
);

// middleware response and request
request.use(async (ctx, next) => {
  await next();
});

export default request;
