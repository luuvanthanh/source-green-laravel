import request from '@/utils/request';

export function add(data = {}) {
  return request('/criteria-groups', {
    method: 'POST',
    data,
    parse: true,
  });
}

export function update(data = {}) {
  return request(`/criteria-groups/${data.id}`, {
    method: 'PUT',
    data,
    parse: true,
  });
}

export function details(data = {}) {
  return request(`/criteria-groups/${data.id}`, {
    method: 'GET',
  });
}
