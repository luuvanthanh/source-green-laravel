import request from '@/utils/request';

export function add(data = {}) {
  return request('/settings/set-multiple', {
    method: 'PUT',
    data :[
      ...data
    ],
    parse: true,
  });
}

export function details() {
  return request(`/settings/get-multiple`, {
    method: 'GET',
    params: {
      keys: ['config_food_in_kitchen','material_group'], 
    },
  });
}

export function getFoodGroups() {
  return request(`/food-commons/groups`, {
    method: 'GET',
  });
}