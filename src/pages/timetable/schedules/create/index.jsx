import { memo, useRef, useEffect, useState } from 'react';
import { Form, List, Checkbox, message, Upload } from 'antd';
import csx from 'classnames';
import { connect, history, withRouter } from 'umi';
import { head, isEmpty, size, last } from 'lodash';
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
import stylesForm from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import EditorToolbar, { modules, formats } from "./EditorToolbar";

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
    const [countCheck, setCountCheck] = useState(false);
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
    const [dataCheck, setDataCheck] = useState([]);
    const [type, setType] = useState('');
    const [errorStudent, setError] = useState(false);
    const [selectClass, setSelectClass] = useState([]);
    const [fileImage, setFileImage] = useState([]);
    const [isTime, setIsTime] = useState(false);

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
      let classTimetables = isAllClass ? classes?.map(item => ({ ClassId: item.id })) : values?.classes?.map(item => ({ ClassId: item }));
      let parentTimetables = isAllStudent ? [] : students?.filter(item => item.checked)?.map(item => ({ studentId: item.id }));
      if (values?.object === 'forPerson') {
        classTimetables = [];
      }
      if (values?.object === 'forClass') {
        parentTimetables = [];
      }
      const startTime = !isEmpty(values?.rangeTime) ? Helper.getDate(values.rangeTime[0], variables.DATE_FORMAT.TIME_FULL) : null;
      const endTime = !isEmpty(values?.rangeTime) ? Helper.getDate(values.rangeTime[1], variables.DATE_FORMAT.TIME_FULL) : null;
      const payload = {
        ...values,
        isReminded,
        isAllClass,
        isAllStudent,
        content,
        fileAttach: !isEmpty(fileImage) ? JSON.stringify(fileImage) : undefined,
        forClass: values?.object === 'forClass',
        forPerson: values?.object === 'forPerson',
        Class: values?.Class || null,
        classTimetables,
        parentTimetables,
        scheduleSendingDate: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: values.scheduleSendingDate,
            targetValue: '00:00:00',
          }),
          isUTC: true,
        }),
        scheduleSendingTime: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: values.time,
          }),
          format: variables.DATE_FORMAT.HOUR,
          isUTC: false,
        }),
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
        id: params?.id || undefined,
      };
      dispatch({
        type: params?.id ? 'timeTablesScheduleAdd/UPDATE' : 'timeTablesScheduleAdd/ADD',
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
      setCountCheck(true);
      mountedSet(
        setStudents,
        students.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)),
      );
    };

    const getStudents = (search, studentOld = []) => {
      mountedSet(setSearchStudents, { ...search, loading: true });
      dispatch({
        type: 'timeTablesScheduleAdd/GET_STUDENTS',
        payload: {
          ...search,
        },
        callback: (response) => {
          if (response) {
            let newStudent = response.items || [];
            if (!isEmpty(studentOld) && !isEmpty(response.items)) {
              newStudent = response.items.map(item => {
                const reuslt = studentOld.find(obj => obj?.student?.id === item?.id);
                if (reuslt) {
                  return {
                    ...item,
                    checked: true,
                  };
                }
                return item;
              });
            }
            mountedSet(setStudents, newStudent);
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
            let newStudent = response.items || [];
            if (!isEmpty(dataCheck) && !isEmpty(response.items)) {
              newStudent = response.items.map(item => {
                const reuslt = dataCheck.find(obj => obj?.student?.id === item?.id);
                if (reuslt) {
                  return {
                    ...item,
                    checked: true,
                  };
                }
                return item;
              });
            }
            // mountedSet(setStudents, newStudent);
            mountedSet(setStudents, students.concat(newStudent));
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

    const getClasses = (branch) => {
      dispatch({
        type: 'timeTablesScheduleAdd/GET_CLASSES',
        payload: {
          branch,
        },
      });
    };

    const onChangeBranch = (branch) => {
      getClasses(branch);
      if (type === 'forPerson') {
        formRef?.current?.setFieldsValue({ Class: undefined });
        getStudents({
          page: variables.PAGINATION.PAGE,
          limit: 10,
          total: 0,
          hasMore: true,
          loading: false, branchId: branch, class: ''
        });
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
      getStudents({
        page: variables.PAGINATION.PAGE,
        limit: 10,
        total: 0,
        hasMore: true,
        loading: false, branchId: searchStudents?.BranchId, class: value
      });
    };

    const handleChooseAll = (e) => {
      setIsAllStudent(e.target.checked);
      mountedSet(
        setStudents,
        students.map((item) => ({ ...item, checked: false })),
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

    const onSetFileImage = (fileImage) => {
      setFileImage(Helper.isJSON(fileImage) ? JSON.parse(fileImage) : []);
    };

    useEffect(() => {
      if (params?.id) {
        dispatch({
          type: 'timeTablesScheduleDetails/GET_DETAILS',
          payload: {
            id: params?.id
          },
          callback: (res) => {
            if (res) {
              const classes = !isEmpty(res?.classTimetables) ? res?.classTimetables?.map(item => item?.class?.id) : [];
              formRef?.current?.setFieldsValue({
                ...res,
                applyDate: res?.applyDate ? moment(res?.applyDate) : null,
                scheduleSendingDate: res?.scheduleSendingDate ? moment(res?.scheduleSendingDate) : null,
                rangeTime: res?.startTime && res?.endTime ? [moment(res?.startTime), moment(res?.endTime)] : null,
                time: moment(res?.scheduleSendingTime, variables.DATE_FORMAT.HOUR),
                object: res?.forClass ? 'forClass' : 'forPerson',
                branchId: res?.branch?.id || null,
                classId: res?.class?.id || null,
                classes,
              });
              setIsTime(res?.isScheduled);
              onSetFileImage(res?.fileAttach);
              setContent(res?.content || '');
              setIsReminded(res?.isReminded || false);
              setType(res?.forClass ? 'forClass' : 'forPerson');
              setIsAllStudent(res?.isAllStudent);
              setIsAllClass(res?.isAllClass);
              if (res?.branch?.id) {
                getClasses(res?.branch?.id);
              }
              setDataCheck(res?.parentTimetables);
              if (res?.class?.id) {
                getStudents({ ...searchStudents, branchId: res?.branch?.id, class: res?.class?.id }, res?.parentTimetables);
              }
            }
          }
        });
      }
      dispatch({
        type: 'timeTablesScheduleAdd/GET_BRANCHES',
        payload: params,
      });
    }, []);

    const onRemoveFile = () => {
      setFileImage(null);
    };

    const onUpload = (files) => {
      dispatch({
        type: 'upload/UPLOAD',
        payload: files,
        callback: (response) => {
          if (response) {
            setFileImage([head(response.results)?.fileInfo]);
          }
        },
      });
    };

    const props = {
      beforeUpload() {
        return null;
      },
      customRequest({ file }) {
        const { name } = file;
        const allowTypes = ['pdf', 'docx', 'xlsx'];
        if (!allowTypes.includes(last(name.split('.')))) {
          message.error('Chỉ hỗ trợ định dạng .pdf, .docx, .xlsx. Dung lượng không được quá 5mb');
          return;
        }
        onUpload(file);
      },
      showUploadList: false,
      fileList: [],
    };

    return (
      <>
        <Breadcrumbs last={params?.id ? 'Chỉnh sửa thời khóa biểu' : 'Tạo thời khóa biểu'} menu={menuLeft} />
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
                      {
                        isReminded && (
                          <>
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
                                rules={[variables.RULES.EMPTY, variables.RULES.MAX_LENGTH_TEXTAREA]}
                                type={variables.TEXTAREA}
                              />
                            </Pane>
                          </>
                        )
                      }
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
                        {!isAllStudent && countCheck ? (
                          <div className="pt15">
                            <Text color="dark" size="normal">
                              Đã chọn {size(students.filter(item => item?.checked))}
                            </Text>
                          </div>) : <div className="pt15">
                          <Text color="dark" size="normal">
                            Đã chọn {dataCheck?.length}
                          </Text>
                        </div>
                        }
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
                          <EditorToolbar />
                          <Quill
                            theme="snow"
                            value={content}
                            onChange={onChangeEditor}
                            modules={modules}
                            formats={formats}
                          />
                        </Pane>
                        <Pane className="col-lg-12 mt15 mb15">
                          <div>
                            <label className="ant-col ant-form-item-label d-flex">
                              <span>Tài liệu đính kèm</span>
                            </label>
                            <Upload {...props} className={stylesForm['upload-file']}>
                              <Button color="transparent" icon="upload1">
                                Tải lên
                              </Button>
                              <i>Chỉ hỗ trợ định dạng .xlsx. Dung lượng không được quá 5mb</i>
                            </Upload>
                          </div>
                        </Pane>
                        <Pane className="col-lg-12 border-top border-bottom">
                          {!isEmpty(fileImage) && (
                            <div className={csx(stylesForm['files-container'], 'mt5')}>
                              {fileImage.map((item) => (
                                <div className={stylesForm.item} key={item.id}>
                                  <a href={`${API_UPLOAD}${item.url}`} target="_blank" rel="noreferrer">
                                    {item?.name}
                                  </a>
                                  <span
                                    role="presentation"
                                    className="icon-cross"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onRemoveFile();
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </Pane>
                        <Pane className="col-lg-12 mt20 d-flex p0">
                          <Pane className="ml15">
                            <FormItem
                              className="checkbox-row checkbox-small p0"
                              label="Đặt hẹn giờ gửi"
                              name="isScheduled"
                              type={variables.CHECKBOX_FORM}
                              valuePropName="checked"
                              onChange={(e) => setIsTime(e.target.checked)}
                            />
                          </Pane>
                          {
                            isTime && (
                              <>
                                <Pane className='mr15 ml15'>
                                  <FormItem
                                    name="scheduleSendingDate"
                                    type={variables.DATE_PICKER}
                                    rules={[variables.RULES.EMPTY]}
                                  />
                                </Pane>
                                <Pane >
                                  <FormItem
                                    name="time"
                                    type={variables.TIME_PICKER}
                                    rules={[variables.RULES.EMPTY]}
                                  />
                                </Pane>
                              </>
                            )
                          }
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
