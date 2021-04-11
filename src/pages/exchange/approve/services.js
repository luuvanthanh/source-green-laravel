import request from '@/utils/request';
import { Helper, variables } from '@/utils';
import variablesModules from '../utils/variables';

export function get(params = {}) {
  return request('/communications', {
    method: 'GET',
    params: {
      feedbackStatus: variablesModules.STATUS.VALIDATING,
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
    },
  });
}

export function update(data = {}) {
  return request(`/feedbacks/${data.id}`, {
    method: 'PUT',
    data,
  });
}
