import request from '@/utils/requestLavarel';
import { omit, pickBy } from 'lodash';
const removeParams = (params) => {
  return omit(pickBy(params, (value) => value !== null && value !== undefined));
};

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
