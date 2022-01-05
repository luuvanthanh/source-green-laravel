import { memo, useRef, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Checkbox, List, message } from 'antd';
import { history, useParams } from 'umi';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Quill from '@/components/CommonComponent/Quill';
import Text from '@/components/CommonComponent/Text';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import styles from '@/assets/styles/Common/information.module.scss';
import { useSelector, useDispatch } from 'dva';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import { variables, Helper } from '@/utils';
import { head, size, isEmpty, debounce } from 'lodash';
import InfiniteScroll from 'react-infinite-scroller';
import { Scrollbars } from 'react-custom-scrollbars';

const { Item: FormItemAntd } = Form;
const { Item: ListItem } = List;

const Index = memo(() => {
  const [
    { branches, divisions },
    loading,
    { defaultBranch },
  ] = useSelector(({ menu, HRMdocumentaryAdd, loading: { effects } }) => [
    HRMdocumentaryAdd,
    effects,
    menu,
  ]);

  const [formRef] = Form.useForm();
  const mounted = useRef(false);
  const params = useParams();
  const mountedSet = (action, value) => mounted?.current && action(value);
  const dispatch = useDispatch();

  const [content, setContent] = useState('');
  const [isAllEmployees, setIsAllEmployees] = useState(false);
  const [searchEmployee, setSearchEmployee] = useState({
    page: variables.PAGINATION.PAGE,
    limit: variables.PAGINATION.PAGE_SIZE,
    total: 0,
    hasMore: true,
    loading: false,
    branchId: defaultBranch?.id || null,
    divisionId: null,
  });
  const [employees, setEmployees] = useState([]);
  const [sentEmployees, setSentEmployees] = useState([]);
  const [emp, setEmp] = useState([]);

  const onChangeEditor = (value) => {
    mountedSet(setContent, value);
  };

  const debouncedSearchKeyWorkEmployee = debounce((value) => {
    mountedSet(setSearchEmployee, { ...searchEmployee, loading: true });
    dispatch({
      type: 'HRMdocumentaryAdd/GET_EMPLOYEES',
      payload: {
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.PAGE_SIZE,
        KeyWord: value?.trim(),
      },
      callback: (response) => {
        if (response) {
          mountedSet(setEmployees, response.items);
          mountedSet(setSearchEmployee, {
            ...searchEmployee,
            total: response.totalCount,
            page: variables.PAGINATION.PAGE,
            limit: variables.PAGINATION.PAGE_SIZE,
          });
        }
      },
    });
  }, 300);

  const onChangeKeyworkEmployee = (e) => {
    debouncedSearchKeyWorkEmployee(e.target.value);
  };

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  useEffect(() => {
    dispatch({
      type: 'HRMdocumentaryAdd/GET_BRANCHES',
      payload: {},
    });
    dispatch({
      type: 'HRMdocumentaryAdd/GET_DIVISIONS',
      payload: {},
    });
  }, []);

  useEffect(() => {
    mountedSet(setSearchEmployee, { ...searchEmployee, loading: true });
    dispatch({
      type: 'HRMdocumentaryAdd/GET_EMPLOYEES',
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

  const onChangeSendDivision = (value) => {
    mountedSet(setSearchEmployee, { ...searchEmployee, loading: true });
    dispatch({
      type: 'HRMdocumentaryAdd/GET_EMPLOYEES',
      payload: {
        divisionId: value,
      },
      callback: (response) => {
        if (response) {
          mountedSet(setSentEmployees, response.parsePayload);
        }
      },
    });
  };

  const onChangeBranch = (value) => {
    mountedSet(setSearchEmployee, { ...searchEmployee, loading: true });
    dispatch({
      type: 'HRMdocumentaryAdd/GET_EMPLOYEES',
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

  const onChangeDivision = (value) => {
    mountedSet(setSearchEmployee, { ...searchEmployee, loading: true });
    dispatch({
      type: 'HRMdocumentaryAdd/GET_EMPLOYEES',
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

  const changeCheckboxEmployee = (id) => {
    mountedSet(
      setEmployees,
      employees.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)),
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
      type: 'HRMdocumentaryAdd/GET_EMPLOYEES',
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

  const changeAll = (event) => {
    mountedSet(setIsAllEmployees, event.target.checked);
  };

  const onFinish = (values) => {
    const payload = {
      ...values,
      id: params.id,
      content,
      fileDocument: undefined,
      detail: !isAllEmployees
        ? employees.filter((item) => item.checked).map((item) => item.id)
        : [],
    };
    dispatch({
      type: params.id ? 'HRMdocumentaryAdd/UPDATE' : 'HRMdocumentaryAdd/ADD',
      payload,
      callback: (response, error) => {
        if (response) {
          history.goBack();
        }
        if (error) {
          if (error?.validationErrors && !isEmpty(error?.validationErrors)) {
            error?.validationErrors.forEach((item) => {
              formRef.setFields([
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
    if (params.id && !isEmpty(employees)) {
      dispatch({
        type: 'HRMdocumentaryAdd/GET_DETAILS',
        payload: params,
        callback: (response) => {
          if (response) {
            mountedSet(setContent, response.parsePayload.content);
            formRef.setFieldsValue({
              typeOfDocument: response.parsePayload?.typeOfDocument,
              topic: response.parsePayload?.topic,
              sentDivisionId: response.parsePayload?.sentDivisionId,
              employeeId: response.parsePayload?.employeeId,
              branchId: response.parsePayload?.branchId,
              receiveDivisionId: response.parsePayload?.receiveDivisionId,
              title: response.parsePayload.title,
              content: response.parsePayload.content,
            });
            setEmp(response.parsePayload?.employee);

            mountedSet(setIsAllEmployees, response.isAllEmployees);
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
          }
        },
      });
    }
  }, [params.id && !isEmpty(employees) && searchEmployee.hasMore]);

  return (
    <Form
      layout="vertical"
      form={formRef}
      initialValues={{
        branchId: defaultBranch?.id || null,
      }}
      onFinish={onFinish}
    >
      <Helmet title={params.id ? 'Chỉnh sửa' : 'Tạo mới'} />
      <Breadcrumbs last={params.id ? 'Chỉnh sửa' : 'Tạo mới'} />
      <Pane className="pr20 pl20">
        <Pane className="row">
          <Pane className="col-lg-6">
            <Pane className="card">
              <Pane className="border-bottom" style={{ padding: '20px 20px 0 20px' }}>
                <Pane className="mb20">
                  <Heading type="form-title">Thông tin chung</Heading>
                </Pane>
              </Pane>

              <Pane className="border-bottom" style={{ padding: '20px 20px 0 20px' }}>
                <Pane className="row">
                  <Pane className="col-lg-6">
                    <FormItem
                      label="Loại công văn"
                      name="typeOfDocument"
                      data={variables.DOCUMENT_TYPE}
                      type={variables.SELECT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </Pane>
                  <Pane className="col-lg-6">
                    <FormItem
                      label="Chủ đề"
                      name="topic"
                      data={variables.TOPIC_TYPE}
                      type={variables.SELECT}
                    />
                  </Pane>
                  <Pane className="col-lg-6">
                    <FormItem
                      label="Bộ phận gửi"
                      name="sentDivisionId"
                      data={divisions}
                      type={variables.SELECT}
                      rules={[variables.RULES.EMPTY]}
                      onChange={onChangeSendDivision}
                    />
                  </Pane>
                  <Pane className="col-lg-6">
                    <FormItem
                      label="Người gửi"
                      name="employeeId"
                      data={Helper.convertSelectUsers(sentEmployees)}
                      type={variables.SELECT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </Pane>
                </Pane>
              </Pane>
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
                      name="receiveDivisionId"
                      data={divisions}
                      type={variables.SELECT}
                      onChange={onChangeDivision}
                    />
                  </Pane>
                </Pane>
              </Pane>
              <Pane className="border-bottom" style={{ padding: '10px 20px 0 20px' }}>
                <Pane className="row">
                  <Pane className="col-lg-12">
                    <FormItem
                      label="Người nhận"
                      name="keyWork"
                      type={variables.INPUT_SEARCH}
                      onChange={onChangeKeyworkEmployee}
                    />
                  </Pane>
                </Pane>
                <FormItemAntd label="Người nhận thông báo">
                  <Checkbox checked={isAllEmployees} onChange={(event) => changeAll(event)}>
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
                          const record = emp.find((itemSelect) => itemSelect.id === id);

                          return (
                            <ListItem key={id} className={styles.listItem}>
                              <Pane className="px20 w-100 d-flex align-items-center">
                                <Checkbox
                                  checked={!!record}
                                  className="mr15"
                                  onChange={() => changeCheckboxEmployee(id)}
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
                    Đã chọn {size(emp)} nhân viên
                  </Text>
                )}
              </Pane>
            </Pane>
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
                <Quill onChange={onChangeEditor} value={content} />
              </Pane>
              <Pane className="p20 d-flex justify-content-end align-items-center">
                <Button color="gray" size="large" onClick={() => history.goBack()}>
                  Huỷ
                </Button>
                <Button
                  color="success"
                  size="large"
                  loading={
                    loading['HRMdocumentaryAdd/GET_BRANCHES'] ||
                    loading['HRMdocumentaryAdd/GET_DIVISIONS'] ||
                    loading['HRMdocumentaryAdd/ADD'] ||
                    loading['HRMdocumentaryAdd/UPDATE']
                  }
                  style={{ marginLeft: '10px' }}
                  htmlType="submit"
                  disabled={!employees.find((item) => item.checked) && !isAllEmployees}
                >
                  Lưu
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
