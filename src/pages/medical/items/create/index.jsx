import { memo, useRef, useState, useEffect } from 'react';
import { Form, List, Radio, message, Spin } from 'antd';
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
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import InfiniteScroll from 'react-infinite-scroller';

const { Item: ListItem } = List;
const { List: FormList, Item: FormItemAntd } = Form;

const Index = memo(({}) => {
  const formRef = useRef();
  const {
    user,
    loading: { effects },
    error,
    menuData,
    branches,
    classes,
  } = useSelector(({ loading, menu, user, medicalItemsAdd }) => ({
    user: user.user,
    loading,
    branches: medicalItemsAdd.branches,
    classes: medicalItemsAdd.classes,
    menuData: menu.menuLeftMedical,
  }));
  const dispatch = useDispatch();
  const params = useParams();
  const loading =
    effects[`medicalItemsAdd/GET_DETAILS`] || effects[`medicalItemsAdd/GET_EMPLOYEES`];
  const loadingSubmit = effects[`medicalItemsAdd/ADD`] || effects[`medicalItemsAdd/UPDATE`];
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [searchStudents, setSearchStudents] = useState({
    totalCount: 0,
    classStatus: 'HAS_CLASS',
    page: variables.PAGINATION.PAGE,
    limit: variables.PAGINATION.PAGE_SIZE,
    class: null,
  });
  const [hasMore, setHasMore] = useState(true);
  const mounted = useRef(false);

  const mountedSet = (action, value) => {
    if (mounted.current) {
      action(value);
    }
  };
  const [pillTimes, setPillTimes] = useState({});
  const [students, setStudents] = useState([]);
  const [files, setFiles] = useState({});
  const [studentId, setStudentsId] = useState(null);
  const filterRef = useRef();

  /**
   * Function change radio
   * @param {string} radio value of editor
   */
  const onChangeRadio = (e, id) => {
    mountedSet(setStudentsId, id);
  };

  useEffect(() => {
    mounted.current = true;
    return () => (mounted.current = false);
  }, []);

  useEffect(() => {
    dispatch({
      type: 'medicalItemsAdd/GET_BRANCHES',
      payload: {},
    });
  }, []);

  const onChangeBranch = (value) => {
    dispatch({
      type: 'medicalItemsAdd/GET_CLASSES',
      payload: {
        branch: value,
      },
    });
  };

  const onChangeClass = (value) => {
    dispatch({
      type: 'medicalItemsAdd/GET_STUDENTS',
      payload: {
        ...searchStudents,
        classStatus: 'HAS_CLASS',
        class: value,
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.PAGE_SIZE,
      },
      callback: (response, error) => {
        if (response) {
          mountedSet(setStudents, response.items);
          mountedSet(setSearchStudents, {
            ...searchStudents,
            class: value,
            totalCount: response.totalCount,
            page: variables.PAGINATION.PAGE,
            limit: variables.PAGINATION.PAGE_SIZE,
          });
        }
      },
    });
  };

  useEffect(() => {
    mountedSet(setLoadingStudents, true);
    dispatch({
      type: 'healthAdd/GET_STUDENTS',
      payload: {
        ...searchStudents,
      },
      callback: (response, error) => {
        if (response) {
          mountedSet(setLoadingStudents, false);
          mountedSet(setStudents, response.items);
          mountedSet(setSearchStudents, {
            ...searchStudents,
            totalCount: response.totalCount,
          });
        }
      },
    });
  }, []);

  const handleInfiniteOnLoad = () => {
    mountedSet(setLoadingStudents, true);
    if (students.length >= searchStudents.totalCount) {
      message.warning('Danh sách đã hiển thị tất cả.');
      mountedSet(setHasMore, false);
      mountedSet(setLoadingStudents, false);
      return;
    }
    dispatch({
      type: 'healthAdd/GET_STUDENTS',
      payload: {
        ...searchStudents,
        page: searchStudents.page + 1,
      },
      callback: (response, error) => {
        if (response) {
          mountedSet(setStudents, students.concat(response.items));
          mountedSet(setLoadingStudents, false);
          mountedSet(setSearchStudents, {
            ...searchStudents,
            totalCount: response.totalCount,
            page: searchStudents.page + 1,
          });
        }
        if (error) {
          message.error('Lỗi hệ thống.');
          mountedSet(setHasMore, false);
          mountedSet(setLoadingStudents, false);
        }
      },
    });
  };

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
        return {
          ...omit(item, 'pillTimeNote', 'pillTimes'),
          files: files[index]?.files ? JSON.stringify(files[index]?.files) : undefined,
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
    mountedSet(setFiles, (prev) => ({
      ...prev,
      [index]: {
        files: prev[index]?.files ? [...prev[index].files, file] : [file],
      },
    }));
  };

  const removeFiles = (file, index) => {
    mountedSet(setFiles, (prev) => ({
      ...prev,
      [index]: {
        files: file,
      },
    }));
  };

  return (
    <>
      <Helmet title="Tạo y tế" />
      <Breadcrumbs last="Tạo y tế" menu={menuData} />
      <Pane style={{ padding: '10px 20px', paddingBottom: 0 }}>
        <Pane className="row">
          <Pane className="col-lg-6">
            <Pane className="card" style={{ padding: 20 }}>
              <Heading type="form-title" style={{ marginBottom: 20 }}>
                Danh sách học sinh
              </Heading>

              <Form layout="vertical" ref={filterRef}>
                <Pane className={csx('row', 'border-bottom')}>
                  <Pane className="col-lg-6">
                    <FormItem
                      data={branches}
                      label="Cơ sở"
                      name="branchId"
                      type={variables.SELECT}
                      onChange={onChangeBranch}
                    />
                  </Pane>
                  <Pane className="col-lg-6">
                    <FormItem
                      data={classes}
                      label="Lớp"
                      name="classId"
                      type={variables.SELECT}
                      onChange={onChangeClass}
                    />
                  </Pane>
                </Pane>

                <Scrollbars autoHeight autoHeightMax={window.innerHeight - 333}>
                  <InfiniteScroll
                    hasMore={!loadingStudents && hasMore}
                    initialLoad={loadingStudents}
                    loadMore={handleInfiniteOnLoad}
                    pageStart={0}
                    useWindow={false}
                  >
                    <Radio.Group value={studentId}>
                      <List
                        loading={loadingStudents && hasMore}
                        dataSource={students}
                        renderItem={(item) => (
                          <ListItem key={item.id} className={styles.listItem}>
                            <Radio
                              value={item.id}
                              onChange={(event) => onChangeRadio(event, item.id)}
                            />
                            <AvatarTable
                              fileImage={Helper.getPathAvatarJson(item.fileImage)}
                              fullName={item.fullName}
                              description={`${item.age} tháng tuổi`}
                            />
                          </ListItem>
                        )}
                      >
                        {loadingStudents && !hasMore && (
                          <div className="demo-loading-container">
                            <Spin />
                          </div>
                        )}
                      </List>
                    </Radio.Group>
                  </InfiniteScroll>
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
                                    removeFiles={(event) => removeFiles(event, index)}
                                    files={files[index]?.files || []}
                                  />
                                </FormItemAntd>
                              </Pane>
                            </Pane>
                          </Pane>
                        ))}
                      </Scrollbars>
                      <Pane style={{ padding: 20 }} className="border-bottom border-top">
                        <Button color="success" ghost icon="plus" onClick={() => add()}>
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
                    disabled={!studentId}
                  >
                    Lưu
                  </Button>
                </Pane>
              </Form>
            </Pane>
          </Pane>
        </Pane>
      </Pane>
    </>
  );
});

export default Index;
