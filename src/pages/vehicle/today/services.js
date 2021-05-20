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
    },
  });
}

export function get(params = {}) {
  return request(
    `/bus-place-log/bus-route/${params.id}/${moment(params.date).format(
      variables.DATE_FORMAT.DATE_AFTER,
    )}/group-bus-place`,
    {
      method: 'GET',
      params: {
        ...omit(params, 'page', 'limit', 'date', 'id'),
        ...Helper.getPagination(params.page, params.limit),
      },
    },
  );
}
export function getTimeLine(params = {}) {
  return request(
    `/bus-places/bus-route/${params.id}/${moment(params.date).format(
      variables.DATE_FORMAT.DATE_AFTER,
    )}/time-line`,
    {
      method: 'GET',
      params: {
        ...omit(params, 'page', 'limit', 'date', 'id'),
        ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
      },
    },
  );
}

export function getTrackings(params = {}) {
  return request(`/bus-trackings`, {
    method: 'GET',
    params: {
      ...params,
      startDate: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: params.startDate,
          targetValue: '00:00:00',
        }),
        isUTC: true,
      }),
      endDate: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: params.endDate,
          targetValue: '23:59:59',
        }),
        isUTC: true,
      }),
    },
  });
}
