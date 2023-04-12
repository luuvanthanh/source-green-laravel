import request from '@/utils/requestLavarel';
import { variables, Helper } from '@/utils';

export function add(data = {}) {
  return request('/v1/recruitment-configurations', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/recruitment-configurations/${data.id}`, {
    method: 'PUT',
    data: {
      ...data,
    },
  });
}

export function getData(params = {}) {
  return request(`/v1/recruitment-configurations/${params.id}`, {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes(['division,level,question']),
    },
  });
}

export function getRecruitmentLevels() {
  return request(`/v1/recruitment-levels`, {
    method: 'GET',
    params: {},
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
