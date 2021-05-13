import request from '@/utils/request';
import { Helper, variables } from '@/utils';

export function get(params = {}) {
  return request(`/news/${params.id}`, {
    method: 'GET',
  });
}
