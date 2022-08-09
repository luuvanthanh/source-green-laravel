import { memo, useRef, useEffect, useState } from 'react';
import { Form, Modal } from 'antd';
import { head, isEmpty, get } from 'lodash';
import moment from 'moment';
import { connect, withRouter } from 'umi';
import PropTypes from 'prop-types';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import styles from '@/assets/styles/Common/common.scss';
import Loading from '@/components/CommonComponent/Loading';
import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';
import { variables } from '@/utils/variables';
import FormItem from '@/components/CommonComponent/FormItem';
import { Helper } from '@/utils';
import stylesModule from '../../styles.module.scss';

const marginProps = { style: { marginBottom: 12 } };

const genders = [
  { id: 'LEAD_NEW', name: 'Lead mới' },
  { id: 'POTENTIAL', name: 'Có tiềm năng' },
  { id: 'NOT_POTENTIAL', name: 'Không tiềm năng' },
];

const mapStateToProps = ({ loading, crmSaleLeadAdd, user }) => ({
  loading,
  details: crmSaleLeadAdd.details,
  error: crmSaleLeadAdd.error,
  branches: crmSaleLeadAdd.branches,
  classes: crmSaleLeadAdd.classes,
  parentLead: crmSaleLeadAdd.parentLead,
  lead: crmSaleLeadAdd.lead,
  parentPotential: crmSaleLeadAdd.parentPotential,
  user: user.user,
});
const General = memo(
  ({ dispatch, loading: { effects }, match: { params }, details, error, parentLead, lead, parentPotential, user }) => {
    const [formRef] = Form.useForm();
    const [formPotential] = Form.useForm();

    const mounted = useRef(false);
    const [visible, setVisible] = useState(false);
    const [checkStatus, setCheckStatus] = useState(false);
    const [checkStatusBtn, setCheckStatusBtn] = useState(false);
    const [checkSelect, setCheckSelect] = useState(true);
    const [checkPost, setCheckPost] = useState(true);

    const checkLead = lead.filter(i => i?.status === 'POTENTIAL');

    const mountedSet = (setFunction, value) =>
      !!mounted?.current && setFunction && setFunction(value);
    const loadingSubmit =
      effects[`crmSaleLeadAdd/ADD`] ||
      effects[`crmSaleLeadAdd/UPDATE`] ||
      effects[`crmSaleLeadAdd/UPDATE_STATUS`];
    const loading = effects[`crmSaleLeadAdd/GET_DETAILS`];


    const loadingSubmitPotential =
      effects[`crmSaleLeadAdd/ADD_POTENTIAL`];

    useEffect(() => {
      dispatch({
        type: 'crmSaleLeadAdd/GET_STATUS_LEAD',
        payload: {
          customer_lead_id: params.id,
        },
      });
      dispatch({
        type: 'crmSaleLeadAdd/GET_PARENT_LEAD',
        payload: {},
      });
    }, [params.id]);


    useEffect(() => {
      dispatch({
        type: 'crmSaleLeadAdd/GET_DETAILS',
        payload: params,
      });
    }, []);

    const showModal = () => {
      mountedSet(setVisible, true);
      dispatch({
        type: 'crmSaleLeadAdd/GET_PARENT_POTENTIAL',
        payload: {},
      });
    };

    const handleOk = () => {
      mountedSet(setVisible, true);
    };

    const cancelModal = () => {
      mountedSet(setVisible, false);
    };

    /**
     * Function submit form modal
     * @param {object} values values of form
     */
    const onPotential = () => {
      formPotential.validateFields().then((values) => {
        dispatch({
          type: "crmSaleLeadAdd/ADD_POTENTIAL",
          payload: { statusPotential: values.statusPotential, id: params.id },
          callback: (response, error) => {
            if (response) {
              setCheckSelect(true);
              setCheckStatusBtn(true);
              setCheckStatus(false);
              mountedSet(setVisible, false);
            }
            if (error) {
              if (get(error, 'data.status') === 400 && !isEmpty(error?.data?.errors)) {
                error.data.errors.forEach((item) => {
                  formRef.setFields([
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
      });
    };

    const onFinish = (values) => {
      if (values?.status_parent_lead_id) {
        dispatch({
          type: 'crmSaleLeadAdd/ADD_STATUS_LEAD',
          payload: {
            status_parent_lead_id: values?.status_parent_lead_id,
            customer_lead_id: params.id,
          },
          callback: () => {
          },
        });
      }
      if(checkPost){
        dispatch({
          type: 'crmSaleLeadAdd/ADD_STATUS',
          payload: {
            status: values?.status,
            customer_lead_id: params.id,
            user_update_id: user?.id,
            user_update_info: user,
          },
          callback: (response, error) => {
            if (response) {
              dispatch({
                type: 'crmSaleLeadAdd/GET_STATUS_LEAD',
                payload: {
                  customer_lead_id: params.id,
                },
              });
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
        }
    };


    useEffect(() => {
      mounted.current = true;
      return mounted.current;
    }, []);

    useEffect(() => {
      if (details) {
        formPotential.setFieldsValue({
          ...details,
          ...head(details.positionLevel),
          birth_date: details.birth_date && moment(details.birth_date),
          created_at: details.created_at && moment(details.created_at),
        });
      }
    }, [details]);

    useEffect(() => {
      if (details?.statusCare?.length - 1 || (details?.statusLead?.length - 1)) {
        formRef?.setFieldsValue({
          status_parent_lead_id: details?.statusCare[(details?.statusCare?.length - 1)]?.status_parent_lead_id,
          status: details?.statusLead[(details?.statusLead?.length - 1)]?.status,
        });
        if (details?.statusLead[(details?.statusLead?.length - 1)]?.status === 'POTENTIAL' && checkLead.length <= 0) {
          setCheckStatus(true);
          setCheckStatusBtn(true);
          setCheckSelect(true);
        } 
        if (details?.statusLead[(details?.statusLead?.length - 1)]?.status === 'POTENTIAL') {
          setCheckSelect(true);
          setCheckStatus(false);
          setCheckStatusBtn(true);
          setCheckPost(false);
        }else {
          setCheckStatus(false);
          setCheckStatusBtn(true);
          setCheckSelect(false);
        }
      }
    }, [details]);

    const onStatus = (id) => {
      if (id === "POTENTIAL" && checkLead.length <= 0) {
        setCheckStatus(true);
        setCheckStatusBtn(false);
        setCheckSelect(true);
      } else {
        setCheckSelect(false);
        setCheckStatusBtn(true);
        setCheckStatus(false);
      }
    };

    /**
       * Function header table
       */
    const headerPopup = () => {
      const columns = [
        {
          title: 'STT',
          key: 'index',
          lassName: 'min-width-100',
          width: 80,
          render: (text, record, index) => <Text size="normal">{index + 1}</Text>,
        },
        {
          title: 'Họ và tên',
          key: 'name',
          width: 150,
          lassName: 'min-width-100',
          render: (record) => <Text size="normal">{record?.full_name}</Text>,
        },
        {
          title: 'Ngày sinh',
          key: 'birthDay',
          width: 150,
          lassName: 'min-width-100',
          render: (record) => Helper.getDate(record.birth_date, variables.DATE_FORMAT.DATE)
        },
        {
          title: 'Tuổi (tháng)',
          key: 'age',
          width: 150,
          lassName: 'min-width-100',
          render: (record) => <Text size="normal">{record?.age_month}</Text>,
        },
        {
          title: 'Giới tính',
          key: 'sex',
          width: 100,
          lassName: 'min-width-100',
          render: (record) => <Text size="normal">
            {record?.sex === 'MALE' ? "Nam" : ""}
            {record?.sex === 'FEMALE' ? "Nữ" : ""}
            {record?.sex === 'OTHER' ? "Khác" : ""}
          </Text>,
        },
        {
          title: 'Mối quan hệ',
          key: 'categoryRelationship',
          width: 150,
          lassName: 'min-width-100',
          render: (record) => <Text size="normal">{get(record, 'categoryRelationship.name')}</Text>,
        },
      ];
      return columns;
    };

    const header = () => {
      const columns = [
        {
          title: 'Ngày cập nhật',
          key: 'day',
          className: 'max-width-200',
          width: 200,
          render: (record) =>
            Helper.getDate(get(record, 'updated_at'), variables.DATE_FORMAT.DATE_TIME),
        },
        {
          title: 'Tên tình trạng chăm sóc',
          key: 'statusParent',
          className: 'min-width-150',
          render: (record) => <Text size="normal">
            {record?.status === 'LEAD_NEW' ? 'Lead mới' : ""}
            {record?.status === 'POTENTIAL' ? 'Có tiềm năng' : ""}
            {record?.status === 'NOT_POTENTIAL' ? 'Không tiềm năng' : ""}
          </Text>,
        },
        {
          title: 'Người cập nhật',
          key: 'name',
          className: 'max-width-150',
          width: 150,
          render: (record) => <Text size="normal">{record?.user_update_info?.name}</Text>,
        },
      ];
      return columns;
    };
    return (
      <>
        <Form layout="vertical" form={formRef} onFinish={onFinish}>
          <div className="card">
          <Loading loading={effects[`crmSaleLeadAdd/GET_DETAILS`]} >
            <div style={{ padding: 20 }} className="pb-0 border-bottom">
              <Heading type="form-title" style={{ marginBottom: 20 }}>
                Tình trạng chăm sóc phụ huynh lead
              </Heading>
              <Pane className="row mt20">
                <Pane className="col-lg-12">
                  <span className={styles['assignment-title']}>Tình trạng phân loại PH lead</span>
                </Pane>
                <Pane className="col-lg-4 mt10">
                  <FormItem
                    options={['id', 'name']}
                    name="status_parent_lead_id"
                    data={parentLead}
                    placeholder="Chọn"
                    type={variables.SELECT}
                  />
                </Pane>
                <Pane className="col-lg-12">
                  <span className={styles['assignment-title']}>Tình trạng phụ huynh lead</span>
                </Pane>
                <Pane className="col-lg-4 mt10">
                  {
                    checkSelect ?
                      <FormItem
                        options={['id', 'name']}
                        name="status"
                        data={genders}
                        placeholder="Chọn"
                        onChange={onStatus}
                        type={variables.SELECT}
                        rules={[variables.RULES.EMPTY_INPUT]}
                        disabled
                      /> :
                      <FormItem
                        options={['id', 'name']}
                        name="status"
                        data={genders}
                        placeholder="Chọn"
                        onChange={onStatus}
                        type={variables.SELECT}
                        rules={[variables.RULES.EMPTY_INPUT]}
                      />
                  }
                </Pane>
                {
                  checkStatus && checkLead.length <= 0 ?
                    <Pane className={styles[('order-assignment-btn', 'col-lg-3')]}>
                      <Button color="success" ghost icon="next" onClick={showModal} className="mt10">
                        Tạo tiềm năng
                      </Button>
                    </Pane> :
                    <Pane className={styles[('order-assignment-btn', 'col-lg-3')]}>
                      <Button color="success" icon="next" disabled className="mt10">
                        Tạo tiềm năng
                      </Button>
                    </Pane>
                }
                <Modal
                  visible={visible}
                  title="Tạo tiềm năng"
                  onOk={handleOk}
                  centered
                  className={stylesModule['wrapper-modal-check']}
                  width={700}
                  onCancel={cancelModal}
                  footer={
                    <>
                      <p
                        role="presentation"
                        key="cancel"
                        color="white"
                        icon="fe-x"
                        onClick={cancelModal}
                        loading={loadingSubmit}
                        className={stylesModule['button-cancel']}
                      >
                        Hủy
                      </p>
                      <Button
                        key="choose"
                        color="success"
                        icon="fe-save"
                        loading={loadingSubmitPotential}
                        onClick={onPotential}
                      >
                        Tạo
                      </Button>
                    </>
                  }
                >

                  <Form layout="vertical" form={formPotential}>
                    <Pane className="card">
                      <Loading loading={loading} isError={error.isError} params={{ error }}>
                        <Pane style={{ padding: 20 }} className="pb-0">
                          <Pane className="row" {...marginProps}>
                            <Pane className="col-lg-6">
                              <FormItem
                                name="full_name"
                                label="Họ và tên"
                                type={variables.INPUT}
                                disabled
                              />
                            </Pane>
                            <Pane className="col-lg-6">
                              <FormItem
                                name="phone"
                                label="Số điện thoại"
                                type={variables.INPUT}
                                disabled
                              />
                            </Pane>
                            <Pane className="col-lg-6">
                              <FormItem
                                name="address"
                                label="Địa chỉ"
                                type={variables.INPUT}
                                disabled
                              />
                            </Pane>
                            <Pane className="col-lg-6">
                              <FormItem
                                name="created_at"
                                label="Ngày tạo"
                                type={variables.DATE_PICKER}
                                disabledDate={(current) => current > moment()}
                                disabled
                              />
                            </Pane>
                            <Pane className="col-lg-12">
                              <Heading type="form-title" style={{ marginBottom: 20 }}>
                                Thông tin học sinh
                              </Heading>
                            </Pane>
                            <Pane className="col-lg-12 pb20">
                              <div className={stylesModule['wrapper-table']}>
                                <Table
                                  columns={headerPopup()}
                                  dataSource={details?.studentInfo}
                                  pagination={false}
                                  className="table-normal"
                                  isEmpty
                                  params={{
                                    header: header(),
                                    type: 'table',
                                  }}
                                  bordered
                                  rowKey={(record) => record.id}
                                  scroll={{ x: '100%' }}
                                />
                              </div>
                            </Pane>
                            <Pane className="col-lg-6">
                              <FormItem
                                options={['id', 'name']}
                                name="statusPotential"
                                data={parentPotential}
                                placeholder="Chọn"
                                type={variables.SELECT}
                                label="Tình trạng tiềm năng"
                                rules={[variables.RULES.EMPTY_INPUT]}
                              />
                            </Pane>
                          </Pane>
                        </Pane>
                      </Loading>
                    </Pane>
                  </Form>


                </Modal>

              </Pane>
              {
                checkStatusBtn && !checkStatus ?
                  <div className={stylesModule['wrapper-btn']}>
                    <Button
                      color="success"
                      size="normal"
                      htmlType="submit"
                      loading={loadingSubmit}
                    >
                      Lưu
                    </Button>
                  </div> :
                  <div className={stylesModule['wrapper-btn']}>
                    <Button
                      color="success"
                      size="normal"
                      htmlType="submit"
                      loading={loadingSubmit}
                      disabled
                    >
                      Lưu
                    </Button>
                  </div>
              }
            </div>
            </Loading>
          </div>
          <div className="card">
            <div style={{ padding: 20 }} className="pb-0 border-bottom">
              <Heading type="form-title" style={{ marginBottom: 20 }}>
                Lịch sử cập nhập tình trạng
              </Heading>
              <div className="row">
                <Pane className="col-lg-12">
                  <div className={stylesModule['wrapper-table']}>
                    <Table
                      columns={header()}
                      dataSource={lead}
                      pagination={false}
                      loading={effects[`crmSaleLeadAdd/GET_STATUS_LEAD`]}
                      className="table-normal"
                      isEmpty
                      params={{
                        header: header(),
                        type: 'table',
                      }}
                      bordered={false}
                      rowKey={(record) => record.id}
                      scroll={{ x: '100%' }}
                    />
                  </div>
                </Pane>
              </div>
            </div>
          </div>
        </Form>
      </>
    );
  },
);

General.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  branches: PropTypes.arrayOf(PropTypes.any),
  classes: PropTypes.arrayOf(PropTypes.any),
  parentLead: PropTypes.arrayOf(PropTypes.any),
  lead: PropTypes.arrayOf(PropTypes.any),
  parentPotential: PropTypes.arrayOf(PropTypes.any),
  user: PropTypes.arrayOf(PropTypes.any),
};

General.defaultProps = {
  match: {},
  details: {},
  dispatch: () => { },
  loading: {},
  error: {},
  branches: [],
  classes: [],
  parentLead: [],
  lead: [],
  parentPotential: [],
  user: [],
};

export default withRouter(connect(mapStateToProps)(General));
