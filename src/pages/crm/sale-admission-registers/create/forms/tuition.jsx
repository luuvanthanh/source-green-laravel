import { memo, useRef, useEffect } from 'react';
import { Form, Table } from 'antd';
import { connect, withRouter } from 'umi';
import moment from 'moment';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { useDispatch } from 'dva';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import { Helper, variables } from '@/utils';
import stylesModule from '../../styles.module.scss';

const mapStateToProps = ({ loading, crmSaleAdmissionAdd }) => ({
  loading,
  details: crmSaleAdmissionAdd.details,
});
const General = memo(
  ({ loading: { effects }, details, match: { params } }) => {
    const formRef = useRef();
    const dispatch = useDispatch();
    const mounted = useRef(false);
    const loadingSubmit = "";
    const loading = effects[``];

    useEffect(() => {
      mounted.current = true;
      return mounted.current;
    }, []);


    useEffect(() => {
      if (details.id) {
        formRef.current.setFieldsValue({
          birth_date: get(details, 'studentByChargeNow?.birth_date') && moment(get(details, 'studentByChargeNow?.birth_date')),
        });
      }
    }, [details.id]);

    useEffect(() => {
      if (params.id) {
        dispatch({
          type: 'crmSaleAdmissionAdd/GET_DETAILS',
          payload: params,
        });
      }
    }, [params.id]);


    const header = () => {
      const columns = [
        {
          title: 'Loại phí',
          key: 'fee',
          className: 'min-width-150',
          width: 150,
          render: (record) => <Text size="normal">{record?.fee?.name}</Text>,
        },
        {
          title: 'Hình thức',
          key: 'paymentForm',
          className: 'min-width-250',
          width: 250,
          render: (record) => <Text size="normal">{record?.paymentForm?.name}</Text>,
        },
        {
          title: 'Tiền dự kiến (đ)',
          key: 'money',
          className: 'min-width-150',
          width: 150,
          render: (record) => <Text size="normal">{Helper.getPrice(record?.money)}</Text>,
        },
        {
          title: 'Tiền giảm (đ)',
          key: 'moneyDown',
          className: 'min-width-150',
          width: 150,
          render: () => <Text size="normal">{Helper.getPrice('0')}</Text>,
        },
        {
          title: 'Tiền đóng (đ)',
          key: 'name',
          className: 'min-width-150',
          width: 150,
          render: (record) => <Text size="normal">{Helper.getPrice(record?.money)}</Text>,
        },
      ];
      return columns;
    };
    return (
      <>
        {
          details?.studentByChargeNow?.chargeStudent.length > 0 ?
            <Form layout="vertical" ref={formRef} >
              {/* <Loading loading={loading} isError={error.isError} params={{ error }}> */}
              <Pane className="card">
                <Pane className="border-bottom">
                  <Pane className="p20">
                    <Heading type="form-title" style={{ marginBottom: 20 }}>
                      Thông tin học phí
                    </Heading>
                    <Pane className="row">
                      <div className="col-lg-4">
                        <div className="ant-col ant-form-item-label">
                          <label className="ant-form-item-required">Tên học sinh</label>
                        </div>
                        <Text size="normal" className={stylesModule['general-detail']}>
                          {details?.studentByChargeNow?.full_name}
                        </Text>
                      </div>
                      <div className="col-lg-4">
                        <div className="ant-col ant-form-item-label">
                          <label className="ant-form-item-required">Năm học</label>
                        </div>
                        <Text size="normal" className={stylesModule['general-detail']}>
                          {get(details, 'studentByChargeNow.chargeStudent[0].schoolYear.year_from')} - {get(details, 'studentByChargeNow.chargeStudent[0].schoolYear.year_to')}
                        </Text>
                      </div>
                      <div className="col-lg-4">
                        <div className="ant-col ant-form-item-label">
                          <label className="ant-form-item-required">Ngày sinh</label>
                        </div>
                        <Text size="normal" className={stylesModule['general-detail']}>
                          {Helper.getDate(details?.studentByChargeNow?.birth_date, variables.DATE_FORMAT.DATE)}
                        </Text>
                      </div>
                      <div className="col-lg-4">
                        <div className="ant-col ant-form-item-label">
                          <label className="ant-form-item-required">Tuổi (Tháng)</label>
                        </div>
                        <Text size="normal" className={stylesModule['general-detail']}>
                          {details?.studentByChargeNow?.age_month}
                        </Text>
                      </div>
                      <div className="col-lg-4">
                        <div className="ant-col ant-form-item-label">
                          <label className="ant-form-item-required">Ngày nhập học</label>
                        </div>
                        <Text size="normal" className={stylesModule['general-detail']}>
                          {Helper.getDate(details?.studentByChargeNow?.chargeStudent[0]?.day_admission, variables.DATE_FORMAT.DATE)}
                        </Text>
                      </div>
                      <div className="col-lg-4">
                        <div className="ant-col ant-form-item-label">
                          <label className="ant-form-item-required">Lớp học dự kiến</label>
                        </div>
                        <Text size="normal" className={stylesModule['general-detail']}>
                          {details?.studentByChargeNow?.chargeStudent[0]?.classType?.name}
                        </Text>
                      </div>
                      <div className="col-lg-4">
                        <div className="ant-col ant-form-item-label">
                          <label className="ant-form-item-required">Trạng thái</label>
                        </div>
                        <Text size="normal" className={stylesModule['general-detail']}>
                          {details?.studentByChargeNow?.chargeStudent[0]?.status}
                        </Text>
                      </div>
                    </Pane>
                    <Heading type="form-block-title" style={{ marginBottom: 12 }}>
                      Chi tiết loại phí
                    </Heading>
                    <div className={stylesModule['wrapper-table']}>
                      <Table
                        columns={header()}
                        dataSource={details?.studentByChargeNow?.chargeStudent[0]?.tuition}
                        pagination={false}
                        loading={loading}
                        className="table-edit"
                        isEmpty
                        params={{
                          header: header(),
                          type: 'table',
                        }}
                        bordered
                        rowKey={(record) => record.id}
                        scroll={{ x: '100%' }}
                        summary={(pageData) => {
                          let totalBorrow = '0';
                          let totalShipping = '0';
                          pageData.forEach(({ money, moneyDown }) => {
                            totalBorrow += money;
                            totalShipping += moneyDown;
                          });
                          return (
                            <>
                              <Table.Summary.Row>
                                <Table.Summary.Cell colSpan={2}>
                                  <Text size="normal" style={{ fontWeight: 'bold' }}>
                                    Tổng tiền
                                  </Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell>
                                  <Text size="normal" style={{ fontWeight: 'bold' }}>
                                    {Helper.getPrice(totalBorrow)}
                                  </Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell>
                                  <Text size="normal" style={{ fontWeight: 'bold' }}>
                                    {Helper.getPrice(totalShipping)}
                                  </Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell>
                                  <Text size="normal" style={{ fontWeight: 'bold' }}>
                                    {Helper.getPrice(totalBorrow + totalShipping)}
                                  </Text>
                                </Table.Summary.Cell>
                              </Table.Summary.Row>
                            </>
                          );
                        }}
                      />
                    </div>
                  </Pane>
                </Pane>
                <Pane className="d-flex" style={{ marginLeft: 'auto', padding: 20 }}>
                  <Button color="primary" icon="export" className="ml-2">
                    Xuất biểu phí
                  </Button>
                  <Button color="success" htmlType="submit" loading={loadingSubmit} className="ml-2">
                    Thanh toán
                  </Button>
                </Pane>
              </Pane>
              {/* </Loading> */}
            </Form> :
            <Form layout="vertical" ref={formRef}>
              {/* <Loading loading={loading} isError={error.isError} params={{ error }}> */}
              <Pane className="card" style={{ height: '300px' }}>
                <Pane >
                  <Pane className="p20">
                    <Heading type="form-title" style={{ marginBottom: 20 }}>
                      Thông tin học phí
                    </Heading>
                    <p className={stylesModule['title-Information']}>Chưa có thông tin học phí</p>
                  </Pane>
                </Pane>
              </Pane>
              {/* </Loading> */}
            </Form>
        }
      </>
    );
  },
);

General.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  // error: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
};

General.defaultProps = {
  loading: {},
  details: {},
  match: {},
  // error: {},
};

export default withRouter(connect(mapStateToProps)(General));
