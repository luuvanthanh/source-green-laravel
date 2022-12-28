import request from '@/utils/request';

export function get(params = {}) {
  return request('/criteria-standards', {
    method: 'GET',
    params: {
      ...params,
      Sorting: 'Sorting',
      SkipCount: 0,
      MaxResultCount: 1000,
    },
  });
}

export function post(data = {}) {
  return request(`/criteria-standards?type=${data?.type}`, {
    method: 'POST',
    data: data?.items,
  });
}

export default get;
