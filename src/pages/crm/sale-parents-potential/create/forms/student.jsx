import { memo, useRef, useState, useEffect } from 'react';
import { Form, Avatar } from 'antd';
import { useParams } from 'umi';
import { head, isEmpty } from 'lodash';
import moment from 'moment';
import { useSelector, useDispatch } from 'dva';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import ImageUpload from '@/components/CommonComponent/ImageUpload';
import Text from '@/components/CommonComponent/Text';
import { UserOutlined } from '@ant-design/icons';
import csx from 'classnames';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import stylesModule from '../../styles.module.scss';

const genders = [
  { id: 'MALE', name: 'Nam' },
  { id: 'FEMALE', name: 'Nữ' },
];
const Students = memo(() => {

  const params = useParams();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const mounted = useRef(false);
  const [fileImage, setFileImage] = useState([null]);

  const mountedSet = (setFunction, value) =>
    !!mounted?.current && setFunction && setFunction(value);
  const {
    student,
    relationships,
  } = useSelector(({ loading, crmSaleParentsPotentialAdd }) => ({
    loading,
    relationships: crmSaleParentsPotentialAdd.relationships,
    student: crmSaleParentsPotentialAdd.student,
    details: crmSaleParentsPotentialAdd.details,
    degrees: crmSaleParentsPotentialAdd.degrees,
    error: crmSaleParentsPotentialAdd.error,
  }));

  const [students, setStudents] = useState([]);

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
      type: 'crmSaleParentsPotentialAdd/ADD_STUDENTS',
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
      type: 'crmSaleParentsPotentialAdd/GET_RELATIONSHIPS',
      payload: {},
    });
    dispatch({
      type: 'crmSaleParentsPotentialAdd/GET_STUDENTS',
      payload: {
        customer_potential_id: params.id,
      },
      callback: (response) => {
        if (response) {
          setStudents(response.parsePayload);
          // setDayOfBirth(moment(response.parsePayload.map((item) => ({
          //   birth_date: moment(item.birth_date),
          // }))));
          form.setFieldsValue({
            data: response.parsePayload.map((item) => ({
              ...item,
              birth_date: item.birth_date ? moment(item?.birth_date) : "",
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
      {
        students?.length > 0 ?
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
                form={form}
                onFinish={onFinish}
              >
                <Pane>
                  <Pane>
                    <Pane className="card">
                      <div className="row">
                        <div className="col-lg-12">
                          <Form.List name="data">
                            {(fields,) => (
                              <>
                                {fields.map((field, index) => {
                                  let file = {};
                                  const { data } = form.getFieldsValue();
                                  const itemData = data?.find((item, indexWater) => indexWater === index);
                                  file = student.find((item) => item.id === itemData?.id);
                                  return (
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
                                            {
                                              file?.file_image ?
                                                <ImageUpload
                                                  callback={(res) => {
                                                    onSetImage(res.fileInfo.url, index);
                                                  }}
                                                  fileImage={fileImage[index]}
                                                /> :
                                                < Avatar shape="square" size={100} icon={<UserOutlined />} />
                                            }
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
                                          //  onChange={onChaneDate}
                                          />
                                        </Pane>
                                        <Pane className="col-lg-4">
                                          <Form.Item label="Tuổi (tháng)" >
                                            <Text size="normal">
                                              {file?.age_month}
                                            </Text>
                                          </Form.Item>
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
                                            data={relationships}
                                            name={[field.name, 'category_relationship_id']}
                                            label="Mối quan hệ"
                                            fieldKey={[field.fieldKey, 'category_relationship_id']}
                                            type={variables.SELECT}
                                            rules={[variables.RULES.EMPTY_INPUT]}
                                          />
                                        </Pane>
                                      </Pane>
                                    </Pane>
                                  );
                                })}
                              </>
                            )}
                          </Form.List>
                        </div>
                      </div>
                    </Pane>
                  </Pane>
                </Pane>
              </Form>
            </Pane>
          </Pane> :
          <div className="card ">
            <div className={stylesModule['wrapper-admission']}>
              <h3 className={stylesModule.title}>Danh học sinh</h3>
              <p className={stylesModule.description}>Chưa có thông tin học sinh</p>
            </div>
          </div>
      }
    </>
  );
});

export default Students;