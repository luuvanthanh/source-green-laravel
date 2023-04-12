import request from '@/utils/request';
import { omit } from 'lodash';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/allergy-notes/student-has-allergy-food', {
    method: 'GET',
    params: {
      ...params,
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function add(data={}) {
  return request(`/allergy-notes`, {
    method: 'POST',
    data: {
      ...data,
    },
  });
}

export function getFood(params = {}) {
  return request(`/food-commons/food-items`, {
    method: 'GET',
    params,
  });
}