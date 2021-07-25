import request from '@/utils/requestLavarel';

export function get(data = {}) {
  return request('/v1/absent-type-students', {
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
  return request(`/v1/absent-type-students/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}
