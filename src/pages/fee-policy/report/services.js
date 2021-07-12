import request from '@/utils/requestLavarel';

export function get(params = {}) {
  return request('/v1/charge-old-students', {
    method: 'GET',
    params: {
      ...params
    },
  });
}

export function remove(id) {
  return request(`/v1/charge-old-students/${id}`, {
    method: 'DELETE',
  });
}
