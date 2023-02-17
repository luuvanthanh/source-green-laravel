import request from '@/utils/request';
import { variables } from '@/utils';

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

export function getPhysical(params = {}) {
  return request('/criteria-group-properties', {
    method: 'GET',
    params: {
      ...params,
      type: 'PHYSICAL',
    },
  });
}

export function getConfirmation(data = {}) {
  return request(`/criteria-standards`, {
    method: 'GET',
    params: {
      maxResultCount: variables.PAGINATION.SIZEMAX,
      type: data?.type,
    },
  });
}
