import request from '@/utils/request';
import { Helper, variables } from '@/utils';

export function get(params = {}) {
  return request('/student-criterias/statistic-by-property', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function getCriteriaGroupProperties() {
  return request('/criteria-group-properties', {
    method: 'GET',
    params: {
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
      type: 'HEALTH',
    },
  });
}
