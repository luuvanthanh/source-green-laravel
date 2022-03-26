import request from '@/utils/requestCrm';

export function details(data = {}) {
  return request(`/v1/manager-calls/${data.id}`, {
    method: 'GET',
    params: {},
  });
}

export function add(data = {}) {
  return request('/manager-calls', {
    method: 'POST',
    data,
    parse: true,
  });
}
