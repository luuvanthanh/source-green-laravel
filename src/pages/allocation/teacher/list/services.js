import request from '@/utils/request';

export function getStudents(params = {}) {
  return request('/class-students', {
    method: 'GET',
    params,
  });
}

export function getTeachers(params = {}) {
  return request('/class-teachers', {
    method: 'GET',
    params,
  });
}

export function changeRadioTeacher({ id, data, check }) {
  return request(`/class-teachers/${id}/change-isLead?isLead=${check}`, {
    method: 'PUT',
    data: {
      ...data,
    },
  });
}
