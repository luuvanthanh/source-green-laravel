import { memo, useRef, useState, useEffect } from 'react';
import { Form, Input } from 'antd';
import { isEmpty, get, head, } from 'lodash';
import { connect, withRouter } from 'umi';
import PropTypes from 'prop-types';
import TableCus from '@/components/CommonComponent/Table';
import classnames from 'classnames';
import styles from '@/assets/styles/Common/common.scss';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import { variables } from '@/utils/variables';
import { v4 as uuidv4 } from 'uuid';
import FormItem from '@/components/CommonComponent/FormItem';
import stylesModule from '../../styles.module.scss';

const mapStateToProps = ({ loading, crmSaleAdmissionAdd }) => ({
  loading,
  data: crmSaleAdmissionAdd.data,
  details: crmSaleAdmissionAdd.details,
  error: crmSaleAdmissionAdd.error,
  branches: crmSaleAdmissionAdd.branches,
  classes: crmSaleAdmissionAdd.classes,
  city: crmSaleAdmissionAdd.city,
  district: crmSaleAdmissionAdd.district,
  medical: crmSaleAdmissionAdd.medical,
  categoryMedical: crmSaleAdmissionAdd.categoryMedical,
  medicalCheck: crmSaleAdmissionAdd.medicalCheck,
});
const General = memo(
  ({ dispatch, loading: { effects }, match: { params }, medical, categoryMedical, medicalCheck }) => {
    const formRef = useRef();
    const mounted = useRef(false);
    const [dataTable, setDataTable] = useState([]);
    const [form1, setForm1] = useState([]);
    const [newForm, setNewForm] = useState(false);
    const loadingSubmit =
      effects[`crmSaleAdmissionAdd/ADD`] ||
      effects[`crmSaleAdmissionAdd/UPDATE`] ||
      effects[`crmSaleAdmissionAdd/UPDATE_STATUS`];
    /**
     * Function submit form modal
     * @param {object} values values of form
     */

    useEffect(() => {
      dispatch({
        type: 'crmSaleAdmissionAdd/GET_CATEGORY_MEDICAL',
        payload: {},
        callback: (response) => {
          if (response) {
            formRef.current.setFieldsValue({
              data: response.parsePayload,
            });
          }
        },
      });
    }, []);

    useEffect(() => {
      dispatch({
        type: 'crmSaleAdmissionAdd/GET_MEDICAL',
        payload: { admission_register_id: params.id },

        callback: (response) => {
          if (response) {
            setNewForm(true);
            setDataTable(response?.parsePayload[0]?.childHeathDevelop || []);
            formRef.current.setFieldsValue({
              data: response.parsePayload[0].medicalDeclareInfo,
            });
            setForm1(response.parsePayload[0].medicalDeclareInfo);
          }
        },
      });
    }, []);

    useEffect(() => {
      if (params.id) {
        formRef.current.setFieldsValue({
          ...medicalCheck,
          ...head(medicalCheck.positionLevel),
        });
      }
    }, [medicalCheck]);

    const onFinish = (values) => {
      const items = values.data.map((item) => ({
        config_medical_declare_id: item?.config_medical_declare_id || item?.id,
        reason: item?.reason || "",
        is_checked: item?.is_checked,
      }));
      dispatch({
        type: 'crmSaleAdmissionAdd/ADD_MEDICAL',
        payload: {
          admission_register_id: params.id,
          height: values.height,
          note: values.note,
          weight: values.weight, medical_declare: items, child_heath: dataTable,
        },
        callback: (response, error) => {

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
    useEffect(() => {
      mounted.current = true;
      return mounted.current;
    }, []);

    const onChangeSick = (e, record) => {
      setDataTable((prev) =>
        prev.map((item) => (
          item.test === record.test && item.id === record.id ? { ...item, sick: e.target.value } : { ...item }
        ),
        ));
    };

    const onChangeYear = (e, record) => {
      setDataTable((prev) =>
        prev.map((item) => (
          item.test === record.test && item.id === record.id ? { ...item, year: e.target.value } : { ...item }
        ),
        ));
    };

    const onChangeHospitalTime = (e, record) => {
      setDataTable((prev) =>
        prev.map((item) => (
          item.test === record.test && item.id === record.id ? { ...item, hospital_time: e.target.value } : { ...item }
        ),
        ));
    };
    const onChangeStatus = (e, record) => {
      setDataTable((prev) =>
        prev.map((item) => (
          item.test === record.test && item.id === record.id ? { ...item, status: e.target.value } : { ...item }
        ),
        ));
    };

    const newMedical = () => {

      dispatch({
        type: 'crmSaleAdmissionAdd/GET_CATEGORY_MEDICAL',
        payload: {},
        callback: (response) => {
          if (response) {
            setNewForm(false);
            formRef.current.setFieldsValue({
              data: response?.parsePayload,
            });
          }
        },
      });

    };

    const columns = [
      {
        title: 'Bệnh đã mắc phải nằm viện',
        dataIndex: 'sick',
        key: 'sick',
        width: 200,
        className: classnames('min-width-200', 'max-width-200'),
        render: (value, record) => (
          <Input.TextArea
            value={record.sick}
            autoSize={{ minRows: 1, maxRows: 1 }}
            placeholder="Nhập"
            onChange={(e) => onChangeSick(e, record)}
          />
        ),
      },
      {
        title: 'Năm',
        dataIndex: 'year',
        key: 'year',
        width: 80,
        className: classnames('min-width-200', 'max-width-200'),
        render: (value, record) => (
          <Input.TextArea
            value={record.year}
            autoSize={{ minRows: 1, maxRows: 1 }}
            placeholder="Nhập"
            onChange={(e) => onChangeYear(e, record)}
          />
        ),
      },
      {
        title: 'Thời gian nằm viện',
        dataIndex: 'hospital_time',
        key: 'hospital_time',
        width: 200,
        className: classnames('min-width-200', 'max-width-200'),
        render: (value, record) => (
          <Input.TextArea
            value={record.hospital_time}
            autoSize={{ minRows: 1, maxRows: 1 }}
            placeholder="Nhập"
            onChange={(e) => onChangeHospitalTime(e, record)}
          />
        ),
      },
      {
        title: 'Tình trạng sau khi xuất viện',
        key: 'status',
        width: 200,
        dataIndex: 'status',
        render: (value, record) => (
          <Input.TextArea
            value={record.status}
            autoSize={{ minRows: 1, maxRows: 1 }}
            placeholder="Nhập"
            onChange={(e) => onChangeStatus(e, record)}
          />
        ),
      },
      {
        key: 'action',
        className: 'min-width-80',
        width: 80,
        fixed: 'right',
        render: (record) => (
          <div className={styles['list-button']}>
            <button
              onClick={() => {
                setDataTable(dataTable.filter((val) => (val.key || val.id) !== (record.key || record.id)));
              }}
              type="button"
              className={styles['button-circle']}
            >
              <span className="icon-remove" />
            </button>
          </div>
        ),
      },
    ];

    return (
      <Form layout="vertical" ref={formRef} onFinish={onFinish} >
        {/* <Pane className="card"> */}
        {/* <Loading loading={loading} isError={error.isError} params={{ error }}> */}
        <Pane className="card">
          <Heading type="form-title" className="pl20 pt20">
            Thông tin y tế
          </Heading>
          <Heading type="form-block-title" className="pl20 pt10"  >
            Thông tin học sinh
          </Heading>
          <Pane className="row pl20 pr20 pb20 pt10" >
            <Pane className="col-lg-4">
              <FormItem
                name="weight"
                label="Cân nặng (kg)"
                type={variables.INPUT}
                rules={[variables.RULES.EMPTY]}
              />
            </Pane>
            <Pane className="col-lg-4">
              <FormItem
                name="height"
                label="Chiều cao (cm)"
                type={variables.INPUT}
                rules={[variables.RULES.EMPTY]}
              />
            </Pane>
          </Pane>
          <Pane className="border-top pt20 d-flex justify-content-between align-items-center">
            <Heading type="form-block-title" className="ml20">
              Thông tin khai báo y tế
            </Heading>
            <Button color="success" onClick={() => newMedical()} className="ml-2 mr20" >
              Cập nhập câu hỏi y tế
            </Button>
          </Pane>
          {
            medical.length && newForm ?
              <Form.List name="data">
                {(fields,) => (
                  <>
                    {fields.map((field, index) => {
                      const itemData = categoryMedical?.find((item, indexWater) => indexWater === index);
                      const file = form1.find((item) => item.config_medical_declare_id === itemData?.id);
                      return (
                        <>
                          <Pane className="offset-lg-12 col-lg-12 pt20 pl20 pr20 border-bottom" key={field?.key}>
                            <Pane className={stylesModule['wrapper-radio']}>
                              <h3 className={stylesModule.title}>{index + 1}. {file?.configMedicalDeclare?.name}</h3>
                              <Pane >
                                {file?.configMedicalDeclare?.use_yes_or_no ?
                                  <FormItem
                                    className="title-black w-100 d-flex"
                                    name={[field.name, 'is_checked']}
                                    fieldKey={[field.fieldKey, 'is_checked']}
                                    type={variables.RADIO}
                                    width={10}
                                    rules={[variables.RULES.EMPTY]}
                                    data={[
                                      { value: true, label: 'Có' },
                                      { value: false, label: 'Không' },
                                    ]}
                                  />
                                  : ""}
                              </Pane>
                            </Pane>
                            {
                              file?.configMedicalDeclare?.use_input ?
                                <Pane className="col-lg-12 p0">
                                  <FormItem
                                    label="Lý do"
                                    name={[field.name, 'reason']}
                                    fieldKey={[field.fieldKey, 'reason']}
                                    type={variables.INPUT}
                                    rules={[variables.RULES.EMPTY]}
                                  />
                                </Pane>
                                : ""
                            }

                          </Pane>
                        </>
                      );
                    })}

                  </>

                )}
              </Form.List> :
              <Form.List name="data">
                {(fields,) => (
                  <>
                    {fields.map((field, index) => {
                      let file = {};
                      const { data } = formRef.current.getFieldsValue();
                      const itemData = data?.find((item, indexWater) => indexWater === index);
                      file = categoryMedical.find((item) => item.id === itemData?.id);

                      return (
                        <>
                          <Pane className="offset-lg-12 col-lg-12 pt20 pl20 pr20 pb10 border-bottom" key={field.key}>
                            <Pane className={stylesModule['wrapper-radio']}>
                              <h3 className={stylesModule.title}>{index + 1}. {file?.name}</h3>
                              <Pane >
                                {file?.use_yes_or_no ?
                                  <FormItem
                                    className="title-black w-100 d-flex"
                                    name={[field.name, 'is_checked']}
                                    fieldKey={[field.fieldKey, 'is_checked']}
                                    type={variables.RADIO}
                                    rules={[variables.RULES.EMPTY]}
                                    data={[
                                      { value: true, label: 'Có' },
                                      { value: false, label: 'Không' },
                                    ]}
                                  /> : ""}
                              </Pane>
                              {file?.use_input ?
                                <Pane className="col-lg-12 p0">
                                  <FormItem
                                    label="Lý do"
                                    name={[field.name, 'reason']}
                                    fieldKey={[field.fieldKey, 'reason']}
                                    type={variables.INPUT}
                                    rules={[variables.RULES.EMPTY]}
                                  />
                                </Pane>
                                : ""
                              }
                            </Pane>
                          </Pane>
                        </>
                      );
                    })}

                  </>
                )}
              </Form.List>
          }
          <Pane className="col-lg-12 pt20 pl20 pr20">
            <h3 className={stylesModule['wrapper-title']}>8. Lưu ý khác (nếu có)</h3>
          </Pane>
          <Pane className="col-lg-12 pl20 pr20 border-bottom">
            <FormItem
              name="note"
              label="Nội dung"
              type={variables.INPUT}
            />
          </Pane>
          <Pane className=" border-bottom">
            <Pane className="p20">
              <Heading type="form-block-title" style={{ marginBottom: 12 }}>
                Diễn biến sức khỏe của trẻ
              </Heading>
              <div className={stylesModule['wrapper-table']}>
                <TableCus
                  rowKey={(record) => record.id}
                  className="table-edit"
                  columns={columns}
                  dataSource={dataTable}
                  isEmpty
                  pagination={false}
                  scroll={{ x: '100%' }}
                  footer={() => (
                    <Button
                      onClick={() =>
                        setDataTable([
                          ...dataTable,
                          {
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
              </div>
            </Pane>
          </Pane>
          <Pane className="d-flex justify-content-end p20">
            <Button color="primary" icon="export" className="ml-2">
              Xuất file khai báo y tế
            </Button>
            <Button color="success" htmlType="submit" loading={loadingSubmit} className="ml-2">
              Lưu
            </Button>
          </Pane>
        </Pane>
        {/* </Loading> */}
      </Form >
    );
  },
);

General.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  categoryMedical: PropTypes.arrayOf(PropTypes.any),
  medical: PropTypes.arrayOf(PropTypes.any),
  medicalCheck: PropTypes.objectOf(PropTypes.any),
};

General.defaultProps = {
  match: {},
  dispatch: () => { },
  loading: {},
  categoryMedical: [],
  medical: [],
  medicalCheck: {},
};

export default withRouter(connect(mapStateToProps)(General));
