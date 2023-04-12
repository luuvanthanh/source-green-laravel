import request from '@/utils/requestLavarel';
import {  Helper } from '@/utils';


export function add(data = {}) {
  return request('/v1/recruitment-manager', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/recruitment-manager/${data.id}`, {
    method: 'PUT',
    data: {
      ...data,
    },
  });
}

export function getData(params = {}) {
  return request(`/v1/recruitment-manager/${params.id}`, {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes(['recruitmentConfiguration,level,division,candidate']),
    },
  });
}

export function getRecruiment(params = {}) {
  return request(`/v1/get-link-recruitment`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function addDataUser(data = {}) {
  return request('/v1/create-candidate', {
    method: 'POST',
    data,
  });
}

export function getDataUser(params = {}) {
  return request(`/v1/recruitment-candidate/${ params?.id}`, {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes(['level,division,recruitmentManagement',
      'questionCandidate.recruitmentQuestion']),
    },
  });
}

export function addUserStatus(data = {}) {
  return request(`/v1/recruitment-candidate/${data?.id}`, {
    method: 'PUT',
    data,
  });
}