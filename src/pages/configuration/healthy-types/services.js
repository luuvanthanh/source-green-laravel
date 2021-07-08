import request from '@/utils/request';

export function get(params = {}) {
  return request('/configs/by-type', {
    method: 'GET',
    params,
  });
}

export function active(params = {}) {
  return request(`/configs/config-key/${params.id}/active`, {
    method: 'PUT',
    params: {
      ...params,
      isActive: params.isActive || 'false',
    },
  });
}

export function setValue(params = {}) {
  return request(`/configs/${params.id}/set-value`, {
    method: 'PUT',
    params,
  });
}
