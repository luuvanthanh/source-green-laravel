import request from '@/utils/requestCrm';

export function get(params = {}) {
  return request('/v1/payment-forms', {
    method: 'GET',
    params: {
      ...params
    },
  });
}
