import request from '@/utils/request';
import { omit } from 'lodash';
import { Helper } from '@/utils';

export function getNote(params = {}) {
  return request('/notes', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function detailsNote(data) {
  return request(`/notes/${data.id}`, {
    method: 'GET',
  });
}

export function getMedical(params = {}) {
  return request('/medicals', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function detailsMedical(data) {
  return request(`/medicals/${data.id}`, {
    method: 'GET',
  });
}
