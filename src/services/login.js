import requestLogin from '@/utils/requestLogin';
import request from '@/utils/request';
import qs from 'qs';

export function login(data) {
  return requestLogin('/connect/token', {
    method: 'POST',
    headers: {
      Authorization: 'Basic RXJwX0FwcDoxcTJ3M0Uq',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify({
      ...data,
    }),
    isLogin: true,
  });
}

export function me(data) {
  return request('/user/me', {
    method: 'GET',
    headers: {
      Authorization: `${data.token_type} ${data.access_token}`,
    },
  });
}

export async function switchAccount(params) {
  return request('/user/switch-role', {
    method: 'PATCH',
    params,
    parse: true,
  });
}

export async function logout() {
  return requestLogin('/api/logout', {
    method: 'POST',
    parse: true,
    isLogin: true,
  });
}
