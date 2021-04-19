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

export function getBranches(params = {}) {
  return request('/branches', {
    method: 'GET',
    params: {
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
    },
  });
}

export function getClasses(params = {}) {
  return request('/classes', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
    },
  });
}
