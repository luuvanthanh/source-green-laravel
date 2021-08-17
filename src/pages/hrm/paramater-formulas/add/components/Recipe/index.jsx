import classnames from 'classnames';
import { variables, Helper } from '@/utils';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import Table from '@/components/CommonComponent/Table';
import Button from '@/components/CommonComponent/Button';
import styles from '@/assets/styles/Common/common.scss';
import { v4 as uuidv4 } from 'uuid';
import { EditableCell, EditableRow } from '../Table/EditableCell';

const EditableTable = ({ data, onSaveData }) => {
  const [dataSource, setDataSource] = useState([]);
  const mounted = useRef(false);
  const mountedSet = (action, value) => {
    if (mounted.current) {
      action(value);
    }
  };

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    mountedSet(setDataSource, data);
  }, [data]);

  /**
   * Function save edit table
   * @param {object} record values after change
   */
  const handleSave = async (record) => {
    await mountedSet(
      setDataSource,
      dataSource.map((item) => (item.key === record.key ? record : item)),
    );
    onSaveData(dataSource.map((item) => (item.key === record.key ? record : item)));
  };

  /**
   * Function add item table edit
   */
  const add = async () => {
    let objects = {
      key: uuidv4(),
      id: uuidv4(),
      name: null,
      operator: null,
      parentId: null,
      value: null,
      level: 1,
      children: [],
    };
    if (isEmpty(dataSource)) {
      objects = {
        ...objects,
        isFirst: true,
      };
    }
    const items = Helper.nest([...dataSource, objects]);
    await mountedSet(setDataSource, Helper.flatten(items));
    const itemsRow = document.querySelectorAll(
      `.ant-table-tbody tr[data-row-key='${objects.key}'] .editable-cell-value-wrap`,
    );
    if (!isEmpty(itemsRow)) {
      itemsRow[0].click();
    }
  };

  /**
   * Function add item table edit
   */
  const addChildren = async (record) => {
    const dataChildren = dataSource.filter((item) => item.parentId === record.id);
    let objects = {
      key: uuidv4(),
      id: uuidv4(),
      name: null,
      operator: null,
      value: null,
      parentId: record.id,
      level: record.level + 1,
    };
    if (isEmpty(dataChildren)) {
      objects = {
        ...objects,
        isFirst: true,
      };
    }
    const items = Helper.nest([...dataSource, objects]);
    await mountedSet(setDataSource, Helper.flatten(items));
    const itemsRow = document.querySelectorAll(
      `.ant-table-tbody tr[data-row-key='${objects.key}'] .editable-cell-value-wrap`,
    );
    if (!isEmpty(itemsRow)) {
      itemsRow[0].click();
    }
  };

  /**
   * Function remove item table
   * @param {uid} id of item table
   */
  const onRemove = async (record) => {
    const items = Helper.nest(dataSource.filter((item) => item.id !== record.id));
    await mountedSet(setDataSource, Helper.flatten(items));
    onSaveData(Helper.flatten(items));
  };

  const columns = [
    {
      dataIndex: 'level',
      title: 'Level',
      align: 'center',
      width: 80,
      className: classnames('min-width-80', 'max-width-80'),
    },
    {
      title: 'Tên công thức',
      dataIndex: 'variable',
      editable: true,
      className: classnames('min-width-130', 'max-width-130'),
      type: variables.TEXTAREA,
    },
    {
      title: 'GIÁ TRỊ',
      dataIndex: 'value',
      editable: true,
      className: classnames('min-width-120', 'max-width-120'),
      type: variables.PRICE,
      render: (value) => Helper.getPrice(value),
    },
    {
      title: 'LOẠI PHÉP',
      dataIndex: 'operator',
      editable: true,
      className: classnames('min-width-120', 'max-width-120'),
      type: variables.SELECT,
    },
    {
      className: 'min-width-120',
      width: 120,
      align: 'center',
      render: (record) => (
        <div className={classnames(styles['list-button'], 'd-flex', 'justify-content-end')}>
          <Button color="success" icon="plusMain" onClick={() => addChildren(record)} />
          <Button color="danger" icon="remove" onClick={() => onRemove(record)} />
        </div>
      ),
    },
  ];

  /**
   * Function edit row
   * @param {objects} col value of item row
   * @param {objects} record value of record row
   */
  const getEditRow = (col, record) => {
    if (col.dataIndex === 'operator' && record.isFirst) {
      return false;
    }
    if (col.dataIndex === 'value' && record.isFirst) {
      return false;
    }
    return col.editable;
  };

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: getEditRow(col, record),
        dataIndex: col.dataIndex,
        title: col.title,
        type: col.type,
        prefix: col.prefix,
        handleSave,
      }),
    };
  });
  return (
    <div className="mt20">
      <Table
        bordered
        className="table-edit table-edit-discount"
        columns={mergedColumns}
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
        dataSource={dataSource}
        footer={() => (
          <Button color="transparent-success" icon="plus" onClick={add}>
            Thêm dòng
          </Button>
        )}
        isEmpty
        pagination={false}
        scroll={{ x: '100%' }}
      />
    </div>
  );
};

EditableTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any),
  onSaveData: PropTypes.func,
};

EditableTable.defaultProps = {
  data: [],
  onSaveData: () => {},
};

export default EditableTable;
