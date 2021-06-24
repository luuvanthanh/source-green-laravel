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

const Index = memo(({ feeDetail, setFeeDetail, error, checkValidate }) => {
  const dispatch = useDispatch();
  const params = useParams();
  const {
    classes,
    paymentForm
  } = useSelector(({ classType, paymentMethod }) => ({
    classes: classType.data,
    paymentForm: paymentMethod.data
  }));

  useEffect(() => {
    dispatch({
      type: 'classType/GET_DATA',
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
    const index = _.findIndex(feeDetail, (item) => item.id === record?.id);
    const newFeeDetail = [...feeDetail];
    newFeeDetail[index] = {
      ...record,
      [name]: value
    };
    if (error) {
      checkValidate(newFeeDetail, 'tuition');
    }
    setFeeDetail(newFeeDetail);
  };

  const removeLine = (record) => {
    const newFeeDetail = [...feeDetail].filter(item => item.id !== record.id);
    setFeeDetail(newFeeDetail);
  };

  const columns = useMemo(() => [
    {
      title: 'Lớp',
      key: 'class',
      className: 'min-width-200',
      render: (record) => (
        <>
          <FormItem
            className="mb-0"
            type={variables.SELECT}
            placeholder="Chọn"
            onChange={(e) => onChange(e, record, 'classTypeId')}
            allowClear={false}
            data={classes}
            value={record?.classTypeId}
            rules={[variables.RULES.EMPTY]}
          />
          {error && !(record?.classTypeId) && (
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
      title: 'Nội dung',
      key: 'content',
      className: 'min-width-200',
      render: (record) => (
        <>
          <FormItem
            className="mb-0"
            type={variables.INPUT}
            rules={[variables.RULES.EMPTY]}
            value={record?.content}
            onChange={(e) => onChange(e, record, 'content')}
          />
          {error && !(record?.content) && (
            <span className="text-danger">{variables.RULES.EMPTY_INPUT.message}</span>
          )}
        </>
      )
    },
    {
      title: 'Thời gian hiệu lực',
      key: 'deadline',
      className: 'min-width-250',
      render: (record) => (
        <>
          <FormItem
            className="mb-0"
            rules={[variables.RULES.EMPTY]}
            value={record?.rangeDate}
            type={variables.RANGE_PICKER}
            onChange={(e) => onChange(e, record, 'rangeDate')}
          />
          {error && _.isEmpty(record?.rangeDate) && (
            <span className="text-danger">{variables.RULES.EMPTY_INPUT.message}</span>
          )}
        </>
      )
    },
    {
      title: 'Học sinh cũ (đ)',
      key: 'oldStudent',
      className: 'min-width-120',
      render: (record) => (
        <>
          <FormItem
            className="mb-0"
            type={variables.INPUT_NUMBER}
            rules={[variables.RULES.EMPTY]}
            value={record?.oldStudent}
            onChange={(e) => onChange(e, record, 'oldStudent')}
          />
          {error && !(record?.oldStudent) && (
            <span className="text-danger">{variables.RULES.EMPTY_INPUT.message}</span>
          )}
        </>
      )
    },
    {
      title: 'Học sinh mới (đ)',
      key: 'newStudent',
      className: 'min-width-120',
      render: (record) => (
        <>
          <FormItem
            className="mb-0"
            type={variables.INPUT_NUMBER}
            rules={[variables.RULES.EMPTY]}
            value={record?.newStudent}
            onChange={(e) => onChange(e, record, 'newStudent')}
          />
          {error && !(record?.newStudent) && (
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
    setFeeDetail([
      ...feeDetail,
      {
        id: uuidv4(),
        classTypeId: "",
        paymentFormId: "",
        content: "",
        rangeDate: [],
        oldStudent: "",
        newStudent: ""
      }
    ]);
  };

  return (
    <>
      <Table
        columns={params?.id ? _.initial(columns) : columns}
        dataSource={feeDetail}
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
      {_.isEmpty(feeDetail) && (
        <p className="text-danger px20">{variables.RULES.EMPTY_INPUT.message}</p>
      )}
    </>
  );
});

Index.propTypes = {
  feeDetail: PropTypes.arrayOf(PropTypes.any),
  setFeeDetail: PropTypes.func,
  error: PropTypes.bool,
  checkValidate: PropTypes.func,
};

Index.defaultProps = {
  feeDetail: [],
  setFeeDetail: () => {},
  error: false,
  checkValidate: () => {},
};

export default Index;
