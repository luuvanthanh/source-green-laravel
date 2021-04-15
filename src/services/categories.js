import request from '@/utils/request';
import requestLogin from '@/utils/requestLogin';
import { Helper, variables } from '@/utils';

export function getRoles(params = {}) {
  return requestLogin('/api/identity/roles', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
    },
  });
}

export function getStudents(params = {}) {
  return request('/students', {
    method: 'GET',
    params,
  });
}

export function getBranches(params = {}) {
  return request('/branches', {
    method: 'GET',
    params,
  });
}

export function getClasses(params = {}) {
  return request('/classes', {
    method: 'GET',
    params,
  });
}

export default getRoles;
