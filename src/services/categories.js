import request from '@/utils/request';
import { variables } from '@/utils';

export function getProductTypes(params = {}) {
  return request(`/api/product-types`, {
    method: 'GET',
    params: {
      ...params,
      maxResultCount: variables.PAGINATION.SIZEMAX,
    },
  });
}

export function getProductGroup(params = {}) {
  return request(`/api/product-groups`, {
    method: 'GET',
    params: {
      ...params,
      maxResultCount: variables.PAGINATION.SIZEMAX,
    },
  });
}

export function getProductAreas(params = {}) {
  return request(`/api/product-areas`, {
    method: 'GET',
    params: {
      ...params,
      maxResultCount: variables.PAGINATION.SIZEMAX,
    },
  });
}

export function getLocations(params = {}) {
  return request(`/api/locations`, {
    method: 'GET',
    params: {
      ...params,
      maxResultCount: variables.PAGINATION.SIZEMAX,
    },
  });
}

export function getProduct(params = {}) {
  return request('/api/products', {
    method: 'GET',
    params: {
      ...params,
      status: variables.PRODUCT_STATUS.OPEN,
    },
  });
}

export function getBOGroup(params = {}) {
  return request(`/api/business-object-group`, {
    method: 'GET',
    params: {
      ...params,
      type: 'SUPPLIER',
    },
  });
}

export function getBOGroupAll(params = {}) {
  return request(`/api/business-object-group`, {
    method: 'GET',
    params,
  });
}

export function getBO(params = {}) {
  return request('/api/business-object', {
    method: 'GET',
    params,
  });
}

export function getBOByGroup(params = {}) {
  return request(`/api/business-object-group/${params.id}/business-objects`, {
    method: 'GET',
    params,
  });
}

export function getServices(params = {}) {
  return request('/api/services', {
    method: 'GET',
    params: {
      ...params,
      maxResultCount: variables.PAGINATION.SIZEMAX,
    },
  });
}

export function getUtilities(params = {}) {
  return request('/api/utilities', {
    method: 'GET',
    params: {
      ...params,
      maxResultCount: variables.PAGINATION.SIZEMAX,
    },
  });
}

export function getInitContract(params = {}) {
  return request(`/api/business-object/${params.id}/init-contract`, {
    method: 'GET',
    params,
  });
}

export default getProductTypes;
