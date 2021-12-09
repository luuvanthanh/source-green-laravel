import { memo, useRef, useEffect } from 'react';
import { Form } from 'antd';
import { head, isEmpty, get } from 'lodash';
import moment from 'moment';
import { connect, withRouter } from 'umi';
import PropTypes from 'prop-types';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import { variables } from '@/utils/variables';
import FormItem from '@/components/CommonComponent/FormItem';

const mapStateToProps = ({ loading, crmSaleAdmissionAdd }) => ({
  loading,
  details: crmSaleAdmissionAdd.details,
  error: crmSaleAdmissionAdd.error,
  branches: crmSaleAdmissionAdd.branches,
  classes: crmSaleAdmissionAdd.classes,
  students: crmSaleAdmissionAdd.students,
});
const General = memo(
  ({ dispatch, loading: { effects }, match: { params }, details, }) => {
    const formRef = useRef();
    const mounted = useRef(false);
    // const [ramdom, setRamdom] = useState(0);
    const loadingSubmit =
      effects[`crmSaleAdmissionAdd/UPDATE_STUDENTS`];
    const loading = effects[`crmSaleAdmissionAdd/GET_DETAILS`];
    useEffect(() => {
      if(params.id){
      dispatch({
        type: 'crmSaleAdmissionAdd/GET_DETAILS',
        payload: params,
      });
    }
    }, [params.id]);

    /**
     * Function submit form modal
     * @param {object} values values of form
     */
    const onFinish = (values) => {
      dispatch({
        type: 'crmSaleAdmissionAdd/UPDATE_STUDENTS',
        payload: { ...details, ...values, id: params.id },
        callback: (response, error) => {
          // if (response) {
          //   setRamdom(Math.random());
          // }
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

    useEffect(() => {
      if (!isEmpty(details) && params.id) {
        formRef.current.setFieldsValue({
          ...details,
          ...head(details.positionLevel),

          startDate:
            head(details.positionLevel)?.startDate &&
            moment(head(details.positionLevel)?.startDate),
          date_register: details.date_register && moment(details.date_register),
        });
      }
    }, [details]);

    return (
      <Form layout="vertical" ref={formRef} onFinish={onFinish}>
        <Pane className="card">
            <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
              <Heading type="form-title" style={{ marginBottom: 20 }}>
              Thông tin đăng ký
              </Heading>
              <Pane className="row">
                <Pane className="col-lg-4">
                  <FormItem
                    name="date_register"
                    label="Thời gian đăng ký nhập học"
                    type={variables.DATE_PICKER}
                    rules={[variables.RULES.EMPTY]}
                  />
                </Pane>
                <Pane className="col-lg-12">
                  <FormItem
                    name="parent_wish"
                    placeholder="Nhập"
                    label="Mong muốn của phụ huynh"
                    type={variables.TEXTAREA}
                  // rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                  />
                </Pane>
                <Pane className="col-lg-12">
                  <FormItem
                    name="children_note"
                    placeholder="Nhập"
                    label="Lưu ý trẻ"
                    type={variables.TEXTAREA}
                  // rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                  />
                </Pane>
              </Pane>
            </Pane>
            <Pane className="d-flex" style={{ marginLeft: 'auto', padding: 20 }}>
              <Button color="success" size="large" htmlType="submit" loading={loadingSubmit || loading}>
                Lưu
              </Button>
            </Pane>
        </Pane>
      </Form>
    );
  },
);

General.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
};

General.defaultProps = {
  match: {},
  details: {},
  dispatch: () => { },
  loading: {},
};

export default withRouter(connect(mapStateToProps)(General));
