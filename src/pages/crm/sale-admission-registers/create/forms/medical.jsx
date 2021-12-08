import { memo, useRef, useState, useEffect } from 'react';
import { Form, Radio, Input } from 'antd';
import { isEmpty, get } from 'lodash';
import { connect, history, withRouter } from 'umi';
import PropTypes from 'prop-types';
import TableCus from '@/components/CommonComponent/Table';
import classnames from 'classnames';
import styles from '@/assets/styles/Common/common.scss';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import Loading from '@/components/CommonComponent/Loading';
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
  ({ dispatch, loading: { effects }, match: { params }, details, error, sliderRows, medical, categoryMedical, medicalCheck }) => {
    const formRef = useRef();
    const mounted = useRef(false);
    const [data, setData] = useState(sliderRows);
    const loadingSubmit =
      effects[`crmSaleAdmissionAdd/ADD`] ||
      effects[`crmSaleAdmissionAdd/UPDATE`] ||
      effects[`crmSaleAdmissionAdd/UPDATE_STATUS`];
    const loading = effects[`crmSaleAdmissionAdd/GET_MEDICAL`] || effects[`crmSaleAdmissionAdd/GET_CATEGORY_MEDICAL`];
    /**
     * Function submit form modal
     * @param {object} values values of form
     */
    useEffect(() => {
      if (!isEmpty(sliderRows)) {
        setData(sliderRows);
      }
    }, [sliderRows]);


    useEffect(() => {
      dispatch({
        type: 'crmSaleAdmissionAdd/GET_MEDICAL',
        payload: { admission_register_id: params.id },
        
        callback: (response) => {
          if (response) {
            formRef.current.setFieldsValue({
              data: response.parsePayload.map((item) =>
               [item.medicalDeclareInfo],
              ),
            });
            console.log(response);
            console.log("data", response.parsePayload.map((item) =>
            item.medicalDeclareInfo
           ),)
          }
        },
      });
    }, [params.id]);

    useEffect(() => {
      dispatch({
        type: 'crmSaleAdmissionAdd/GET_CATEGORY_MEDICAL',
        payload: {},
        callback: (response) => {
          if (response) {
            formRef.current.setFieldsValue({
              data: response.parsePayload,
            });
            console.log("response", response)
          }
        },
      });
    }, []);


    const onFinish = (values) => {
      const items = values.data.map((item, index) => ({
        config_medical_declare_id: item.id,
        reason : null,
        is_checked: item.is_checked,
      }));
      dispatch({
        type: 'crmSaleAdmissionAdd/ADD_MEDICAL',
        payload: { admission_register_id: params.id,
            height: values.height, note: values.note, 
            weight: values.weight,medical_declare: items,child_heath: data, },
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
    console.log("medical", medical);
    console.log("categoryMedical", categoryMedical);
    console.log("medicalCheck",medicalCheck);
    useEffect(() => {
      mounted.current = true;
      return mounted.current;
    }, []);

    const onChangeSick = (e, record) => {
      setData((prev) =>
        prev.map((item) => (
          item.test === record.test && item.id === record.id ? { ...item, sick: e.target.value } : { ...item }
        ),
        ));
    };

    const onChangeYear = (e, record) => {
      setData((prev) =>
        prev.map((item) => (
          item.test === record.test && item.id === record.id ? { ...item, year: e.target.value } : { ...item }
        ),
        ));
    };

    const onChangeHospitalTime = (e, record) => {
      setData((prev) =>
        prev.map((item) => (
          item.test === record.test && item.id === record.id ? { ...item, hospital_time: e.target.value } : { ...item }
        ),
        ));
    };
    const onChangeStatus = (e, record) => {
      setData((prev) =>
        prev.map((item) => (
          item.test === record.test && item.id === record.id ? { ...item, status: e.target.value } : { ...item }
        ),
        ));
    };

    const columns = [
      {
        title: 'Bệnh đã mắc phải nằm viện',
        dataIndex: 'sick',
        key: 'sick',
        width: 250,
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
        width: 100,
        className: classnames('min-width-200', 'max-width-200'),
        render: (value, record) => (
          <Input.TextArea
             value={value.year}
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
            value={value.hospital_time}
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
             value={value.status}
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
                setData(data.filter((val) => (val.key || val.id) !== (record.key || record.id)));
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
          <Pane className="row p20" >
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
          <Heading type="form-block-title" className="ml20">
            Thông tin khai báo y tế
          </Heading>
          
          {
            medicalCheck ? 
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
                      <Pane className="offset-lg-12 col-lg-12 pt20 p20" key={field.key}>
                        <Pane className={stylesModule['wrapper-radio']}>
                          <h3 className={stylesModule.title}>{index + 1}. {file?.name}</h3>
                          <Pane >
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
                            />
                          </Pane>
                        </Pane>

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
                    <Pane className="offset-lg-12 col-lg-12 pt20 p20" key={field.key}>
                      <Pane className={stylesModule['wrapper-radio']}>
                        <h3 className={stylesModule.title}>{index + 1}. {file?.name}</h3>
                        <Pane >
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
                          />
                        </Pane>
                      </Pane>

                    </Pane>
                  </>
                );
              })}

            </>
          )}
        </Form.List> 
          }
          
          <Pane className="col-lg-12">
            <FormItem
              name="note"
              label="Nội dung"
              type={variables.INPUT}
              rules={[variables.RULES.EMPTY]}
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
                  dataSource={medical}
                  isEmpty
                  pagination={false}
                  scroll={{ x: '100%' }}
                  footer={() => (
                    <Button
                      onClick={() =>
                        setData([
                          ...data,
                          {
                            id: uuidv4(),
                            title: undefined,
                            content: undefined,
                            file_image: undefined,
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
        </Pane>
        <Pane className="d-flex" style={{ marginLeft: 'auto', padding: 20 }}>

          <Button color="success" htmlType="submit" loading={loadingSubmit} className="ml-2">
            Lưu
          </Button>
        </Pane>
        {/* </Loading> */}
      </Form >
    );
  },
);

General.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  data: PropTypes.arrayOf(PropTypes.any),
  sliderRows: PropTypes.arrayOf(PropTypes.any),
  categoryMedical:PropTypes.arrayOf(PropTypes.any),
  medical: PropTypes.arrayOf(PropTypes.any),
  medicalCheck : PropTypes.objectOf(PropTypes.any),
};

General.defaultProps = {
  match: {},
  details: {},
  dispatch: () => { },
  loading: {},
  error: {},
  data: [],
  sliderRows: [],
  categoryMedical: [],
  medical: [],
  medicalCheck : {},
};

export default withRouter(connect(mapStateToProps)(General));
