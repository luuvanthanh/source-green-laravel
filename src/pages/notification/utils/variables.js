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
    { value: 'STUDENT', label: 'Học sinh' },
  ],
  TYPE: {
    EMPLOYEE: 'EMPLOYEE',
    PARENT: 'PARENT',
    BRANCH: 'BRANCH',
    STUDENT: 'STUDENT',
  },
  ACTION_TYPE: {
    POST: 'gửi thông báo',
    PUT: 'sửa thông báo',
  },
  STATUS_NAME_SEND: {
    Draft: 'Lưu nháp',
    Approving: 'Chờ duyệt',
    Approved: 'Đã duyệt',
  },
  STATUS_NAME_STATUS: {
    Draft: 'Draft',
    Approving: 'Approving',
    Approved: 'Approved',
  },
  STATUS_TABS: [
    {
      id: undefined,
      name: 'Tất cả',
    },
    {
      id: 'Draft',
      name: 'Lưu nháp',
    },
    {
      id: 'Approving',
      name: 'Chờ duyệt',
    },
    {
      id: 'Approved',
      name: 'Đã duyệt',
    },
  ],
  STATUS_ACTIONS_BTN: {
    VIEW: 'VIEW',
    SAVE: 'SAVE',
    SEND: 'SEND',
    APPROVE: 'APPROVE',
  },
};

export default variables;
