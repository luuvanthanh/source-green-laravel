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
  },
};

export default variables;
