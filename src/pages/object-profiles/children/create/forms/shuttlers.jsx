import { memo, useRef, useState, useEffect } from 'react';
import { Form } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import csx from 'classnames';
import { connect, withRouter } from 'umi';
import { head, isEmpty } from 'lodash';
import PropTypes from 'prop-types';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import ImageUpload from '@/components/CommonComponent/ImageUpload';
import Loading from '@/components/CommonComponent/Loading';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils/variables';

const mapStateToProps = ({ loading, OPchildrenAdd }) => ({
  loading,
  details: OPchildrenAdd.details,
  error: OPchildrenAdd.error,
});
const Shuttlers = memo(({ dispatch, loading: { effects }, match: { params }, details, error }) => {
  const formRef = useRef();
  const loading = effects[`OPchildrenAdd/GET_DETAILS`];
  const loadingSubmit = effects[`OPchildrenAdd/ADD_TRANSPORTER`];
  const mounted = useRef(false);
  const [fileImage, setFileImage] = useState([null]);

  const mountedSet = (action, value) => {
    if (mounted.current) {
      action(value);
    }
  };

  const onSetImage = (file, position) => {
    mountedSet(
      setFileImage,
      fileImage.map((item, index) => (index === position ? file : item)),
    );
  };

  const onFinish = (values) => {
    const payload = {
      studentTransporter: values.studentTransporter.map((item, index) => ({
        ...item,
        fileImage: fileImage[index],
      })),
      id: params.id,
    };
    dispatch({
      type: 'OPchildrenAdd/ADD_TRANSPORTER',
      payload,
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
    }
  }, [params.id]);

  useEffect(() => {
    if (!isEmpty(details) && params.id) {
      formRef.current.setFieldsValue({
        studentTransporter: !isEmpty(details?.student?.studentTransporter)
          ? details?.student?.studentTransporter
          : [{}],
      });
      if (!isEmpty(details?.student?.studentTransporter)) {
        mountedSet(
          setFileImage,
          details?.student?.studentTransporter.map((item) => item.fileImage || null),
        );
      }
    }
  }, [details]);

  return (
    <Form
      layout="vertical"
      ref={formRef}
      onFinish={onFinish}
      initialValues={{
        studentTransporter: [{}],
      }}
    >
      <Pane className="card">
        <Loading loading={loading} isError={error.isError} params={{ error }}>
          <Pane style={{ padding: 20 }} className="pb-0">
            <Heading type="form-title">Người đưa đón</Heading>
          </Pane>

          <Form.List name="studentTransporter">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name }, index) => (
                  <Pane
                    key={key}
                    className={csx('pb-0', 'border-bottom', 'position-relative')}
                    style={{ padding: 20 }}
                  >
                    <Heading type="form-block-title" style={{ marginBottom: 12 }}>
                      Người đưa đón {index + 1}
                    </Heading>

                    <Pane className="row">
                      <Pane className="col-lg-4">
                        <Form.Item name={[key, 'fileImage']} label="Hình ảnh">
                          <ImageUpload
                            callback={(res) => {
                              onSetImage(res.fileInfo.url, index);
                            }}
                            fileImage={fileImage[index]}
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
                          rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                        />
                      </Pane>
                      <Pane className="col-lg-4">
                        <FormItem
                          name={[key, 'relationship']}
                          label="Mối liên hệ"
                          type={variables.INPUT}
                          rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                        />
                      </Pane>
                      <Pane className="col-lg-4">
                        <FormItem
                          name={[key, 'identifyNumber']}
                          label="Số CMND"
                          type={variables.INPUT}
                          rules={[variables.RULES.MAX_LENGTH_INPUT]}
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
                    </Pane>

                    {fields.length > 1 && (
                      <DeleteOutlined
                        className="position-absolute"
                        style={{ top: 20, right: 20 }}
                        onClick={() => remove(name)}
                      />
                    )}
                  </Pane>
                ))}

                <Pane style={{ padding: 20 }} className="border-bottom">
                  <Button
                    color="success"
                    ghost
                    icon="plus"
                    onClick={() => {
                      add();
                      mountedSet(setFileImage, [...fileImage, null]);
                    }}
                  >
                    Thêm
                  </Button>
                </Pane>
              </>
            )}
          </Form.List>

          <Pane style={{ padding: 20 }}>
            <Button
              color="success"
              style={{ marginLeft: 'auto' }}
              size="large"
              htmlType="submit"
              loading={loadingSubmit || loading}
            >
              Lưu
            </Button>
          </Pane>
        </Loading>
      </Pane>
    </Form>
  );
});

Shuttlers.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
};

Shuttlers.defaultProps = {
  match: {},
  details: {},
  dispatch: () => {},
  loading: {},
  error: {},
};

export default withRouter(connect(mapStateToProps)(Shuttlers));
