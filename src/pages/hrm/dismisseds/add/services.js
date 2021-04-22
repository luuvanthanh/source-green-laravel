import request from '@/utils/requestLavarel';
import { Helper, variables } from '@/utils';

export function getUsers(params = {}) {
  return request('/v1/employees', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function add(data = {}) {
  return request('/v1/dismisseds', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/dismisseds/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function details(data) {
  return request(`/v1/dismisseds/${data.id}`, {
    method: 'GET',
  });
}

export function getBranches(params = {}) {
  return request('/v1/branches', {
    method: 'GET',
    params: {
      limit: variables.PAGINATION.SIZEMAX,
      page: variables.PAGINATION.PAGE,
    },
  });
}

export function getDivisions(params = {}) {
  return request('/v1/divisions', {
    method: 'GET',
    params: {
      limit: variables.PAGINATION.SIZEMAX,
      page: variables.PAGINATION.PAGE,
    },
  });
}

export function getPositions(params = {}) {
  return request('/v1/positions', {
    method: 'GET',
    params: {
      limit: variables.PAGINATION.SIZEMAX,
      page: variables.PAGINATION.PAGE,
    },
  });
}
