import { memo, useRef, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Radio, Checkbox, List, message } from 'antd';
import { history } from 'umi';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Quill from '@/components/CommonComponent/Quill';
import Text from '@/components/CommonComponent/Text';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import styles from '@/assets/styles/Common/information.module.scss';
import variablesModules from '../utils/variables';
import { useSelector, useDispatch } from 'dva';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import { variables, Helper } from '@/utils';
import { head, size, isEmpty } from 'lodash';
import InfiniteScroll from 'react-infinite-scroller';
import { Scrollbars } from 'react-custom-scrollbars';
import moment from 'moment';

const { Item: FormItemAntd } = Form;
const { Group: RadioGroup } = Radio;
const { Item: ListItem } = List;

const Index = memo(({}) => {
  const [
    menuData,
    { branches, divisions },
    loading,
  ] = useSelector(({ menu, notificationAdd, loading: { effects } }) => [
    menu.menuLeftNotification,
    notificationAdd,
    effects,
  ]);

  const filterRef = useRef();
  const formRef = useRef();
  const mounted = useRef(false);
  const mountedSet = (action, value) => mounted?.current && action(value);
  const dispatch = useDispatch();

  const [content, setContent] = useState('');
  const [type, setType] = useState(variablesModules.TYPE.EMPLOYEE);
  const [searchEmployee, setSearchEmployee] = useState({
    page: variables.PAGINATION.PAGE,
    limit: variables.PAGINATION.PAGE_SIZE,
    total: 0,
    hasMore: true,
    loading: false,
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

  const onChangeEditor = (value) => {
    mountedSet(setContent, value);
  };

  const onChangeType = (event) => {
    mountedSet(setType, event.target.value);
  };

  useEffect(() => {
    mounted.current = true;
    return () => (mounted.current = false);
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

  const onFinish = (values) => {
    console.log();
    const payload = {
      ...values,
      content,
      sentDate: moment(),
      employeeNews:
        type === variablesModules.TYPE.EMPLOYEE
          ? employees.filter((item) => item.checked).map((item) => ({ employeeId: item.id }))
          : [],
      parentNews:
        type === variablesModules.TYPE.PARENT
          ? parents.filter((item) => item.checked).map((item) => ({ employeeId: item.id }))
          : [],
    };
    dispatch({
      type: 'notificationAdd/ADD',
      payload,
      callback: (response, error) => {
        if (response) {
          history.goBack();
        }
        if (error) {
          if (error?.validationErrors && !isEmpty(error?.validationErrors)) {
            error?.validationErrors.forEach((item) => {
              this.formRef.current.setFields([
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

  return (
    <>
      <Helmet title="Tạo thông báo" />
      <Breadcrumbs last="Tạo thông báo" menu={menuData} />
      <Pane className="pr20 pl20">
        <Pane className="row">
          <Pane className="col-lg-6">
            <Pane className="card">
              <Form layout="vertical" ref={filterRef}>
                <Pane className="border-bottom" style={{ padding: '20px 20px 0 20px' }}>
                  <Pane className="mb20">
                    <Heading type="form-title">Thông tin chung</Heading>
                  </Pane>

                  <FormItemAntd label="Đối tượng gửi">
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
                            rules={[variables.RULES.EMPTY]}
                            type={variables.SELECT}
                          />
                        </Pane>
                        <Pane className="col-lg-6">
                          <FormItem
                            label="Bộ phận"
                            name="divisionId"
                            data={divisions}
                            rules={[variables.RULES.EMPTY]}
                            type={variables.SELECT}
                          />
                        </Pane>
                      </Pane>
                    </Pane>
                    <Pane className="border-bottom" style={{ padding: '10px 20px 0 20px' }}>
                      <FormItemAntd label="Người nhận thông báo">
                        <Checkbox>Tất cả nhân viên</Checkbox>
                      </FormItemAntd>
                    </Pane>

                    <Pane className="border-bottom">
                      <Scrollbars autoHeight autoHeightMax={window.innerHeight - 600}>
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
                            renderItem={({ id, fullName, positionLevel, fileImage, checked }) => (
                              <ListItem key={id} className={styles.listItem}>
                                <Pane className="px20 w-100 d-flex align-items-center">
                                  <Checkbox
                                    checked={!!checked}
                                    className="mr15"
                                    onChange={(event) => changeCheckboxEmployee(id)}
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
                    </Pane>

                    <Pane className="p20">
                      <Text color="dark" size="normal">
                        Đã chọn {size(employees.filter((item) => item.checked))} nhân viên
                      </Text>
                    </Pane>
                  </>
                )}
                {type === variablesModules.TYPE.PARENT && (
                  <>
                    <Pane className="border-bottom" style={{ padding: '10px 20px 0 20px' }}>
                      <FormItemAntd label="Người nhận thông báo">
                        <Checkbox>Tất cả phụ huynh</Checkbox>
                      </FormItemAntd>
                    </Pane>

                    <Pane className="border-bottom">
                      <Scrollbars autoHeight autoHeightMax={window.innerHeight - 500}>
                        <InfiniteScroll
                          hasMore={!searchParent.loading && searchParent.hasMore}
                          initialLoad={searchParent.loading}
                          loadMore={handleInfiniteOnLoadParent}
                          pageStart={0}
                          useWindow={false}
                        >
                          <List
                            dataSource={parents}
                            renderItem={({ id, fullName, fileImage, checked }) => (
                              <ListItem key={id} className={styles.listItem}>
                                <Pane className="px20 w-100 d-flex align-items-center">
                                  <Checkbox
                                    checked={!!checked}
                                    className="mr15"
                                    onChange={(event) => changeCheckboxParent(id)}
                                  />
                                  <Pane className={styles.userInformation}>
                                    <AvatarTable fileImage={Helper.getPathAvatarJson(fileImage)} />
                                    <Pane>
                                      <h3>{fullName}</h3>
                                    </Pane>
                                  </Pane>
                                </Pane>
                              </ListItem>
                            )}
                          />
                        </InfiniteScroll>
                      </Scrollbars>
                    </Pane>

                    <Pane className="p20">
                      <Text color="dark" size="normal">
                        Đã chọn {size(parents.filter((item) => item.checked))} phụ huynh
                      </Text>
                    </Pane>
                  </>
                )}
              </Form>
            </Pane>
          </Pane>

          <Pane className="col-lg-6">
            <Form layout="vertical" ref={formRef} initialValues={{}} onFinish={onFinish}>
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
                  <Quill onChange={onChangeEditor} value={content} />
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
                      !parents.find((item) => item.checked)
                    }
                  >
                    Gửi thông báo
                  </Button>
                </Pane>
              </Pane>
            </Form>
          </Pane>
        </Pane>
      </Pane>
    </>
  );
});

export default Index;
