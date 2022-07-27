import { memo, useRef, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Radio, Checkbox, List, message } from 'antd';
import { history, useParams } from 'umi';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Quill from '@/components/CommonComponent/Quill';
import EditorToolbar, { modules, formats } from "@/components/CommonComponent/EditorToolbar";
import Text from '@/components/CommonComponent/Text';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import styles from '@/assets/styles/Common/information.module.scss';
import { useSelector, useDispatch } from 'dva';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import { variables, Helper } from '@/utils';
import { head, size, isEmpty, debounce } from 'lodash';
import InfiniteScroll from 'react-infinite-scroller';
import { Scrollbars } from 'react-custom-scrollbars';
import moment from 'moment';
import variablesModules from '../utils/variables';

const { Item: FormItemAntd } = Form;
const { Group: RadioGroup } = Radio;
const { Item: ListItem } = List;

const Index = memo(() => {
  const [
    menuData,
    { branches, divisions, details },
    loading,
    { defaultBranch },
  ] = useSelector(({ menu, notificationAdd, loading: { effects }, user }) => [
    menu.menuLeftNotification,
    notificationAdd,
    effects,
    user,
  ]);

  const formRef = useRef();
  const mounted = useRef(false);
  const params = useParams();
  const mountedSet = (action, value) => mounted?.current && action(value);
  const dispatch = useDispatch();

  const [content, setContent] = useState('');
  const [isAllEmployees, setIsAllEmployees] = useState(false);
  const [checkTime, setCheckTime] = useState(undefined);
  const [isAllParents, setIsAllParents] = useState(false);
  const [type, setType] = useState(variablesModules.TYPE.EMPLOYEE);
  const [searchEmployee, setSearchEmployee] = useState({
    page: variables.PAGINATION.PAGE,
    limit: variables.PAGINATION.PAGE_SIZE,
    total: 0,
    hasMore: true,
    loading: false,
    branchId: defaultBranch?.id || null,
    divisionId: null,
  });
  const [searchParent, setSearchParent] = useState({
    page: variables.PAGINATION.PAGE,
    limit: variables.PAGINATION.PAGE_SIZE,
    total: 0,
    hasMore: true,
    loading: false,
  });
  const [employees, setEmployees] = useState([]);
  const [parents, setParents] = useState([]);
  const [employeesActive, setEmployeesActive] = useState([]);
  const [parentsActive, setParentsActive] = useState([]);
  const [dataClass, setDataClass] = useState([]);

  const onChangeEditor = (value) => {
    mountedSet(setContent, value);
  };

  const onChangeType = (event) => {
    mountedSet(setType, event.target.value);
  };

  /**
   * Function debounce search
   * @param {string} value value of object search
   * @param {string} type key of object search
   */
  const debouncedSearchKeyWork = debounce((value) => {
    mountedSet(setSearchParent, { ...searchParent, loading: true });
    dispatch({
      type: 'notificationAdd/GET_PARENTS',
      payload: {
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.PAGE_SIZE,
        KeyWord: value?.trim(),
      },
      callback: (response) => {
        if (response) {
          mountedSet(setParents, response.items);
          mountedSet(setSearchParent, {
            ...searchParent,
            total: response.totalCount,
            page: variables.PAGINATION.PAGE,
            limit: variables.PAGINATION.PAGE_SIZE,
          });
        }
      },
    });
  }, 300);

  const onChangeKeywork = (e) => {
    debouncedSearchKeyWork(e.target.value);
  };

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  useEffect(() => {
    dispatch({
      type: 'notificationAdd/GET_BRANCHES',
      payload: {},
    });
    dispatch({
      type: 'notificationAdd/GET_DIVISIONS',
      payload: {},
    });
  }, []);

  useEffect(() => {
    mountedSet(setSearchEmployee, { ...searchEmployee, loading: true });
    dispatch({
      type: 'notificationAdd/GET_EMPLOYEES',
      payload: {
        ...searchEmployee,
      },
      callback: (response) => {
        if (response) {
          mountedSet(setEmployees, response.parsePayload);
          mountedSet(setSearchEmployee, {
            ...searchEmployee,
            total: response.pagination.total,
            loading: false,
          });
        }
      },
    });
  }, []);

  useEffect(() => {
    mountedSet(setSearchParent, { ...searchParent, loading: true });
    dispatch({
      type: 'notificationAdd/GET_PARENTS',
      payload: {
        ...searchParent,
      },
      callback: (response) => {
        if (response) {
          mountedSet(setParents, response.items);
          mountedSet(setSearchParent, { ...searchParent, total: response.totalCount });
        }
      },
    });
  }, []);

  const onChangeBranch = (value) => {
    mountedSet(setSearchEmployee, { ...searchEmployee, loading: true });
    dispatch({
      type: 'notificationAdd/GET_EMPLOYEES',
      payload: {
        ...searchEmployee,
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.PAGE_SIZE,
        branchId: value,
      },
      callback: (response) => {
        if (response) {
          mountedSet(setEmployees, response.parsePayload);
          mountedSet(setSearchEmployee, {
            ...searchEmployee,
            page: variables.PAGINATION.PAGE,
            limit: variables.PAGINATION.PAGE_SIZE,
            branchId: value,
            total: response.pagination.total,
            loading: false,
          });
        }
      },
    });
  };

  const onChangeBranchParent = (value) => {

    dispatch({
      type: 'notificationAdd/GET_CLASS',
      payload: {
        branch: value,
      },
      callback: (response) => {
        if (response) {
          mountedSet(setDataClass, response.items);
        }
      },
    });
  };

  const onChangeDivision = (value) => {
    mountedSet(setSearchEmployee, { ...searchEmployee, loading: true });
    dispatch({
      type: 'notificationAdd/GET_EMPLOYEES',
      payload: {
        ...searchEmployee,
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.PAGE_SIZE,
        divisionId: value,
      },
      callback: (response) => {
        if (response) {
          mountedSet(setEmployees, response.parsePayload);
          mountedSet(setSearchEmployee, {
            ...searchEmployee,
            page: variables.PAGINATION.PAGE,
            limit: variables.PAGINATION.PAGE_SIZE,
            divisionId: value,
            total: response.pagination.total,
            loading: false,
          });
        }
      },
    });
  };

  const debouncedSearchUser = debounce((value) => {
    dispatch({
      type: 'notificationAdd/GET_EMPLOYEES',
      payload: {
        fullName: value,
      },
      callback: (response) => {
        if (response) {
          mountedSet(setEmployees, response.parsePayload);
          mountedSet(setSearchEmployee, {
            ...searchEmployee,
            page: variables.PAGINATION.PAGE,
            limit: variables.PAGINATION.PAGE_SIZE,
            divisionId: value,
            total: response.pagination.total,
            loading: false,
          });
        }
      },
    });
  }, 600);

  const onChangeSearch = (value) => {
    debouncedSearchUser(value);
  };

  const changeCheckboxEmployee = (id) => {
    mountedSet(
      setEmployees,
      employees.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)),
    );
  };

  const changeCheckboxParent = (id) => {
    mountedSet(
      setParents,
      parents.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)),
    );
  };

  const handleInfiniteOnLoad = () => {
    mountedSet(setSearchEmployee, { ...searchEmployee, loading: true });
    if (employees.length >= searchEmployee.total) {
      message.warning('Danh sách đã hiển thị tất cả.');
      mountedSet(setSearchEmployee, { ...searchEmployee, hasMore: false, loading: false });
      return;
    }
    dispatch({
      type: 'notificationAdd/GET_EMPLOYEES',
      payload: {
        ...searchEmployee,
        page: searchEmployee.page + 1,
      },
      callback: (response, error) => {
        if (response) {
          mountedSet(setEmployees, employees.concat(response.parsePayload));
          mountedSet(setSearchEmployee, {
            ...searchEmployee,
            total: response.pagination.total,
            page: searchEmployee.page + 1,
            loading: false,
          });
        }
        if (error) {
          message.error('Lỗi hệ thống.');
          mountedSet(setSearchEmployee, { ...searchEmployee, hasMore: false, loading: false });
        }
      },
    });
  };

  const handleInfiniteOnLoadParent = () => {
    mountedSet(setSearchParent, { ...searchParent, loading: true });
    if (employees.length >= searchParent.total) {
      message.warning('Danh sách đã hiển thị tất cả.');
      mountedSet(setSearchParent, { ...searchParent, hasMore: false, loading: false });
      return;
    }
    dispatch({
      type: 'notificationAdd/GET_PARENTS',
      payload: {
        ...searchParent,
        page: searchParent.page + 1,
      },
      callback: (response, error) => {
        if (response) {
          mountedSet(setParents, parents.concat(response.items));
          mountedSet(setSearchParent, {
            ...searchParent,
            total: response.totalCount,
            page: searchParent.page + 1,
            loading: false,
          });
        }
        if (error) {
          message.error('Lỗi hệ thống.');
          mountedSet(setSearchParent, { ...searchParent, hasMore: false, loading: false });
        }
      },
    });
  };

  const changeAll = (type, event) => {
    if (type === variablesModules.TYPE.EMPLOYEE) {
      mountedSet(setIsAllEmployees, event.target.checked);
    } else {
      mountedSet(setIsAllParents, event.target.checked);
    }
  };

  const onFinish = (values) => {
    const payload = {
      ...values,
      RemindDate: checkTime ? Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: values.RemindDate,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }) : Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: moment(),
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
      RemindTime: checkTime ? Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: values.RemindTime,
        }),
        format: variables.DATE_FORMAT.HOUR,
        isUTC: false,
      }) : Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: moment(),
        }),
        format: variables.DATE_FORMAT.HOUR,
        isUTC: false,
      }),
      id: params.id,
      content,
      sentDate: moment(),
      isAllEmployees,
      isAllParents,
      employeeNews:
        type === variablesModules.TYPE.EMPLOYEE && !isAllEmployees
          ? employees.filter((item) => item.checked).map((item) => ({ employeeId: item.id }))
          : [],
      parentNews:
        type === variablesModules.TYPE.PARENT && !isAllParents
          ? parents.filter((item) => item.checked).map((item) => ({ parentId: item.id }))
          : [],
    };
    dispatch({
      type: params.id ? 'notificationAdd/UPDATE' : 'notificationAdd/ADD',
      payload,
      callback: (response, error) => {
        if (response) {
          history.goBack();
        }
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
    if (params.id && !isEmpty(employees) && !isEmpty(parents)) {
      dispatch({
        type: 'notificationAdd/GET_DETAILS',
        payload: params,
        callback: (response) => {
          if (response) {
            mountedSet(setContent, response.content);
            mountedSet(
              setType,
              !isEmpty(response.employeeNews)
                ? variablesModules.TYPE.EMPLOYEE
                : variablesModules.TYPE.PARENT,
            );
            formRef.current.setFieldsValue({
              title: response.title,
              branchId: response?.branch?.id,
              divisionId: response?.division?.id,
              ClassId: response?.class?.id,
              IsReminded: response?.isReminded,
              RemindTime: moment(response?.remindTime, variables.DATE_FORMAT.HOUR),
              RemindDate: moment(response.remindDate),
            });
            mountedSet(
              setParents,
              parents.map((item) => {
                const itemParent = response.parentNews.find(
                  (itemE) => itemE?.parent?.id === item.id,
                );
                return {
                  ...item,
                  checked: !!itemParent,
                };
              }),
            );
            mountedSet(setIsAllEmployees, response.isAllEmployees);
            mountedSet(setIsAllParents, response.isAllParents);
            mountedSet(
              setEmployees,
              employees.map((item) => {
                const itemEmloyee = response.employeeNews.find(
                  (itemE) => itemE?.employee?.id === item.id,
                );
                return {
                  ...item,
                  checked: !!itemEmloyee,
                };
              }),
            );
            mountedSet(setEmployeesActive, response?.employeeNews);
            mountedSet(setParentsActive, response?.parentNews);
          }
          if (response?.branch?.id) {
            dispatch({
              type: 'notificationAdd/GET_CLASS',
              payload: {
                branch: response?.branch?.id,
              },
              callback: (response) => {
                if (response) {
                  mountedSet(setDataClass, response.items);
                }
              },
            });
          }
        },
      });
    }
  }, [
    params.id &&
    !isEmpty(employees) &&
    searchEmployee.hasMore &&
    !isEmpty(parents) &&
    searchParent.hasMore,
  ]);

  const onchangCheck = (e) => {
    setCheckTime(e.target.checked);
  };

  return (
    <Form
      layout="vertical"
      ref={formRef}
      initialValues={{
        branchId: defaultBranch?.id || null,
      }}
      onFinish={onFinish}
    >
      <Helmet title={params.id ? 'Chỉnh sửa thông báo' : 'Tạo thông báo'} />
      <Breadcrumbs last={params.id ? 'Chỉnh sửa thông báo' : 'Tạo thông báo'} menu={menuData} />
      <Pane className="pr20 pl20">
        <Pane className="row">
          <Pane className="col-lg-6">
            <Pane className="card">
              <Pane className="border-bottom" style={{ padding: '20px 20px 0 20px' }}>
                <Pane className="mb20">
                  <Heading type="form-title">Thông tin chung</Heading>
                </Pane>

                <FormItemAntd label="Đối tượng nhận">
                  <RadioGroup
                    options={variablesModules.TYPES}
                    value={type}
                    onChange={onChangeType}
                  />
                </FormItemAntd>
              </Pane>

              {type === variablesModules.TYPE.EMPLOYEE && (
                <>
                  <Pane className="border-bottom" style={{ padding: '20px 20px 0 20px' }}>
                    <Pane className="row">
                      <Pane className="col-lg-6">
                        <FormItem
                          label="Cơ sở"
                          name="branchId"
                          data={branches}
                          type={variables.SELECT}
                          onChange={onChangeBranch}
                        />
                      </Pane>
                      <Pane className="col-lg-6">
                        <FormItem
                          label="Bộ phận"
                          name="divisionId"
                          data={divisions}
                          type={variables.SELECT}
                          onChange={onChangeDivision}
                        />
                      </Pane>
                    </Pane>
                  </Pane>
                  <Pane className="border-bottom" style={{ padding: '10px 20px 0 20px' }}>
                    <FormItemAntd label="Người nhận thông báo">
                      <FormItem
                        name="FullName"
                        placeholder="Nhập từ khóa tìm kiếm"
                        type={variables.INPUT_SEARCH}
                        onChange={(e) => onChangeSearch(e.target.value)}
                      />
                      <Checkbox
                        checked={isAllEmployees}
                        onChange={(event) => changeAll(variablesModules.TYPE.EMPLOYEE, event)}
                      >
                        Tất cả nhân viên
                      </Checkbox>
                    </FormItemAntd>
                  </Pane>
                  {!isAllEmployees && (
                    <Pane className="border-bottom">
                      <Scrollbars autoHeight autoHeightMax="40vh">
                        <InfiniteScroll
                          hasMore={!searchEmployee.loading && searchEmployee.hasMore}
                          initialLoad={searchEmployee.loading}
                          loadMore={handleInfiniteOnLoad}
                          pageStart={0}
                          useWindow={false}
                        >
                          <List
                            loading={searchEmployee.loading}
                            dataSource={employees}
                            renderItem={({ id, fullName, positionLevel, fileImage }) => {
                              const checked = employeesActive.find(
                                (item) => item.employee.id === id,
                              );

                              return (
                                <ListItem key={id} className={styles.listItem}>
                                  <Pane className="px20 w-100 d-flex align-items-center">
                                    <Checkbox
                                      defaultChecked={checked}
                                      className="mr15"
                                      onChange={() => changeCheckboxEmployee(id)}
                                    />
                                    <Pane className={styles.userInformation}>
                                      <AvatarTable
                                        fileImage={Helper.getPathAvatarJson(fileImage)}
                                      />
                                      <Pane>
                                        <h3>{fullName}</h3>
                                        <p>{head(positionLevel)?.position?.name}</p>
                                      </Pane>
                                    </Pane>
                                  </Pane>
                                </ListItem>
                              );
                            }}
                          />
                        </InfiniteScroll>
                      </Scrollbars>
                    </Pane>
                  )}

                  <Pane className="p20">
                    {!isAllEmployees && (
                      <Text color="dark" size="normal">
                        Đã chọn {size(employees?.filter((item) => item.checked))} nhân viên
                      </Text>
                    )}
                  </Pane>
                </>
              )}
              {type === variablesModules.TYPE.PARENT && (
                <>
                  <Pane className="border-bottom" style={{ padding: '20px 20px 0 20px' }}>
                    <Pane className="row">
                      <Pane className="col-lg-6">
                        <FormItem
                          label="Cơ sở"
                          name="branchId"
                          data={branches}
                          type={variables.SELECT}
                          onChange={onChangeBranchParent}
                        />
                      </Pane>
                      <Pane className="col-lg-6">
                        <FormItem
                          label="Lớp"
                          name="ClassId"
                          data={dataClass}
                          type={variables.SELECT}
                          onChange={onChangeDivision}
                        />
                      </Pane>
                      <Pane className="col-lg-12">
                        <FormItem
                          label="Người nhận"
                          name="keyWork"
                          type={variables.INPUT_SEARCH}
                          onChange={onChangeKeywork}
                        />
                      </Pane>
                    </Pane>
                  </Pane>
                  <Pane className="border-bottom" style={{ padding: '10px 20px 0 20px' }}>
                    <FormItemAntd label="Người nhận thông báo">
                      <Checkbox
                        checked={isAllParents}
                        onChange={(event) => changeAll(variablesModules.TYPE.PARENT, event)}
                      >
                        Tất cả phụ huynh
                      </Checkbox>
                    </FormItemAntd>
                  </Pane>

                  {!isAllParents && (
                    <Pane className="border-bottom">
                      <Scrollbars autoHeight autoHeightMax="40vh">
                        <InfiniteScroll
                          hasMore={!searchParent.loading && searchParent.hasMore}
                          initialLoad={searchParent.loading}
                          loadMore={handleInfiniteOnLoadParent}
                          pageStart={0}
                          useWindow={false}
                        >
                          <List
                            dataSource={parents}
                            renderItem={({ id, fullName, fileImage }) => {
                              const checked = parentsActive?.find((item) => item.parent.id === id);

                              return (
                                <ListItem key={id} className={styles.listItem}>
                                  <Pane className="px20 w-100 d-flex align-items-center">
                                    <Checkbox
                                      defaultChecked={checked}
                                      className="mr15"
                                      onChange={() => changeCheckboxParent(id)}
                                    />
                                    <Pane className={styles.userInformation}>
                                      <AvatarTable
                                        fileImage={Helper.getPathAvatarJson(fileImage)}
                                      />
                                      <Pane>
                                        <h3>{fullName}</h3>
                                      </Pane>
                                    </Pane>
                                  </Pane>
                                </ListItem>
                              );
                            }}
                          />
                        </InfiniteScroll>
                      </Scrollbars>
                    </Pane>
                  )}

                  <Pane className="p20">
                    {!isAllParents && (
                      <Text color="dark" size="normal">
                        Đã chọn {size(parents?.filter((item) => item.checked))} phụ huynh
                      </Text>
                    )}
                  </Pane>
                </>
              )}
            </Pane>
            {params.id && (
              <Pane className="card">
                <Pane className="border-bottom" style={{ padding: 20 }}>
                  <Heading type="form-title">Lịch sử</Heading>
                </Pane>
                <List
                  dataSource={Helper.onSortDates(details?.history, 'logtime') || []}
                  renderItem={(item) => (
                    <ListItem key={item.id} className={styles.listItem}>
                      <Pane style={{ width: '100%' }} className="row pr20 pl20">
                        <Pane className="col-md-5">
                          <Heading type="form-sub-title" style={{ marginBottom: 10 }}>
                            {Helper.getDate(item.logtime, variables.DATE_FORMAT.DATE_TIME)}
                          </Heading>
                        </Pane>
                        <Pane className="col-md-7">
                          <Pane>
                            {item?.editor?.objectInfo?.fullName || item?.editor?.name}{' '}
                            {variablesModules?.ACTION_TYPE[item.httpMethod]}
                          </Pane>
                        </Pane>
                      </Pane>
                    </ListItem>
                  )}
                />
              </Pane>
            )}
          </Pane>

          <Pane className="col-lg-6">
            <Pane className="card">
              <Pane className="border-bottom" style={{ padding: '20px' }}>
                <Pane className="mb20">
                  <Heading type="form-title">Tạo thông báo</Heading>
                </Pane>

                <FormItem
                  name="title"
                  label="Tiêu đề"
                  type={variables.INPUT}
                  rules={[variables.RULES.EMPTY_INPUT]}
                />
                <div className="ant-col ant-form-item-label">
                  <label>
                    <span>Nội dung</span>
                  </label>
                </div>
                <EditorToolbar />
                <Quill onChange={onChangeEditor} value={content} theme="snow" modules={modules}
                  formats={formats} />
                <Pane className="col-lg-12 mt20 d-flex p0">
                  <Pane className="mr15">
                    <FormItem
                      className="checkbox-row checkbox-small p0"
                      label="Đặt hẹn giờ gửi"
                      name="IsReminded"
                      type={variables.CHECKBOX_FORM}
                      valuePropName="checked"
                      onClick={onchangCheck}
                    />
                  </Pane>
                  <Pane className='mr15'>
                    <FormItem
                      name="RemindDate"
                      type={variables.DATE_PICKER}
                      rules={checkTime ? [variables.RULES.EMPTY] : []}
                    />
                  </Pane>
                  <Pane >
                    <FormItem
                      name="RemindTime"
                      type={variables.TIME_PICKER}
                      rules={checkTime ? [variables.RULES.EMPTY] : []}
                    />
                  </Pane>
                </Pane>
              </Pane>
              <Pane className="p20">
                <Button
                  color="success"
                  size="large"
                  loading={
                    loading['notificationAdd/GET_BRANCHES'] ||
                    loading['notificationAdd/GET_DIVISIONS'] ||
                    loading['notificationAdd/ADD'] ||
                    loading['notificationAdd/UPDATE']
                  }
                  style={{ marginLeft: 'auto' }}
                  htmlType="submit"
                  disabled={
                    !employees.find((item) => item.checked) &&
                    !parents.find((item) => item.checked) &&
                    !isAllEmployees &&
                    !isAllParents
                  }
                >
                  Gửi
                </Button>
              </Pane>
            </Pane>
          </Pane>
        </Pane>
      </Pane>
    </Form>
  );
});

export default Index;
