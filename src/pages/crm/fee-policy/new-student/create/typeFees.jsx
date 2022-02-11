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
  const { fees, paymentForm } = useSelector(({ fees, paymentMethod }) => ({
    fees: fees.data,
    paymentForm: paymentMethod.data,
  }));

  const changeText=(e)=>{
    hanDleChangeText(e);
  };
  
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

  const getMoney = async (formRef, tuition, name, value, index) => {
    const { getFieldsValue } = formRef?.current;
    const { schoolYearId, classTypeId, dayAdmission } = getFieldsValue();
    const { feeId, paymentFormId } = tuition[index];
    const newTuition = [...tuition];

    if (value && ((name === 'feeId' && paymentFormId) || (name === 'paymentFormId' && feeId))) {
      const details = [
        {
          ...newTuition[index],
          paymentFormId: name === 'paymentFormId' ? value : paymentFormId,
          feeId: name === 'feeId' ? value : feeId,
        },
      ];
      return dispatch({
        type: 'newStudentAdd/GET_MONEY_FEE_POLICIES',
        payload: {
          classTypeId,
          schoolYearId,
          dayAdmission: Helper.getDateTime({
            value: Helper.setDate({
              ...variables.setDateData,
              originValue: dayAdmission,
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
            onChange={(e) => onChange(e, record, 'feeId')}
            allowClear={false}
            data={fees}
            value={record?.feeId}
            rules={[variables.RULES.EMPTY]}
          />
          {error && !record?.feeId && (
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
            onChange={(e) => onChange(e, record, 'paymentFormId')}
            allowClear={false}
            data={paymentForm}
            value={record?.paymentFormId}
            rules={[variables.RULES.EMPTY]}
          />
          {error && !record?.paymentFormId && (
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
        feeId: null,
        paymentFormId: null,
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
