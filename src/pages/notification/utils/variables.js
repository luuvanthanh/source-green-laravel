export const variables = {
  STATUS: {
    NO_VERIFYE: 'NO_VERIFYE',
    VERIFIED: 'VERIFIED',
    PENDING: 'PENDING',
    VALID: 'VALID',
    EXPIRE: 'EXPIRE',
    PROCESSED: 'PROCESSED',
  },
  STATUS_NAME: {
    NO_VERIFYE: 'Chưa xác nhận',
    VERIFIED: 'Đang hoạt động',
    PENDING: 'Đang chờ',
    VALID: 'Lỗi',
    EXPIRE: 'Nghỉ học',
    PROCESSED: 'Đã xử lý',
  },
  TYPES: [
    { value: 'EMPLOYEE', label: 'Nhân viên' },
    { value: 'PARENT', label: 'Phụ huynh' },
  ],
  TYPE: {
    EMPLOYEE: 'EMPLOYEE',
    PARENT: 'PARENT',
    BRANCH: 'BRANCH',
  },
  ACTION_TYPE: {
    POST: 'gửi thông báo',
    PUT: 'sửa thông báo',
  },
  STATUS_NAME_SEND: {
    SEND: 'Đã gửi',
    NOT_SEND: 'Chưa gửi',
  },
  STATUS_TABS: [
    {
      id: 'ALL',
      name: 'Tất cả',
    },
    {
      id: 'SAVE_DRAFT',
      name: 'Lưu nháp',
    },
    {
      id: 'PENDING',
      name: 'Chờ duyệt',
    },
  ],
};

export default variables;
