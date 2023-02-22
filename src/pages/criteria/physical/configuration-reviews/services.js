import request from '@/utils/request';

export function get(params = {}) {
  return request('/physical-evaluate-template/list-of-pagging', {
    method: 'GET',
    params: {
      ...params
    },
  });
}
export function remove(id = {}) {
  return request(`/physical-evaluate-template/${id}`, {
    method: 'DELETE',
    parse: true,
    data: {
      id,
    },
  });
}
