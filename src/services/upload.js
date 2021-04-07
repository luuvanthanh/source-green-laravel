import request from '@/utils/request';

export const upload = (file) => {
  const formData = new FormData();
  formData.append('files', file);

  return request(`/api/files`, {
    prefix: API_UPLOAD,
    method: 'POST',
    data: formData,
    parse: true,
  });
};
