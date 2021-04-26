import request from '@/utils/requestLavarel';

export function add(data) {
  return request('/v1/shift-students', {
    method: 'POST',
    data,
    parse: true,
  });
}

export function update(data) {
  return request(`/v1/shift-students/${data.id}`, {
    method: 'PUT',
    data: {
      ...data,
      shiftId: data.id,
    },
    parse: true,
  });
}

export function details(id) {
  return request(`/v1/shift-students/${id}`, {
    method: 'GET',
    params: {
      include: 'shiftDetail',
    },
  });
}
