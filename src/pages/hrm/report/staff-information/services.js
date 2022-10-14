import request from '@/utils/requestLavarel';
import { variables } from '@/utils';

export function get(params = {}) {
  return request('/v1/report-employee-info', {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      searchJoin: 'and',
    },
  });
}

export function getBranches(_params = {}) {
  return request('/v1/branches', {
    method: 'GET',
    params: {
      limit: variables.PAGINATION.SIZEMAX,
      page: variables.PAGINATION.PAGE,
    },
  });
}

export function getDivisions(_params = {}) {
  return request('/v1/divisions', {
    method: 'GET',
    params: {
      limit: variables.PAGINATION.SIZEMAX,
      page: variables.PAGINATION.PAGE,
    },
  });
}

export function getPositions(_params = {}) {
  return request('/v1/positions', {
    method: 'GET',
    params: {
      limit: variables.PAGINATION.SIZEMAX,
      page: variables.PAGINATION.PAGE,
    },
  });
}

export function add(data = {}) {
  return request('/v1/employees', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/employees/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function remove(id) {
  return request(`/v1/employees/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

export default get;
