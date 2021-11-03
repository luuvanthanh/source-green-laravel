import { memo, useRef, useState, useEffect } from 'react';
import { Form } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useParams } from 'umi';
import { head, isEmpty } from 'lodash';
import moment from 'moment';
import { useSelector, useDispatch } from 'dva';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import ImageUpload from '@/components/CommonComponent/ImageUpload';
import csx from 'classnames';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';

const Students = memo(() => {
  const formRef = useRef();

  const params = useParams();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const mounted = useRef(false);
  const [fileImage, setFileImage] = useState([null]);
  const mountedSet = (setFunction, value) =>
    !!mounted?.current && setFunction && setFunction(value);
  const {
    loading: { effects },
  } = useSelector(({ loading, crmSaleAdmissionAdd }) => ({
    loading,
    student: crmSaleAdmissionAdd.student,
    details: crmSaleAdmissionAdd.details,
    degrees: crmSaleAdmissionAdd.degrees,
    error: crmSaleAdmissionAdd.error,
  }));

  const [students, setStudents] = useState([]);

  const loadingSubmit = effects[`crmSaleAdmissionAdd/ADD_STUDENTS`];
  // const [deleteRows, setDeleteRows] = useState([]);

  const onSetImage = (file, position) => {
    mountedSet(
      setFileImage,
      fileImage.map((item, index) => (index === position ? file : item)),
    );
  };

  const onFinish = (values) => {
    const items = values.data.map((item, index) => ({
      ...item,
      file_image: fileImage[index],
      birth_date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: item.birth_date,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
      customer_potential_id: params.id,
    }));
    const payload = {
      createRows: items.filter((item) => !item.id),
      updateRows: items.filter((item) => item.id),
      // deleteRows,
    };
    dispatch({
      type: 'crmSaleAdmissionAdd/ADD_STUDENTS',
      payload,
      callback: (response, error) => {
        if (error) {
          if (error?.validationErrors && !isEmpty(error?.validationErrors)) {
            error?.validationErrors.forEach((item) => {
              form.setFields([
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
    dispatch({
      type: 'crmSaleAdmissionAdd/GET_STUDENTS',
      payload: {
        customer_potential_id: params.id,
      },
      callback: (response) => {
        if (response) {
          setStudents(response.parsePayload);
          formRef.current.setFieldsValue({
            data: response.parsePayload.map((item) => ({
              ...item,
              birth_date: moment(item.birth_date),
            })),
          });
        }
      },
    });
  }, [params.id]);

  useEffect(() => {
    if (!isEmpty(students)) {
      mountedSet(
        setFileImage,
        students.map((item) => item.file_image || null),
      );
    }
  }, [students]);

  return (
    <>
      <Pane>
        <Pane>
          <Form
            layout="vertical"
            initialValues={{
              data: [
                {
                  ...params,
                  birth_date: params.birth_date && moment(params.birth_date),
                },
              ],
            }}
            ref={formRef}
            onFinish={onFinish}
          >
            <Pane>
              <Pane>
                <Pane className="card">
                  <div className="row">
                    <div className="col-lg-12">
                      <Form.List name="data">
                        {(fields, { add, remove }) => (
                          <>
                            {fields.map((field, index) => (
                              <Pane
                                key={field.key}
                                className={csx('pb-0', 'border-bottom', 'position-relative')}
                                style={{ padding: 20 }}
                              >
                                <Heading type="form-title" style={{ marginBottom: 20 }}>
                                  Thông tin giấy đồng ý người đưa đón
                                </Heading>
                                <Heading type="form-block-title" style={{ marginBottom: 12 }}>
                                  NGƯỜI ĐƯA ĐÓN {index + 1}
                                </Heading>

                                <Pane className="row">
                                  <Pane className="col-lg-4">
                                    <Form.Item name={[field.key, 'file_image']} label="Hình ảnh">
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
                                      label="Họ và tên"
                                      name={[field.name, 'full_name']}
                                      fieldKey={[field.fieldKey, 'full_name']}
                                      type={variables.INPUT}
                                      rules={[
                                        variables.RULES.EMPTY_INPUT,
                                        variables.RULES.MAX_LENGTH_INPUT,
                                      ]}
                                    />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem
                                      label="Mối quan hệ"
                                      name={[field.name, 'full_name']}
                                      fieldKey={[field.fieldKey, 'full_name']}
                                      type={variables.INPUT}
                                      rules={[
                                        variables.RULES.EMPTY_INPUT,
                                        variables.RULES.MAX_LENGTH_INPUT,
                                      ]}
                                    />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem
                                      label="Số CMND"
                                      name={[field.name, 'full_name']}
                                      fieldKey={[field.fieldKey, 'full_name']}
                                      type={variables.INPUT}
                                      rules={[
                                        variables.RULES.EMPTY_INPUT,
                                        variables.RULES.MAX_LENGTH_INPUT,
                                      ]}
                                    />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem
                                      label="Số điện thoại"
                                      name={[field.name, 'full_name']}
                                      fieldKey={[field.fieldKey, 'full_name']}
                                      type={variables.INPUT}
                                      rules={[
                                        variables.RULES.EMPTY_INPUT,
                                        variables.RULES.MAX_LENGTH_INPUT,
                                      ]}
                                    />
                                  </Pane>
                                </Pane>

                                {fields.length > 0 && (
                                  <DeleteOutlined
                                    className="position-absolute"
                                    style={{ top: 20, right: 20 }}
                                    onClick={() => {
                                      // const student = students?.find(
                                      //   (item, studentsIndex) => studentsIndex === index,
                                      // );
                                      // setDeleteRows((prev) => [...prev, student.id]);
                                      remove(index);
                                    }}
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
                    </div>
                  </div>
                <Pane className="d-flex" style={{ marginLeft: 'auto', padding: 20 }}>
                  <Button color="primary" icon="export" className="ml-2">
                    Xuất file khai báo y tế
                  </Button>
                  <Button
                    color="success"
                    htmlType="submit"
                    loading={loadingSubmit}
                    className="ml-2"
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
});

export default Students;
