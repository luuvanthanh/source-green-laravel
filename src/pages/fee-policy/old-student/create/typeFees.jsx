import { memo, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useSelector, useDispatch } from 'dva';

import Button from '@/components/CommonComponent/Button';
import TableCus from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import moment from 'moment';

const Index = memo(({ tuition, details, hanDleChangeText , checkSearch}) => {
  const dispatch = useDispatch();
  const { fees, paymentForm } = useSelector(({ fees, paymentMethod }) => ({
    fees: fees.data,
    paymentForm: paymentMethod.data,
  }));

  const [check, setCheck] = useState(false);
  const [feeId, setFeeId] = useState(undefined);
  const [paymentFormId, setPaymentFormId] = useState(undefined);
  const [deleteId, setDeleteId] = useState(false);
  const changeText = (e, k, data, deleteId) => {
    hanDleChangeText(e, k, data, deleteId);
  };
  const [dataItem, setDataItem] = useState([]);

  const [data, setData] = useState([
    {
      id: uuidv4(),
      feeId: undefined,
      paymentFormId: undefined,
      money: 0,
    },

  ]);

  useEffect(() => {
    if (tuition?.length > 0) {
      setData(tuition?.map(i =>
      ({
        id: i?.id,
        feeId: i?.feeId,
        paymentFormId: i?.paymentFormId,
        money: 0,
      })));
    }
  }, [tuition]);

  useEffect(() => {
    dispatch({
      type: 'fees/GET_DATA',
      payload: {
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.SIZEMAX,
      },
    });
    dispatch({
      type: 'paymentMethod/GET_DATA',
      payload: {
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.SIZEMAX,
      },
    });
  }, []);


  const onChangeTitle = (e, record) => {
    setFeeId(e);
    if (record?.paymentFormId) {
      setPaymentFormId(record?.paymentFormId);
    }
    setData((prev) =>
      prev.map((item) =>
        item.test === record.test && item.id === record.id
          ? { ...item, feeId: e, money: 0 }
          : { ...item, money: 0 },
      ),
    );
    // getMoney(e, record,data);
  };
  const onChangeContent = (e, record) => {
    setPaymentFormId(e);
    if (record?.paymentFormId) {
      setFeeId(record?.feeId);
    }
    setData((prev) =>
      prev.map((item) =>
        item.test === record.test && item.id === record.id
          ? { ...item, paymentFormId: e, money: 0 }
          : { ...item, money: 0 },
      ),
    );

  };

  useEffect(() => {
    if ((feeId && paymentFormId || deleteId) || (checkSearch && details?.schoolYearId && details?.classTypeId && details?.dayAdmission)) {
      const { schoolYearId, classTypeId, dayAdmission } = details;
      const detailss = data?.map(i =>
      ({
        paymentFormId: i?.paymentFormId,
        feeId: i?.feeId,
      }));
      dispatch({
        type: 'oldStudentAdd/GET_MONEY_FEE_POLICIES',
        payload: {
          classTypeId,
          schoolYearId,
          dayAdmission: Helper.getDateTime({
            value: Helper.setDate({
              ...variables.setDateData,
              originValue: moment(dayAdmission, variables.DATE_FORMAT.DATE_VI),
            }),
            format: variables.DATE_FORMAT.DATE_AFTER,
            isUTC: false,
          }),
          details: JSON.stringify(detailss),
          student: 'old',
        },
        callback: (res) => {
          setPaymentFormId(undefined);
          setFeeId(undefined);
          setDeleteId(false);
          if (!_.isEmpty(res?.payload) || !_.isEmpty(res?.detailData)) {
            setDataItem(res?.detailData);
            setCheck(false);
          }
          if (res?.payload <= 0) {
            setData([{
              feeId: undefined,
              paymentFormId: undefined,
              money: 0,
            },]);
          }
        },
      });
    }
  }, [feeId, paymentFormId, deleteId,checkSearch]);
  const columns = [
    {
      title: 'Tên',
      key: 'name',
      lassName: 'min-width-300',
      width: 300,
      render: (value, record) => (
        <FormItem
          className="mb-0"
          type={variables.SELECT}
          placeholder="Chọn"
          onChange={(e) => onChangeTitle(e, record)}
          allowClear={false}
          data={fees}
          value={record?.feeId}
          rules={[variables.RULES.EMPTY]}
        />
      ),
    },
    {
      title: 'Nội dung',
      key: 'content',
      lassName: 'min-width-100',
      render: (value, record) => (
        <FormItem
          className="mb-0"
          type={variables.SELECT}
          placeholder="Chọn"
          onChange={(e) => onChangeContent(e, record)}
          allowClear={false}
          data={paymentForm}
          value={record?.paymentFormId}
          rules={[variables.RULES.EMPTY]}
        />
      ),
    },
    {
      key: 'action',
      className: 'min-width-100',
      width: 100,
      fixed: 'right',
      render: (record) => (
        <div >
          <Button
            onClick={() => {
              setData(
                data.filter(
                  (val) =>
                    (val.key || val.id || val.test) !== (record.key || record.id || record.test),
                ),
              );
              setDeleteId(true);
            }}
            type="button"
            color="danger"
            icon="remove"
          />
        </div>
      ),
    },
  ];

  changeText(dataItem, check, data, deleteId);

  return (
    <>
      {
        details?.schoolYearId && details?.classTypeId && details?.dayAdmission && (
          <TableCus
            className="content-vertical-top mb20"
            columns={columns}
            dataSource={data}
            loading={false}
            error={{}}
            isError={false}
            pagination={false}
            rowKey="id"
            scroll={{ x: '100%' }}
            footer={(item, index) => (
              <Button
                key={index}
                onClick={() =>
                  setData([
                    ...data,
                    {
                      key: '',
                      test: uuidv4(),
                    },
                  ])
                }
                color="transparent-success"
                icon="plus"
              >
                Thêm
              </Button>
            )}
          />
        )
      }
    </>
  );
});

Index.propTypes = {
  tuition: PropTypes.arrayOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  checkSearch: PropTypes.bool,
  hanDleChangeText: PropTypes.func,
};

Index.defaultProps = {
  tuition: [],
  details: {},
  checkSearch: false,
  hanDleChangeText: () => {},
};

export default Index;