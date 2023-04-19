import request from '@/utils/requestLavarel';

export function get(params = {}) {
  return request('/v1/interview-configurations', {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'CreationTime',
      sortedBy: 'desc',
    },
  });
}

export function remove(id = {}) {
  return request(`/v1/interview-configurations/${id}`, {
    method: 'DELETE',
    parse: true,
    data: {
      id,
    },
  });
}
