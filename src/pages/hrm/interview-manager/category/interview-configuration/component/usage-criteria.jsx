import { memo, useEffect, useRef } from 'react';
import { Checkbox } from 'antd';
import Table from '@/components/CommonComponent/Table';
import PropTypes from 'prop-types';

import stylesModule from '../styles.module.scss';

const Index = memo(({ setDataEvaluation, dataEvaluation, type }) => {
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const onChangCheckBox = (record, e) => {
    setDataEvaluation(
      dataEvaluation?.map((i) => ({
        ...i,
        checkbox: record?.id === i?.id ? e.target.checked : i?.checkbox,
      })),
    );
  };

  const header = () => {
    const columns = [
      ...(type !== 'detail'
        ? [
            {
              key: 'check',
              className: 'min-width-150',
              render: (record) => (
                <Checkbox
                  defaultChecked={record?.checkBox}
                  onChange={(e) => onChangCheckBox(record, e)}
                />
              ),
            },
          ]
        : []),
      {
        title: 'Tiêu chí',
        key: 'name',
        className: 'min-width-400',
        render: (record) => record?.name,
      },
    ];
    return columns;
  };

  return (
    <div className={stylesModule['wrapper-table']}>
      <Table
        columns={header()}
        dataSource={dataEvaluation}
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
      />
    </div>
  );
});

Index.propTypes = {
  dataEvaluation: PropTypes.arrayOf(PropTypes.any),
  setDataEvaluation: PropTypes.PropTypes.any,
  type: PropTypes.PropTypes.any,
};

Index.defaultProps = {
  dataEvaluation: [],
  setDataEvaluation: () => {},
  type: '',
};

export default Index;
