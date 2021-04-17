import request from '@/utils/request';
import { Helper, variables } from '@/utils';

export function add(data = {}) {
  return request('/branches', {
    method: 'POST',
    data,
    parse: true,
  });
}

export function update(data = {}) {
  return request(`/branches/${data.id}`, {
    method: 'PUT',
    data,
    parse: true,
  });
}

export function details(data = {}) {
  return request(`/branches/${data.id}`, {
    method: 'GET',
  });
}
