import request from '@/utils/requestCrm';

export function details(data = {}) {
  return request(`/v1/branches/${data.id}`, {
    method: 'GET',
  });
}