import request from '@/utils/requestLavarel';
import { variables } from '@/utils';

export function getParamaterValues(data = {}) {
  return request('/v1/paramater-values', {
    method: 'GET',
    params: {
      ...data,
      limit: variables.PAGINATION.SIZEMAX,
      page: variables.PAGINATION.PAGE,
    },
  });
}

export function getParamaterFormulas() {
  return request('/v1/paramater-formulas', {
    method: 'GET',
    params: {
      limit: variables.PAGINATION.SIZEMAX,
      page: variables.PAGINATION.PAGE,
    },
  });
}

export function add(data = {}) {
  return request('/v1/type-of-contracts', {
    method: 'POST',
    data,
    parse: true,
  });
}

export function update(data = {}) {
  return request(`/v1/type-of-contracts/${data.id}`, {
    method: 'PUT',
    data,
    parse: true,
  });
}

export function details(data = {}) {
  return request(`/v1/type-of-contracts/${data.id}`, {
    method: 'GET',
    params: {
      include: 'parameterValues',
    },
  });
}
