import request from '@/utils/request';
import { omit } from 'lodash';

export const getLocation = (params) =>
  request(`/${params.lng},${params.lat}.json`, {
    prefix: API_MAP_BOX,
    method: 'GET',
    params,
  });

export const searchLocation = (params) =>
  request(`/${params.address}.json`, {
    prefix: API_MAP_BOX,
    method: 'GET',
    params: { ...omit(params, 'address') },
  });
