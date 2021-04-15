import request from '@/utils/request';

export function changeClassStudent({ id, data }) {
  return request(`/class-students/change-to-class/${id}`, {
    method: 'PUT',
    data
  });
}

export function getStudents(params = {}) {
  return request('/class-students', {
    method: 'GET',
    params,
  });
}