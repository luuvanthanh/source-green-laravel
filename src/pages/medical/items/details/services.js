import request from '@/utils/request';

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
  return request('/medicals/update-medicine-time-status', {
    method: 'PUT',
    data,
  });
}
