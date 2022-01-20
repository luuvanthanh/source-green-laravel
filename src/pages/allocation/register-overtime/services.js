import request from '@/utils/request';

export function addLimit(data = {}) {
  return request('/extended-class-registration-configs', {
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

export function year(data) {
  return request(`/timetable-settings`, {
    method: 'GET',
  });
}

export function details(data) {
  return request(`/extended-class-registration-configs`, {
    method: 'GET',
    params: {
      year: '2030',
      
      // ...data,
      // limit: data.limit,
      // page: data.page,
      // orderBy: 'created_at',
      // sortedBy: 'desc',
      // searchJoin: 'and',
    },
  });
}

export function getTime(data) {
  return request(`/extended-class-configs`, {
    method: 'GET',
    params: {
      year: 2030,
      
      // ...data,
      // limit: data.limit,
      // page: data.page,
      // orderBy: 'created_at',
      // sortedBy: 'desc',
      // searchJoin: 'and',
    },
  });
}

export function addTime(data = {}) {
  return request('/eextended-class-configs', {
    method: 'POST',
    data,
  });
}