import request from '@/utils/request';

export function get(params = {}) {
  return request('/timetables/detail-by-conditions', {
    method: 'GET',
    params: {
      params,
    },
  });
}

export function getYears(params = {}) {
  return request('/timetable-settings', {
    method: 'GET',
    params: {
      params,
    },
  });
}

export function getActivities(params = {}) {
  return request('/timetable-activities/details', {
    method: 'GET',
    params: {
      params,
    },
  });
}

export function getAddDrag(data = {}) {
  return request('/timetables/by-drag-drop', {
    method: 'POST',
    data,
  });
}

export default get;
