export const variables = {
  // Layout Form
  LAYOUT_FORM_VERTICAL: 'vertical',
  LAYOUT_FORM_HORIZONTAL: 'horizontal',
  // TYPE FORM
  INPUT: 'input',
  INPUT_PASSWORD: 'inputPassword',
  PRICE: 'price',
  PERCENT: 'percent',
  INPUT_SEARCH: 'inputSearch',
  SELECT: 'select',
  SELECT_ADD: 'selectAdd',
  SELECT_MUTILPLE: 'selectMutilple',
  SELECT_TAGS: 'tags',
  CASCADER: 'cascader',
  TEXTAREA: 'textArea',
  RANGE_PICKER: 'rangePicker',
  RANGE_DATETIME_PICKER: 'rangeDateTimePicker',
  TIME_RANGE: 'timeRange',
  TIME_PICKER: 'timePicker',
  TREE_SELECT: 'treeSelect',
  TREE_SELECT_ADD: 'treeSelectAdd',
  TREE_SELECT_SINGLE: 'treeSelectSingle',
  DATE_PICKER: 'datePicker',
  MONTH_PICKER: 'monthPicker',
  MONTH_YEAR_PICKER: 'monthYearPicker',
  YEAR_PICKER: 'yearPicker',
  DATE_TIME_PICKER: 'dateTimePicker',
  CHECKBOX: 'checkbox',
  CHECKBOX_SINGLE: 'checkboxSingle',
  CHECKBOX_FORM: 'checkboxform',
  RADIO: 'radio',
  INPUT_NUMBER: 'inputNumber',
  INPUT_NOTE: 'inputNote',
  INPUT_COUNT: 'inputCount',
  INPUT_COUNT_FORM: 'inputCountForm',
  INPUT_DATE: 'inputDate',
  SWITCH: 'switch',
  AUTO_COMPLETE: 'AutoComplete',
  DATE_REGISTERS_BIRTHDAY: 'registersBirthDay',
  DATE_REGISTERS_DAY: 'registersDay',
  NUMBER_INPUT: 'numberInput',
  RANGE_PICKER_MONTH: 'rangePickerMonth',
  GET: 'get',
  // RULES
  RULES: {
    EMPTY: { required: true, message: 'Vui lòng không được để trống trường này' },
    EMPTY_ENGLISH: { required: true, message: 'Please do not leave this field blank' },
    EMPTY_INPUT: {
      required: true,
      message: 'Vui lòng không được để trống trường này',
      whitespace: true,
    },
    EMPTY_INPUT_ENGLISH: {
      required: true,
      message: 'Please do not leave this field blank',
      whitespace: true,
    },
    MAX_LENGTH_INPUT_CODE: { max: 30, message: 'Trường này không quá 30 kí tự' },
    MAX_LENGTH_INPUT: { max: 500, message: 'Trường này không quá 500 kí tự' },
    MAX_LENGTH_TEXTAREA: { max: 1000, message: 'Trường này không quá 1000 kí tự' },
    MAX_LENGTH_INPUT_MONTH: {
      type: 'number',
      min: 0,
      max: 12,
      message: 'Trường này tối đa 12',
    },
    MIN_LENGTH_INPUT: { type: 'number', min: 1, message: 'Trường này tối thiểu 1' },
    MAX_LENGTH_INPUT_DATE: {
      type: 'number',
      min: 0,
      max: 365,
      message: 'Số ngày không được quá 12 tháng',
    },
    // TODO: Rename
    MAX_LENGTH_255: { max: 255, message: 'Trường này không quá 255 kí tự' },
    MAX_NUMBER: { max: 15, message: 'Trường này không quá 15 kí tự' },
    MIN_NUMBER_PHONE: { min: 10, message: 'Trường này ít nhất 10 ký tự' },
    NUMBER: { pattern: /^\d+$/, message: 'Trường này là chỉ là số' },
    NUMBER_ENGLISH: { pattern: /^\d+$/, message: 'This field is just integer' },
    EMAIL: { type: 'email', message: 'Trường này là email' },
    PHONE: {
      pattern: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/,
      message: 'Trường này là số điện thoại',
    },
    ONLY_TEXT_NUMBER: {
      pattern: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/,
      message: 'Trường này là số',
    },
    MAX_ONLY_TEXT_NUMBER: { max: 3, message: 'Trường này không quá 3 kí tự' },
    MIN_ONLY_TEXT_NUMBER: { min: 3, message: 'Trường này ít nhất 3 kí tự' },
    YEAR_FROM: 'Từ Năm không được lớn hơn Đến Năm',
    YEAR_TO: 'Đến Năm không được nhỏ hơn Từ Năm',
    INVALID_DATE: 'Ngày không hợp lệ',
    ERR_STUDY_PLANE: 'Data has changed, do you want to delete the data?',
    TEXT_WARNING_CATEGORY: 'Bạn có chắc chắn muốn xóa danh mục này không?',
    NUMBER_INTEGER: { pattern: /^\d+$/, message: 'Trường này là số nguyên' },
  },
  // PAGINATION
  PAGINATION: {
    PAGE: 1,
    PAGE_SIZE_SMALL: 5,
    PAGE_SIZE: 10,
    SIZEMAX: 1000,
    PAGE_SIZE_OPTIONS: ['10', '20', '50', '100'],
    SHOW_SIZE_CHANGER: true,
    PER_PAGE_TEXT: '/ trang',
    PER_PAGE_TEXT_ENGLISH: '/ Page',
  },
  // DATE FORMAT
  DATE_FORMAT: {
    DATE: 'DD/MM/YYYY',
    DATE_TIME: 'DD/MM/YYYY, HH:mm',
    FULL_DATE_TIME: 'DD/MM/YYYY HH:mm',
    TIME_DATE: 'HH:mm, DD/MM/YYYY',
    TIME_DATE_MONTH: 'HH:mm, DD/MM',
    YEAR: 'YYYY',
    MONTH: 'MM',
    DATE_AFTER: 'YYYY-MM-DD',
    HOUR: 'HH:mm',
    TIME_FULL: 'HH:mm:ss',
    DAY_NAME: 'ddd',
    WEEKLY: 'weekly',
    // TODO: rename
    DATE_VI: 'DD/MM/YYYY',
    TIME_DATE_VI: 'HH:mm, DD/MM/YYYY',
    DATE_TIME_UTC: 'YYYY-MM-DD[T]HH:mm:ss',
    DATE_MONTH: 'DD/MM',
    SHOW_FULL_DATE: 'dddd - DD/MM/YYYY',
    MONTH_FULL: '[Tháng] MM/YYYY',
    MONTH_FULL_ENGLISH: 'MM/YYYY',
    MONTH_NAME: '[Tháng] MM',
    MONTH_YEAR: 'MM/YYYY',
    YEAR_MONTH_DAY: 'YYYY/MM/DD',
    ONLY_DATE: 'D',
    ONLY_MINUTES: 'mm',
    WEEK: 'W',
    YEAR_MONTH: 'YYYY-MM',
    DATE_TIME_UTC_ONE: 'YYYY-MM-DD[T]HH:mm:ss[Z]',
  },
  PARENT_ID: '00000000-0000-0000-0000-000000000000',
  SYMBOL: 'xem thêm',
  setDateData: {
    format: { targetValue: 'HH:mm:ss' },
    attributes: ['hour', 'minute', 'second'],
  },
  STATUS_204: 204,
  STATUS_400: 400,
  STATUS_403: 403,
  STATUS_404: 404,
  STATUS_500: 500,
  QUERY_STRING: 'queryString',
  EMPTY_DATA_TEXT: 'Chưa có dữ liệu',
  ROLES: {
    PARENT: 'PARENT',
    TEACHER: 'TEACHER',
    HRM: 'HRM',
    ADMIN: 'ADMIN',
    ALL: 'ALL',
    PRINCIPAL: 'PRINCIPAL',
  },
  ROLES_NAME: {
    PARENT: 'Phụ huynh',
    TEACHER: 'Giáo viên',
    HRM: 'Hrm',
    ADMIN: 'Admin',
    ALL: 'All',
    PRINCIPAL: 'Hiệu trưởng',
  },
  ROLES_PERMISSIONS: ['ADMIN', 'TEACHER', 'PARENT', 'HRM', 'PRINCIPAL'],
  CHOOSE: [
    {
      id: 'DATE',
      name: 'Ngày',
    },
    {
      id: 'MONTH',
      name: 'Tháng',
    },
  ],
  DAY_OF_WEEKS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  DAY_OF_WEEKS_TEXT: {
    Monday: 'Thứ 2',
    Tuesday: 'Thứ 3',
    Wednesday: 'Thứ 4',
    Thursday: 'Thứ 5',
    Friday: 'Thứ 6',
  },
  STATUS: {
    NO_VERIFYE: 'NO_VERIFYE',
    VERIFIED: 'VERIFIED',
    PENDING: 'PENDING',
    VALID: 'VALID',
    EXPIRE: 'EXPIRE',
    CONFIRMING: 'CONFIRMING',
    CONFIRMED: 'CONFIRMED',
    PROCESSED: 'PROCESSED',
  },
  STATUS_NAME: {
    NO_VERIFYE: 'Chưa xác nhận',
    VERIFIED: 'Đang hoạt động',
    PENDING: 'Làm thủ tục',
    VALID: 'Lỗi',
    EXPIRE: 'Nghỉ học',
    CONFIRMING: 'Chờ xác nhận',
  },
  STATUS_ABSENT: {
    ANNUAL_LEAVE: 'ANNUAL_LEAVE',
    UNPAID_LEAVE: 'UNPAID_LEAVE',
    HAVE_IN: 'HAVE_IN',
    HAVE_OUT: 'HAVE_OUT',
  },
  STATUS_ABSENT_NAME: {
    ANNUAL_LEAVE: 'Vắng có phép',
    UNPAID_LEAVE: 'Vắng không phép',
    HAVE_IN: 'Đã vào lớp',
    HAVE_OUT: 'Ra về',
  },
  NO_DATA: 'Không có dữ liệu',
  // eslint-disable-next-line security/detect-unsafe-regex
  REGEX_NUMBER: /\B(?=(\d{3})+(?!\d))/g,
  method: ['put', 'post', 'delete', 'patch'],
  SEMESTER_1: 'HOCKY1',
  SEMESTER_2: 'HOCKY2',
  GENDERS: {
    MALE: 'Nam',
    FEMALE: 'Nữ',
    OTHER: 'Khác',
  },
  STATUS_CONTRACT: [
    { id: 'DANG_HIEU_LUC', name: 'Đang hiệu lực' },
    { id: 'GAN_HET_HAN', name: 'Gần hết hạn' },
    { id: 'DA_HET_HAN', name: 'Đã hết hạn' },
    { id: 'CHUA_DEN_HAN', name: 'Chưa đến hạn' },
  ],
  DOCUMENT_TYPE: [
    { id: 'CONG_VAN_DEN', name: 'Công văn đến' },
    { id: 'CONG_VAN_DI', name: 'Công văn đi' },
    { id: 'CONG_VAN_NOI_BO', name: 'Công văn nội bộ' },
    { id: 'TAI_LIEU', name: 'Tài liệu' },
  ],
  DOCUMENT_TOPIC: [
    { id: 'THONG_BAO', name: 'Thông báo' },
    { id: 'QUYET_DINH', name: 'Quyết định' },
    { id: 'QUY_DINH', name: 'Quy định' },
    { id: 'TO_TRINH', name: 'Tờ trình' },
  ],
  TOPIC_TYPE: [
    { id: 'THONG_BAO', name: 'Thông báo' },
    { id: 'QUYET_DINH', name: 'Quyết định' },
    { id: 'QUY_DINH', name: 'Quy định' },
    { id: 'TO_TRINH', name: 'Tờ trình' },
  ],
  STATUS_EXTENDED: {
    NOT_DISTRIBUTION: 'NOT_DISTRIBUTION',
    CONFIRMED: 'CONFIRMED',
    WAITING: 'WAITING',
  },
  STATUS_EXTENDED_NAME: {
    NOT_DISTRIBUTION: 'Chưa phân bổ',
    CONFIRMED: 'Đã xác nhận',
    WAITING: 'Chưa xác nhận',
  },
  COLORS: [
    '#FF8D8D',
    '#FFA5AC',
    '#FFC0A5',
    '#FFCC97',
    '#FFEE97',
    '#DEFF97',
    '#ACFF97',
    '#97FFBA',
    '#7FEBE5',
    '#8DC8FF',
    '#96ADFF',
    '#A59DFF',
    '#D49DFF',
    '#FD9DFF',
    '#FF9DDE',
    '#FFFF00',
    '#7030A0',
    '#E9BDE0',
    '#00B0F0',
    '#FFD966',
    '#C6E0B4',
  ],
  CHART: {
    grid: {
      focus: { show: false },
      y: { show: true },
    },
  },
  CALL_TIME: [
    {
      id: 'FIRST',
      name: 'Lần 1',
    },
    {
      id: 'SECOND',
      name: 'Lần 2',
    },
    {
      id: 'THIRD',
      name: 'Lần 3',
    },
    {
      id: 'FOURTH',
      name: 'Lần 4',
    },
    {
      id: 'FIVETH',
      name: 'Lần 5',
    },
  ],
  STATUS_CALL: {
    CANCELED: 'Đã huỷ',
    REJECTED: 'Từ chối',
    HANGUP: 'Đã kết thúc',
  },
  DIRECTION: {
    INBOUND: 'Cuộc gọi đến',
    OUTBOUND: 'Cuộc gọi đi',
  },
  DIRECTION_ENG: {
    INBOUND: 'INBOUND',
    OUTBOUND: 'OUTBOUND',
  },
  DIRECTION_TYPE: [
    { id: 'INBOUND', name: 'Cuộc gọi đến' },
    { id: 'OUTBOUND', name: 'Cuộc gọi đi' },
  ],
  CAUSE_ENG: {
    NORMAL_CLEARING: 'NORMAL_CLEARING',
    NORMAL_TEMPORARY_FAILURE: 'NORMAL_TEMPORARY_FAILURE',
    CALL_REJECTED: 'CALL_REJECTED',
    NO_ANSWER: 'NO_ANSWER',
    ORIGINATOR_CANCEL: 'ORIGINATOR_CANCEL',
  },
  CALL_TYPE: [
    { id: 'CANCELED', name: 'Đã huỷ' },
    { id: 'REJECTED', name: 'Từ chối' },
    { id: 'HANGUP', name: 'Đã kết thúc' },
  ],
  LEAD_STATUS: {
    LEAD_NEW: 'Lead mới',
    POTENTIAL: 'Có tiềm năng',
    NOT_POTENTIAL: 'Không tiềm năng',
  },
  CALL_STATUS: {
    CALLYET: 'Chưa gọi',
    CALLED: 'Đã gọi',
  },
  CALL_TIMES: {
    YET_CREATE: '',
    FIRST: 'Lần 1',
    SECOND: 'Lần 2',
    THIRD: 'Lần 3',
    FOURTH: 'Lần 4',
    FIVETH: 'Lần 5',
  },
  LIST_ROLE_CODE: {
    STAFF: 'staff',
    PARENT: 'parent',
    TEACHER: 'teacher',
    NURSEMAID: 'nursemaid',
    PRINCIPAL: 'principal',
    ADMIN: 'admin',
    SALE: 'sale',
    HR: 'hr',
    COOK: 'cook',
    HELTHCARE: 'healthcare',
    CUSTOMERLEAD: 'customerlead',
    CEO: 'ceo',
  },
  LANGUAGE: {
    VIETNAM: 'VIETNAM',
    ENGLISH: 'ENGLISH',
  },
  TYPE: {
    TEXT: 'text',
    DAY: 'day',
    SELECT: 'select',
    SELECT_TAGS:'selectTags',
    IMG: 'img',
    NO_LABLE: 'noLable',
    TEXTAREA: 'TextArea',
    LABEL: 'label',
    LINK: 'link',
    TEXT_REQUIRED: 'text_required',
    LABEL_REQUIRED: 'label_required',
  },
};

export default variables;
