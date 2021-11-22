import { memo, useRef, useState, useEffect } from 'react';
import { Form } from 'antd';
import { head, isEmpty, get } from 'lodash';
import moment from 'moment';
import { connect, withRouter } from 'umi';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import Loading from '@/components/CommonComponent/Loading';
import { variables } from '@/utils/variables';
import { DeleteOutlined } from '@ant-design/icons';
import FormItem from '@/components/CommonComponent/FormItem';
import { Helper } from '@/utils';
import stylesModule from './styles.module.scss';

const mapStateToProps = ({ loading, crmWebForm }) => ({
  loading,
  details: crmWebForm.details,
  error: crmWebForm.error,
  branches: crmWebForm.branches,
  district: crmWebForm.district,
  program: crmWebForm.program,
});
const General = memo(
  ({
    dispatch,
    location: { pathname },
    loading: { effects },
    match: { params },
    details,
    error,
    district,
    branches,
    program,
  }) => {
    const formRef = useRef();
    const mounted = useRef(false);
    const [done, setDone] = useState(false);
    const loadingSubmit =
      effects[`crmWebForm/ADD`] ||
      effects[`crmWebForm/UPDATE`] ||
      effects[`crmWebForm/UPDATE_STATUS`];
    const loading = effects[`crmWebForm/GET_DETAILS`];
    useEffect(() => {
      dispatch({
        type: 'crmWebForm/GET_PROGRAMS',
        payload: params,
      });
      dispatch({
        type: 'crmWebForm/GET_CITIES',
        payload: {},
      });
      dispatch({
        type: 'crmWebForm/GET_BRANCHES',
        payload: {},
      });
      dispatch({
        type: 'crmWebForm/GET_BRANCHES',
        payload: {},
      });
      dispatch({
        type: 'crmWebForm/GET_DISTRICTS',
        payload: { city_id: 'e30bfd9c-0668-4860-b065-455cae47d328' },
      });
    }, [params.id]);

    /**
     * Function submit form modal
     * @param {object} values values of form
     */
    const onFinish = () => {
      formRef.current.validateFields().then((values) => {
        const items = {
          ...values,
          marketing_program_id: params.id,
          web_form_childrens: values.web_form_childrens.map((item) => ({
            full_name: item.full_name,
            birth_date: Helper.getDateTime({
              value: Helper.setDate({
                ...variables.setDateData,
                originValue: item.birth_date,
              }),
              format: variables.DATE_FORMAT.DATE_AFTER,
              isUTC: false,
            }),
          })),
          url: pathname,
        };
        const payload = {
          ...items,
        };
        dispatch({
          type: 'crmWebForm/ADD',
          payload,
          callback: (response, error) => {
            if (response) {
              setDone(true);
            }
            if (error) {
              setDone(false);
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
      });
    };

    useEffect(() => {
      mounted.current = true;
      return mounted.current;
    }, []);

    useEffect(() => {
      if (!isEmpty(details) && params.id) {
        formRef.current.setFieldsValue({
          ...details,
          ...head(details.positionLevel),
          startDate:
            head(details.positionLevel)?.startDate &&
            moment(head(details.positionLevel)?.startDate),
          birth_date: details.birth_date && moment(details.birth_date),
          dateOfIssueIdCard: details.dateOfIssueIdCard && moment(details.dateOfIssueIdCard),
          dateOff: details.dateOff && moment(details.dateOff),
        });
      }
    }, [details]);

    return (
      <div className={stylesModule['wrapper-container']}>
        <div className={stylesModule['wrapper-logo']}>
          <img className={stylesModule.img} src="/images/webForm.png" alt="bmi" />
        </div>
        {done ? (
          <Form
            layout="vertical"
            ref={formRef}
            onFinish={onFinish}
            initialValues={{
              data: [
                {
                  ...params,
                  birth_date: params.birth_date && moment(params.birth_date),
                },
              ],
            }}
          >
            <Pane className={classnames(stylesModule['container-main'], 'col-lg-6 offset-lg-3')}>
              <Pane className="card">
                <Pane className={stylesModule['wrapper-title']}>
                  <h3 className={stylesModule.title}>{program.name}</h3>
                  <h3 className={stylesModule.description}>
                    Chào Ba Mẹ, cảm ơn Ba Mẹ đã dành ít phút để điền thông tin, bộ phận Chuyên Môn
                    của Clover sẽ liên hệ và tư vấn cho Ba Mẹ sớm nhất nhé! Trân trọng!
                  </h3>
                </Pane>
              </Pane>
            </Pane>
          </Form>
        ) : (
          <Form
            layout="vertical"
            ref={formRef}
            onFinish={onFinish}
            initialValues={{
              web_form_childrens: [
                {
                  ...params,
                  birth_date: params.birth_date && moment(params.birth_date),
                },
              ],
            }}
          >
            <Pane className={classnames(stylesModule['container-main'], 'col-lg-6 offset-lg-3')}>
              <Pane className="card">
                <Loading loading={loading} isError={error.isError} params={{ error }}>
                  <Pane className={stylesModule['wrapper-title']}>
                    <h3 className={stylesModule.title}>{program.name}</h3>
                    <h3 className={stylesModule.description}>
                      Chào Ba Mẹ, Ba Mẹ vui lòng dành ít phút để điền thông tin sau đây, để bộ phận
                      Chuyên Môn của Clover có thể liên hệ và tư vấn cho Ba Mẹ sớm nhất nhé! Trân
                      trọng!
                    </h3>
                  </Pane>
                  <Pane className={stylesModule['wrapper-main']}>
                    <h3 className={stylesModule.title}>THÔNG TIN CHUNG</h3>
                    <Pane className={classnames(stylesModule.form, 'row')}>
                      <Pane className="col-lg-6">
                        <FormItem
                          name="full_name"
                          label="Họ và tên Ba/Mẹ"
                          type={variables.INPUT}
                          rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                        />
                      </Pane>
                      <Pane className="col-lg-6">
                        <FormItem
                          name="phone"
                          label="Số điện thoại của Ba/Mẹ"
                          type={variables.INPUT}
                          rules={[variables.RULES.EMPTY, variables.RULES.PHONE]}
                        />
                      </Pane>
                      <Pane className="col-lg-6">
                        <FormItem name="email" label="Email của Ba/Mẹ" type={variables.INPUT} />
                      </Pane>
                      <Pane className="col-lg-6">
                        <FormItem
                          options={['id', 'name']}
                          name="branch_id"
                          data={branches}
                          placeholder="Chọn"
                          type={variables.SELECT}
                          label="Cơ sở Ba/Mẹ quan tâm"
                        />
                      </Pane>
                      <Pane className="col-lg-6">
                        <FormItem
                          options={['id', 'name']}
                          name="district_id"
                          data={district}
                          placeholder="Chọn"
                          type={variables.SELECT}
                          label="Quận của trẻ đang sống"
                        />
                      </Pane>
                    </Pane>
                  </Pane>
                  <Pane>
                    <Pane>
                      <Pane className={stylesModule['wrapper-students']}>
                        <Form.List name="web_form_childrens">
                          {(fields, { add, remove }) => (
                            <>
                              {fields.map((field, index) => (
                                <Pane key={field.key} className={stylesModule.main}>
                                  <Heading type="form-title" className={stylesModule.title}>
                                    THÔNG TIN TRẺ
                                  </Heading>
                                  <div className="d-flex justify-content-between">
                                    <Heading
                                      type="form-block-title"
                                      className={stylesModule.description}
                                    >
                                      Trẻ {index + 1}
                                    </Heading>
                                    <DeleteOutlined
                                      onClick={() => {
                                        remove(index);
                                      }}
                                      className={stylesModule.delete}
                                    />
                                  </div>
                                  <Pane className="row">
                                    <Pane className="col-lg-6">
                                      <FormItem
                                        label="Họ và tên trẻ 1"
                                        name={[field.name, 'full_name']}
                                        fieldKey={[field.fieldKey, 'full_name']}
                                        type={variables.INPUT}
                                        rules={[
                                          variables.RULES.EMPTY_INPUT,
                                          variables.RULES.MAX_LENGTH_INPUT,
                                        ]}
                                      />
                                    </Pane>
                                    <Pane className="col-lg-6">
                                      <FormItem
                                        name={[field.name, 'birth_date']}
                                        label="Sinh nhật trẻ (ngày/tháng/năm)"
                                        fieldKey={[field.fieldKey, 'birth_date']}
                                        type={variables.DATE_PICKER}
                                        rules={[variables.RULES.EMPTY]}
                                        disabledDate={(current) => current > moment()}
                                      />
                                    </Pane>
                                  </Pane>
                                </Pane>
                              ))}
                              <Pane className={stylesModule.btn}>
                                <Button
                                  color="success"
                                  ghost
                                  icon="plus"
                                  onClick={() => {
                                    add();
                                  }}
                                >
                                  Thêm trẻ
                                </Button>
                              </Pane>
                            </>
                          )}
                        </Form.List>
                      </Pane>
                    </Pane>
                    <Pane className={stylesModule['wrapper-button']}>
                      <Button
                        className={stylesModule.btn}
                        color="success"
                        htmlType="submit"
                        size="large"
                        loading={loadingSubmit || loading}
                      >
                        GỬI ĐĂNG KÝ
                      </Button>
                    </Pane>
                  </Pane>
                </Loading>
              </Pane>
            </Pane>
          </Form>
        )}
        <div className={stylesModule['wrapper-footer']}>
          {' '}
          Copyright 2021 © ❤️ Clover Montessori{' '}
        </div>
      </div>
    );
  },
);

General.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  district: PropTypes.arrayOf(PropTypes.any),
  branches: PropTypes.arrayOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
  program: PropTypes.objectOf(PropTypes.any),
};

General.defaultProps = {
  match: {},
  details: {},
  dispatch: () => {},
  loading: {},
  error: {},
  district: [],
  branches: [],
  location: {},
  program: {},
};

export default withRouter(connect(mapStateToProps)(General));
