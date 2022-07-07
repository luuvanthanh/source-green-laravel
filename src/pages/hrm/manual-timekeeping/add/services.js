import request from '@/utils/requestLavarel';
import { Helper } from '@/utils';

export function add(data = {}) {
  return request('/v1/manual-calculations', {
    method: 'POST',
    data,
  });
}

export function get(params = {}) {
  return request('/v1/employees', {
    method: 'GET',
    params: {
      ...params,
      limit: params.limit,
      page: params.page,
      orderBy: 'FullName;CreationTime',
      include: Helper.convertIncludes([
        'manualCalculation',
        'positionLevelNow',
        'probationaryContract,labourContract,resignationDecision',
      ]),
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
