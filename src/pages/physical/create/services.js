import request from '@/utils/request';
import { omit } from 'lodash';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/student-criterias/physical', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function add(data = {}) {
  return request('/student-criterias/physical', {
    method: 'PUT',
    data,
  });
}

export function getStudents(params = {}) {
  return request('/students', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
      classStatus: params.class ? 'HAS_CLASS' : 'ALL',
      studentStatus: 'OFFICAL',
    },
  });
}

export default get;
