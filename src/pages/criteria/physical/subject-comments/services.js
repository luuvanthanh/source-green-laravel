import request from '@/utils/request';

export function get(params = {}) {
  return request('/physical-criteria-template/criteria/list-of-pagging', {
    method: 'GET',
    params: {
      ...params
    },
  });
}

export function remove(id = {}) {
  return request(`/physical-criteria-template/criteria/${id}`, {
    method: 'DELETE',
    parse: true,
    data: {
      id,
    },
  });
}
