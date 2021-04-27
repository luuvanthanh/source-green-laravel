import request from '@/utils/request';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/api/product-types', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(params.page, params.limit),
    }
  });
}

export default get;
