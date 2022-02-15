import { Helper } from '@/utils';
import request from '@/utils/requestLavarel';

export function add(data = {}) {
  return request('/v1/document-managements', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/document-managements/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function get(data = {}) {
  return request(`/v1/document-managements/${data.id}`, {
    method: 'GET',
    params: {
      include: Helper.convertIncludes(['employee']),
    },
  });
}
