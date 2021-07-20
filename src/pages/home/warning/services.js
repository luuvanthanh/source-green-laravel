import request from '@/utils/request';

export function getNote(params = {}) {
  return request('/notes/warning', {
    method: 'GET',
    params,
  });
}

export function getMedical(params = {}) {
  return request('/medicals/warning', {
    method: 'GET',
    params,
  });
}

export function getStudentCriterias(params = {}) {
  return request('/student-criterias/warning', {
    method: 'GET',
    params,
  });
}
