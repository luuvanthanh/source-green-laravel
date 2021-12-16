import request from '@/utils/request';

export function get(params = {}) {
  return request('/student-medical-problems', {
    method: 'GET',
    params: {
      ...params
    },
  });
}

export function remove(id = {}) {
  return request(`/student-medical-problems/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}