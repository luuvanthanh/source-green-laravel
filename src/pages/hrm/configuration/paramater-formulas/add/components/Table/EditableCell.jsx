import React, { useContext, useState, useEffect, useRef } from 'react';
import { Input, Form, Select, DatePicker, InputNumber,  } from 'antd';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { isEmpty, omit,  } from 'lodash';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import { variables, Helper } from '@/utils';
import styles from '@/assets/styles/Common/common.scss';

const EditableContext = React.createContext();

const EditableRow = ({ ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form component={false} form={form}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

EditableRow.propTypes = {
  index: PropTypes.number,
};

EditableRow.defaultProps = {
  index: 0,
};

const EditableCell = ({
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  type,
  prefix,
  disabledDateFuture,
  ...restProps
}) => {
  const mounted = useRef(false);
  const mountedSet = (action, value) => {
    if (mounted.current) {
      action(value);
    }
  };
  const [editing, setEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const inputRef = useRef();
  const selectRef = useRef();
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      mountedSet(setOpen, true);
    }
    if (editing && selectRef.current) {
      selectRef.current.focus();
    }
  }, [editing, record]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const saveDatePicker = async () => {
    try {
      mountedSet(setOpen, false);
      toggleEdit();
      const values = await form.validateFields();
      handleSave({ ...record, ...values });
      // eslint-disable-next-line no-empty
    } catch (errInfo) {}
  };

  const save = async () => {
    try {
      mountedSet(setOpen, false);
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
      // eslint-disable-next-line no-empty
    } catch (errInfo) {}
  };

  const saveSelect = async () => {
    try {
      mountedSet(setOpen, false);
      const values = await form.validateFields(['operator']);
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
      // eslint-disable-next-line no-empty
    } catch (errInfo) {}
  };

  const onChangeDatePicker = async (e, dataIndex) => {
    try {
      toggleEdit();
      handleSave({
        ...record,
        [`${dataIndex}`]: e,
      });
      mountedSet(setOpen, false);
      // eslint-disable-next-line no-empty
    } catch (errInfo) {}
  };

  let childNode = children;

  const renderForm = () => {
    if (type === variables.INPUT) {
      return (
        <Form.Item
          name={dataIndex}
          rules={[variables.RULES.MAX_LENGTH_INPUT]}
        >
          <Input
            onBlur={save}
            onPressEnter={save}
            placeholder="Nhập"
            ref={inputRef}
            suffix={prefix}
          />
        </Form.Item>
      );
    }
    if (type === variables.INPUT_NOTE) {
      return (
        <Form.Item
          name={dataIndex}
          rules={[variables.RULES.MAX_LENGTH_TEXTAREA]}
        >
          <Input
            onBlur={save}
            onPressEnter={save}
            placeholder="Nhập"
            ref={inputRef}
            suffix={prefix}
          />
        </Form.Item>
      );
    }
    if (type === variables.PERCENT) {
      return (
        <Form.Item
          name={dataIndex}
          rules={[variables.RULES.MAX_NUMBER, variables.RULES.NUMBER]}
        >
          <Input
            onBlur={save}
            onPressEnter={save}
            placeholder="Nhập"
            ref={inputRef}
            suffix={prefix || '%'}
          />
        </Form.Item>
      );
    }
    if (type === variables.PRICE) {
      return (
        <Form.Item
          name={dataIndex}
          rules={[variables.RULES.NUMBER]}
        >
          <InputNumber
            className={classnames('input-number', styles['input-number-container'])}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            onBlur={save}
            onPressEnter={save}
            placeholder="Nhập"
            ref={inputRef}
          />
        </Form.Item>
      );
    }
    if (type === variables.INPUT_DATE) {
      return (
        <Form.Item
          name={dataIndex}
          rules={[variables.RULES.NUMBER]}
        >
          <InputNumber
            className={classnames(
              'input-number',
              styles['input-number-container'],
              styles['input-number-date'],
            )}
            onBlur={save}
            onPressEnter={save}
            placeholder="Nhập"
            ref={inputRef}
          />
        </Form.Item>
      );
    }
    if (type === variables.INPUT_NUMBER) {
      return (
        <Form.Item
          name={dataIndex}
          rules={[variables.RULES.NUMBER]}
        >
          <InputNumber
            className={classnames(
              'input-number',
              styles['input-number-container'],
              styles['input-number-count'],
            )}
            onBlur={save}
            onPressEnter={save}
            placeholder="Nhập"
            ref={inputRef}
          />
        </Form.Item>
      );
    }
    if (type === variables.SELECT) {
      return (
        <Form.Item
          name={dataIndex}
          rules={[variables.RULES.MAX_LENGTH_INPUT]}
        >
          <Select
            filterOption={(input, option) =>
              Helper.slugify(option?.children).indexOf(Helper.slugify(input)) >= 0
            }
            notFoundContent={null}
            onBlur={saveSelect}
            placeholder="Chọn"
            ref={selectRef}
            showAction={['focus', 'click']}
            showSearch
          >
            {[
              { id: '*', name: '*' },
              { id: '/', name: '/' },
              { id: '+', name: '+' },
              { id: '-', name: '-' },
            ].map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      );
    }
    if (type === variables.TEXTAREA) {
      return (
        <Form.Item
          name={dataIndex}
          rules={[variables.RULES.MAX_LENGTH_INPUT]}
        >
          <Input onBlur={save} onPressEnter={save} placeholder="Nhập" ref={inputRef} />
        </Form.Item>
      );
    }
    if (type === variables.DATE_PICKER) {
      return (
        <Form.Item
          name={dataIndex}
          rules={[variables.RULES.EMPTY]}
        >
          <DatePicker
            disabledDate={disabledDateFuture && Helper.disabledDateFuture}
            format={variables.DATE_FORMAT.DATE}
            onBlur={saveDatePicker}
            onChange={(e) => onChangeDatePicker(e, dataIndex)}
            open={open}
            placeholder="dd/mm/yyyy"
            ref={inputRef}
          />
        </Form.Item>
      );
    }
    return (
      <Form.Item
        name={dataIndex}
        rules={[]}
      >
        <Input onBlur={save} onPressEnter={save} ref={inputRef} />
      </Form.Item>
    );
  };

  if (editable) {
    if (editing) {
      childNode = renderForm();
    }
    if (!editing) {
      childNode = (
        <div
          className="editable-cell-value-wrap"
          onClick={toggleEdit}
          role="presentation"
          style={{
            paddingRight: 24,
          }}
        >
          {children}
        </div>
      );
    }
  }

  return <td {...restProps}>{childNode}</td>;
};

EditableCell.propTypes = {
  title: PropTypes.any,
  editable: PropTypes.any,
  children: PropTypes.any,
  dataIndex: PropTypes.string,
  record: PropTypes.objectOf(PropTypes.any),
  handleSave: PropTypes.func,
  type: PropTypes.string,
  prefix: PropTypes.string,
  disabledDateFuture: PropTypes.bool,
};

EditableCell.defaultProps = {
  title: '',
  editable: '',
  children: '',
  dataIndex: '',
  record: {},
  handleSave: () => {},
  type: '',
  prefix: '',
  disabledDateFuture: false,
};

const SortableItem = sortableElement((props) => {
  const [form] = Form.useForm();
  return (
    <Form component={false} form={form}>
      <EditableContext.Provider value={form}>
        <tr
          {...omit(props, 'record')}
          className={classnames(
            {
              'table-edit-children': !isEmpty(props?.record?.isChildren),
            },
            `table-edit-row-${props?.record?.level}`,
          )}
          data-row-key-level={`${props?.record?.id}-${props?.record?.level}`}
        />
      </EditableContext.Provider>
    </Form>
  );
});
const SortableContainer = sortableContainer((props) => <tbody {...props} />);

const DragHandle = sortableHandle(() => (
  <span className="icon-drag" style={{ cursor: 'pointer', color: '#999' }} />
));

export { EditableRow, EditableCell, SortableItem, SortableContainer, DragHandle };
