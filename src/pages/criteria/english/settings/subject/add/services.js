import request from '@/utils/requestLavarel';
import { Helper } from '@/utils';

export function add(data = {}) {
  return request('/v1/subjects', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/subjects/${data.id}`, {
    method: 'PUT',
    data: {
      ...data,
    },
    parse: true,
  });
}

export function getData(params = {}) {
  return request(`/v1/subjects/${params.id}`, {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes(['subjectSection.subjectSectionDetail']),
    },
  });
}

export function remove(id = {}) {
  return request(`/v1/subjects/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

export function getSkill() {
  return request(`/v1/category-skills`, {
    method: 'GET',
    params: {
      orderBy: 'Name',
    },
  });
}
