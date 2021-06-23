import request from '@/utils/request';
import requestLogin from '@/utils/requestLogin';

export function getPermission(_params = {}) {
  return request('/permission-management/all-keys', {
    method: 'GET',
    params: {},
  });
}

export function getPermissionByRole(_params = {}) {
  return request(`/permission-management/role-permissions`, {
    method: 'GET',
    params: {},
  });
}

export function update(data) {
  return requestLogin(`/api/permission-management/permissions`, {
    method: 'PUT',
    data,
    params: {
      providerKey: data.providerKey,
      providerName: data.providerName,
    },
  });
}
