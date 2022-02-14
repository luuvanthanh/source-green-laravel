import request from '@/utils/requestCrm';

export function get(params = {}) {
  return request('/v1/fees', {
    method: 'GET',
    params: {
      page: params.page,
      limit: params.limit,
    },
  });
}
