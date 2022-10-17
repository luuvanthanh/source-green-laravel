import request from '@/utils/requestSSO';
import { omit } from 'lodash';

export function add(data = {}) {
  return request('/api/function-processes', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/api/function-processes/${data.moduleId}`, {
    method: 'PUT',
    data: {
      ...data,
      ...omit(data, 'moduleId'),
    },
    parse: true,
  });
}

export function getData(params = {}) {
  return request(`/api/function-processes/${params.id}`, {
    method: 'GET',
    params: {
      ...params,
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

export function getBrowseObject() {
  return request(`/api/identity/roles/all`, {
    method: 'GET',
    params: {},
  });
}

export function getRecipients() {
  return request(`/api/business-object-type`, {
    method: 'GET',
    params: {},
  });
}
