import { memo, useRef, useEffect, useState } from 'react';
import { Form } from 'antd';
import { head, isEmpty, get } from 'lodash';
import moment from 'moment';
import { connect, history, withRouter } from 'umi';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import ImageUpload from '@/components/CommonComponent/ImageUpload';
import Loading from '@/components/CommonComponent/Loading';
import { variables } from '@/utils/variables';
import FormItem from '@/components/CommonComponent/FormItem';

const genders = [
  { id: 'MALE', name: 'Nam' },
  { id: 'FEMALE', name: 'Nữ' },
];
const mapStateToProps = ({ loading, OPchildrenAdd }) => ({
  loading,
  details: OPchildrenAdd.details,
  error: OPchildrenAdd.error,
});
const General = memo(({ dispatch, loading: { effects }, match: { params }, details, error }) => {
  const formRef = useRef();
  const [fileImage, setFileImage] = useState(null);
  const [dayOfBirth, setDayOfBirth] = useState(null);
  const mounted = useRef(false);
  const mountedSet = (setFunction, value) =>
    !!mounted?.current && setFunction && setFunction(value);

  const loadingSubmit = effects[`OPchildrenAdd/ADD`] || effects[`OPchildrenAdd/UPDATE`];
  const loading = effects[`OPchildrenAdd/GET_DETAILS`];

  const onChaneDate = (e) => {
    mountedSet(setDayOfBirth, e);
  };

  /**
   * Function submit form modal
   * @param {object} values values of form
   */
  const onFinish = (values) => {
    const age = moment().endOf('month').diff(moment(values.dayOfBirth).startOf('month'), 'month');
    dispatch({
      type: params.id ? 'OPchildrenAdd/UPDATE' : 'OPchildrenAdd/ADD',
      payload: params.id
        ? {
            id: params.id,
            student: {
              ...details,
              ...values,
              id: params.id,
              fileImage,
              age,
            },
          }
        : {
            student: {
              ...values,
              fileImage,
              age,
            },
          },
      callback: (response, error) => {
        if (response) {
          history.goBack();
        }
        if (error) {
          if (error?.validationErrors && !isEmpty(error?.validationErrors)) {
            error?.validationErrors.forEach((item) => {
              formRef.current.setFields([
                {
                  name: head(item.members),
                  errors: [item.message],
                },
              ]);
            });
          }
        }
      },
    });
  };

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'OPchildrenAdd/GET_DETAILS',
        payload: params,
      });
    }
  }, [params.id]);

  useEffect(() => {
    mounted.current = true;
    return () => (mounted.current = false);
  }, []);

  useEffect(() => {
    if (!isEmpty(details) && params.id) {
      formRef.current.setFieldsValue({
        ...details.student,
        dayOfBirth: details?.student?.dayOfBirth && moment(details?.student?.dayOfBirth),
        registerDate: details?.student?.registerDate && moment(details?.student?.registerDate),
      });
      mountedSet(setDayOfBirth(moment(details?.student?.dayOfBirth)));
      mountedSet(setFileImage, details?.student?.fileImage);
    }
  }, [details]);

  return (
    <Form layout="vertical" ref={formRef} onFinish={onFinish}>
      <Loading loading={loading} isError={error.isError} params={{ error }}>
        <Pane className="card">
          <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
            <Heading type="form-title" style={{ marginBottom: 20 }}>
              Thông tin cơ bản
            </Heading>
            <Pane className="row">
              <Pane className="col">
                <Form.Item name="avatar" label="Hình ảnh học sinh">
                  <ImageUpload
                    callback={(res) => {
                      mountedSet(setFileImage, res.fileInfo.url);
                    }}
                  />
                </Form.Item>
              </Pane>
            </Pane>

            <Pane className="row">
              <Pane className="col-lg-4">
                <FormItem
                  name="fullName"
                  label="Họ và tên"
                  type={variables.INPUT}
                  rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem
                  name="code"
                  label="Mã học sinh"
                  type={variables.INPUT}
                  rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem
                  name="registerDate"
                  label="Ngày nhập học"
                  type={variables.DATE_PICKER}
                  rules={[variables.RULES.EMPTY]}
                />
              </Pane>

              <Pane className="col-lg-4">
                <FormItem
                  name="dayOfBirth"
                  label="Ngày sinh"
                  type={variables.DATE_PICKER}
                  rules={[variables.RULES.EMPTY]}
                  onChange={onChaneDate}
                />
              </Pane>
              <Pane className="col-lg-4">
                <Form.Item label="Tuổi(tháng)">
                  {dayOfBirth &&
                    moment().endOf('month').diff(moment(dayOfBirth).startOf('month'), 'month')}
                </Form.Item>
              </Pane>
              <Pane className="col-lg-4">
                <FormItem
                  data={genders}
                  name="sex"
                  label="Giới tính"
                  type={variables.SELECT}
                  rules={[variables.RULES.EMPTY]}
                />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem data={[]} name="classId" label="Mã lớp" type={variables.SELECT} />
              </Pane>

              <Pane className="col-lg-4">
                <FormItem data={[]} name="premisesId" label="Mã cơ sở" type={variables.SELECT} />
              </Pane>
              <Pane className="col-lg-4">
                <FormItem data={[]} name="yearId" label="Mã năm" type={variables.SELECT} />
              </Pane>
            </Pane>

            <Heading type="form-block-title" style={{ marginBottom: 12 }}>
              Địa chỉ
            </Heading>

            <Pane className="row">
              <Pane className="col-lg-12">
                <FormItem name="address" label="Địa chỉ hiện tại" type={variables.INPUT} />
              </Pane>
            </Pane>
          </Pane>

          <Pane style={{ padding: 20 }}>
            <Button
              color="success"
              size="large"
              htmlType="submit"
              style={{ marginLeft: 'auto' }}
              loading={loadingSubmit}
            >
              Lưu
            </Button>
          </Pane>
        </Pane>
      </Loading>
    </Form>
  );
});

export default withRouter(connect(mapStateToProps)(General));
