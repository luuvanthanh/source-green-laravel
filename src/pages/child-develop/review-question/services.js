import request from '@/utils/requestLavarel';

export function add(data = {}) {
  return request('/v1/category-question-parents', {
    method: 'POST',
    data,
  });
}

export function remove(id = {}) {
  return request(`/v1/category-question-parents/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

export function getTags(data) {
  return request('/v1/category-question-parents', {
    method: 'GET',
    data,
  });
}

export function getColorTags() {
  return request(`/v1/category-question-parents`, {
    method: 'GET',
  });
}