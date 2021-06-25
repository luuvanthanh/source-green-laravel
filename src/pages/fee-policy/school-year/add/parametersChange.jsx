import { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';

import Pane from '@/components/CommonComponent/Pane';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Table from '@/components/CommonComponent/Table';

import { variables, Helper } from '@/utils';

const Index = memo(({ formRef, fees, paramChanges, setParamChanges, error }) => {
  const { getFieldsValue } = formRef?.current;
  const { rangeDate} = getFieldsValue();

  const [disableApply, setDiableApply] = useState(true);

  const renderData = (length, values) => {
    const datasTable = [];
    for (let i = 0; i < length; i += 1) {
      const startMonth = moment(rangeDate[0]).add(i, 'month').set('date', values?.expirationDate);
      const endMonth = moment(rangeDate[0]).add(i, 'month');
      datasTable.push({
        id: i,
        paymentFormId: values?.fee,
        fee: [...fees].find(item => item.id === values?.fee)?.code,
        duaDate: values?.expirationDate,
        startDate: moment(rangeDate[0]).add(i + 1, 'month').format('MM/YYYY'),
        expirationDate: startMonth.format('MM') <= endMonth.format('MM') ? startMonth.format('DD/MM/YYYY'): endMonth.endOf('month').format('DD/MM/YYYY'),
      });
    }
    return datasTable;
  };

  const handleApply = () => {
    const values = getFieldsValue();
    const result = moment(rangeDate[1]).diff(moment(rangeDate[0]), 'month') + 1;
    if (result) {
      const data = renderData(result, values);
      setParamChanges(data);
    }
  };

  useEffect(() => {
    const { getFieldsValue } = formRef?.current;
    const { fee, expirationDate } = getFieldsValue();
    if (fee && expirationDate) {
      setDiableApply(false);
    }
  }, []);

  /**
   * Function header table
   */
  const header = () => {
    const columns = [
      {
        title: 'Hình thức',
        key: 'form',
        className: 'min-width-200',
        render: (record) => record?.fee || record?.paymentForm?.name || ''
      },
      {
        title: 'Ngày học theo lịch',
        key: 'date',
        className: 'min-width-200',
        render: (record) => record?.startDate || Helper.getDate(moment(record?.lastModificationTime).add(1, 'month'), 'MM/YYYY') || '',
      },
      {
        title: 'Ngày đến hạn thanh toán',
        key: 'expired',
        className: 'min-width-300',
        render: (record) => record?.expirationDate || Helper.getDate(record?.lastModificationTime, 'DD/MM/YYYY') || '',
      },
    ];
    return columns;
  };

  const changeForm = () => {
    setParamChanges([]);
    const values = getFieldsValue();
    if (values?.fee && values?.expirationDate) {
      setDiableApply(false);
    } else {
      setDiableApply(true);
    }
  };

  return (
    <Pane className="p20">
      <div className="row">
        <div className="col-lg-3">
          <label htmlFor="" className="mb5">Thời điểm</label>
          <p className="mb0 py10 font-weight-bold">{ !_.isEmpty(rangeDate) ? `${Helper.getDate(rangeDate[0])} - ${Helper.getDate(rangeDate[1])}` : '' }</p>
        </div>
        <div className="col-lg-3">
          <FormItem
            data={fees}
            label="Hình thức"
            name='fee'
            type={variables.SELECT}
            onChange={changeForm}
          />
        </div>
        <div className="col-lg-3">
          <FormItem
              label="Ngày đến hạn mỗi THÁNG"
              name="expirationDate"
              type={variables.INPUT_COUNT}
              onChange={changeForm}
              rules={[
                () => ({
                  validator(_, value) {
                    if (value && value > 31) {
                      setDiableApply(true);
                      return Promise.reject(new Error(variables.RULES.INVALID_DATE));
                    }
                    setDiableApply(false);
                    return Promise.resolve();
                  },
                }),
              ]}
            />
        </div>
        <div className="col-lg-3">
          <Button
            className="px25 btn-small"
            color="success"
            size="large"
            onClick={handleApply}
            disabled={disableApply}
          >
            Áp dụng
          </Button>
        </div>
      </div>
      <Table
        name="table"
        bordered
        columns={header()}
        dataSource={paramChanges}
        pagination={false}
        params={{
          header: header(),
          type: 'table',
        }}
        rowKey={(record) => record.id}
        scroll={{ x: '100%' }}
      />
      {_.isEmpty(paramChanges) && error && (
        <p className="text-danger px20">{variables.RULES.EMPTY_INPUT.message}</p>
      )}
    </Pane>
  );
});

Index.propTypes = {
  formRef: PropTypes.objectOf(PropTypes.any),
  fees: PropTypes.arrayOf(PropTypes.any),
  paramChanges: PropTypes.arrayOf(PropTypes.any),
  setParamChanges: PropTypes.func,
  error: PropTypes.bool,
};

Index.defaultProps = {
  formRef: {},
  fees: [],
  paramChanges: [],
  setParamChanges: () => {},
  error: false,
};

export default Index;
