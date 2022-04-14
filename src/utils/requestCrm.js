import { get, pickBy, omit } from 'lodash';
import { notification } from 'antd';
import build from 'redux-object';
import { extend } from 'umi-request';
import Cookies from 'universal-cookie';
import normalize from 'json-api-normalizer';
import { variables } from './variables';

const cookies = new Cookies();
let optionsRoot;
const request = extend({
  prefix: API_URL_CRM,
  maxCache: 10,
});

const removeParams = (params) =>
  omit(pickBy(params, (value) => value !== null && value !== undefined));

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
  if (response.status === 204) {
    notification.success({
      message: 'Thông báo',
      description: 'Bạn đã cập nhật thành công dữ liệu',
    });
    return response;
  }
  const dataRoot = await response.clone().json();
  if (variables.method.includes(optionsRoot?.method?.toLowerCase())) {
    if (response.status >= 400 && response.status <= 500) {
      notification.error({
        message: 'Thông báo',
        description: get(dataRoot, 'errors[0].detail') || 'Lỗi hệ thống vui lòng kiểm tra lại',
      });
    }
    if (response.status >= 200 && response.status <= 300) {
      notification.success({
        message: 'Thông báo',
        description: 'Bạn đã cập nhật thành công dữ liệu',
      });
    }
  }
  if (response.status >= 200 && response.status < 300) {
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
        data_details: get(dataRoot, 'data_details'),
        meta: get(dataRoot, 'meta'),
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
