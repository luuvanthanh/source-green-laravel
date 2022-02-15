import request from '@/utils/request';

export function add(data = {}) {
  return request('/timetable-settings', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/timetable-settings/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function details(data) {
  return request(`/timetable-settings/${data.id}`, {
    method: 'GET',
  });
}
