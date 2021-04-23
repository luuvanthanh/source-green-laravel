import request from '@/utils/request';
import requestLogin from '@/utils/requestLogin';
import requestLaravel from '@/utils/requestLavarel';
import { Helper, variables } from '@/utils';

export function getRoles(params = {}) {
  return requestLogin('/api/identity/roles', {
    method: 'GET',
    params: {
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
    params: {
      ...params,
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
    },
  });
}

export function getClasses(params = {}) {
  return request('/classes', {
    method: 'GET',
    params,
  });
}

export function getTeachers(params = {}) {
  return requestLaravel('/v1/employees', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export default getRoles;
