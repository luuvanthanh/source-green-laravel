import request from '@/utils/request';
import { omit } from 'lodash';
import { Helper, variables } from '@/utils';

export function get(params = {}) {
  return request('/student-criterias', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
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
