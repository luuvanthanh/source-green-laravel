import { memo, useEffect, useRef, useState } from 'react';
import FormItem from '@/components/CommonComponent/FormItem';
import Pane from '@/components/CommonComponent/Pane';
import { debounce } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import styles from '@/assets/styles/Common/common.scss';
import csx from 'classnames';

import Heading from '@/components/CommonComponent/Heading';
import PropTypes from 'prop-types';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import { variables } from '@/utils/variables';
import stylesModule from '../styles.module.scss';

import VariablesModules from '../../utils/variables';

const Index = memo(({ data, setData, foodCommonsMaterials }) => {
  const [remove, setRemove] = useState([]);
  const debouncedSearch = debounce((e, record, key) => {
    setData((prev) =>
      prev.map((item) => (item.id === record.id ? { ...item, [key]: e } : { ...item })),
    );
  }, 300);

  const onChange = (e, record, key) => {
    const itemData = foodCommonsMaterials?.find((i) => i?.id === e);
    if (key === 'itemDetailType') {
      setData((prev) =>
        prev.map((item) => (item.id === record.id ? { ...item, [key]: e } : { ...item })),
      );
    }
    if (key === 'itemMaterialId') {
      setData((prev) =>
        prev.map((item) =>
          item.id === record.id
            ? {
                checkInput: false,
                ...item,
                itemName: itemData?.name,
                itemMaterialId: e,
                materialCode: itemData?.code,
                measureUnitName: itemData?.measureUnit?.name,
                measureUnitId: itemData?.measureUnitId,
              }
            : { ...item },
        ),
      );
    } else {
      debouncedSearch(e, record, key);
    }
  };

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const header = () => {
    const columns = [
      {
        title: 'STT',
        key: 'no',
        className: 'min-width-80',
        render: (text, record, index) => index + 1,
      },
      {
        title: 'Tên nguyên vật liệu',
        key: 'itemMaterialId',
        className: `${csx('min-width-250', 'labelRequired')}`,
        render: (record) => (
          <FormItem
            name={!record?.checkInput ? [record?.id, 'itemMaterialId'] : undefined}
            value={record?.itemMaterialId}
            data={foodCommonsMaterials}
            type={variables.SELECT}
            rules={[variables.RULES.EMPTY]}
            onChange={(e) => onChange(e, record, 'itemMaterialId')}
          />
        ),
      },
      {
        title: 'Mã nguyên vật liệu',
        key: 'no',
        className: 'min-width-150',
        render: (record) => record?.materialCode,
      },
      {
        title: 'Đơn vị tính',
        key: 'no',
        className: 'min-width-150',
        render: (record) => record?.measureUnitName,
      },
      {
        title: 'Số lượng',
        key: 'quantity',
        className: `${csx('min-width-150', 'labelRequired')}`,
        render: (record) => (
          <FormItem
            name={!record?.checkInput ? [record?.id, 'quantity'] : undefined}
            value={record?.quantity}
            type={variables.NUMBER_INPUT}
            rules={[variables.RULES.EMPTY]}
            onChange={(e) => onChange(e, record, 'quantity')}
          />
        ),
      },
      {
        title: 'Loại định mức',
        key: 'itemDetailType',
        className: `${csx('min-width-150')}`,
        render: (record) => (
          <FormItem
            name={record?.checkInput ? [record?.id, 'itemDetailType'] : undefined}
            value={record?.itemDetailType}
            type={variables.SELECT}
            data={VariablesModules.DATA_NORM_TYPE}
            onChange={(e) => onChange(e, record, 'itemDetailType')}
          />
        ),
      },
      {
        key: 'action',
        width: 120,
        fixed: 'right',
        render: (record) => (
          <div className={styles['list-button']}>
            <Button
              onClick={() => {
                setData(
                  data.filter(
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
    <Pane className="card">
      <Heading type="form-title" className="mb15">
        Định mức nguyên vật liệu
      </Heading>
      <div className={csx(styles['table-header-blue'], stylesModule['wrapper-table'])}>
        <Table
          columns={header()}
          dataSource={data}
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
            <>
              <Button
                key={index}
                onClick={() =>
                  setData([
                    ...data,
                    {
                      id: uuidv4(),
                      checkInput: false,
                    },
                  ])
                }
                color="transparent-success"
                icon="plus"
              >
                Thêm dòng
              </Button>
            </>
          )}
        />
      </div>
    </Pane>
  );
});

Index.propTypes = {
  data: PropTypes.PropTypes.any,
  setData: PropTypes.PropTypes.any,
  foodCommonsMaterials: PropTypes.PropTypes.any,
};

Index.defaultProps = {
  data: [],
  setData: () => {},
  foodCommonsMaterials: [],
};

export default Index;
