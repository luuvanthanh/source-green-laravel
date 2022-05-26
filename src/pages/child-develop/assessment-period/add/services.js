import request from '@/utils/requestLavarel';
import requestApi from '@/utils/request';
import { Helper } from '@/utils';

export function add(data = {}) {
  return request('/v1/assessment-periods', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/assessment-periods/${data.id}`, {
    method: 'PUT',
    data,
    parse: true,
  });
}

export function details(data = {}) {
  return request(`/v1/assessment-periods/${data.id}`, {
    method: 'GET',
    params: {
      ...data,
      include: Helper.convertIncludes(['classes', 'branch', 'schoolYear']),
    },
  });
}

export function remove(id = {}) {
  return request(`/v1/assessment-periods/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

export function getSchooolYear(params) {
  return request('/v1/school-years', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function getBranches(params) {
  return request('/v1/branches', {
    method: 'GET',
    params,
  });
}

export function getClass(params) {
  return requestApi('/classes/by-branches', {
    method: 'GET',
    params,
  });
}

export function getProblems(params) {
  return request('/v1/name-assessment-periods', {
    method: 'GET',
    params,
  });
}
