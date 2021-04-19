import request from '@/utils/request';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/posts', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export default get;
