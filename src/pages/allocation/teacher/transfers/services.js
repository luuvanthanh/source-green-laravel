import request from '@/utils/request';

export function change({ id, data, startDate }) {
  return request(`/class-teachers/change-to-class/${id}?startDate=${startDate}`, {
    method: 'PUT',
    data,
  });
}

export function getTeachers(params = {}) {
  return request('/class-teachers', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
