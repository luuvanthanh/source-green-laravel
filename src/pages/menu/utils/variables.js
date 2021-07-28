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
  STATUS_TIME_CODE: [
    {
      value: 'BEFORE_BREAKFAST',
      label: 'Trước ăn sáng',
    },
    {
      value: 'AFTER_BREAKFAST',
      label: 'Sau ăn sáng',
    },
    {
      value: 'BEFORE_LUNCH',
      label: 'Trước ăn trưa',
    },
    {
      value: 'AFTER_LUNCH',
      label: 'Sau ăn trưa',
    },
  ],
  STATUS_TIME_CODE_NAME: {
    BEFORE_BREAKFAST: 'Trước ăn sáng',
    AFTER_BREAKFAST: 'Sau ăn sáng',
    BEFORE_LUNCH: 'Trước ăn trưa',
    AFTER_LUNCH: 'Sau ăn trưa',
  },
  STATUS_TABS: [
    {
      id: 'PENDING',
      name: 'Đang chờ',
    },
    {
      id: 'PROCESSED',
      name: 'Đã xử lý',
    },
  ],
  STATUS_MEDICAL_RECEIVING: [
    {
      id: 'RECEIVED',
      name: 'Đã nhận thuốc',
    },
    {
      id: 'NOT_RECEIVED',
      name: 'Không nhận',
    },
  ],
  STATUS_MEDICAL_DRINKING: [
    {
      id: 'DRINK',
      name: 'Đã cho uống thuốc',
    },
    {
      id: 'NOT_DRINK',
      name: 'Không cho uống thuốc',
    },
  ],
  STATUS_SHIFT: {
    ON: 'ON',
    OFF: 'OFF',
    ALL: 'ALL',
    TOTAL: 'TOTAL',
  },
  MEDICAL_ACTION_TYPE: {
    CREATE: 'Tạo mới dặn thuốc',
    CONFIRM_RECEIVED: 'Xác nhận đã nhận thuốc',
    CONFIRM_NOT_RECEIVED: 'Xác nhận không nhận thuốc',
    CONFIRM_DRINK: 'Xác nhận đã uống thuốc',
    CONFIRM_NOT_DRINK: 'Xác nhận không uống thuốc',
    UPDATE_NOTE: 'Cập nhật ghi chú',
  },
  MEDICAL_ACTION_TYPE_STATUS: [
    {
      id: 'CREATE',
      name: 'Tạo mới dặn thuốc',
    },
    {
      id: 'CONFIRM_RECEIVED',
      name: 'Xác nhận đã nhận thuốc',
    },
    {
      id: 'CONFIRM_NOT_RECEIVED',
      name: 'Xác nhận không nhận thuốc',
    },
    {
      id: 'CONFIRM_DRINK',
      name: 'Xác nhận đã uống thuốc',
    },
    {
      id: 'CONFIRM_NOT_DRINK',
      name: 'Xác nhận không uống thuốc',
    },
    {
      id: 'UPDATE_NOTE',
      name: 'Cập nhật ghi chú',
    },
  ],
  DAY_OF_WEEK: {
    Monday: 'mo',
    Tuesday: 'tu',
    Wednesday: 'we',
    Thursday: 'th',
    Friday: 'fr',
    Saturday: 'sa',
    Sunday: 'su',
  },
  DAYS: [
    { id: 'Monday', name: 'Thứ 2' },
    { id: 'Tuesday', name: 'Thứ 3' },
    { id: 'Wednesday', name: 'Thứ 4' },
    { id: 'Thursday', name: 'Thứ 5' },
    { id: 'Friday', name: 'Thứ 6' },
  ],
  WEEKLY: 'WEEKLY',
};

export default variables;
