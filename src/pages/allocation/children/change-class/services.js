import request from '@/utils/request';
import { omit } from 'lodash';
import { variables, Helper } from '@/utils';

export function changeClassStudent({ id, data }) {
  return request(`/class-students/change-to-class/${id}`, {
    method: 'PUT',
    data,
  });
}

export function getStudents(params = {}) {
  return request('/class-students', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}
