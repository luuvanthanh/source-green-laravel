import request from '@/utils/requestCrm';

export function add(data = {}) {
  return request('/v1/web-forms', {
    method: 'POST',
    data,
  });
}

export function remove(id = {}) {
  return request(`/v1/tags/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

export function getTags(data) {
  return request('/v1/tags', {
    method: 'GET',
    data,
  });
}


export function getBranches(params) {
    return request(`/v1/branches`, {
      method: 'GET',
      params: {
        ...params,
        orderBy: 'name',
      },
    });
  }

  export function getDistricts(params) {
    return request(`/v1/districts?`, {
      method: 'GET',
      params: {
        ...params,
        orderBy: 'name',
      },
    });
  }

  export function getPrograms(data) {
    return request(`/v1/marketing-programs/${data.id}`, {
      method: 'GET',
      data,
    });
  }