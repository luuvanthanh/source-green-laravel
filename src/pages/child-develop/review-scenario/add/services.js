import request from '@/utils/requestLavarel';
import { Helper } from '@/utils';

export function add(data = {}) {
  return request('/v1/child-evaluates', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/child-evaluates/${data.id}`, {
    method: 'PUT',
    data: {
      ...data,
    },
    parse: true,
  });
}

export function getData(params = {}) {
  return request(`/v1/child-evaluates/${params.id}`, {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes([
        'childEvaluateDetail.childEvaluateDetailChildren',
        'childEvaluateDetailChildrent',
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