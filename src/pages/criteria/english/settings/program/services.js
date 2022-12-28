import request from '@/utils/request';

export function get(params = {}) {
  return request('/program', {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      searchJoin: 'and',
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
