import { memo, useRef, useEffect, useState } from 'react';
import { Form } from 'antd';
import moment from 'moment';
import { useParams } from 'umi';
import { DeleteOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'dva';
import csx from 'classnames';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import Pane from '@/components/CommonComponent/Pane';
import { variables, Helper } from '@/utils';
import FormItem from '@/components/CommonComponent/FormItem';
import MultipleImageUpload from '@/components/CommonComponent/UploadAvatar';
import stylesModule from '../../styles.module.scss';

const genders = [
  { id: 'MALE', name: 'Nam' },
  { id: 'FEMALE', name: 'Nữ' },
];

const { List: FormList } = Form;

const General = memo(() => {
  const { details } = useSelector(({ loading, crmMarketingDataAdd }) => ({
    loading,
    details: crmMarketingDataAdd.details,
    data: crmMarketingDataAdd.data,
    error: crmMarketingDataAdd.error,
  }));
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);
  const [files, setFiles] = Helper.isJSON(details?.fileImage)
    ? useState(JSON.parse(details?.fileImage))
    : useState([]);

  const mountedSet = (setFunction, value) =>
    !!mounted?.current && setFunction && setFunction(value);

  useEffect(() => {
    dispatch({
      type: 'crmMarketingDataAdd/GET_DATA',
      payload: params,
    });
  }, []);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const uploadFiles = (file) => {
    mountedSet(setFiles, (prev) => [...prev, file]);
  };

  return (
    <Form layout="vertical">
      <div className="card">
        <div style={{ padding: 20 }} className="pb-0 border-bottom">
          <Heading type="form-title" style={{ marginBottom: 10 }}>
            Thông tin học sinh
          </Heading>
          <div className="row">
            <Pane className="col-lg-12">
              <FormList name="timetableDetails">
                {(student, { add, remove }) => (
                  <>
                    <Pane className="border-bottom">
                      {student.map(({ key, name }, index) => (
                        <Pane
                          key={key}
                          className={csx('position-relative', {
                            'border-bottom': index < student.length - 1,
                          })}
                        >
                          <Heading
                            type="form-block-title"
                            style={{ marginBottom: 12, marginTop: 12 }}
                          >
                            Học sinh {index + 1}
                          </Heading>

                          {student.length > 1 && (
                            <DeleteOutlined
                              className="position-absolute"
                              style={{ top: 20, right: 20, zIndex: 2 }}
                              onClick={() => remove(name)}
                            />
                          )}

                          <Pane className="row">
                            <Pane className="col-lg-12">
                              <div className="ant-col ant-form-item-label">
                                <label className="ant-form-item-required">
                                  <span>Hình ảnh học sinh</span>
                                </label>
                              </div>
                              <MultipleImageUpload
                                files={files}
                                callback={(files) => uploadFiles(files)}
                                removeFiles={(files) => mountedSet(setFiles, files)}
                              />
                            </Pane>
                            <Pane className="col-lg-4">
                              <FormItem name="fullName" label="Họ và tên" type={variables.INPUT} />
                            </Pane>
                            <Pane className="col-lg-4">
                              <FormItem
                                name="dateOfBirth"
                                label="Ngày sinh"
                                type={variables.DATE_PICKER}
                                disabledDate={(current) => current > moment()}
                              />
                            </Pane>
                            <Pane className="col-lg-4">
                              <FormItem name="age" label="Tuổi (Tháng)" type={variables.INPUT} />
                            </Pane>
                            <Pane className="col-lg-4">
                              <FormItem
                                data={genders}
                                name="gender"
                                label="Gới tính"
                                type={variables.INPUT}
                              />
                            </Pane>
                          </Pane>
                        </Pane>
                      ))}
                    </Pane>

                    <Pane className={stylesModule['wrapper-btn-student']}>
                      <Button
                        className="text-uppercase"
                        color="success"
                        ghost
                        icon="plus"
                        onClick={() => add()}
                      >
                        Thêm học sinh
                      </Button>
                    </Pane>
                  </>
                )}
              </FormList>
            </Pane>
          </div>
        </div>
        <div className="d-flex justify-content-end" style={{ padding: 20 }}>
          <Button color="success" size="large" htmlType="submit">
            Lưu
          </Button>
        </div>
      </div>
    </Form>
  );
});

export default General;
