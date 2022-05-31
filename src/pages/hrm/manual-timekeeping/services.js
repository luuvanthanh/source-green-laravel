import { Helper } from '@/utils';
import request from '@/utils/requestLavarel';

export function get(params = {}) {
  return request('/v1/manual-calculations', {
    method: 'GET',
    params: {
      ...params,
      limit: params.limit,
      page: params.page,
      include: Helper.convertIncludes(['manualCalculation', 'positionLevelNow']),
    },
  });
}

export function getEmployees(params = {}) {
  return request('/v1/employees', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function copy(data = {}) {
  return request('/v1/copy-manual-calculations', {
    method: 'POST',
    data,
  });
}
