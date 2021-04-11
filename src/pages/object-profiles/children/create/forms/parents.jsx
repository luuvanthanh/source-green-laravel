import { memo, useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { Form, Input, DatePicker, Radio } from 'antd';
import { head, isEmpty, get } from 'lodash';
import moment from 'moment';
import { connect, history, withRouter } from 'umi';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import Select from '@/components/CommonComponent/Select';
import ImageUpload from '@/components/CommonComponent/ImageUpload';
import Loading from '@/components/CommonComponent/Loading';
import FormItem from '@/components/CommonComponent/FormItem';

import { variables } from '@/utils/variables';

const { Group: RadioGroup } = Radio;

const infomationTypes = {
  create: 'CREATE',
  select: 'SELECT',
};

const mockParents = [{ id: 1, name: 'Nguyễn Văn Mai' }];

const mapStateToProps = ({ loading, OPchildrenAdd }) => ({
  loading,
  details: OPchildrenAdd.details,
  error: OPchildrenAdd.error,
  employees: OPchildrenAdd.employees,
});
const Parents = memo(({ dispatch, loading: { effects }, match: { params }, details, error }) => {
  const formRef = useRef();
  const loading = effects[`OPchildrenAdd/GET_DETAILS`] || effects[`OPchildrenAdd/GET_EMPLOYEES`];
  const loadingSubmit = effects[`OPchildrenAdd/ADD`] || effects[`OPchildrenAdd/UPDATE`];
  const mounted = useRef(false);
  const mountedSet = (action, value) => {
    if (mounted.current) {
      action(value);
    }
  };

  const [formType, setFormType] = useState({
    farther: infomationTypes.create,
    mother: infomationTypes.create,
  });

  const switchType = useCallback((key, value) => {
    setFormType((prevValue) => ({
      ...prevValue,
      [key]: value,
    }));
  });

  const typeRadioGroup = useMemo(
    () => (key) => (
      <Pane className="row">
        <Pane className="col">
          <Form.Item name={[key, 'type']}>
            <RadioGroup onChange={({ target: { value } }) => switchType(key, value)}>
              <Radio value={infomationTypes.create}>Tạo mới</Radio>
              <Radio value={infomationTypes.select}>Lấy từ danh sách phụ huynh</Radio>
            </RadioGroup>
          </Form.Item>
        </Pane>
      </Pane>
    ),
    [switchType],
  );

  const detailForm = useMemo(
    () => (key) => {
      switch (formType[key]) {
        case infomationTypes.create:
          return (
            <>
              <Pane className="row">
                <Pane className="col-lg-4">
                  <Form.Item name={[key, 'avatar']} label="Hình ảnh">
                    <ImageUpload />
                  </Form.Item>
                </Pane>
              </Pane>

              <Pane className="row">
                <Pane className="col-lg-4">
                  <Form.Item name={[key, 'fullName']} label="Họ và tên">
                    <Input placeholder="Nhập" />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-4">
                  <Form.Item name={[key, 'dayOfBirth']} label="Ngày sinh">
                    <DatePicker
                      placeholder="Chọn"
                      format={variables.DATE_FORMAT.DATE}
                      disabledDate={(current) => current > moment()}
                    />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-4">
                  <Form.Item name={[key, 'jobTile']} label="Nghề nghiệp">
                    <Input placeholder="Nhập" />
                  </Form.Item>
                </Pane>

                <Pane className="col-lg-4">
                  <Form.Item name={[key, 'position']} label="Chức vụ">
                    <Input placeholder="Nhập" />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-4">
                  <Form.Item name={[key, 'workplace']} label="Nơi làm việc">
                    <Input placeholder="Nhập" />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-4">
                  <Form.Item name={[key, 'phone']} label="Số điện thoại">
                    <Input placeholder="Nhập" />
                  </Form.Item>
                </Pane>

                <Pane className="col-lg-4">
                  <Form.Item name={[key, 'email']} label="Email">
                    <Input placeholder="Nhập" />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-4">
                  <Form.Item name={[key, 'faceBook']} label="Link facebook">
                    <Input placeholder="Nhập" />
                  </Form.Item>
                </Pane>

                <Pane className="col-lg-12">
                  <Form.Item name={[key, 'hobby']} label="Tính cách và sở thích">
                    <Input placeholder="Nhập" />
                  </Form.Item>
                </Pane>
              </Pane>
            </>
          );
        case infomationTypes.select:
          return (
            <>
              <Pane className="row">
                <Pane className="col-lg-4">
                  <Form.Item name={[key, 'id']} label="Tên phụ huynh">
                    <Select placeholder="Chọn" dataSet={mockParents} />
                  </Form.Item>
                </Pane>
              </Pane>
            </>
          );
        default:
          return null;
      }
    },
    [formType],
  );

  const onFinish = (values) => {
    dispatch({
      type: 'OPchildrenAdd/UPDATE',
      payload: {
        ...details,
        ...values,
        id: params.id,
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
    mounted.current = true;
    return () => (mounted.current = false);
  }, []);

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'OPchildrenAdd/GET_DETAILS',
        payload: params,
      });
      dispatch({
        type: 'OPchildrenAdd/GET_EMPLOYEES',
        payload: params,
      });
    }
  }, [params.id]);

  useEffect(() => {
    if (!isEmpty(details) && params.id) {
      formRef.current.setFieldsValue({
        mother: {
          ...(details.mother
            ? { ...details.mother, dayOfBirth: moment(details?.mother?.dayOfBirth) }
            : {}),
        },
        farther: {
          ...(details.farther
            ? { ...details.farther, dayOfBirth: moment(details?.farther?.dayOfBirth) }
            : {}),
        },
      });
    }
  }, [details]);

  return (
    <Form
      layout="vertical"
      ref={formRef}
      onFinish={onFinish}
      initialValues={{
        farther: {
          type: infomationTypes.create,
        },
        mother: {
          type: infomationTypes.create,
        },
      }}
    >
      <Pane className="card">
        <Loading loading={loading} isError={error.isError} params={{ error }}>
          <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
            <Heading type="form-title" style={{ marginBottom: 20 }}>
              Phụ huynh
            </Heading>
            <Heading type="form-block-title" style={{ marginBottom: 12 }}>
              Thông tin cha
            </Heading>

            {typeRadioGroup('farther')}
            {detailForm('farther')}
          </Pane>

          <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
            <Heading type="form-block-title" style={{ marginBottom: 12 }}>
              Thông tin mẹ
            </Heading>

            {typeRadioGroup('mother')}
            {detailForm('mother')}
          </Pane>

          <Pane style={{ padding: 20 }}>
            <Button
              color="success"
              style={{ marginLeft: 'auto' }}
              size="large"
              loading={loadingSubmit}
              htmlType="submit"
            >
              Lưu
            </Button>
          </Pane>
        </Loading>
      </Pane>
    </Form>
  );
});

export default withRouter(connect(mapStateToProps)(Parents));
