import request from '@/utils/requestLogin';
import qs from 'qs';

export function login(data) {
  return request('/connect/token', {
    method: 'POST',
    headers: {
      Authorization: 'Basic RXJwX0FwcDoxcTJ3M0Uq',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify({
      ...data
    }),
  });
}

export function me(data) {
  return request('/api/identity/my-profile', {
    method: 'GET',
    headers: {
      Authorization: `${data.token_type} ${data.access_token}`
    }
  });
}

export async function logout() {
  return request('/api/logout', {
    method: 'POST',
    parse: true,
  });
}
