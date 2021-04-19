import request from '@/utils/request';
import { Helper, variables } from '@/utils';

export const get = () => {};

export function getStudents(params = {}) {
  return request('/students', {
    method: 'GET',
    params: {
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
    },
  });
}

export function getCriteriaGroupProperties(params = {}) {
  return request('/criteria-group-properties', {
    method: 'GET',
    params: {
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
      groupName: 'Sức khỏe',
    },
  });
}
