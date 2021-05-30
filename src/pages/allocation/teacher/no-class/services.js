import request from '@/utils/request';

export function createClassTeacher(data) {
  return request('/class-teachers', {
    method: 'POST',
    data,
  });
}

export function getTeachers(params = {}) {
  return request('/class-teachers', {
    method: 'GET',
    params,
  });
}

export function changeClassTeacher({ id, data }) {
  return request(`/class-teachers/change-to-class/${id}`, {
    method: 'PUT',
    data,
  });
}
