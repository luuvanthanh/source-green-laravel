import request from '@/utils/request';

export function add(data = {}) {
  return request('/timetable-activities', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/timetable-activities/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function details(data) {
  return request(`/timetable-activities/${data.id}`, {
    method: 'GET',
  });
}
