import request from '@/utils/requestCrm';

export function get(params = {}) {
  return request('/v1/search-sources', {
    method: 'GET',
    params: {
      ...params
    },
  });
}
