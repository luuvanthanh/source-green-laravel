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

const genders = [
  { id: 'MALE', name: 'Nam' },
  { id: 'FEMALE', name: 'Nữ' },
  { id: 'OTHER', name: 'Khác' },
];
const relationship = [
  { id: 'FATHER', name: 'Cha' },
  { id: 'MOTHER', name: 'Mẹ' },
];

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
  } = useSelector(({ loading, crmMarketingDataAdd }) => ({
    loading,
    student: crmMarketingDataAdd.student,
    details: crmMarketingDataAdd.details,
    degrees: crmMarketingDataAdd.degrees,
    error: crmMarketingDataAdd.error,
  }));

  const [students, setStudents] = useState([]);
  const loading = effects[`crmMarketingDataAdd/GET_STUDENTS`];
  const loadingSubmit = effects[`crmMarketingDataAdd/ADD_STUDENTS`];
  const [deleteRows, setDeleteRows] = useState([]);

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
      data_marketing_id: params.id,
    }));
    const payload = {
      create_rows: items.filter((item) => !item.id),
      update_rows: items.filter((item) => item.id),
      delete_rows: deleteRows,
    };
    dispatch({
      type: 'crmMarketingDataAdd/ADD_STUDENTS',
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
      type: 'crmMarketingDataAdd/GET_STUDENTS',
      payload: {
        data_marketing_id: params.id,
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
                                  Thông tin học sinh
                                </Heading>
                                <Heading type="form-block-title" style={{ marginBottom: 12 }}>
                                  Học sinh {index + 1}
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
                                      name={[field.name, 'birth_date']}
                                      label="Ngày sinh"
                                      fieldKey={[field.fieldKey, 'birth_date']}
                                      type={variables.DATE_PICKER}
                                      disabledDate={(current) => current > moment()}
                                    />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem
                                      name={[field.name, 'month_age']}
                                      label="Tuổi (tháng)"
                                      fieldKey={[field.fieldKey, 'month_age']}
                                      type={variables.INPUT}
                                    />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem
                                      data={genders}
                                      name={[field.name, 'sex']}
                                      label="Giới tính"
                                      fieldKey={[field.fieldKey, 'sex']}
                                      type={variables.SELECT}
                                      rules={[variables.RULES.EMPTY_INPUT]}
                                    />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem
                                      data={relationship}
                                      name={[field.name, 'relationship']}
                                      label="Mối quan hệ"
                                      fieldKey={[field.fieldKey, 'relationship']}
                                      type={variables.SELECT}
                                      rules={[variables.RULES.EMPTY_INPUT]}
                                    />
                                  </Pane>
                                </Pane>

                                {fields.length > 0 && (
                                  <DeleteOutlined
                                    className="position-absolute"
                                    style={{ top: 20, right: 20 }}
                                    onClick={() => {
                                      const student = students?.find(
                                        (item, studentsIndex) => studentsIndex === index,
                                      );
                                      setDeleteRows((prev) => [...prev, student.id]);
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
                                Thêm học sinh
                              </Button>
                            </Pane>
                          </>
                        )}
                      </Form.List>
                    </div>
                  </div>
                </Pane>
                <Pane className="d-flex justify-content-between align-items-center mb20">
                  <Button
                    className="ml-auto px25"
                    color="success"
                    htmlType="submit"
                    size="large"
                    loading={loadingSubmit || loading}
                  >
                    Lưu
                  </Button>
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
