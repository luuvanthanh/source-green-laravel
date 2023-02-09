import { Helper } from '@/utils';
import request from '@/utils/requestLavarel';

export function get(params = {}) {
  return request('/v1/sample-comments', {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      searchJoin: 'and',
      include: Helper.convertIncludes(['sampleCommentDetail']),
    },
  });
}

export function remove(id = {}) {
  return request(`/v1/sample-comments/${id}`, {
    method: 'DELETE',
    parse: true,
    data: {
      id,
    },
    cancelNotification: true,
  });
}
