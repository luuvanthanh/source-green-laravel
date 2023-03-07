import request from '@/utils/requestCrm';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/v1/post-knowledge-to-teach-childrens', {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes(['categoryKnowledgeToTeachChildren']),
      orderBy: 'created_at',
      sortedBy: 'desc',
      searchJoin: 'and',
    },
  });
}

export function remove(id = {}) {
  return request(`/v1/post-knowledge-to-teach-childrens/${id}`, {
    method: 'DELETE',
    parse: true,
    data: {
      id,
    },
  });
}
