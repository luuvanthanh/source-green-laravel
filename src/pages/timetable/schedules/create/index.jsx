import { memo, useRef, useEffect, useState } from 'react';
import { Form, List, Checkbox, message } from 'antd';
import csx from 'classnames';
import { connect, history, withRouter } from 'umi';
import { head, isEmpty, size } from 'lodash';
import PropTypes from 'prop-types';
import { useDispatch } from 'dva';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';
import InfiniteScroll from 'react-infinite-scroller';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Loading from '@/components/CommonComponent/Loading';
import { variables, Helper } from '@/utils';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Quill from '@/components/CommonComponent/Quill';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import styles from '@/assets/styles/Common/information.module.scss';
import Text from '@/components/CommonComponent/Text';

import variablesModules from '../variables';

const { Item: ListItem } = List;

const mapStateToProps = ({ timeTablesScheduleAdd, loading, menu }) => ({
  loading,
  branches: timeTablesScheduleAdd.branches,
  classes: timeTablesScheduleAdd.classes,
  error: timeTablesScheduleAdd.error,
  menuLeft: menu.menuLeftTimeTable,
});

const Index = memo(
  ({ loading: { effects }, match: { params }, branches, error, menuLeft, classes }) => {
    const mounted = useRef(false);
    const mountedSet = (action, value) => mounted?.current && action(value);
    const dispatch = useDispatch();

    const [content, setContent] = useState('');
    const [isReminded, setIsReminded] = useState(false);
    const [isAllClass, setIsAllClass] = useState(false);
    const [isAllStudent, setIsAllStudent] = useState(false);
    const [searchStudents, setSearchStudents] = useState({
      page: variables.PAGINATION.PAGE,
      limit: variables.PAGINATION.PAGE_SIZE,
      total: 0,
      hasMore: true,
      loading: false,
      branchId: null,
      class: null,
    });
    const [students, setStudents] = useState([]);
    const [type, setType] = useState('');
    const [errorStudent, setError] = useState(false);
    const [selectClass, setSelectClass] = useState([]);

    const loadingSubmit = effects[`timeTablesScheduleAdd/ADD`];
    const formRef = useRef();

    const onFinishFailed = () => {
      if (type === 'forPerson' && !isAllStudent) {
        setError(true);
      }
    };

    const onFinish = (values) => {
      if (type === 'forPerson' && !isAllStudent && size(students.filter(item => item?.checked)) === 0) {
        setError(true);
        return;
      }
      let classTimetables = isAllClass ? classes?.map(item => ({ classId: item.id })) : values?.classes?.map(item => ({ classId: item }));
      let parentTimetables = isAllStudent ? [] : students?.filter(item => item.checked)?.map(item => ({ studentId: item.id }));
      if (values?.object === 'forPerson') {
        classTimetables = [];
      }
      if (values?.object === 'forClass') {
        parentTimetables = [];
      }
      const startTime = !isEmpty(values?.rangeTime) ? Helper.getDate(values.rangeTime[0], variables.DATE_FORMAT.TIME_FULL) : null;
      const endTime = !isEmpty(values?.rangeTime) ? Helper.getDate(values.rangeTime[1], variables.DATE_FORMAT.TIME_FULL)  : null;
      const payload = {
        ...values,
        isReminded,
        isAllClass,
        isAllStudent,
        content,
        forClass: values?.object === 'forClass',
        forPerson: values?.object === 'forPerson',
        classId: values?.classId || null,
        classTimetables,
        parentTimetables,
        applyDate: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: values.applyDate,
            targetValue: '00:00:00',
          }),
          isUTC: false,
        }),
        startTime: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: values.applyDate,
            targetValue: startTime,
          }),
          isUTC: false,
        }),
        endTime: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: values.applyDate,
            targetValue: endTime,
          }),
          isUTC: false,
        }),
        rangeTime: undefined,
        object: undefined,
      };
      dispatch({
        type: 'timeTablesScheduleAdd/ADD',
        payload,
        callback: (response, err) => {
          if (response) {
            history.goBack();
          }
          if (err) {
            if (err?.validationErrors && !isEmpty(err?.validationErrors)) {
              err?.validationErrors.forEach((item) => {
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
      dispatch({
        type: 'timeTablesScheduleAdd/GET_BRANCHES',
        payload: params,
      });
    }, []);

    useEffect(() => {
      mounted.current = true;
      return mounted.current;
    }, []);

    const onChangeEditor = (value) => {
      mountedSet(setContent, value);
    };

    const convertDate = () => {
      const hours = [];
      for (let i = 1; i <= 24; i += 1) {
        hours.push({
          id: i,
          name: `${i} giờ`
        });
      }
      return hours;
    };

    const changeCheckboxStudents = (id) => {
      mountedSet(
        setStudents,
        students.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)),
      );
    };

    const getStudents = (search) => {
      mountedSet(setSearchStudents, { ...search, loading: true });
      dispatch({
        type: 'timeTablesScheduleAdd/GET_STUDENTS',
        payload: {
          ...search,
        },
        callback: (response) => {
          if (response) {
            mountedSet(setStudents, response.items);
            mountedSet(setSearchStudents, {
              ...search,
              total: response.totalCount,
              loading: false,
            });
          }
        },
      });
    };

    const handleInfiniteOnLoad = () => {
      mountedSet(setSearchStudents, { ...searchStudents, loading: true });
      if (students.length >= searchStudents.total) {
        message.warning('Danh sách đã hiển thị tất cả.');
        mountedSet(setSearchStudents, { ...searchStudents, hasMore: false, loading: false });
        return;
      }
      dispatch({
        type: 'timeTablesScheduleAdd/GET_STUDENTS',
        payload: {
          ...searchStudents,
          page: searchStudents.page + 1,
        },
        callback: (response, error) => {
          if (response) {
            mountedSet(setStudents, students.concat(response.items));
            mountedSet(setSearchStudents, {
              ...searchStudents,
              total: response.totalCount,
              page: searchStudents.page + 1,
              loading: false,
            });
          }
          if (error) {
            message.error('Lỗi hệ thống.');
            mountedSet(setSearchStudents, { ...searchStudents, hasMore: false, loading: false });
          }
        },
      });
    };

    const onChangeBranch = (branch) => {
      dispatch({
        type: 'timeTablesScheduleAdd/GET_CLASSES',
        payload: {
          branch,
        },
      });
      if (type === 'forPerson') {
        formRef?.current?.setFieldsValue({ classId: undefined });
        getStudents({...searchStudents, branchId: branch, classId: '' });
      }
    };

    const changeObject = (e) => {
      const { value } = e.target;
      setType(value);
      if (value === 'forClass') {
        setIsAllStudent(false);
      } else {
        setIsAllClass(false);
        getStudents({ ...searchStudents });
      }
    };

    const onChangeClass = (value) => {
      getStudents({...searchStudents, class: value });
    };

    const handleChooseAll = (e) => {
      setIsAllStudent(e.target.checked);
      mountedSet(
        setStudents,
        students.map((item) => ({...item, checked: false})),
      );
    };

    const onSelectClass = (value) => {
      setSelectClass(value);
    };

    const onChangeAllClass = (e) => {
      setIsAllClass(e.target.checked);
      setSelectClass([]);
      formRef?.current?.setFieldsValue({ classes: undefined });
    };

    return (
      <>
        <Breadcrumbs last="Tạo thời khóa biểu" menu={menuLeft} />
        <Pane style={{ padding: '10px 20px', paddingBottom: 0 }}>
          <Loading loading={false} isError={error.isError} params={{ error }}>
            <Form
              layout="vertical"
              ref={formRef}
              onFinish={onFinish}
              initialValues={{
                timetableDetails: [{}],
              }}
              onFinishFailed={onFinishFailed}
            >
              <Pane className="row">
                <Pane className="col-lg-6">
                  <Pane className="card" style={{ padding: 20 }}>
                    <Heading type="form-title" style={{ marginBottom: 20 }}>
                      Thông tin chung
                    </Heading>

                    <Pane className={csx('row', 'border-bottom', 'mb20')}>
                      <Pane className="col-lg-6">
                        <FormItem
                          label="Loại lịch"
                          name="eventType"
                          rules={[variables.RULES.EMPTY]}
                          type={variables.SELECT}
                          data={variablesModules.TYPE_CALENDAR}
                        />
                      </Pane>
                    </Pane>
                    <Pane className={csx('row', 'border-bottom', 'mb20')}>
                      <Pane className="col-lg-6">
                        <FormItem
                          label="Thời gian diễn ra"
                          name="applyDate"
                          type={variables.DATE_PICKER}
                          rules={[variables.RULES.EMPTY]}
                          disabledDate={(current) => current < moment().add(-1, 'day')}
                        />
                      </Pane>
                      <Pane className="col-lg-6">
                        <FormItem
                          className="no-label"
                          name="rangeTime"
                          label=""
                          type={variables.TIME_RANGE}
                          rules={[variables.RULES.EMPTY]}
                        />
                      </Pane>
                      <Pane className="col-lg-12">
                        <FormItem
                          className="checkbox-row checkbox-small"
                          label="Nhắc nhở"
                          type={variables.CHECKBOX_SINGLE}
                          checked={isReminded}
                          onChange={(e) => setIsReminded(e.target.checked)}
                        />
                      </Pane>
                      <Pane className="col-lg-12">
                        <FormItem
                          label="Nhắc trước"
                          name="remindBefore"
                          rules={[variables.RULES.EMPTY]}
                          type={variables.SELECT}
                          data={convertDate()}
                        />
                      </Pane>
                      <Pane className="col-lg-12">
                        <FormItem
                          label="Ghi chú nhắc nhở"
                          name="note"
                          rules={[variables.RULES.MAX_LENGTH_TEXTAREA]}
                          type={variables.TEXTAREA}
                        />
                      </Pane>
                    </Pane>
                    <Pane className={csx('row', 'border-bottom', 'mb20')}>
                      <Pane className="col-lg-12">
                        <FormItem
                          className="radio-group-row"
                          label="Đối tượng"
                          name="object"
                          type={variables.RADIO}
                          rules={[variables.RULES.EMPTY]}
                          data={variablesModules.OBJECTS}
                          onChange={changeObject}
                        />
                      </Pane>
                    </Pane>
                    <Pane className={csx('row', 'border-bottom')}>
                      <Pane className="col-lg-6">
                        <FormItem
                          label="Cơ sở"
                          name="branchId"
                          rules={[variables.RULES.EMPTY]}
                          type={variables.SELECT}
                          data={branches}
                          onChange={onChangeBranch}
                        />
                      </Pane>
                      {type && type === 'forPerson' && (
                        <Pane className="col-lg-6">
                          <FormItem
                            label="Lớp"
                            name="classId"
                            type={variables.SELECT}
                            data={classes}
                            onChange={onChangeClass}
                          />
                        </Pane>
                      )}
                    </Pane>

                    {type && type === 'forPerson' && (
                      <>
                        <Pane className="border-bottom py20">
                          <p className="mb0">Gửi đến phụ huynh</p>
                          {!isEmpty(students) && (
                            <FormItem
                              className="checkbox-row checkbox-small mb0 py20"
                              label="Tất cả học sinh"
                              type={variables.CHECKBOX_SINGLE}
                              checked={isAllStudent}
                              onChange={handleChooseAll}
                            />
                          )}
                          {!isAllStudent && (
                            <div className="border-top">
                              <Scrollbars autoHeight autoHeightMax={window.innerHeight - 600}>
                                <InfiniteScroll
                                  hasMore={!searchStudents.loading && searchStudents.hasMore}
                                  initialLoad={searchStudents.loading}
                                  loadMore={handleInfiniteOnLoad}
                                  pageStart={0}
                                  useWindow={false}
                                >
                                  <List
                                    rules={[variables.RULES.EMPTY]}
                                    loading={searchStudents.loading}
                                    dataSource={students}
                                    renderItem={({ id, fullName, positionLevel, fileImage, checked }) => (
                                      <ListItem key={id} className={styles.listItem}>
                                        <Pane className="w-100 d-flex align-items-center">
                                          <Checkbox
                                            checked={!!checked}
                                            className="mr15"
                                            onChange={() => changeCheckboxStudents(id)}
                                          />
                                          <Pane className={styles.userInformation}>
                                            <AvatarTable fileImage={Helper.getPathAvatarJson(fileImage)} />
                                            <Pane>
                                              <h3>{fullName}</h3>
                                              <p>{head(positionLevel)?.position?.name}</p>
                                            </Pane>
                                          </Pane>
                                        </Pane>
                                      </ListItem>
                                    )}
                                  />
                                </InfiniteScroll>
                              </Scrollbars>
                            </div>
                          )}
                        </Pane>
                        {!isAllStudent && (
                          <div className="pt15">
                            <Text color="dark" size="normal">
                              Đã chọn {size(students.filter(item => item?.checked))}
                            </Text>
                          </div>
                        )}
                        {!isAllStudent && errorStudent && size(students.filter(item => item?.checked)) === 0 && (
                          <span className="text-danger mt5">{variables.RULES.EMPTY_INPUT.message}</span>
                        )}
                      </>
                    )}

                    {type && type === 'forClass' && !isEmpty(classes) && (
                      <Pane className="row pt20">
                        <Pane className="col-lg-12">
                          <p>Gửi đến phụ huynh</p>
                          {!isEmpty(classes) && (
                            <FormItem
                              className="checkbox-row checkbox-small"
                              label="Tất cả lớp"
                              type={variables.CHECKBOX_SINGLE}
                              checked={isAllClass}
                              onChange={onChangeAllClass}
                            />
                          )}
                          {!isAllClass && (
                            <FormItem
                              name="classes"
                              type={variables.CHECKBOX}
                              rules={[
                                {
                                  ...variables.RULES.EMPTY,
                                  required: !isAllClass
                                }
                              ]}
                              onChange={onSelectClass}
                              className="checkbox-group group-column"
                              data={classes.map((item) => ({
                                value: item.id,
                                label: item.name,
                              }))}
                            />
                          )}
                        </Pane>
                        {!isAllClass && (
                          <div className="border-top px15 pt15 col-12">
                            <Text color="dark" size="normal">
                              Đã chọn {size(selectClass)}
                            </Text>
                          </div>
                        )}
                      </Pane>
                    )}
                  </Pane>
                </Pane>

                <Pane className="col-lg-6">
                  <Pane className="card">
                    <Pane style={{ padding: '20px 20px 0 20px' }}>
                      <Heading type="form-title">Chi tiết</Heading>
                    </Pane>
                    <Pane className="p20">
                      <Pane className={csx('row', 'mb20')}>
                        <Pane className="col-lg-12">
                          <FormItem
                            label="Tiêu đề"
                            name="title"
                            rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                            type={variables.INPUT}
                          />
                        </Pane>
                        <Pane className="col-lg-12">
                          <FormItem
                            label="Địa điểm"
                            name="location"
                            rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                            type={variables.INPUT}
                          />
                        </Pane>
                        <Pane className="col-lg-12">
                          <Pane className="ant-col ant-form-item-label">
                            <label>
                              <span>Nội dung</span>
                            </label>
                          </Pane>
                          <Quill onChange={onChangeEditor} value={content} />
                        </Pane>
                      </Pane>
                    </Pane>

                    <Pane className="px20 pb20">
                      <Button
                        size="large"
                        color="success"
                        htmlType="submit"
                        style={{ marginLeft: 'auto' }}
                        loading={loadingSubmit}
                      >
                        Gửi
                      </Button>
                    </Pane>
                  </Pane>
                </Pane>
              </Pane>
            </Form>
          </Loading>
        </Pane>
      </>
    );
  },
);

Index.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  classes: PropTypes.arrayOf(PropTypes.any),
  branches: PropTypes.arrayOf(PropTypes.any),
  menuLeft: PropTypes.arrayOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  loading: {},
  classes: [],
  branches: [],
  menuLeft: [],
  error: {},
};

export default withRouter(connect(mapStateToProps)(Index));
