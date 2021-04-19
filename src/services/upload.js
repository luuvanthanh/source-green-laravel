import request from '@/utils/request';
import { isArray } from 'lodash';

export const upload = (files) => {
  const formData = new FormData();

  if (isArray(files)) {
    for (const file of files) {
      formData.append('files', file);
    }
  } else {
    formData.append('files', files);
  }

  return request(`/api/files`, {
    prefix: API_UPLOAD,
    method: 'POST',
    data: formData,
    parse: true,
  });
};
