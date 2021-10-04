import request from '@/utils/requestCrm';

export function get(params = {}) {
  return request('/v1/status-parent-leads', {
    method: 'GET',
    params: {
      ...params
    },
  });
}
