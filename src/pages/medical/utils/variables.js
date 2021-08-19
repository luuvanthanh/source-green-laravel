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
      value: 'BEFORE_SECOND_BREAKFAST',
      label: 'Trước xế sáng',
    },
    {
      value: 'AFTER_SECOND_BREAKFAST',
      label: 'Sau xế sáng',
    },
    {
      value: 'BEFORE_LUNCH',
      label: 'Trước ăn trưa',
    },
    {
      value: 'AFTER_LUNCH',
      label: 'Sau ăn trưa',
    },
    {
      value: 'BEFORE_SECOND_LUNCH',
      label: 'Trước xế trưa',
    },
    {
      value: 'AFTER_SECOND_LUNCH',
      label: 'Sau xế trưa',
    },
    {
      value: 'BEFORE_TEA_TIME',
      label: 'Trước xế chiều',
    },
    {
      value: 'AFTER_TEA_TIME',
      label: 'Sau xế chiều',
    },
  ],
  STATUS_TIME_CODE_NAME: {
    BEFORE_BREAKFAST: 'Trước ăn sáng',
    AFTER_BREAKFAST: 'Sau ăn sáng',
    BEFORE_LUNCH: 'Trước ăn trưa',
    AFTER_LUNCH: 'Sau ăn trưa',
    BEFORE_SECOND_BREAKFAST: 'Trước xế sáng',
    AFTER_SECOND_BREAKFAST: 'Sau xế sáng',
    BEFORE_SECOND_LUNCH: 'Trước xế trưa',
    AFTER_SECOND_LUNCH: 'Sau xế trưa',
    BEFORE_TEA_TIME: 'Trước xế chiều',
    AFTER_TEA_TIME: 'Sau xế chiều',
  },
  STATUS_TIME_CODE_KEY: {
    BEFORE_BREAKFAST: 'BEFORE_BREAKFAST',
    AFTER_BREAKFAST: 'AFTER_BREAKFAST',
    BEFORE_LUNCH: 'BEFORE_LUNCH',
    AFTER_LUNCH: 'AFTER_LUNCH',
    BEFORE_SECOND_BREAKFAST: 'BEFORE_SECOND_BREAKFAST',
    AFTER_SECOND_BREAKFAST: 'AFTER_SECOND_BREAKFAST',
    BEFORE_SECOND_LUNCH: 'BEFORE_SECOND_LUNCH',
    AFTER_SECOND_LUNCH: 'AFTER_SECOND_LUNCH',
    BEFORE_TEA_TIME: 'BEFORE_TEA_TIME',
    AFTER_TEA_TIME: 'AFTER_TEA_TIME',
  },
  TREE_MEDICAL: [
    {
      value: 'BREAKFAST',
      label: 'Sáng',
      color: 'yellow',
      children: [
        {
          value: 'BEFORE_BREAKFAST',
          label: 'Trước ăn sáng',
        },
        {
          value: 'AFTER_BREAKFAST',
          label: 'Sau ăn sáng',
        },
        {
          value: 'BEFORE_SECOND_BREAKFAST',
          label: 'Trước xế sáng',
        },
        {
          value: 'AFTER_SECOND_BREAKFAST',
          label: 'Sau xế sáng',
        },
      ],
    },
    {
      value: 'LUNCH',
      label: 'Trưa',
      color: 'gold',
      children: [
        {
          value: 'BEFORE_LUNCH',
          label: 'Trước ăn trưa',
        },
        {
          value: 'AFTER_LUNCH',
          label: 'Sau ăn trưa',
        },
        {
          value: 'BEFORE_SECOND_LUNCH',
          label: 'Trước xế trưa',
        },
        {
          value: 'AFTER_SECOND_LUNCH',
          label: 'Sau xế trưa',
        },
      ],
    },
    {
      value: 'TEA_TIME',
      label: 'Chiều',
      color: 'primary',
      children: [
        {
          value: 'BEFORE_TEA_TIME',
          label: 'Trước xế chiều',
        },
        {
          value: 'AFTER_TEA_TIME',
          label: 'Sau xế chiều',
        },
      ],
    },
  ],
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
      id: 'CREATE',
      name: 'Tạo mới dặn thuốc',
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
};

export default variables;
