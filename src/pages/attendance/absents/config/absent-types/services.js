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

export function add(data = {}) {
  return request('/v1/absent-type-students', {
    method: 'POST',
    data,
    parse: true,
  });
}

export function update(data = {}) {
  return request(`/v1/absent-type-students/${data.id}`, {
    method: 'PUT',
    data,
    parse: true,
  });
}

export function details(data = {}) {
  return request(`/v1/absent-type-students/${data.id}`, {
    method: 'GET',
  });
}
