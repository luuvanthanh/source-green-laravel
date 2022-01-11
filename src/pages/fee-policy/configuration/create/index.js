import { memo, useRef, useEffect, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { useSelector, useDispatch } from 'dva';
import csx from 'classnames';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { useParams, history } from 'umi';
import _ from 'lodash';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import { DeleteOutlined } from '@ant-design/icons';
import Table from '@/components/CommonComponent/Table';
import Loading from '@/components/CommonComponent/Loading';
import Button from '@/components/CommonComponent/Button';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import FormItem from '@/components/CommonComponent/FormItem';
import commonStyles from '@/assets/styles/Common/common.scss';
import { variables, Helper } from '@/utils';

const select = [
  { id: 'MALE', name: 'Nam' },
  { id: 'FEMALE', name: 'Nữ' },
  { id: 'OTHER', name: 'Khác' },
];
const Index = memo(() => {
  const formRef = useRef();
  const dispatch = useDispatch();
  const params = useParams();

  const { menuLeftFeePolicy, yearsSchool, error } = useSelector(
    ({ loading, menu, currencyOldStudentAdd }) => ({
      loading: loading.effects,
      menuLeftFeePolicy: menu.menuLeftFeePolicy,
      yearsSchool: currencyOldStudentAdd?.data,
    }),
  );

  const [showDetails, setShowDetails] = useState(false);
  const [moneyMeal, setMoneyMeal] = useState([
    {
      id: 1,
    },
  ]);

  useEffect(() => {
    dispatch({
      type: 'currencyOldStudentAdd/GET_DATA',
      payload: {
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.SIZEMAX,
      },
    });
    setShowDetails(true);
    if (params?.id) {
      dispatch({
        type: 'feePolicyPolicyAdd/GET_DETAILS',
        payload: {
          id: params?.id,
          include: Helper.convertIncludes(['currencyOldStudentAdd']),
        },
        callback: () => {},
      });
    }
  }, []);

  const onChange = async (e, name) => {
    if (name === 'currencyOldStudentAddId') {
      const choolYearSelect = yearsSchool.find((item) => item?.id === e);
      await formRef?.current?.setFieldsValue({
        timeToPay: [moment(choolYearSelect?.startDate), moment(choolYearSelect?.endDate)],
      });
    }

    const { getFieldsValue } = formRef?.current;
    const { currencyOldStudentAddId, decisionDate, decisionNumber, timeToPay } = getFieldsValue();
    if (currencyOldStudentAddId && decisionDate && decisionNumber && timeToPay) {
      setShowDetails(true);
    } else {
      setShowDetails(false);
    }
  };

  const removeLine = (record) => {
    // const newMoneyMeal = [...moneyMeal].filter((item) => item.id !== record.id);
    // setMoneyMeal(newMoneyMeal);
  };

  const columns = useMemo(() => [
    {
      title: 'Loại phí',
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
            data={select}
            value={record?.classTypeId}
            rules={[variables.RULES.EMPTY]}
          />
          {error && !record?.classTypeId && (
            <span className="text-danger">{variables.RULES.EMPTY_INPUT.message}</span>
          )}
        </>
      ),
    },
    {
      title: 'Hình thức hoàn phí',
      key: 'format',
      className: 'min-width-200',
      children: [
        {
          title: 'Thôi học',
          dataIndex: 'student',
          key: 'month',
          className: 'min-width-200',
          render: (record) => (
            <>
              <FormItem
                className="mb-0"
                type={variables.SELECT}
                placeholder="Chọn"
                onChange={(e) => onChange(e, record, 'paymentFormId')}
                allowClear={false}
                data={select}
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
          title: 'Nghỉ tạm thời',
          dataIndex: 'money',
          key: 'money',
          className: 'min-width-200',

          render: (record) => (
            <>
              <FormItem
                className="mb-0"
                type={variables.SELECT}
                placeholder="Chọn"
                onChange={(e) => onChange(e, record, 'paymentFormId')}
                allowClear={false}
                data={select}
                value={record?.paymentFormId}
                rules={[variables.RULES.EMPTY]}
              />
              {error && !record?.paymentFormId && (
                <span className="text-danger">{variables.RULES.EMPTY_INPUT.message}</span>
              )}
            </>
          ),
        },
      ],
    },
    {
      title: 'Thời gian hiệu lực',
      key: 'money',
      className: 'min-width-200',
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
      ),
    },
    {
      title: '',
      key: 'delete',
      className: 'min-width-40',
      with: 40,
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
    setMoneyMeal([
      ...moneyMeal,
      {
        id: uuidv4(),
        classTypeId: '',
        paymentFormId: '',
        money: '',
      },
    ]);
  };

  return (
    <Form layout="vertical" colon={false} ref={formRef}>
      <Breadcrumbs
        className="pb0"
        last={params?.id ? 'Chi tiết' : 'Thêm mới'}
        menu={menuLeftFeePolicy}
      />
      <Pane style={{ padding: 20, paddingBottom: 0 }}>
        <Loading params={{ type: 'container', goBack: '/chinh-sach-phi/tien-dong' }}>
          <Helmet title={params?.id ? 'Chi tiết tiền đóng' : 'Thêm mới tiền đóng'} />

          <Pane className="card p20">
            <Heading type="form-title" className="mb10">
              Thông tin chung
            </Heading>

            <Pane className="row">
              <div className="col-lg-3">
                <FormItem
                  className="mb-2"
                  label="Năm học"
                  name="currencyOldStudentAddId"
                  type={variables.SELECT}
                  placeholder="Chọn năm"
                  onChange={(e) => onChange(e, 'currencyOldStudentAddId')}
                  allowClear={false}
                  data={yearsSchool?.map((item) => ({
                    ...item,
                    name: `${item?.yearFrom} - ${item?.yearTo}`,
                  }))}
                  rules={[variables.RULES.EMPTY]}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  className="mb-2"
                  label="Thời gian hiệu lực"
                  name="currencyOldStudentAddId"
                  type={variables.INPUT}
                  disabled
                />
              </div>
            </Pane>
          </Pane>
          {showDetails && (
            <>
              <Pane className="card mb0">
                <Pane
                  className={csx(commonStyles['block-table'], commonStyles['block-table-tab-new'])}
                >
                  <Heading type="form-title" className="heading-tab">
                    Chi tiết
                  </Heading>
                  <>
                    <Table
                      bordered
                      columns={columns}
                      dataSource={moneyMeal}
                      loading={false}
                      error={{}}
                      isError={false}
                      pagination={false}
                      rowKey="id"
                      scroll={{ x: '100%' }}
                    />
                    <Pane className="m20">
                      <Button className="btn-create" color="success" icon="plus" onClick={addLine}>
                        Thêm
                      </Button>
                    </Pane>
                  </>
                </Pane>
              </Pane>
              <Pane className="p20 d-flex justify-content-between align-items-center">
                <p
                  className="btn-delete"
                  role="presentation"
                  onClick={() => history.push('/chinh-sach-phi/cau-hinh-hoan-phi')}
                >
                  Hủy
                </p>
                <Button
                  className="ml-auto px25"
                  color="success"
                  htmlType="submit"
                  size="large"
                  // loading={loading['classTypeAdd/GET_DETAILS']}
                >
                  Lưu
                </Button>
              </Pane>
            </>
          )}
        </Loading>
      </Pane>
    </Form>
  );
});

export default Index;
