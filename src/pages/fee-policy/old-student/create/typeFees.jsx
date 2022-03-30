import { memo, useMemo, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useSelector, useDispatch } from 'dva';

import { DeleteOutlined } from '@ant-design/icons';
import Button from '@/components/CommonComponent/Button';
import Pane from '@/components/CommonComponent/Pane';
import TableCus from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import moment from 'moment';

const Index = memo(({ tuition, setTuition, error, checkValidate, details, hanDleChangeText }) => {
  const dispatch = useDispatch();
  const { fees, paymentForm } = useSelector(({ fees, paymentMethod }) => ({
    fees: fees.data,
    paymentForm: paymentMethod.data,
  }));
  const changeText = (e, k) => {
    hanDleChangeText(e, k);
  };

  const [check, setCheck] = useState(true);
  const [checkId, setCheckId] = useState({});

  const [dataItem, setDataItem] = useState([]);

  const [data, setData] = useState([
    {
      feeId: undefined,
      paymentFormId: undefined,
    },

  ]);


  console.log("tuitionss", tuition)


  const [deleteId, setDeleteId] = useState({});

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


  useEffect(() => {
    if (tuition?.length > 0) {
      setData(tuition?.map(i =>
      ({
        id: i?.id,
        feeId: i?.feeId,
        paymentFormId: i?.paymentFormId,
      })));
    }
  }, [tuition]);

  const getMoney = async (e, record) => {
    const { schoolYearId, classTypeId, dayAdmission } = details;
    // const { feeId, paymentFormId } = tuition[index];
    // const newTuition = [...tuition];
    if (
      (record?.feeId && record?.paymentFormId) ) {
      const details = data?.map(i =>
      ({
        paymentFormId: i?.paymentFormId,
        feeId: i?.feeId,
      }));
      return dispatch({
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
          details: JSON.stringify(details),
          student: 'old',
        },
        callback: (res) => {
          if(!_.isEmpty(res?.payload)){
           console.log("res",res);
           setDataItem(res?.detailData);
           setCheck(false);
          }
        //   if (!_.isEmpty(res?.payload)) {
        //     setCheck(false);
        //     // newTuition[index] = { ...res?.payload[0], detailData: res?.detailData };
        //     setDeleteId({});
        //     setCheckId({ ...res?.payload[0], detailData: res?.detailData });
        //   }
        //   if (error) {
        //     checkValidate(newTuition, 'tuition');
        //   }
        //   return setTuition(newTuition);
        },
      });
    }
    // newTuition[index] = {
    //   ...newTuition[index],
    //   [name]: value,
    // };
    // if (error) {
    //   checkValidate(newTuition, 'tuition');
    // }
    // return setTuition(newTuition);
  };
  const onChange = async (event, record, name) => {
    let value = event;
    if (name === 'content') {
      value = event.target.value;
    }
    const index = _.findIndex(tuition, (item) => item.id === record?.id);
    getMoney(details, tuition, name, value, index);
  };

  const removeLine = (record) => {
    setDeleteId(record);
    setCheck(false);
    setCheckId({});
    const newTuition = [...tuition].filter((item) => item.id !== record.id);
    setTuition(newTuition);
  };
  console.log("tuition", tuition)
  changeText(dataItem, check);

  const addLine = () => {
    setTuition([
      ...tuition,
      {
        id: uuidv4(),
        feeId: null,
        paymentFormId: null,
        money: 0,
      },
    ]);
  };

  const onChangeTitle = (e, record) => {
    setData((prev) =>
      prev.map((item) =>
        item.test === record.test && item.id === record.id
          ? { ...item, feeId: e }
          : { ...item },
      ),
    );
    getMoney(e, record);
  };
  const onChangeContent = (e, record) => {
    setData((prev) =>
      prev.map((item) =>
        item.test === record.test &&  item.id === record.id
          ? { ...item, paymentFormId: e }
          : { ...item },
      ),
    );
    getMoney(e, record);
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
              // setRemove([...remove, record.id]);
            }}
            type="button"
            color="danger"
            icon="remove"
          />
        </div>
      ),
    },
  ];
  console.log("DATA", data)
  return (
    <>
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
    </>
  );
});

Index.propTypes = {
  tuition: PropTypes.arrayOf(PropTypes.any),
  setTuition: PropTypes.func,
  error: PropTypes.bool,
  checkValidate: PropTypes.func,
  details: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  tuition: [],
  setTuition: () => { },
  error: false,
  checkValidate: () => { },
  details: {},
};

export default Index;
