import { memo, useMemo, useEffect } from 'react';
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

const Index = memo(({ tuition, setTuition, error, checkValidate, addFees, formRef, hanDleChangeText }) => {
  const dispatch = useDispatch();
  const { fees, paymentForm , moneyFee} = useSelector(({ CRMnewStudentAdd, paymentMethod }) => ({
    fees: CRMnewStudentAdd.fees,
    moneyFee: CRMnewStudentAdd.moneyFee,
    paymentForm: CRMnewStudentAdd.paymentForm,
  }));

  const changeText=(e)=>{
    hanDleChangeText(e);
  };
  console.log("CRMnewStudentAdd",moneyFee);
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

  const getMoney = async (formRef, tuition, name, value, index) => {
    const { getFieldsValue } = formRef?.current;
    const { school_year_id, class_type_id, day_admission } = getFieldsValue();
    const { fee_id, payment_form_id } = tuition[index];
    const newTuition = [...tuition];

    if (value && ((name === 'fee_id' && payment_form_id) || (name === 'payment_form_id' && fee_id))) {
      const details = [
        {
          ...newTuition[index],
          payment_form_id: name === 'payment_form_id' ? value : payment_form_id,
          fee_id: name === 'fee_id' ? value : fee_id,
        }
      ];
      return dispatch({
        type: 'CRMnewStudentAdd/GET_MONEY_FEE_POLICIES',
        payload: {
          class_type_id,
          school_year_id,
          day_admission: Helper.getDateTime({
            value: Helper.setDate({
              ...variables.setDateData,
              originValue: day_admission,
            }),
            format: variables.DATE_FORMAT.DATE_AFTER,
            isUTC: false,
          }),
          details: JSON.stringify(details),
          student: 'new',
        },
        callback: (res) => {
          if (!_.isEmpty(res)) {
            newTuition[index] = { ...res[0] };
          } else {
            newTuition[index] = {
              ...newTuition[index],
              [name]: value,
              money: 0,
            };
          }
          if (error) {
            checkValidate(newTuition, 'tuition');
          }
          return setTuition(newTuition);
        },
      });
    }
    newTuition[index] = {
      ...newTuition[index],
      [name]: value,
    };
    if (error) {
      checkValidate(newTuition, 'tuition');
    }
    return setTuition(newTuition);
  };

  const onChange = async (event, record, name) => {
    let value = event;
    if (name === 'content') {
      value = event.target.value;
    }
    const index = _.findIndex(tuition, (item) => item.id === record?.id);
    getMoney(formRef, tuition, name, value, index);
  };

  const removeLine = (record) => {
    const newTuition = [...tuition].filter((item) => item.id !== record.id);
    setTuition(newTuition);
  };
  changeText(tuition);
  const columns = useMemo(() => [
    {
      title: 'Loại phí',
      key: 'fees',
      className: 'min-width-200',
      render: (record) => (
        <>
          <FormItem
            className="mb-0"
            type={variables.SELECT}
            placeholder="Chọn"
            onChange={(e) => onChange(e, record, 'fee_id')}
            allowClear={false}
            data={fees}
            value={record?.fee_id}
            rules={[variables.RULES.EMPTY]}
          />
          {error && !record?.fee_id && (
            <span className="text-danger">{variables.RULES.EMPTY_INPUT.message}</span>
          )}
        </>
      ),
    },
    {
      title: 'Hình thức',
      key: 'format',
      className: 'min-width-200',
      render: (record) => (
        <>
          <FormItem
            className="mb-0"
            type={variables.SELECT}
            placeholder="Chọn"
            onChange={(e) => onChange(e, record, 'payment_form_id')}
            allowClear={false}
            data={paymentForm}
            value={record?.payment_form_id}
            rules={[variables.RULES.EMPTY]}
          />
          {error && !record?.payment_form_id && (
            <span className="text-danger">{variables.RULES.EMPTY_INPUT.message}</span>
          )}
        </>
      ),
    },
    {
      title: '',
      key: 'delete',
      with: 40,
      align: 'center',
      render: (record) => (
        <DeleteOutlined
          className="btn-delete-table"
          onClick={() => {
            removeLine(record);
          }}
        />
      ),
    },
  ]);

  const addLine = () => {
    setTuition([
      ...tuition,
      {
        id: uuidv4(),
        fee_id: null,
        payment_form_id: null,
        money: 0,
      },
    ]);
  };

  return (
    <>
      <TableCus
        className="table-edit mb20 w-100" 
        columns={columns}
        dataSource={tuition}
        loading={false}
        isEmpty
        error={{}}
        isError={false}
        pagination={false}
        rowKey="id"
        scroll={{ x: '100%' }}
      />
      {addFees && (
        <Pane className="px20">
          <Button className="btn-create" color="success" icon="plus" onClick={addLine}>
            Thêm dòng
          </Button>
        </Pane>
      )}
      {_.isEmpty(tuition) && error && (
        <p className="text-danger px20 pt20 mb0">{variables.RULES.EMPTY_INPUT.message}</p>
      )}
    </>
  );
});

Index.propTypes = {
  tuition: PropTypes.arrayOf(PropTypes.any),
  setTuition: PropTypes.func,
  error: PropTypes.bool,
  checkValidate: PropTypes.func,
  addFees: PropTypes.bool,
  formRef: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  tuition: [],
  setTuition: () => {},
  error: false,
  checkValidate: () => {},
  addFees: false,
  formRef: {},
};

export default Index;
