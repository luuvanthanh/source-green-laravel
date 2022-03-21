import request from '@/utils/requestLavarel';
import { omit } from 'lodash';
import { Helper, variables } from '@/utils';

export function get(params = {}) {
  return request('/v1/labours-contracts', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      limit: params.limit,
      page: params.page,
      include: Helper.convertIncludes([
       'employee,typeOfContract,position,branch'
      ]),
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
