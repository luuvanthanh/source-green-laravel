import request from '@/utils/request';

export function get(params = {}) {
  return request('/program', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function remove(id = {}) {
  return request(`/program/${id}`, {
    method: 'DELETE',
    parse: true,
    data: {
      id,
    },
    cancelNotification: true,
  });
}
