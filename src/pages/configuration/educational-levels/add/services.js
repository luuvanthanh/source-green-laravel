import request from '@/utils/requestLavarel';
import { Helper, variables } from '@/utils';

export function add(data = {}) {
  return request('/v1/educational-levels', {
    method: 'POST',
    data,
    parse: true,
  });
}

export function update(data = {}) {
  return request(`/v1/educational-levels/${data.id}`, {
    method: 'PUT',
    data,
    parse: true,
  });
}

export function details(data = {}) {
  return request(`/v1/educational-levels/${data.id}`, {
    method: 'GET',
  });
}
