import request from '@/utils/request';

export function get(params = {}) {
  return request('/physical-study-programs/list-of-pagging', {
    method: 'GET',
    params: {
      ...params
    },
  });
}

export function remove(id = {}) {
  return request(`/physical-study-programs/${id}`, {
    method: 'DELETE',
    parse: true,
    data: {
      id,
    },
  });
}
