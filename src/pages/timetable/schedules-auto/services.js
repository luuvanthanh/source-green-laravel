import request from '@/utils/request';

export function get(params = {}) {
  return request('/timetables/detail-by-conditions', {
    method: 'GET',
    params,
  });
}

export function getYears(params = {}) {
  return request('/timetable-settings', {
    method: 'GET',
    params,
  });
}

export function getActivities(params = {}) {
  return request('/timetable-activities/details', {
    method: 'GET',
    params,
  });
}

export function addDrag(data = {}) {
  return request('/timetables/by-drag-drop', {
    method: 'POST',
    data,
    cancelNotification: true
  });
}

export function updateActivies(data = {}) {
  return request('/timetables/by-detail-popup', {
    method: 'POST',
    data,
  });
}

export function removeActivites(data = {}) {
  return request(`/timetable-detail-activities/${data.id}`, {
    method: 'DELETE',
  });
}

export function dragCellByCell(data = {}) {
  return request(`/timetables/by-drag-drop/${data.id}`, {
    method: 'PUT',
    data,
  });
}
