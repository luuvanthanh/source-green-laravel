import request from '@/utils/request';

export function add(data = {}) {
  return request(`/program/set-time-table`, {
    method: 'PUT',
    params: {
      ...data,
    },
    cancelNotification: true,
  });
}

export function getData(params = {}) {
  return request(`/program/get-time-table`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function getDataSubject(data = {}) {
  return request(`/timetable-activities/details`, {
    method: 'GET',
    params: {
      ...data,
    },
  });
}
