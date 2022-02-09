import request from '@/utils/request';

export function get(params = {}) {
  return request('/student-criterias/statistic-by-properties', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function getStudents() {
  return request('/students', {
    method: 'GET',
    params : {
      MaxResultCount : 1000
    },
  });
}

export function getGroupProperty(params = {}) {
  return request('/criteria-group-properties', {
    method: 'GET',
    params,
  });
}

export default get;
