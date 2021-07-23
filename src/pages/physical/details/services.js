import request from '@/utils/request';

export function getDetails(data = {}) {
  return request(`/student-criterias/statistic-by-physical/${data.id}`, {
    method: 'GET',
  });
}

export function update(data = {}) {
  return request('/student-criterias/physical', {
    method: 'PUT',
    data,
  });
}
