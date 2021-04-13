import request from '@/utils/request';
import { Helper, variables } from '@/utils';

export function get(params = {}) {
  return request('/time-tables', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
    },
  });
}

export default get;
