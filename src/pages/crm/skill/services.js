import request from '@/utils/requestCrm';

export function get(params) {
  return request(`/v1/category-skills`, {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'numerical_city',
    },
  });
}

export function updateOrderIndex(data = {}) {
  return request(`/v1/city-sorts`, {
    method: 'POST',
    data,
  });
}

export function remove(id) {
  return request(`/v1/category-skills/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}