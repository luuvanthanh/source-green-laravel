import { memo, useRef, useEffect, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { useSelector, useDispatch } from 'dva';
import csx from 'classnames';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { useParams, history } from 'umi';
import { isEmpty, get } from 'lodash';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import { DeleteOutlined } from '@ant-design/icons';
import TableCus from '@/components/CommonComponent/Table';
import Loading from '@/components/CommonComponent/Loading';
import Button from '@/components/CommonComponent/Button';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import FormItem from '@/components/CommonComponent/FormItem';
import commonStyles from '@/assets/styles/Common/common.scss';
import { variables, Helper } from '@/utils';

const dataSelect = [
  { id: 'TUAN', name: 'Tuần' },
  { id: 'THANG', name: 'Tháng' },
];
const Index = memo(() => {
  const formRef = useRef();
  const dispatch = useDispatch();
  const params = useParams();

  const { menuLeftFeePolicy, yearsSchool, error, fees, loading } = useSelector(
    ({ loading, menu, schoolYear, fees, paymentMethod }) => ({
      loading: loading.effects,
      yearsSchool: schoolYear.data,
      fees: fees.data,
      paymentForm: paymentMethod.data,
      menuLeftFeePolicy: menu.menuLeftFeePolicy,
    }),
  );
  const [data, setData] = useState([
    {
      LEAVE: undefined,
      STORE: undefined,
      feeId: undefined,
      test: uuidv4(),
    },
  ]);
  const [dataDetail, setDataDetail] = useState(undefined);
  const [remove, setRemove] = useState([]);
  const [rangeDate, setRangeDate] = useState(undefined);

  const [showDetails, setShowDetails] = useState(false);
  const [details, setDetails] = useState({
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    dispatch({
      type: 'schoolYear/GET_DATA',
      payload: {
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.SIZEMAX,
      },
    });
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
    dispatch({
      type: 'currencyOldStudentAdd/GET_DATA',
      payload: {
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.SIZEMAX,
      },
    });
    setShowDetails(true);
  }, []);

  useEffect(() => {
    if (params?.id) {
      dispatch({
        type: 'feePolicyConfigurationAdd/GET_DETAILS',
        payload: {
          id: params?.id,
          include: Helper.convertIncludes(['currencyOldStudentAdd']),
        },
        callback: (res) => {
          setDataDetail(res);
        },
      });
    }
  }, [params?.id]);

  useEffect(() => {
    if (dataDetail?.id && params?.id) {
      formRef.current.setFieldsValue({
        ...dataDetail,
        currencyOldStudentAddId: dataDetail?.schoolYearId,
      });
      setData(
        dataDetail?.refundDetail?.length > 0
          ? dataDetail?.refundDetail?.map((i) => ({
              ...i,
              STORE: i?.configRefund?.find((k) => k?.type === 'STORE')?.refundForm,
              LEAVE: i?.configRefund?.find((k) => k?.type === 'LEAVE')?.refundForm,
              rangeDate: [moment(i?.startDate), moment(i?.endDate)],
            }))
          : [
              {
                LEAVE: undefined,
                STORE: undefined,
                feeId: undefined,
                test: uuidv4(),
                rangeDate: [
                  moment(dataDetail?.schoolYear?.startDate),
                  moment(dataDetail?.schoolYear?.endDate),
                ],
              },
            ],
      );
      setDetails((prev) => ({
        ...prev,
        startDate: dataDetail?.schoolYear?.startDate
          ? Helper.getDate(dataDetail?.schoolYear?.startDate, variables.DATE_FORMAT.DATE_VI)
          : '',
        endDate: dataDetail?.schoolYear?.endDate
          ? Helper.getDate(dataDetail?.schoolYear?.endDate, variables.DATE_FORMAT.DATE_VI)
          : '',
      }));
      setRangeDate(dataDetail?.schoolYear);
    }
  }, [dataDetail?.id, params?.id]);

  const onChangeYear = async (value) => {
    const dataYear = yearsSchool?.find((i) => i?.id === value);
    setRangeDate(dataYear);
    if (value) {
      setDetails((prev) => ({
        ...prev,
        startDate: dataYear.startDate
          ? Helper.getDate(dataYear.startDate, variables.DATE_FORMAT.DATE_VI)
          : '',
        endDate: dataYear.endDate
          ? Helper.getDate(dataYear.endDate, variables.DATE_FORMAT.DATE_VI)
          : '',
      }));
      setData((prev) =>
        prev?.map((i) => ({
          ...i,
          rangeDate: i?.type
            ? i?.rangeDate
            : [moment(dataYear?.startDate), moment(dataYear?.endDate)],
          startDate: dataYear.startDate
            ? Helper.getDate(dataYear.startDate, variables.DATE_FORMAT.DATE_VI)
            : '',
          endDate: dataYear.endDate
            ? Helper.getDate(dataYear.endDate, variables.DATE_FORMAT.DATE_VI)
            : '',
        })),
      );
    }
  };

  const onChangeTable = (e, record, key) => {
    setData((prev) =>
      prev.map((item) =>
        item?.test === record?.test && item?.id === record?.id
          ? { ...item, [key]: e }
          : { ...item },
      ),
    );
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
            onChange={(e) => onChangeTable(e, record, 'feeId')}
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
      title: 'Hình thức hoàn phí',
      key: 'format',
      className: 'min-width-200',
      children: [
        {
          title: 'Thôi học',
          key: 'class',
          className: 'min-width-200',
          render: (record) => (
            <>
              <FormItem
                className="mb-0"
                type={variables.SELECT}
                placeholder="Chọn"
                onChange={(e) => onChangeTable(e, record, 'STORE')}
                allowClear={false}
                data={dataSelect}
                value={record?.STORE}
                rules={[variables.RULES.EMPTY]}
              />
              {error && !record?.feeId && (
                <span className="text-danger">{variables.RULES.EMPTY_INPUT.message}</span>
              )}
            </>
          ),
        },
        {
          title: 'Nghỉ tạm thời',
          key: 'class',
          className: 'min-width-200',
          render: (record) => (
            <>
              <FormItem
                className="mb-0"
                type={variables.SELECT}
                placeholder="Chọn"
                onChange={(e) => onChangeTable(e, record, 'LEAVE')}
                allowClear={false}
                data={dataSelect}
                value={record?.LEAVE}
                rules={[variables.RULES.EMPTY]}
              />
              {error && !record?.feeId && (
                <span className="text-danger">{variables.RULES.EMPTY_INPUT.message}</span>
              )}
            </>
          ),
        },
      ],
    },
    {
      title: 'Thời gian hiệu lực',
      key: 'rangeDate',
      className: 'min-width-200',
      render: (record) => (
        <>
          <FormItem
            className="mb-0"
            rules={[variables.RULES.EMPTY]}
            value={record?.rangeDate}
            type={variables.RANGE_PICKER}
            onChange={(e) => onChangeTable(e, record, 'rangeDate')}
            disabledDate={(current) =>
              (details?.startDate &&
                current <
                  moment(details?.startDate, variables.DATE_FORMAT.DATE_VI).startOf('day')) ||
              (details?.endDate &&
                current >= moment(details.endDate, variables.DATE_FORMAT.DATE_VI).endOf('day'))
            }
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
      width: 40,
      render: (record) => (
        <DeleteOutlined
          className="btn-delete-table"
          onClick={() => {
            setData(
              data.filter(
                (val) =>
                  (val.key || val.id || val.test) !== (record.key || record.id || record.test),
              ),
            );
            setRemove([...remove, record.id]);
          }}
        />
      ),
    },
  ]);

  /**
   * Function submit form modal
   * @param {object} values values of form
   */
  const onFinish = (values) => {
    const items = data.map((item) => ({
      id: item?.id,
      feeId: item.feeId,
      refundDetailId: item?.id,
      configRefund: [
        {
          configRefundId: item?.configRefund?.find((k) => k?.type === 'STORE')?.id,
          refundForm: item?.STORE,
          type: 'STORE',
        },
        {
          configRefundId: item?.configRefund?.find((k) => k?.type === 'LEAVE')?.id,
          refundForm: item?.LEAVE,
          type: 'LEAVE',
        },
      ],
      startDate: moment(item?.rangeDate[0]).format(variables.DATE_FORMAT.DATE_AFTER),
      endDate: moment(item?.rangeDate[1]).format(variables.DATE_FORMAT.DATE_AFTER),
    }));
    const payload = {
      id: params?.id,
      schoolYearId: values?.currencyOldStudentAddId,
      createRefundDetailRows: items.filter((item) => !item.id),
      updateRefundDetailRows: items.filter((item) => item.id),
      deleteRefundDetailRows: remove,
    };
    dispatch({
      type: params?.id ? 'feePolicyConfigurationAdd/UPDATE' : 'feePolicyConfigurationAdd/ADD',
      payload,
      callback: (response, error) => {
        if (response) {
          history.goBack();
        }
        if (error) {
          if (get(error, 'data.status') === 400 && !isEmpty(error?.data?.errors)) {
            error.data.errors.forEach((item) => {
              formRef.current.setFields([
                {
                  name: get(item, 'source.pointer'),
                  errors: [get(item, 'detail')],
                },
              ]);
            });
          }
        }
      },
    });
  };

  return (
    <Form layout="vertical" colon={false} ref={formRef} onFinish={onFinish}>
      <Breadcrumbs
        className="pb0"
        last={params?.id ? 'Chi tiết' : 'Thêm mới'}
        menu={menuLeftFeePolicy}
      />
      <Pane style={{ padding: 20, paddingBottom: 0 }}>
        <Loading loading={loading['feePolicyConfigurationAdd/GET_DETAILS']}>
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
                  onChange={(e) => onChangeYear(e, 'currencyOldStudentAddId')}
                  allowClear={false}
                  data={yearsSchool.map((item) => ({
                    ...item,
                    name: `${item?.yearFrom} - ${item?.yearTo}`,
                  }))}
                  rules={[variables.RULES.EMPTY]}
                />
              </div>
              <div className="col-lg-3">
                <label htmlFor="" className="mb5 font-size-13">
                  Thời gian hiệu lực
                </label>
                <p className="mb0 font-size-13 mt10 font-weight-bold">
                  {' '}
                  {details?.startDate ? `${details?.startDate} - ${details?.endDate}` : ''}
                </p>
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
                    <TableCus
                      rowKey={(record) => record.id}
                      className="table-edit"
                      columns={columns}
                      dataSource={data}
                      bordered
                      pagination={false}
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
                                rangeDate: [
                                  moment(rangeDate?.startDate),
                                  moment(rangeDate?.endDate),
                                ],
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
                  loading={loading['feePolicyConfigurationAdd/ADD']}
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
