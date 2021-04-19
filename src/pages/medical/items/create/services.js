import request from '@/utils/request';
import { Helper, variables } from '@/utils';

export function get(params = {}) {
  return request('/medicals', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function add(data = {}) {
  return request('/medicals', {
    method: 'POST',
    data,
  });
}

export function getStudents(params = {}) {
  return request('/students', {
    method: 'GET',
    params: {
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
    },
  });
}