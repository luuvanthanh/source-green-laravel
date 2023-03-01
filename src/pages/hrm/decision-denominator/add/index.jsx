import { memo, useRef, useEffect } from 'react';
import { Form, DatePicker } from 'antd';
import { useParams, useHistory } from 'umi';
import { useSelector, useDispatch } from 'dva';
import { head, isEmpty, get, last } from 'lodash';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import { variables } from '@/utils/variables';
import FormItem from '@/components/CommonComponent/FormItem';
import styles from '@/assets/styles/Common/common.scss';
import { Helper } from '@/utils';
import moment from 'moment';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import stylesModule from '../styles.module.scss';
import variablesModules from '../utils/variables';


const General = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [{ menuLeftHRM }, effects] = useSelector(({ menu, HRMDecisionDenominatorAdd, loading: { effects } }) => [menu, HRMDecisionDenominatorAdd, effects]);
  const mounted = useRef(false);
  const loadingSubmit = effects['HRMDecisionDenominatorAdd/ADD'] || effects['HRMDecisionDenominatorAdd/UPDATE'];


  const params = useParams();

  const history = useHistory();

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      data: [""]
    });
  }, []);

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'HRMDecisionDenominatorAdd/GET_DETAILS',
        payload: params,
        callback: (response) => {
          if (response) {
            form.setFieldsValue({
              ...response?.parsePayload,
              selectDate: response?.parsePayload?.startDate &&
                response?.parsePayload?.endDate && [
                  moment(response?.parsePayload?.startDate),
                  moment(response?.parsePayload?.endDate),
                ],
            });
          }
        },
      });
    }
  }, [params.id]);

  const onFinish = (values) => {
    const payload = {
      startDate:
        head(values.selectDate) &&
        Helper.getDate(head(values.selectDate), variables.DATE_FORMAT.DATE_AFTER),
      endDate:
        last(values.selectDate) &&
        Helper.getDate(last(values.selectDate), variables.DATE_FORMAT.DATE_AFTER),
      selectDate: undefined,
      type: values?.type,
      numberForm: values?.numberForm,
      ordinalNumber: values?.ordinalNumber,
    };

    dispatch({
      type: params.id ? 'HRMDecisionDenominatorAdd/UPDATE' : 'HRMDecisionDenominatorAdd/ADD',
      payload: params.id ? { id: params?.id, ...payload } : payload,
      callback: (response, error) => {
        if (response) {
          history.goBack();
        }
        if (error) {
          if (get(error, 'data.status') === 400 && !isEmpty(error?.data?.errors)) {
            error.data.errors.forEach((item) => {
              form.setFields([
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
    <>
      <Breadcrumbs last={params.id ? 'Chỉnh sửa ' : 'Tạo mới'} menu={menuLeftHRM} />
      <Pane className="col-lg-6 offset-lg-3">
        <Pane className="p20">
          <Form
            layout="vertical"
            form={form}
            initialValues={{}}
            onFinish={onFinish}
          >
            <Pane>
              <Pane className="card">
                <Pane className="p20">
                  <Heading type="form-title" className="mb20">
                    Thông tin thêm mới
                  </Heading>
                  <Pane className="row mt20">
                    <Pane className="col-lg-6">
                      <FormItem label="Loại quyết định" name="type" data={variablesModules?.DATA_TYPE} type={variables.SELECT} rules={[variables.RULES.EMPTY_INPUT]} />
                    </Pane>
                    <Pane className="col-lg-6">
                      <FormItem label="Mẫu số quyết định" name="numberForm" type={variables.INPUT} rules={[variables.RULES.EMPTY_INPUT]} />
                    </Pane>
                    <Pane className="col-lg-6">
                      <div className={stylesModule['lable-item']} >
                        <FormItem
                          label="Số hiện tại"
                          name="ordinalNumber"
                          type={variables.INPUT}
                          rules={[variables.RULES.EMPTY,
                          variables.RULES.ONLY_TEXT_NUMBER,
                          variables.RULES.MAX_ONLY_TEXT_NUMBER,
                          variables.RULES.MIN_ONLY_TEXT_NUMBER]} />
                        <p>Cú pháp: XXX với X là ký tự số</p>
                      </div>
                    </Pane>
                    <Pane className="col-lg-6">
                      <div className={styles['form-item']}>
                        <label htmlFor="userId" className={stylesModule['wrapper-lable']} >Ngày hiệu lực</label>
                        <Form.Item name="selectDate" style={{ marginBottom: 0 }} rules={[variables.RULES.EMPTY]}>
                          <DatePicker.RangePicker
                            format={[variables.DATE_FORMAT.DATE, variables.DATE_FORMAT.DATE]}
                          />
                        </Form.Item>
                      </div>
                    </Pane>
                  </Pane>
                  <Pane className="pt20 pb20 d-flex justify-content-between align-items-center border-top">
                    <p
                      className="btn-delete"
                      role="presentation"
                      loading={loadingSubmit}
                      onClick={() => history.goBack()}
                    >
                      Hủy
                    </p>
                    <Button
                      className="ml-auto px25"
                      color="success"
                      htmlType="submit"
                      size="large"
                      loading={loadingSubmit}
                    >
                      Lưu
                    </Button>
                  </Pane>
                </Pane>
              </Pane>
            </Pane>
          </Form>
        </Pane>
      </Pane>
    </>
  );
},
);

General.propTypes = {
};

General.defaultProps = {
};

export default General;
