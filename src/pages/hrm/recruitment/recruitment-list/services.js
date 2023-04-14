import request from '@/utils/requestLavarel';
import {  Helper } from '@/utils';

export function get(params = {}) {
  return request('/v1/recruitment-manager', {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes(['recruitmentConfiguration,level,division,candidate']),
      orderBy: 'CreationTime',
      sortedBy: 'desc',
    },
  });
}

export function remove(id = {}) {
  return request(`/v1/recruitment-manager/${id}`, {
    method: 'DELETE',
    parse: true,
    data: {
      id,
    },
  });
}
