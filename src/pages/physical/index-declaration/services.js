import request from '@/utils/request';

export function get() {
  return request('/criteria-standards', {
    method: 'GET',
    params: {
      Sorting: 'Sorting',
      SkipCount: 0,
      MaxResultCount: 1000,
    },
  });
}

export function put(data = {}) {
  return request(`/criteria-standards`, {
    method: 'POST',
    data: [...data],
  });
}

export default get;
