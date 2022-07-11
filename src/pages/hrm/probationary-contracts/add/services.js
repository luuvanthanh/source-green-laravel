import request from '@/utils/requestLavarel';
import { Helper } from '@/utils';

export function add(data = {}) {
  return request('/v1/probationary-contracts', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/probationary-contracts/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function details(data) {
  return request(`/v1/probationary-contracts/${data.id}`, {
    method: 'GET',
  });
}

export function getStaff() {
  return request(`/v1/employees`, {
    method: 'GET',
    params: {
      include: Helper.convertIncludes(['positionLevel,positionLevelNow']),
    },
  });
}
export function getFormContarct(data = {}) {
  return request('/v1/number-form-contracts', {
    method: 'GET',
    params: {
      ...data,
    },
  });
}
