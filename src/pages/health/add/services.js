import request from '@/utils/request';
import { omit } from 'lodash';
import { Helper, variables } from '@/utils';

export const get = () => {};

export function add(data = {}) {
  return request('/student-criterias', {
    method: 'POST',
    data,
  });
}

export function getStudents(params = {}) {
  return request('/students', {
    method: 'GET',
    params: {
      ...omit(params),
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function getCriteriaGroupProperties(_params = {}) {
  return request('/criteria-group-properties', {
    method: 'GET',
    params: {
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
      type: 'HEALTH'
    },
  });
}
