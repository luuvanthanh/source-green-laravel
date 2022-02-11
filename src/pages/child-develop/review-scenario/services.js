import request from '@/utils/requestLavarel';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/v1/child-evaluates', {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      searchJoin: 'and',
      include: Helper.convertIncludes([
        'childEvaluateDetail.childEvaluateDetailChildrent',
        'categorySkill'
      ]),
    },
  });
}

export function remove(id = {}) {
  return request(`/v1/child-evaluates/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

export function getSkill() {
  return request(`/v1/category-skills`, {
    method: 'GET',
    params: {
      orderBy: 'Name',
    },
  });
}


export function updateUse(data = {}) {
  return request(`/v1/update-is-use/${data.id}`, {
    method: 'PUT',
    data: {
      use: data.use,
    },
    parse: true,
  });
}
