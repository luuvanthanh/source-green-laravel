import request from '@/utils/requestLoginLavarel';
import { Helper } from '@/utils';

export async function logout() {
  return request('/v1/logout', {
    method: 'POST',
    parse: true,
  });
}

export function login(data) {
  return request('/v1/oauth/token', {
    method: 'POST',
    data: {
      username: data.username,
      password: data.password,
      client_secret: 'dGQ8qvxGwmnqTiCy4j03Cif6Nd8CVBzeDWB4QgUp',
      client_id: '2',
      grant_type: 'password',
      scope: '',
    },
    parse: true,
  });
}

export function me() {
  return request('/v1/me', {
    method: 'GET',
    params: {
      include: Helper.convertIncludes(['role.permission']),
    },
  });
}
