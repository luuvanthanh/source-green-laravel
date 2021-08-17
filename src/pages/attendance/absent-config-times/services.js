import request from '@/utils/requestLavarel';

export function get(_params = {}) {
  return request(`/v1/absent-config-times`, {
    method: 'GET',
    params: {
      orderBy: 'From',
      sortedBy: 'desc',
      searchJoin: 'and',
    }
  });
}

export function add(data = {}) {
  return request(`/v1/absent-config-times`, {
    method: 'POST',
    data,
  });
}
