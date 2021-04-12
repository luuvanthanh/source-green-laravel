import request from '@/utils/request';
import { Helper, variables } from '@/utils';

export function get(params = {}) {
  return request(`/medicals/${params.id}`, {
    method: 'GET',
  });
}

export function add(data = {}) {
  return request('/medicals', {
    method: 'POST',
    data,
  });
}

export function updateStatus(data = {}) {
  return request('/medicals/update-status', {
    method: 'PUT',
    data,
  });
}
