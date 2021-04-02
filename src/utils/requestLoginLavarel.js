import { get, pickBy, omit } from 'lodash';
import build from 'redux-object';
import { extend } from 'umi-request';
import Cookies from 'universal-cookie';
import normalize from 'json-api-normalizer';

const cookies = new Cookies();
let optionsRoot;
const request = extend({
  prefix: API_URL_LAVAREL_LOGIN,
  maxCache: 10,
});

const removeParams = (params) => {
  return omit(pickBy(params, (value) => value !== null && value !== undefined));
};

// request options
request.interceptors.request.use(async (url, options) => {
  optionsRoot = options;
  const token = cookies.get('access_token');
  if (token) {
    const customOps = {
      ...options,
      params: removeParams(options.params),
      headers: { Authorization: `Bearer ${token}` },
      interceptors: true,
    };
    return {
      options: customOps,
    };
  }
  return {
    options: { ...options, interceptors: true },
  };
});

async function covertData(response) {
  if (response.status >= 200 && response.status < 300) {
    if (response.status === 204) {
      return response;
    }
    const dataRoot = await response.clone().json();
    const schema = normalize(dataRoot, {
      camelizeTypeValues: false,
      camelizeKeys: false,
    });

    const { data } = await response.json();
    let payload;
    if (optionsRoot.parse === undefined) {
      if (Array.isArray(data)) {
        payload = data.map((item) => build(schema, item.type, item.id, { includeType: true }));
      } else {
        payload = build(schema, data.type, data.id, { includeType: true });
      }
      return {
        parsePayload: payload,
        pagination: get(dataRoot, 'meta.pagination'),
        unread: get(dataRoot, 'meta.UNREAD'),
        payload: data,
      };
    }
    return dataRoot;
  }
  return response;
}
// response interceptor, handling response
request.interceptors.response.use(
  (response) => covertData(response),
  (error) => error,
);

// middleware response and request
request.use(async (ctx, next) => {
  await next();
});

export default request;
