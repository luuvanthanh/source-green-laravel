import { memo, useRef, useState, useEffect } from 'react';
import { Form, List, Radio, Avatar } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet';
import { Scrollbars } from 'react-custom-scrollbars';
import csx from 'classnames';
import { find, omit, isEmpty, head } from 'lodash';
import { history, useParams } from 'umi';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import MultipleImageUpload from '@/components/CommonComponent/MultipleImageUpload';
import { useSelector, useDispatch } from 'dva';

import { variables, Helper } from '@/utils';
import styles from '@/assets/styles/Common/information.module.scss';
import variablesModules from '../../utils/variables';

const { Item: ListItem } = List;
const { List: FormList, Item: FormItemAntd } = Form;

const Index = memo(({}) => {
  const formRef = useRef();
  const {
    user,
    loading: { effects },
    error,
  } = useSelector(({ loading, menu, user }) => ({
    user: user.user,
    loading,
  }));
  const dispatch = useDispatch();
  const params = useParams();
  const loading =
    effects[`medicalItemsAdd/GET_DETAILS`] || effects[`medicalItemsAdd/GET_EMPLOYEES`];
  const loadingSubmit = effects[`medicalItemsAdd/ADD`] || effects[`medicalItemsAdd/UPDATE`];
  const loadingStudents = effects[`medicalItemsAdd/GET_STUDENTS`];
  const mounted = useRef(false);

  const mountedSet = (action, value) => {
    if (mounted.current) {
      action(value);
    }
  };
  const [pillTimes, setPillTimes] = useState({});
  const [student, setStudent] = useState([]);
  const [files, setFiles] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const filterRef = useRef();

  /**
   * Function change radio
   * @param {string} radio value of editor
   */
  const onChangeRadio = (e, id) => {
    mountedSet(setStudentId, id);
  };

  useEffect(() => {
    mounted.current = true;
    return () => (mounted.current = false);
  }, []);

  useEffect(() => {
    dispatch({
      type: 'medicalItemsAdd/GET_STUDENTS',
      payload: {},
      callback: (response, error) => {
        if (response) {
          mountedSet(setStudent, response.items);
        }
      },
    });
  }, []);

  /**
   * Function submit form
   * @param {object} values values of form
   */
  const onFinish = (values) => {
    if (!studentId) {
      return;
    }
    const payload = {
      studentId,
      ...omit(values, 'appliedDate'),
      appliedDateFrom: values.appliedDate[0],
      appliedDateTo: values.appliedDate[1],
      medicines: values.medicines.map((item, index) => {
        let medicineTimes = [];
        Object.keys(item.pillTimeNote).map(function (key) {
          medicineTimes = [
            ...medicineTimes,
            {
              timeCode: key,
              medicineAmount: item.pillTimeNote[key],
            },
          ];
        });
        const fileImages = files
          .filter((itemFile) => itemFile.index === index)
          .map((item) => item.file);
        return {
          ...omit(item, 'pillTimeNote', 'pillTimes'),
          files: JSON.stringify(fileImages),
          medicineTimes,
        };
      }),
    };
    dispatch({
      type: 'medicalItemsAdd/ADD',
      payload,
      callback: (response) => {
        if (response) {
          history.goBack();
        }
      },
    });
  };

  const uploadFiles = (file, index) => {
    mountedSet(setFiles, (prev) => [...prev, { index, file }]);
  };

  return (
    <Pane style={{ padding: 20, paddingBottom: 0 }}>
      <Helmet title="Tạo y tế" />
      <Pane className="row" style={{ marginBottom: 20 }}>
        <Pane className="col">
          <Heading type="page-title">Tạo y tế</Heading>
        </Pane>
      </Pane>
      <Pane className="row">
        <Pane className="col-lg-6">
          <Pane className="card" style={{ padding: 20 }}>
            <Heading type="form-title" style={{ marginBottom: 20 }}>
              Danh sách học sinh
            </Heading>

            <Form layout="vertical" ref={filterRef}>
              <Pane className={csx('row', 'border-bottom')}>
                <Pane className="col-lg-6">
                  <FormItem label="Cơ sở" name="position" type={variables.SELECT} />
                </Pane>
                <Pane className="col-lg-6">
                  <FormItem label="Lớp" name="class" type={variables.SELECT} />
                </Pane>
              </Pane>

              <Scrollbars autoHeight autoHeightMax={window.innerHeight - 333}>
                <Radio.Group value={studentId}>
                  <List
                    loading={loadingStudents}
                    dataSource={student}
                    renderItem={(item) => {
                      let fileImage = '';
                      if (Helper.isJSON(item.fileImage)) {
                        const files = JSON.parse(item.fileImage);
                        if (!isEmpty(files)) {
                          fileImage = head(files);
                        }
                      }
                      return (
                        <ListItem key={item.id} className={styles.listItem}>
                          <Radio
                            value={item.id}
                            onChange={(event) => onChangeRadio(event, item.id)}
                          />
                          <Pane className={styles.userInformation}>
                            <Avatar
                              shape="square"
                              size={40}
                              src={fileImage ? `${API_UPLOAD}${fileImage}` : null}
                            />
                            <Pane>
                              <h3>{item.fullName}</h3>
                              <p>{item.age} tháng tuổi</p>
                            </Pane>
                          </Pane>
                        </ListItem>
                      );
                    }}
                  />
                </Radio.Group>
              </Scrollbars>
            </Form>
          </Pane>
        </Pane>

        <Pane className="col-lg-6">
          <Pane className="card">
            <Form
              layout="vertical"
              ref={formRef}
              onFinish={onFinish}
              initialValues={{
                medicines: [{}],
              }}
            >
              <Pane style={{ padding: 20, paddingBottom: 0 }}>
                <Heading type="form-title" style={{ marginBottom: 20 }}>
                  Thông tin y tế
                </Heading>

                <Pane className={csx('row', 'border-bottom')}>
                  <Pane className="col-lg-12">
                    <FormItem
                      label="Tên bệnh"
                      name="diseaseName"
                      type={variables.INPUT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </Pane>

                  <Pane className="col-lg-6">
                    <FormItem
                      label="Thời gian dặn thuốc"
                      name="appliedDate"
                      type={variables.RANGE_PICKER}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </Pane>
                  <Pane className="col-lg-6">
                    <FormItem
                      label="Vị trí đặt thuốc"
                      name="medicineLocation"
                      type={variables.INPUT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </Pane>
                </Pane>
              </Pane>

              <FormList name="medicines">
                {(fields, { add, remove }) => (
                  <>
                    <Scrollbars autoHeight autoHeightMax={window.innerHeight - 545}>
                      {fields.map(({ key, name }, index) => (
                        <Pane
                          key={key}
                          className={csx('position-relative"', 'pb-0', {
                            'border-bottom': index < fields.length - 1,
                          })}
                          style={{ padding: 20 }}
                        >
                          <Heading type="form-block-title" style={{ marginBottom: 12 }}>
                            Thuốc {index + 1}
                          </Heading>

                          {fields.length > 1 && (
                            <DeleteOutlined
                              className="position-absolute"
                              style={{ top: 20, right: 20 }}
                              onClick={() => remove(name)}
                            />
                          )}

                          <Pane className="row">
                            <Pane className="col-lg-6">
                              <FormItem
                                label="Tên thuốc"
                                name={[name, 'name']}
                                type={variables.INPUT}
                                rules={[variables.RULES.EMPTY]}
                              />
                            </Pane>
                            <Pane className="col-lg-6">
                              <FormItem
                                label="Đơn vị"
                                name={[name, 'unit']}
                                type={variables.INPUT}
                                rules={[variables.RULES.EMPTY]}
                              />
                            </Pane>

                            <Pane className="col-lg-12">
                              <FormItem
                                label="Thời gian uống"
                                name={[name, 'pillTimes']}
                                type={variables.CHECKBOX}
                                data={variablesModules.STATUS_TIME_CODE}
                                onChange={(values) =>
                                  setPillTimes((prev) => ({ ...prev, [name]: values.sort() }))
                                }
                              />
                            </Pane>

                            {(pillTimes[name] || []).map((value) => (
                              <Pane className="col-lg-6" key={value}>
                                <FormItem
                                  label={find(variablesModules.STATUS_TIME_CODE, { value }).label}
                                  name={[name, 'pillTimeNote', value]}
                                  type={variables.INPUT}
                                />
                              </Pane>
                            ))}

                            <Pane className="col-lg-12">
                              <FormItem
                                label="Ghi chú"
                                name={[name, 'note']}
                                type={variables.INPUT}
                              />
                            </Pane>

                            <Pane className="col-lg-12">
                              <FormItemAntd label="Đính kèm hình ảnh" name={[name, 'files']}>
                                <MultipleImageUpload
                                  callback={(event) => uploadFiles(event, index)}
                                  files={[]}
                                />
                              </FormItemAntd>
                            </Pane>
                          </Pane>
                        </Pane>
                      ))}
                    </Scrollbars>
                    <Pane style={{ padding: 20 }} className="border-bottom border-top">
                      <Button color="success" ghost icon="plus" onClick={add}>
                        Thêm thuốc
                      </Button>
                    </Pane>
                  </>
                )}
              </FormList>

              <Pane style={{ padding: 20 }}>
                <Button
                  color="success"
                  style={{ marginLeft: 'auto' }}
                  htmlType="submit"
                  size="large"
                  loading={loadingSubmit || loading}
                >
                  Lưu
                </Button>
              </Pane>
            </Form>
          </Pane>
        </Pane>
      </Pane>
    </Pane>
  );
});

export default Index;
