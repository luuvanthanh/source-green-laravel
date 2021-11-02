import request from '@/utils/requestCrm';

export function get(params = {}) {
  return request('/v1/status-admission-registers', {
    method: 'GET',
    params: {
      ...params
    },
  });
}
