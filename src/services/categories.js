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

export default getRoles;
