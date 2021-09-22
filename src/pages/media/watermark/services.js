import request from '@/utils/request';
import { isArray } from 'lodash';

export function get(params = {}) {
  return request(`/api/file-settings`, {
    prefix: API_UPLOAD,
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function add(data = {}) {
  return request(`/api/file-settings`, {
    prefix: API_UPLOAD,
    method: 'POST',
    data,
  });
}

export const upload = (files) => {
  const formData = new FormData();

  if (isArray(files)) {
    files.forEach((file) => {
      formData.append('files', file);
    });
  } else {
    formData.append('files', files);
  }

  return request(`/api/files/watermark`, {
    prefix: API_UPLOAD,
    method: 'POST',
    data: formData,
    
  });
};
