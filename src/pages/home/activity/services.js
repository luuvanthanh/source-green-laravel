import request from '@/utils/request';

export function getNote(params = {}) {
  return request('/notes/activities', {
    method: 'GET',
    params,
  });
}

export function getMedical(params = {}) {
  return request('/medicals/activities', {
    method: 'GET',
    params,
  });
}

export function getStudentCriterias(params = {}) {
  return request('/student-criterias/activities', {
    method: 'GET',
    params,
  });
}
