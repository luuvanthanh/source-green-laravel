import request from '@/utils/requestCrm';

export function add(data = {}) {
  return request('/v1/question-reviews', {
    method: 'POST',
    data,
  });
}

export function remove(id = {}) {
  return request(`/v1/question-reviews/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

export function getTags(data) {
  return request('/v1/question-reviews', {
    method: 'GET',
    data,
  });
}

export function getColorTags() {
  return request(`/v1/question-reviews`, {
    method: 'GET',
  });
}