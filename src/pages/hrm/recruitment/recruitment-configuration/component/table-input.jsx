import { memo, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import { Input } from 'antd';

import PropTypes from 'prop-types';
import stylesModule from '../styles.module.scss';


const Index = memo(({ dataTable, setDataTable }) => {
  const [remove, setRemove] = useState([]);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const onChange = (e, record, key) => {
    setDataTable((prev) =>
      prev.map((item) =>
        item.test === record.test && item.id === record.id
          ? { ...item, [key]: e.target.value }
          : { ...item },
      ),
    );
  };

  const header = () => {
    const columns = [
      {
        title: 'STT',
        key: 'number',
        className: 'min-width-80',
        width: 80,
        render: (text, record, index) => index + 1,
      },
      {
        title: 'Câu hỏi',
        key: 'table_name',
        className: 'min-width-120',
        render: (value, record) =>
          <Input.TextArea
            value={value.name}
            autoSize={{ minRows: 2, maxRows: 3 }}
            placeholder="Nhập"
            onChange={(e) => onChange(e, record, 'name')}
          />,
      },
      {
        key: 'action',
        width: 100,
        fixed: 'right',
        render: (record) => (
          <div className={stylesModule['list-button']}>
            <Button
              onClick={() => {
                setDataTable(
                  dataTable.filter(
                    (val) =>
                      (val.key || val.id || val.test) !== (record.key || record.id || record.test),
                  ),
                );
                setRemove([...remove, record.id]);
              }}
              type="button"
              color="danger"
              icon="remove"
              className={stylesModule.remove}
            />
          </div>
        ),
      },
    ];
    return columns;
  };

  return (
    <div className={stylesModule['wrapper-table']}>
      <Table
        columns={header()}
        dataSource={dataTable}
        pagination={false}
        className="table-edit"
        isEmpty
        params={{
          header: header(),
          type: 'table',
        }}
        bordered={false}
        rowKey={(record) => record.id}
        scroll={{ x: '100%' }}
        footer={(item, index) => (

          <Button
            key={index}
            onClick={() =>
              setDataTable([
                ...dataTable,
                {
                  id: uuidv4(),
                  name: undefined,
                },
              ])
            }
            color="transparent-success"
            icon="plus"
          >
            Thêm dòng
          </Button>

        )}
      />
    </div>
  );
});

Index.propTypes = {
  dataTable: PropTypes.arrayOf(PropTypes.any),
  setDataTable:  PropTypes.PropTypes.any,

};

Index.defaultProps = {
  dataTable: [],
  setDataTable: () => { },
};

export default Index;