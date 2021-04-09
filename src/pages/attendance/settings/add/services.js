import request from '@/utils/requestLavarel';

export function add(data) {
  return request('/v1/shifts', {
    method: 'POST',
    data: {
      description: data.description,
      store_id: data.store_id,
      time: data.time,
      shift_code: data.shift_code,
    },
    parse: true,
  });
}

export function update(data) {
  return request(`/v1/shifts/${data.id}`, {
    method: 'PUT',
    data: {
      description: data.description,
      store_id: data.store_id,
      time: data.time,
      shift_code: data.shift_code,
      shift_id: data.id,
    },
    parse: true,
  });
}

export function details(id) {
  return request(`/v1/shifts/${id}`, {
    method: 'GET',
    params: {
      include: 'shiftDetail',
    },
  });
}
