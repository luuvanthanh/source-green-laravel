import request from '@/utils/requestCrm';

export function get(params) {
  return request(`/v1/category-skills`, {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'numerical_skill',
    },
  });
}

export function updateOrderIndex(data = {}) {
  return request(`/v1/category-skill-sorts`, {
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

export function update(data = {}) {
  return request(`/v1/category-skills/${data.id}`, {
    method: 'PUT',
    data,
    parse: true,
  });
}