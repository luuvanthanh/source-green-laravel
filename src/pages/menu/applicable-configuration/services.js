import request from '@/utils/request';

export function add(data = {}) {
  return request('/food-commons/config-food', {
    method: 'PUT',
    params :{
      ...data
    },
    parse: true,
  });
}

export function details() {
  return request(`/food-commons/groups-for-food`, {
    method: 'GET',
  });
}

export function getFoodGroups() {
  return request(`/food-commons/groups`, {
    method: 'GET',
  });
}