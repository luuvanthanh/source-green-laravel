import FormItem from '@/components/CommonComponent/FormItem';
import Pane from '@/components/CommonComponent/Pane';
import Table from '@/components/CommonComponent/Table';
import { Helper, variables } from '@/utils';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { memo } from 'react';
import variablesModules from '../variables';




const Index = memo(({ formRef, fees, paramChanges, setParamChanges, error, checkValidate }) => {
  const { getFieldsValue } = formRef?.current;
  const { rangeDate } = getFieldsValue();

  const onChange = (value, record, name) => {
    const index = _.findIndex(paramChanges, (item) => item.id === record?.id);
    const newParamChanges = [...paramChanges];
    newParamChanges[index] = {
      ...record,
      [name]: value,
    };
    if (error) {
      checkValidate(newParamChanges, 'changeParameter');
    }
    setParamChanges(newParamChanges);
  };

  /**
   * Function header table
   */
  const header = () => {
    const columns = [
      {
        title: 'Hình thức',
        key: 'form',
        className: 'min-width-150',
        render: (record) => record?.fee || record?.paymentForm?.name || '',
      },
      {
        title: 'Ngày học theo lịch',
        key: 'date',
        className: 'min-width-150',
        render: (record) =>
          Helper.getDate(
            moment(record?.date, variables.DATE_FORMAT.DATE_AFTER),
            variables.DATE_FORMAT.MONTH_YEAR,
          ) || '',
      },
      {
        title: 'Ngày đến hạn thanh toán',
        key: 'expired',
        className: 'min-width-200',
        render: (record) =>
          Helper.getDate(
            moment(record?.duaDate, variables.DATE_FORMAT.DATE_AFTER),
            variables.DATE_FORMAT.DATE_VI,
          ) || '',
      },
      {
        title: 'Số tuần thực tế',
        key: 'actualWeek',
        className: 'min-width-150',
        render: (record) => (
          <>
            <FormItem
              className="mb0"
              value={record?.actualWeek}
              type={variables.INPUT_COUNT}
              rules={[variables.RULES.EMPTY]}
              onChange={(event) => onChange(event, record, 'actualWeek')}
            />
            {error && !record?.actualWeek && (
              <span className="text-danger">{variables.RULES.EMPTY_INPUT.message}</span>
            )}
          </>
        ),
      },
      {
        title: 'Từ ngày đến ngày',
        key: 'rangeDate',
        className: 'min-width-250',
        render: (record) => (
          <>
            <FormItem
              className="mb0"
              value={record?.rangeDate}
              onChange={(event) => onChange(event, record, 'rangeDate')}
              type={variables.RANGE_PICKER}
            />
            {error && _.isEmpty(record?.rangeDate) && (
              <span className="text-danger">{variables.RULES.EMPTY_INPUT.message}</span>
            )}
          </>
        ),
      },
      {
        title: 'Học kỳ',
        key: 'paymentFormId',
        className: 'min-width-200',
        render: (record) => (
          <>
            <FormItem
              className="mb0"
              data={[...fees].filter((item) => item.isSemester)}
              value={record?.paymentFormId}
              rules={[variables.RULES.EMPTY]}
              type={variables.SELECT}
              onChange={(event) => onChange(event, record, 'paymentFormId')}
            />
            {error && !record?.paymentFormId && (
              <span className="text-danger">{variables.RULES.EMPTY_INPUT.message}</span>
            )}
          </>
        ),
      },
      {
        title: 'Số ngày học trong tháng',
        key: 'schoolDay',
        className: 'min-width-150',
        render: (record) => (
          <>
            <FormItem
              className="mb0"
              value={record?.schoolDay}
              type={variables.INPUT_COUNT}
              rules={[variables.RULES.EMPTY]}
              onChange={(event) => onChange(event, record, 'schoolDay')}
            />
            {error && !record?.schoolDay && (
              <span className="text-danger">{variables.RULES.EMPTY_INPUT.message}</span>
            )}
          </>
        ),
      },
      {
        title: 'Tròn tháng',
        key: 'fullMonth',
        className: 'min-width-150',
        render: (record) => (
          <>
            <FormItem
              className="mb0"
              data={variablesModules.MONTH}
              value={record?.fullMonth}
              rules={[variables.RULES.EMPTY]}
              type={variables.SELECT}
              onChange={(event) => onChange(event, record, 'fullMonth')}
            />
            {error && !record?.fullMonth && (
              <span className="text-danger">{variables.RULES.EMPTY_INPUT.message}</span>
            )}
          </>
        ),
      },
    ];
    return columns;
  };

  const changeForm = () => {
    const values = getFieldsValue();
    if (!values?.fee && !values?.duaDate) {
      const feeResult = fees
        .filter((item) => item.type === 'TD')
        .find((item) => item.id === values.feeId);
      setParamChanges(
        paramChanges.map((item) => ({
          ...item,
          fee: feeResult.name,
          feeId: values.feeId,
        })),
      );
    }
  };

  return (
    <Pane className="p20">
      <div className="row">
        <div className="col-lg-3">
          <label htmlFor="" className="mb5">
            Thời điểm
          </label>
          <p className="mb0 py10 font-weight-bold">
            {!_.isEmpty(rangeDate)
              ? `${Helper.getDate(rangeDate[0])} - ${Helper.getDate(rangeDate[1])}`
              : ''}
          </p>
        </div>
        <div className="col-lg-3">
          <FormItem
            data={fees.filter((item) => item.type === 'TD')}
            label="Hình thức"
            name="feeId"
            type={variables.SELECT}
            onChange={changeForm}
          />
        </div>
        <div className="col-lg-3">
          <FormItem
            label="Ngày đến hạn mỗi THÁNG"
            name="duaDate"
            type={variables.INPUT_COUNT}
            onChange={changeForm}
            rules={[
              () => ({
                validator(_, value) {
                  if (value === 0 || (value && (value > 31 || value < 1))) {
                    return Promise.reject(new Error(variables.RULES.INVALID_DATE));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          />
        </div>
      </div>
      <Table
        className="content-vertical-top"
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
  checkValidate: PropTypes.func,
};

Index.defaultProps = {
  formRef: {},
  fees: [],
  paramChanges: [],
  setParamChanges: () => { },
  error: false,
  checkValidate: () => { },
};

export default Index;
