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
