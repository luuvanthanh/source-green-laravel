import request from '@/utils/requestLavarel';

export function get(params = {}) {
  return request('/v1/sample-comments', {
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
  return request(`/v1/sample-comments/${id}`, {
    method: 'DELETE',
    parse: true,
    cancelNotification: true,
  });
}
