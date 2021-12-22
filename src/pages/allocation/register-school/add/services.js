import request from '@/utils/request';
import { Helper } from '@/utils';

export function add(data = {}) {
  return request('/medical-problems', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/medical-problems`, {
    method: 'PUT',
    params: {
   
      id: data.id,
    },
    data,
    parse: true,
  });
}

export function details(data = {}) {
  return request(`/medical-problems/${data.id}`, {
    method: 'GET',
    params: {
      ...data,
      orderBy: 'created_at',
      sortedBy: 'desc',
      searchJoin: 'and',
      include: Helper.convertIncludes([
        'Symptoms',
        'symptoms'
      ]),
    },
  });
}

export function remove(id = {}) {
  return request(`/medical-problems/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}
