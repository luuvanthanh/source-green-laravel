import request from '@/utils/request';
import { omit } from 'lodash';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/student-criterias/physical', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function put(data = {}) {
  return request(`/student-criterias/${data?.id}/physical`, {
    method: 'PUT',
    params: {
      value: data?.value,
    },
  });
}

export default get;
