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
  TIME_RANGE: 'timeRange',
  TIME_PICKER: 'timePicker',
  TREE_SELECT: 'treeSelect',
  TREE_SELECT_ADD: 'treeSelectAdd',
  TREE_SELECT_SINGLE: 'treeSelectSingle',
  DATE_PICKER: 'datePicker',
  MONTH_PICKER: 'monthPicker',
  DATE_TIME_PICKER: 'dateTimePicker',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  INPUT_NUMBER: 'inputNumber',
  INPUT_NOTE: 'inputNote',
  INPUT_COUNT: 'inputCount',
  INPUT_DATE: 'inputDate',
  SWITCH: 'switch',
  AUTO_COMPLETE: 'AutoComplete',
  // RULES
  RULES: {
    EMPTY: { required: true, message: 'Vui lòng không được để trống trường này' },
    EMPTY_INPUT: {
      required: true,
      message: 'Vui lòng không được để trống trường này',
      whitespace: true,
    },
    MAX_LENGTH_INPUT_CODE: { max: 30, message: 'Trường này không quá 30 kí tự' },
    MAX_LENGTH_INPUT: { max: 500, message: 'Trường này không quá 500 kí tự' },
    MAX_LENGTH_TEXTAREA: { max: 1000, message: 'Trường này không quá 1000 kí tự' },
    // TODO: Rename
    MAX_LENGTH_255: { max: 255, message: 'Trường này không quá 255 kí tự' },
    MAX_NUMBER: { max: 15, message: 'Trường này không quá 15 kí tự' },
    NUMBER: { pattern: /^\d+$/, message: 'Trường này là chỉ là số' },
    EMAIL: { type: 'email', message: 'Trường này là email' },
    PHONE: {
      pattern: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/,
      message: 'Trường này là số điện thoại',
    },
  },
  // PAGINATION
  PAGINATION: {
    PAGE: 1,
    PAGE_SIZE: 10,
    SIZEMAX: 1000,
    PAGE_SIZE_OPTIONS: ['10', '20', '50', '100'],
    SHOW_SIZE_CHANGER: true,
    PER_PAGE_TEXT: '/ trang',
  },
  // DATE FORMAT
  DATE_FORMAT: {
    DATE: 'DD-MM-YYYY',
    DATE_TIME: 'HH:mm, DD-MM-YYYY',
    YEAR: 'YYYY',
    DATE_AFTER: 'YYYY-MM-DD',
    HOUR: 'HH:mm',
    TIME_FULL: 'HH:mm:ss',
    DAY_NAME: 'ddd',
    WEEKLY: 'weekly',
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
  setDateData: {
    format: { targetValue: 'HH:mm:ss' },
    attributes: ['hour', 'minute', 'second'],
  },
  EMPTY_DATA_TEXT: 'Chưa có dữ liệu'
};

export default variables;
