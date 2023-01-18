import request from '@/utils/request';

// import { Helper } from '@/utils';

export function add(data = {}) {
  return request('/physical-study-programs', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/physical-study-programs/${data.id}`, {
    method: 'PUT',
    data: {
      ...data,
    },
    parse: true,
  });
}

export function getData(params = {}) {
  return request(`/physical-study-programs/${params.id}`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function remove(id = {}) {
  return request(`/physical-study-programs/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

export function getClasses(params) {
  return request('/classes/by-branches', {
    method: 'GET',
    params,
  });
}
