export const variables = {
  STATUS: {
    NO_VERIFYE: 'NO_VERIFYE',
    VERIFIED: 'VERIFIED',
    PENDING: 'PENDING',
    VALID: 'VALID',
    EXPIRE: 'EXPIRE',
    NO_IMAGE: 'NO_IMAGE',
    HANDLING_IMAGE_FAILED: 'HANDLING_IMAGE_FAILED',
  },
  STATUS_NAME: {
    NO_VERIFYE: 'Chưa xác nhận',
    VERIFIED: 'Đang hoạt động',
    PENDING: 'Làm thủ tục',
    VALID: 'Lỗi',
    EXPIRE: 'Nghỉ học',
    NO_IMAGE: 'Chưa đăng ký',
    HANDLING_IMAGE_FAILED: 'Chưa đăng ký',
  },
  STATUS_SHIFT: {
    ON: 'ON',
    OFF: 'OFF',
    ALL: 'ALL',
    TOTAL: 'TOTAL',
  },
  TYPES_PARAMATER_VALUES: [
    {
      id: 'CONTRACT',
      name: 'Tham số theo hợp đồng',
    },
    {
      id: 'COMMON',
      name: 'Tham số dùng chung',
    },
    {
      id: 'DECLARE',
      name: 'Tham số khai báo hàng tháng',
    },
  ],
  PARAMATER_VALUES: {
    CONTRACT: 'CONTRACT',
    COMMON: 'COMMON',
    DECLARE: 'DECLARE',
  },
  PARAMATER_VALUES_NAME: {
    CONTRACT: 'Tham số theo hợp đồng',
    COMMON: 'Tham số dùng chung',
    DECLARE: 'Tham số khai báo hàng tháng',
  },
  PARENT: 'PARENT',
  EMPLOYEES: 'EMPLOYEES',
  DATE_OF_WEEK: {
    0: 'su',
    1: 'mo',
    2: 'tu',
    3: 'th',
    4: 'we',
    5: 'fr',
    6: 'sa',
  },
  TYPE_EARLY_LATE: {
    LATE: 'LATE',
    EARLY: 'EARLY',
  },
  TYPE_CONSTRACT: {
    THU_VIEC: 'Thử việc',
    HOP_DONG: 'Hợp đồng',
  },
  TYPE_ABSENTS_NAME: {
    ABSENT: 'Nghỉ phép  ',
    BUSINESS_TRAVEL: 'Công tác',
    ADD_TIME: 'Làm thêm',
    GO_OUT: 'Đi ra ngoài',
    MATERNITY_LEAVE: 'Nghỉ thai sản',
  },
  TYPE_ABSENTS: {
    ABSENT: 'ABSENT',
    BUSINESS_TRAVEL: 'BUSINESS_TRAVEL',
    ADD_TIME: 'ADD_TIME',
    GO_OUT: 'GO_OUT',
    MATERNITY_LEAVE: 'MATERNITY_LEAVE',
  },
  TYPES_ABSENTS: [
    {
      id: 'ABSENT',
      name: 'Nghỉ phép',
    },
  ],
  TYPES_DIFFIRENT_ABSENTS: [
    {
      id: 'BUSINESS_TRAVEL',
      name: 'Công tác',
    },
    {
      id: 'ADD_TIME',
      name: 'Làm thêm',
    },
    {
      id: 'GO_OUT',
      name: 'Đi ra ngoài',
    },
    {
      id: 'MATERNITY_LEAVE',
      name: 'Nghỉ thai sản',
    },
  ],
  SHIFT_CODES: [
    {
      id: 'Ca sáng',
      name: 'Ca sáng',
    },
    {
      id: 'Ca chiều',
      name: 'Ca chiều',
    },
  ],
};

export default variables;
