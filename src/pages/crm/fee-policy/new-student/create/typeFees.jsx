import { memo, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'dva';

import Button from '@/components/CommonComponent/Button';
import TableCus from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import moment from 'moment';

const Index = memo(({ tuition, details, hanDleChangeText, checkSearch }) => {
  const dispatch = useDispatch();
  const { fees, paymentForm } = useSelector(({ CRMnewStudentAdd }) => ({
    fees: CRMnewStudentAdd.fees,
    moneyFee: CRMnewStudentAdd.moneyFee,
    paymentForm: CRMnewStudentAdd.paymentForm,
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
      fee_id_crm: undefined,
      money: 0,
    },
  ]);

  useEffect(() => {
    if (tuition?.length > 0) {
      setData(
        tuition?.map((i) => ({
          id: i?.id,
          feeId: i?.fee_id,
          paymentFormId: i?.payment_form_id,
          fee_id_crm: i?.fee?.fee_clover_id,
          money: i?.money,
        })),
      );
    }
  }, [tuition]);

  useEffect(() => {
    dispatch({
      type: 'CRMnewStudentAdd/GET_FEES',
      payload: {
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.SIZEMAX,
      },
    });
    dispatch({
      type: 'CRMnewStudentAdd/GET_PAYMENT',
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
    const datas = fees?.find(i => i?.id === e);
    if (datas?.code === 'BUS') {
      setData((prev) =>
        prev.map((item) =>
          item.test === record.test && item.id === record.id
            ? { ...item, feeId: e, check: true, fee_id_crm: datas?.fee_clover_id }
            : { ...item },
        ),
      );
    } else {
      setData((prev) =>
        prev.map((item) =>
          item.test === record.test && item.id === record.id
            ? { ...item, feeId: e, fee_id_crm: datas?.fee_clover_id }
            : { ...item },
        ),
      );
    }
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
          : { ...item },
      ),
    );
  };

  useEffect(() => {
    if (
      (feeId && paymentFormId) ||
      deleteId ||
      (checkSearch &&
        checkSearch &&
        details?.school_year_id &&
        details?.class_type_id &&
        details?.day_admission)
    ) {
      const { school_year_id, class_type_id, day_admission } = details;
      const dataPayload = data?.map((i) => ({
        id: i?.id,
        payment_form_id: i?.paymentFormId,
        fee_id: i?.feeId,
        money: i?.money,
      }));
      dispatch({
        type: 'CRMnewStudentAdd/GET_MONEY_FEE',
        payload: {
          branch_id: details?.branch_id,
          class_type_id,
          school_year_id,
          day_admission: Helper.getDateTime({
            value: Helper.setDate({
              ...variables.setDateData,
              originValue: moment(day_admission, variables.DATE_FORMAT.DATE_VI),
            }),
            format: variables.DATE_FORMAT.DATE_AFTER,
            isUTC: false,
          }),
          details: JSON.stringify(dataPayload),
          student: 'new',
        },
        callback: (res) => {
          if (res) {
            setPaymentFormId(undefined);
            setFeeId(undefined);
            setDeleteId(false);
            setDataItem(res?.data_details);
            setCheck(!check);
            if (res?.payload <= 0) {
              setData([
                {
                  feeId: undefined,
                  paymentFormId: undefined,
                  money: 0,
                },
              ]);
            }
          }
        },
      });
    }
  }, [feeId, paymentFormId, deleteId, checkSearch, check]);

  const onChangeBus = (e, record) => {
    if (e > 0) {
      setTimeout(() => {
        setCheck(!check);
        setPaymentFormId(record?.paymentFormId);
        setFeeId(record?.feeId);
      }, 1500);
      clearTimeout(1500);
      setData((prev) =>
        prev.map((item) =>
          item.test === record.test && item.id === record.id
            ? { ...item, money: e, check: true }
            : { ...item },
        ),
      );
    }
  };

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
          data={fees?.filter((e) => e?.fee_clover_id !== data.find(i => i?.fee_id_crm === e?.fee_clover_id)?.fee_id_crm)}
          value={fees?.find(i => i?.id === record?.feeId)?.name}
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
          data={paymentForm?.filter(i => i?.is_semester !== true)}
          value={record?.paymentFormId}
          rules={[variables.RULES.EMPTY]}
        />
      ),
    },
    {
      title: 'Số tiền',
      key: 'content',
      lassName: 'min-width-100',
      render: (record) => (
        <>
          {
            (record?.check) || (record?.money > 0) ? (
              <FormItem
                className="mb-0"
                type={variables.INPUT_NUMBER}
                rules={[variables.RULES.EMPTY]}
                value={record?.money}
                onChange={(e) => onChangeBus(e, record)}
              />
            ) : ""}
        </>
      )
    },
    {
      key: 'action',
      className: 'min-width-100',
      width: 100,
      fixed: 'right',
      render: (record) => (
        data?.length > 1 && (
          <div>
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
        )
      ),
    },
  ];

  changeText(dataItem, check, data, deleteId);

  return (
    <>
      {details?.school_year_id && details?.class_type_id && details?.day_admission && (
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
      )}
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
  hanDleChangeText: () => { },
};

export default Index;
