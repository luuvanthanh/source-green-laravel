import request from '@/utils/request';

export function getMeasureUnits(params = {}) {
  return request(`/food-commons/measure-units`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function getFoodCommonsGroups(params = {}) {
  return request(`/food-commons/groups`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function get(params = {}) {
  return request(`/food-commons/${params.id}/with-detail`, {
    method: 'GET',
  });
}

export function addMeasureUnit(data = {}) {
  return request(`/food-commons/measure-units`, {
    method: 'POST',
    data,
  });
}

export function add(data = {}) {
  return request('/food-commons', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/food-commons/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function remove(id) {
  return request(`/food-commons/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

export function getFoodCommonsMaterials() {
  return request(`/food-commons/material-item-with-item-group-id-and-type`, {
    method: 'GET',
  });
}