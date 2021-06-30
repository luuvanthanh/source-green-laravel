import request from '@/utils/request';
import moment from 'moment';
import { omit } from 'lodash';
import { Helper, variables } from '@/utils';

export function getBusRoutes(params = {}) {
  return request('/bus-routes', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
      isActive: true,
    },
  });
}

export function get(params = {}) {
  return request(
    `/bus-place-log/bus-route/${params.id}/${moment(params.date).format(
      variables.DATE_FORMAT.DATE_AFTER,
    )}`,
    {
      method: 'GET',
      params: {
        ...omit(params, 'page', 'limit', 'date', 'id'),
        ...Helper.getPagination(params.page, params.limit),
      },
    },
  );
}

export function getTrackingCurrent(params = {}) {
  return request(`/bus-trackings/${params.id}/current-location`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
