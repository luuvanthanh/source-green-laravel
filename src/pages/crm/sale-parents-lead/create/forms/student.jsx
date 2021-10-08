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
// import { v4 as uuidv4 } from 'uuid';

const genders = [
  { id: 'MALE', name: 'Nam' },
  { id: 'FEMALE', name: 'Nữ' },
];
const mapStateToProps = ({ loading, crmSaleLeadAdd }) => ({
  loading,
  details: crmSaleLeadAdd.details,
  error: crmSaleLeadAdd.error,
});
const Students = memo(({ dispatch, loading: { effects }, match: { params }, details, error }) => {
  const formRef = useRef();
  const loading = effects[`crmSaleLeadAdd/GET_DETAILS`];
  const loadingSubmit = effects[`crmSaleLeadAdd/ADD_STUDENTS`];
  const mounted = useRef(false);
  const [fileImage, setFileImage] = useState([null]);
  // const [dataSource, setDataSource] = useState([
  //   {
  //     id: uuidv4(),
  //     isAdd: true,
  //   },
  // ]);

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
    // const createRows = dataSource
    //   .filter((item) => item.isAdd)
    //   .map((item) => ({ ...omit(item, 'isAdd') }));
    // const updateRows = dataSource
    //   .filter((item) => !item.isAdd)
    //   .map((item) => ({ ...omit(item, 'isAdd') }));
    const payload = {
      studentArray: values.studentArray.map((item, index) => ({
        ...item,
        fileImage: fileImage[index],
      })),
      // createRows,
      // updateRows,
      customer_lead_id: params.id,
    };
    dispatch({
      type: 'crmSaleLeadAdd/ADD_STUDENTS',
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
        type: 'crmSaleLeadAdd/GET_DETAILS',
        payload: params,
      });
    }
  }, [params.id]);

  useEffect(() => {
    if (!isEmpty(details) && params.id) {
      formRef.current.setFieldsValue({
        studentArray: !isEmpty(details?.student?.studentArray)
          ? details?.student?.studentArray
          : [{}],
      });
      if (!isEmpty(details?.student?.studentArray)) {
        mountedSet(
          setFileImage,
          details?.student?.studentArray.map((item) => item.fileImage || null),
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
        studentArray: [{}],
      }}
    >
      <Pane className="card">
        <Loading loading={loading} isError={error.isError} params={{ error }}>
          <Pane style={{ padding: 20 }} className="pb-0">
            <Heading type="form-title">Thông tin học sinh</Heading>
          </Pane>

          <Form.List name="studentArray">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name }, index) => (
                  <Pane
                    key={key}
                    className={csx('pb-0', 'border-bottom', 'position-relative')}
                    style={{ padding: 20 }}
                  >
                    <Heading type="form-block-title" style={{ marginBottom: 12 }}>
                      học sinh {index + 1}
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
                          name={[key, 'full_name']}
                          label="Họ và tên"
                          type={variables.INPUT}
                          rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                        />
                      </Pane>
                      <Pane className="col-lg-4">
                        <FormItem
                          name={[key, 'birth_date']}
                          label="Ngày sinh"
                          type={variables.DATE_PICKER}
                        />
                      </Pane>
                      <Pane className="col-lg-4">
                        <FormItem
                          name={[key, 'month_age']}
                          label="Tuổi (tháng)"
                          type={variables.INPUT}
                        />
                      </Pane>
                      <Pane className="col-lg-4">
                        <FormItem
                          data={genders}
                          name={[key, 'sex']}
                          label="Giới tính"
                          type={variables.SELECT}
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
                    Thêm học sinh
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

Students.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
};

Students.defaultProps = {
  match: {},
  details: {},
  dispatch: () => {},
  loading: {},
  error: {},
};

export default withRouter(connect(mapStateToProps)(Students));
