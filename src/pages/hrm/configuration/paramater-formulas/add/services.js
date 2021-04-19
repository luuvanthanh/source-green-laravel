import request from '@/utils/requestLavarel';
import { Helper, variables } from '@/utils';

export function add(data = {}) {
  return request('/v1/paramater-formulas', {
    method: 'POST',
    data,
    parse: true,
  });
}

export function update(data = {}) {
  return request(`/v1/paramater-formulas/${data.id}`, {
    method: 'PUT',
    data,
    parse: true,
  });
}

export function details(data = {}) {
  return request(`/v1/paramater-formulas/${data.id}`, {
    method: 'GET',
  });
}
