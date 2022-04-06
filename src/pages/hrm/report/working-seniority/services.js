import request from '@/utils/requestLavarel';
import {  variables } from '@/utils';

export function get(params = {}) {
  return request('/v1/report-working-seniority', {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      searchJoin: 'and',
      fullName: params.fullName,
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

export function getEmployees(_params = {}) {
  return request('/v1/employees', {
    method: 'GET',
    params: {
      limit: variables.PAGINATION.SIZEMAX,
      page: variables.PAGINATION.PAGE,
    },
  });
}
