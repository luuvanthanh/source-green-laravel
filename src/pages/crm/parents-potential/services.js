import request from '@/utils/requestCrm';

export function get(params = {}) {
  return request('/v1/status-parent-potentials', {
    method: 'GET',
    params: {
      ...params
    },
  });
}
