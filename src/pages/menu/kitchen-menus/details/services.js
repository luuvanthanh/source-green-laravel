import request from '@/utils/request';

export function get(params = {}) {
  return request(`/kitchen-menus/group-by-day/${params.id}`, {
    method: 'GET',
    params: {},
  });
}

export default get;
