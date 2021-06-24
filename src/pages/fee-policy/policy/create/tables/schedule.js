import { memo, useEffect, useMemo } from 'react';
import { Table as TableAntd } from 'antd';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'dva';
import _ from 'lodash';

import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';

const { Summary } = TableAntd;

const Index = memo(({ schoolYearInformation, setSchoolYearInformation, error, checkValidate }) => {
  const dispatch = useDispatch();

  const {
    paymentForm,
  } = useSelector(({ paymentMethod }) => ({
    paymentForm: paymentMethod.data,
  }));

  useEffect(() => {
    dispatch({
      type: 'paymentMethod/GET_DATA',
      payload: {
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.SIZEMAX,
        IsSemester: true
      },
    });
  }, []);

  const onChange = (value, record, name) => {
    const index = _.findIndex(schoolYearInformation, (item) => item.id === record?.id);
    const newSchoolYearInformation = [...schoolYearInformation];
    newSchoolYearInformation[index] = {
      ...record,
      [name]: value
    };
    if (error) {
      checkValidate(newSchoolYearInformation, 'schedule');
    }
    setSchoolYearInformation(newSchoolYearInformation);
  };

  const columns = useMemo(() => [
    {
      title: 'Lịch học',
      key: 'date',
      className: 'min-width-200',
      render: (record) => record?.schedule || ''
    },
    {
      title: 'Học kỳ',
      key: 'semester',
      className: 'min-width-200',
      render: (record) => (
        <>
          <FormItem
            className="mb-0"
            type={variables.SELECT}
            placeholder="Chọn năm"
            onChange={(e) => onChange(e, record, 'paymentFormId')}
            allowClear={false}
            data={paymentForm}
            value={record?.paymentFormId}
            rules={[variables.RULES.EMPTY]}
          />
          {error && !(record?.paymentFormId) && (
            <span className="text-danger">{variables.RULES.EMPTY_INPUT.message}</span>
          )}
        </>
      )
    },
    {
      title: 'Số ngày học trong tháng',
      key: 'day',
      className: 'min-width-200',
      render: (record) => (
        <>
          <FormItem
            className="mb-0"
            type={variables.INPUT_COUNT}
            rules={[variables.RULES.EMPTY]}
            value={record?.schoolDay}
            onChange={(e) => onChange(e, record, 'schoolDay')}
          />
          {error && !(record?.schoolDay) && (
            <span className="text-danger">{variables.RULES.EMPTY_INPUT.message}</span>
          )}
        </>
      )
    }
  ]);

  const summary = (data) => {
    const idHK1 = paymentForm.find(item => item.code === variables.SEMESTER_1)?.id;
    const idHK2 = paymentForm.find(item => item.code === variables.SEMESTER_2)?.id;
    return (
      <>
        <Summary.Row>
          <Summary.Cell colSpan={2}>
            <Text size="normal" className="font-weight-bold">SỐ NGÀY HỌC KỲ 1</Text>
          </Summary.Cell>
          <Summary.Cell>
            <Text size="normal" className="font-weight-bold">{_.sumBy(data.filter(item => item.paymentFormId === idHK1), (item) => item?.schoolDay)}</Text>
          </Summary.Cell>
        </Summary.Row>
        <Summary.Row>
          <Summary.Cell colSpan={2}>
            <Text size="normal" className="font-weight-bold">SỐ NGÀY HỌC KỲ 2</Text>
          </Summary.Cell>
          <Summary.Cell>
            <Text size="normal" className="font-weight-bold">{_.sumBy(data.filter(item => item.paymentFormId === idHK2), (item) => item?.schoolDay)}</Text>
          </Summary.Cell>
        </Summary.Row>
        <Summary.Row>
          <Summary.Cell colSpan={2}>
            <Text size="normal" className="font-weight-bold">TỔNG SỐ NGÀY HỌC</Text>
          </Summary.Cell>
          <Summary.Cell>
            <Text size="normal" className="font-weight-bold">{_.sumBy(data, (item) => item?.schoolDay)}</Text>
          </Summary.Cell>
        </Summary.Row>
      </>
    );
  };

  return (
    <Table
      columns={columns}
      dataSource={schoolYearInformation}
      loading={false}
      error={{}}
      isError={false}
      pagination={false}
      rowKey="id"
      scroll={{ x: '100%' }}
      summary={summary}
    />
  );
});

Index.propTypes = {
  schoolYearInformation: PropTypes.arrayOf(PropTypes.any),
  setSchoolYearInformation: PropTypes.func,
  error: PropTypes.bool,
  checkValidate: PropTypes.func,
};

Index.defaultProps = {
  schoolYearInformation: [],
  setSchoolYearInformation: () => {},
  error: false,
  checkValidate: () => {},
};

export default Index;
