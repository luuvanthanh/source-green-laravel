import request from '@/utils/request';
import { omit } from 'lodash';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/curriculum-reviews/group-by-branch', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function getToolGroups(params = {}) {
  return request('/tool-groups', {
    method: 'GET',
    params,
  });
}

export function getToolDetails(params = {}) {
  return request('/tool-details', {
    method: 'GET',
    params,
  });
}