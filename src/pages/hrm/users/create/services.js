import request from '@/utils/requestLavarel';
import { Helper, variables } from '@/utils';

export function getDegrees(params = {}) {
  return request('/v1/degrees', {
    method: 'GET',
    params: {
      limit: variables.PAGINATION.SIZEMAX,
      page: variables.PAGINATION.PAGE,
    },
  });
}

export function getTrainingMajors(params = {}) {
  return request('/v1/training-majors', {
    method: 'GET',
    params: {
      limit: variables.PAGINATION.SIZEMAX,
      page: variables.PAGINATION.PAGE,
    },
  });
}

export function getTrainingSchools(params = {}) {
  return request('/v1/training-schools', {
    method: 'GET',
    params: {
      limit: variables.PAGINATION.SIZEMAX,
      page: variables.PAGINATION.PAGE,
    },
  });
}

export function add(data = {}) {
  return request('/v1/employees', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/employees/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function details(data = {}) {
  return request(`/v1/employees/${data.id}`, {
    method: 'GET',
  });
}

export function addAccount(data = {}) {
  return request(`/employees/${data.id}/account`, {
    method: 'POST',
    data,
  });
}

export function detailsAccount(data = {}) {
  return request(`/employees/${data.id}/account`, {
    method: 'GET',
  });
}

export function updateStatus(data = {}) {
  return request(`/employees/${data.id}/update-status?status=${data.status}`, {
    method: 'PUT',
    data,
  });
}
