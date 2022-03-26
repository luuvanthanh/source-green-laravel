import request from '@/utils/requestCrm';

export function get(params = {}) {
  return request('/v1/customer-leads/', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
