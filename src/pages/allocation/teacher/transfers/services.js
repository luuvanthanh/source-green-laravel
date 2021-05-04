import request from '@/utils/request';

export function changeClassTeacher({ id, data }) {
  return request(`/class-teachers/change-to-class/${id}`, {
    method: 'PUT',
    data
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
