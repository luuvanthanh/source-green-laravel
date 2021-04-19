import request from '@/utils/request';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/communications', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function details(data) {
  return request(`/communications/${data.id}`, {
    method: 'GET',
  });
}

export function updateCommunications(data = {}) {
  return request(`/communications/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function add(data = {}) {
  return request('/feedbacks', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/feedbacks/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function remove(id) {
  return request(`/feedbacks/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

export default get;
