import request from '@/utils/requestCrm';

export function getExtensions(params = {}) {
  return request('/v1/extensions', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function checkPhoneNumber(data = {}) {
  return request(`/v1/customer-by-phone/${data.id}`, {
    method: 'GET',
    data,
    parse: true,
  });
}
