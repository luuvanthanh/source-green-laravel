import request from '@/utils/request';
import { Helper, variables } from '@/utils';

export function add(data = {}) {
  return request('/job-types', {
    method: 'POST',
    data,
    parse: true,
  });
}

export function update(data = {}) {
  return request(`/job-types/${data.id}`, {
    method: 'PUT',
    data,
    parse: true,
  });
}

export function details(data = {}) {
  return request(`/job-types/${data.id}`, {
    method: 'GET',
  });
}
