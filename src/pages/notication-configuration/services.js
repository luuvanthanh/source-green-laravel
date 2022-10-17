import request from '@/utils/requestSSO';

export function get(params = {}) {
  return request('/api/module', {
    method: 'GET',
    params: {
      ...params,
      Code: 'QUY_TRINH_THONG_BAO',
    },
  });
}

export function remove(id = {}) {
  return request(`/api/module/${id}`, {
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
  return request(`/api/module/${data.id}`, {
    method: 'PUT',
    data,
    parse: true,
  });
}
