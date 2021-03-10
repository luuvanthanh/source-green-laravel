import React from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Input,
  Cascader,
  DatePicker,
  TreeSelect,
  Checkbox,
  Radio,
  InputNumber,
  Switch,
} from 'antd';
import Select from '@/components/CommonComponent/Select';
import styles from '@/assets/styles/Common/common.scss';
import classnames from 'classnames';
import { SearchOutlined } from '@ant-design/icons';
import { variables, Helper } from '@/utils';

const filter = (inputValue, path) =>
  path.some((option) => Helper.slugify(option?.name).indexOf(Helper.slugify(inputValue)) > -1);

const renderChildren = (
  placeholder = '',
  data = [],
  handleScroll,
  onChange,
  disabled,
  disabledDate,
  fieldNames,
  maxTagCount,
  onSearch,
  onBlur,
  dropdownRender,
) => ({
  input: <Input disabled={disabled} onChange={onChange} placeholder={placeholder || 'Nhập'} />,
  inputPassword: <Input.Password onChange={onChange} placeholder={placeholder || 'Nhập'} />,
  inputSearch: (
    <Input onChange={onChange} placeholder={placeholder || 'Nhập'} prefix={<SearchOutlined />} />
  ),
  inputNumber: (
    <InputNumber
      className={classnames('input-number', styles['input-number-container'])}
      disabled={disabled}
      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      placeholder="Nhập"
    />
  ),
  inputCount: (
    <InputNumber
      className={classnames(
        'input-number',
        styles['input-number-container'],
        styles['input-number-count'],
      )}
      disabled={disabled}
      onChange={onChange}
      placeholder="Nhập"
    />
  ),
  inputDate: (
    <InputNumber
      className={classnames(
        'input-number',
        styles['input-number-container'],
        styles['input-number-date'],
      )}
      disabled={disabled}
      onChange={onChange}
      placeholder="Nhập"
    />
  ),
  select: (
    <Select
      allowClear
      dataSet={data}
      filterOption={(input, option) =>
        Helper.slugify(option?.children).indexOf(Helper.slugify(input)) >= 0
      }
      notFoundContent={null}
      onChange={onChange}
      onPopupScroll={handleScroll}
      onSearch={onSearch}
      placeholder={placeholder || 'Chọn'}
      showSearch
    />
  ),
  selectAdd: (
    <Select
      allowClear
      dataSet={data}
      dropdownRender={dropdownRender}
      filterOption={(input, option) =>
        Helper.slugify(option?.children).indexOf(Helper.slugify(input)) >= 0
      }
      notFoundContent={null}
      onBlur={onBlur}
      onChange={onChange}
      onPopupScroll={handleScroll}
      onSearch={onSearch}
      placeholder={placeholder || 'Chọn'}
      showSearch
    />
  ),
  selectMutilple: (
    <Select
      dataSet={data}
      filterOption={(input, option) =>
        Helper.slugify(option?.children).indexOf(Helper.slugify(input)) >= 0
      }
      maxTagCount={maxTagCount}
      mode="multiple"
      onChange={onChange}
      onPopupScroll={handleScroll}
      placeholder={placeholder || 'Chọn'}
      showSearch
    />
  ),
  tags: (
    <Select
      dataSet={data}
      filterOption={(input, option) =>
        Helper.slugify(option?.children).indexOf(Helper.slugify(input)) >= 0
      }
      maxTagCount={maxTagCount}
      mode="tags"
      onChange={onChange}
      onPopupScroll={handleScroll}
      placeholder={placeholder || 'Chọn'}
      showSearch
    />
  ),
  cascader: (
    <Cascader
      fieldNames={fieldNames}
      options={data}
      placeholder={placeholder || 'Chọn'}
      showSearch={{ filter }}
    />
  ),
  textArea: (
    <Input.TextArea
      autoSize={{ minRows: 3, maxRows: 5 }}
      placeholder={placeholder || 'Nhập'}
      showCount
    />
  ),
  rangePicker: (
    <DatePicker.RangePicker
      disabled={disabled}
      format={['DD-MM-YYYY', 'DD-MM-YYYY']}
      onChange={onChange}
      placeholder={placeholder || ['dd/mm/yyyy', 'dd/mm/yyyy']}
    />
  ),
  datePicker: (
    <DatePicker
      disabled={disabled}
      disabledDate={disabledDate}
      format={variables.DATE_FORMAT.DATE}
      onChange={onChange}
      placeholder="dd/mm/yyyy"
    />
  ),
  dateTimePicker: (
    <DatePicker
      disabled={disabled}
      disabledDate={disabledDate}
      format={variables.DATE_FORMAT.DATE_TIME}
      onBlur={onBlur}
      placeholder="dd/mm/yyyy"
      showTime={{ format: 'HH:mm' }}
    />
  ),
  treeSelect: (
    <TreeSelect
      className={styles.treeSelect}
      onChange={onChange}
      placeholder={placeholder || 'Chọn'}
      showCheckedStrategy={TreeSelect.SHOW_CHILD}
      showSearch
      treeCheckable
      treeData={data}
    />
  ),
  treeSelectAdd: (
    <TreeSelect
      className={styles.treeSelect}
      dropdownRender={dropdownRender}
      onChange={onChange}
      placeholder={placeholder || 'Chọn'}
      showCheckedStrategy={TreeSelect.SHOW_CHILD}
      showSearch
      treeCheckable
      treeData={data}
    />
  ),
  treeSelectSingle: (
    <TreeSelect
      className={styles.treeSelect}
      onChange={onChange}
      placeholder={placeholder || 'Chọn'}
      showCheckedStrategy={TreeSelect.SHOW_PARENT}
      treeCheckable={false}
      treeData={data}
      treeDefaultExpandAll
    />
  ),
  checkbox: (
    <Checkbox.Group>
      {data.map((item, index) => (
        <Checkbox key={index} value={item.value}>
          {item.label}
        </Checkbox>
      ))}
    </Checkbox.Group>
  ),
  radio: (
    <Radio.Group>
      {data.map((item, index) => (
        <Radio key={index} value={item.value}>
          {item.label}
        </Radio>
      ))}
    </Radio.Group>
  ),
  switch: <Switch />,
});
export default function FormItem({
  type,
  label,
  rules,
  placeholder,
  data,
  handleScroll,
  onChange,
  disabled,
  disabledDate,
  fieldNames,
  maxTagCount,
  onSearch,
  onBlur,
  dropdownRender,
  ...rest
}) {
  return (
    <Form.Item {...rest} label={<span>{label}</span>} rules={rules}>
      {
        renderChildren(
          placeholder,
          data,
          handleScroll,
          onChange,
          disabled,
          disabledDate,
          fieldNames,
          maxTagCount,
          onSearch,
          onBlur,
          dropdownRender,
        )[type]
      }
    </Form.Item>
  );
}

FormItem.propTypes = {
  children: PropTypes.any,
  type: PropTypes.any,
  label: PropTypes.string,
  rules: PropTypes.arrayOf(PropTypes.any),
  placeholder: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.any),
  handleScroll: PropTypes.func,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  disabledDate: PropTypes.func,
  fieldNames: PropTypes.objectOf(PropTypes.any),
  maxTagCount: PropTypes.number,
  onSearch: PropTypes.func,
  onBlur: PropTypes.func,
  dropdownRender: PropTypes.any,
};

FormItem.defaultProps = {
  children: '',
  type: 'input',
  label: '',
  rules: [],
  placeholder: '',
  data: [],
  handleScroll: () => {},
  onChange: () => {},
  onSearch: () => {},
  onBlur: () => {},
  disabled: false,
  disabledDate: () => {
    return false;
  },
  fieldNames: { label: 'name', value: 'id', children: 'children' },
  maxTagCount: 20,
  dropdownRender: null,
};

FormItem.displayName = 'Form';
