import { memo, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useSelector, useDispatch } from 'dva';
import { useParams } from 'umi';

import { DeleteOutlined } from '@ant-design/icons';
import Button from '@/components/CommonComponent/Button';
import Pane from '@/components/CommonComponent/Pane';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';

const Index = memo(({ tuition, setTuition, error, checkValidate }) => {
  const dispatch = useDispatch();
  const params = useParams();
  const {
    fees,
    paymentForm
  } = useSelector(({ fees, paymentMethod }) => ({
    fees: fees.data,
    paymentForm: paymentMethod.data
  }));

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

  const onChange = (event, record, name) => {
    let value = event;
    if (name === 'content') {
      value = event.target.value;
    }
    const index = _.findIndex(tuition, (item) => item.id === record?.id);
    const newTuition = [...tuition];
    newTuition[index] = {
      ...record,
      [name]: value
    };
    if (error) {
      checkValidate(newTuition, 'tuition');
    }
    setTuition(newTuition);
  };

  const removeLine = (record) => {
    const newTuition = [...tuition].filter(item => item.id !== record.id);
    setTuition(newTuition);
  };

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
          {error && !(record?.feeId) && (
            <span className="text-danger">{variables.RULES.EMPTY_INPUT.message}</span>
          )}
        </>
      )
    },
    {
      title: 'Hình thức',
      key: 'format',
      className: 'min-width-150',
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
          {error && !(record?.paymentFormId) && (
            <span className="text-danger">{variables.RULES.EMPTY_INPUT.message}</span>
          )}
        </>
      )
    },
    {
      title: 'Tiền dự kiến đ',
      key: 'money',
      className: 'min-width-120',
      render: (record) => (
        <>
          <FormItem
            className="mb-0"
            type={variables.INPUT_NUMBER}
            rules={[variables.RULES.EMPTY]}
            value={record?.money}
            onChange={(e) => onChange(e, record, 'money')}
          />
          {error && !(record?.money) && (
            <span className="text-danger">{variables.RULES.EMPTY_INPUT.message}</span>
          )}
        </>
      )
    },
    {
      title: '',
      key: 'delete',
      with: 40,
      render: (record) => (
        <DeleteOutlined
          className="btn-delete-table"
          onClick={() => {
            removeLine(record);
          }}
        />
      )
    }
  ]);

  const addLine = () => {
    setTuition([
      ...tuition,
      {
        id: uuidv4(),
        feeId: "",
        paymentFormId: "",
        money: "",
      }
    ]);
  };

  return (
    <>
      <Table
        className="content-vertical-top"
        columns={columns}
        dataSource={tuition}
        loading={false}
        error={{}}
        isError={false}
        pagination={false}
        rowKey="id"
        scroll={{ x: '100%' }}
      />
      {!(params?.id) && (
        <Pane className="m20">
          <Button
            className="btn-create"
            color="success"
            icon="plus"
            onClick={addLine}
          >
            Thêm dòng
          </Button>
        </Pane>
      )}
      {_.isEmpty(tuition) && error && (
        <p className="text-danger px20">{variables.RULES.EMPTY_INPUT.message}</p>
      )}
    </>
  );
});

Index.propTypes = {
  tuition: PropTypes.arrayOf(PropTypes.any),
  setTuition: PropTypes.func,
  error: PropTypes.bool,
  checkValidate: PropTypes.func,
};

Index.defaultProps = {
  tuition: [],
  setTuition: () => {},
  error: false,
  checkValidate: () => {},
};

export default Index;
