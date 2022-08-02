import request from '@/utils/request';
import { omit } from 'lodash';
import { Helper } from '@/utils';

export function changeClassStudent({ id, data, joinDate }) {
  return request(`/class-students/change-to-class/${id}?joinDate=${joinDate}`, {
    method: 'PUT',
    data: {
      ...data,
    },
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
