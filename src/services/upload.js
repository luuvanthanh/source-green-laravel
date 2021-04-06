import request from '@/utils/request';

// Dùng tạm apit upload của DEV ERP TRẦN
const API_URL = 'https://api-dev.erptran.projects.greenglobal.vn/api'

export const upload = (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return request(`/v1/upload`, {
    prefix: API_URL,
    method: 'POST',
    data: formData,
    parse: true,
  });
}
