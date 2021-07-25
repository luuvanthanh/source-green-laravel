import request from '@/utils/requestLavarel';

export function get(data = {}) {
  return request('/v1/fingerprint-timekeepers', {
    method: 'GET',
    params: {
      ...data,
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      searchJoin: 'and',
    },
  });
}

export function remove(id) {
  return request(`/v1/fingerprint-timekeepers/${id}`, {
    method: 'DELETE',
    data: {
      id,
    },
    parse: true,
  });
}
