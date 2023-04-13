import request from '@/utils/requestLavarel';
import {  Helper } from '@/utils';

export function get(params = {}) {
  return request('/v1/recruitment-configurations', {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes(['division,level,question']),
      orderBy: 'CreationTime',
      sortedBy: 'asc',
    },
  });
}

export function remove(id = {}) {
  return request(`/v1/recruitment-configurations/${id}`, {
    method: 'DELETE',
    parse: true,
    data: {
      id,
    },
  });
}
