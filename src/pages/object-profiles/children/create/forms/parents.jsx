import { memo, useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { Form, Radio } from 'antd';
import { head, isEmpty, omit } from 'lodash';
import PropTypes from 'prop-types';
import { connect, history, withRouter } from 'umi';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import ImageUpload from '@/components/CommonComponent/ImageUpload';
import Loading from '@/components/CommonComponent/Loading';
import FormItem from '@/components/CommonComponent/FormItem';

import { Helper, variables } from '@/utils';

const { Group: RadioGroup } = Radio;

const infomationTypes = {
  create: 'CREATE',
  select: 'SELECT',
};

const genders = [
  { id: 'MALE', name: 'Nam' },
  { id: 'FEMALE', name: 'Nữ' },
];

const mapStateToProps = ({ loading, OPchildrenAdd }) => ({
  loading,
  details: OPchildrenAdd.details,
  error: OPchildrenAdd.error,
  parents: OPchildrenAdd.parents,
});
const Parents = memo(
  ({ dispatch, loading: { effects }, match: { params }, details, error, parents }) => {
    const formRef = useRef();
    const loading = effects[`OPchildrenAdd/GET_DETAILS`] || effects[`OPchildrenAdd/GET_EMPLOYEES`];
    const loadingSubmit = effects[`OPchildrenAdd/ADD`] || effects[`OPchildrenAdd/UPDATE`];
    const mounted = useRef(false);
    const [fileImage, setFileImage] = useState({
      farther: null,
      mother: null,
    });

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

    useEffect(() => {
      formRef.current.setFieldsValue({
        farther: {
          sex: 'MALE',
        },
        mother: {
          sex: 'FEMALE',
        },
      });
    }, []);

    const detailForm = (key, sex) => {
      switch (formType[key]) {
        case infomationTypes.create:
          return (
            <>
              <Pane className="row">
                <Pane className="col-lg-4">
                  <Form.Item name={[key, 'avatar']} label="Hình ảnh">
                    <ImageUpload
                      callback={(res) => {
                        mountedSet(setFileImage, {
                          ...fileImage,
                          [`${key}`]: res.fileInfo.url,
                        });
                      }}
                      fileImage={fileImage[`${key}`]}
                    />
                  </Form.Item>
                </Pane>
              </Pane>

              <Pane className="row">
                <Pane className="col-lg-4">
                  <FormItem
                    name={[key, 'fullName']}
                    label="Họ và tên"
                    type={variables.INPUT}
                    rules={[variables.RULES.MAX_LENGTH_INPUT]}
                  />
                </Pane>
                <Pane className="col-lg-4">
                  <FormItem
                    name={[key, 'dayOfBirth']}
                    label="Ngày sinh"
                    type={variables.DATE_PICKER}
                  />
                </Pane>
                <Pane className="col-lg-4">
                  <FormItem
                    options={['id', 'name']}
                    name={[key, 'sex']}
                    data={genders}
                    placeholder="Chọn"
                    type={variables.SELECT}
                    label="Giới tính"
                    disabled
                  />
                </Pane>
                <Pane className="col-lg-4">
                  <FormItem
                    name={[key, 'jobTile']}
                    label="Nghề nghiệp"
                    type={variables.INPUT}
                    rules={[variables.RULES.MAX_LENGTH_255]}
                  />
                </Pane>
                <Pane className="col-lg-4">
                  <FormItem
                    name={[key, 'phone']}
                    label="Số điện thoại"
                    type={variables.INPUT}
                    rules={[variables.RULES.PHONE]}
                  />
                </Pane>

                <Pane className="col-lg-4">
                  <FormItem
                    name={[key, 'email']}
                    label="Email"
                    type={variables.INPUT}
                    rules={[variables.RULES.EMAIL]}
                  />
                </Pane>
                <Pane className="col-lg-4">
                  <FormItem
                    name={[key, 'faceBook']}
                    label="Link facebook"
                    type={variables.INPUT}
                    rules={[variables.RULES.MAX_LENGTH_255]}
                  />
                </Pane>

                <Pane className="col-lg-8">
                  <FormItem
                    name={[key, 'hobby']}
                    label="Tính cách và sở thích"
                    type={variables.INPUT}
                    rules={[variables.RULES.MAX_LENGTH_255]}
                  />
                </Pane>

                <Pane className="col-lg-4">
                  <FormItem
                    name={[key, 'bank']}
                    label="Ngân hàng"
                    type={variables.INPUT}
                    rules={[variables.RULES.MAX_LENGTH_255]}
                  />
                </Pane>

                <Pane className="col-lg-4">
                  <FormItem
                    name={[key, 'bankNumber']}
                    label="Số tài khoản"
                    type={variables.INPUT}
                    rules={[variables.RULES.MAX_LENGTH_255]}
                  />
                </Pane>

                <Pane className="col-lg-4">
                  <FormItem
                    name={[key, 'ownerBank']}
                    label="Người hưởng thụ"
                    type={variables.INPUT}
                    rules={[variables.RULES.MAX_LENGTH_255]}
                  />
                </Pane>
              </Pane>
            </>
          );
        case infomationTypes.select:
          return (
            <>
              <Pane className="row">
                <Pane className="col-lg-6">
                  <FormItem
                    data={Helper.convertSelectParent(parents)?.filter(i => i?.sex === sex)}
                    name={`${key}Id`}
                    label="Tên phụ huynh"
                    type={variables.SELECT}
                    rules={[variables.RULES.EMPTY]}
                  />
                </Pane>
                {details[`${key}Id`] && (
                  <Pane className="col-lg-4">
                    <Form.Item label={<span />}>
                      <Button
                        color="success"
                        onClick={() =>
                          history.push(`/ho-so-doi-tuong/phu-huynh/${details[`${key}Id`]}/chi-tiet`)
                        }
                      >
                        Chi tiết
                      </Button>
                    </Form.Item>
                  </Pane>
                )}
              </Pane>
            </>
          );
        default:
          return null;
      }
    };

    const onFinish = (values) => {
      const payload = {
        ...details,
        ...values,
        farther: {
          ...details.farther,
          ...values.farther,
          fileImage: fileImage.farther,
        },
        mother: {
          ...details.mother,
          ...values.mother,
          fileImage: fileImage.mother,
        },
        id: params.id,
      };
      dispatch({
        type: 'OPchildrenAdd/UPDATE',
        payload: {
          ...omit(
            payload,
            !values?.farther?.fullName ? 'farther' : '',
            !values?.mother?.fullName ? 'mother' : '',
          ),
        },
        callback: (response, error) => {
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
      return mounted.current;
    }, []);

    useEffect(() => {
      if (params.id) {
        dispatch({
          type: 'OPchildrenAdd/GET_DETAILS',
          payload: params,
        });
        dispatch({
          type: 'OPchildrenAdd/GET_PARENTS',
          payload: params,
        });
      }
    }, [params.id]);

    useEffect(() => {
      if (!isEmpty(details) && params.id) {
        formRef.current.setFieldsValue({
          fartherId: details.fartherId,
          motherId: details.motherId,
        });
        mountedSet(setFormType, {
          mother: details?.motherId ? infomationTypes.select : infomationTypes.create,
          farther: details?.fartherId ? infomationTypes.select : infomationTypes.create,
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
          <Loading
            loading={loading}
            isError={error.isError}
            params={{ error, goBack: '/ho-so-doi-tuong/hoc-sinh' }}
          >
            <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
              <Heading type="form-title" style={{ marginBottom: 20 }}>
                Phụ huynh
              </Heading>
              <Heading type="form-block-title" style={{ marginBottom: 12 }}>
                Thông tin cha
              </Heading>
              {!details?.farther && typeRadioGroup('farther')}
              {detailForm('farther', 'MALE')}
            </Pane>

            <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
              <Heading type="form-block-title" style={{ marginBottom: 12 }}>
                Thông tin mẹ
              </Heading>

              {!details?.mother && typeRadioGroup('mother')}
              {detailForm('mother', 'FEMALE')}
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
      </Form >
    );
  },
);

Parents.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  parents: PropTypes.arrayOf(PropTypes.any),
};

Parents.defaultProps = {
  match: {},
  details: {},
  dispatch: () => { },
  loading: {},
  error: {},
  parents: [],
};

export default withRouter(connect(mapStateToProps)(Parents));
