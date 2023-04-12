import request from '@/utils/requestLavarel';
import {  Helper } from '@/utils';


export function get(params = {}) {
  return request('/v1/recruitment-candidate', {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes(['level,division,recruitmentManagement', 'questionCandidate.recruitmentQuestion']),
    },
  });
}

export function remove(id = {}) {
  return request(`/v1/recruitment-candidate/${id}`, {
    method: 'DELETE',
    parse: true,
    data: {
      id,
    },
  });
}
