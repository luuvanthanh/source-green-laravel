
import { memo, useRef, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Radio, Checkbox, List, message } from 'antd';
import { history, useParams } from 'umi';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Quill from '@/components/CommonComponent/Quill';
import EditorToolbar, { modules, formats } from '@/components/CommonComponent/EditorToolbar';
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
    { branches, divisions },
    loading,
    { defaultBranch },
  ] = useSelector(({ menu, notificationAdd, loading: { effects }, user }) => [
    menu.menuLeftNotification,
    notificationAdd,
    effects,
    user,
  ]);
  const [defaultBranchs,] = useState(defaultBranch?.id ? [defaultBranch] : []);

  const formRef = useRef();
  const mounted = useRef(false);
  const params = useParams();
  const [details, setDetails] = useState(undefined);
  const mountedSet = (action, value) => mounted?.current && action(value);
  const dispatch = useDispatch();

  const [checkboxInput, setCheckboxInput] = useState(!params?.id);
  const [content, setContent] = useState('');
  const [isAllEmployees, setIsAllEmployees] = useState(false);
  const [checkTime, setCheckTime] = useState(undefined);
  const [isAllParents, setIsAllParents] = useState(false);
  const [type, setType] = useState(variablesModules.TYPE.EMPLOYEE);

  const [checkboxAll, setCheckboxAll] = useState(false);
  const [checkboxAllEmployees, setCheckboxAllEmployees] = useState(false);

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
    branchId: defaultBranch?.id || null,
    loading: false,
    classStatus: 'ALL',
  });
  const [employees, setEmployees] = useState([]);
  const [parents, setParents] = useState([]);
  // const [employeesActive, setEmployeesActive] = useState([]);
  // const [parentsActive, setParentsActive] = useState(undefined);
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
        ...searchParent,
        KeyWord: value?.trim(),
        total: undefined,
      },
      callback: (response) => {
        if (response) {
          mountedSet(setParents, response.items);
          mountedSet(setSearchParent, {
            ...searchParent,
            total: response.totalCount,
            page: variables.PAGINATION.PAGE,
            KeyWord: value?.trim(),
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

  // useEffect(() => {
  //   if (!params?.id) {
  //     mountedSet(setSearchEmployee, { ...searchEmployee, loading: true });
  //     dispatch({
  //       type: 'notificationAdd/GET_EMPLOYEES',
  //       payload: {
  //         ...searchEmployee,
  //       },
  //       callback: (response) => {
  //         if (response) {
  //           mountedSet(setEmployees, response.parsePayload);
  //           mountedSet(setSearchEmployee, {
  //             ...searchEmployee,
  //             total: response.pagination.total,
  //             loading: false,
  //           });
  //         }
  //       },
  //     });
  //   }
  // }, []);

  useEffect(() => {
    if (details?.id) {
      mountedSet(setSearchEmployee, { ...searchEmployee, branchId: details?.branchId });
      dispatch({
        type: 'notificationAdd/GET_EMPLOYEES',
        payload: {
          page: searchEmployee?.page,
          limit: searchEmployee?.limit,
          branchId: details?.branchId,
          divisionId: details?.divisionId,
        },
        callback: (response) => {
          if (response) {
            mountedSet(
              setEmployees,
              response.parsePayload?.map((item) => {
                const itemEmloyee = details.employeeNews.find(
                  (itemE) => itemE?.employee?.id === item.id,
                );
                return {
                  ...item,
                  checked: !!itemEmloyee,
                };
              }),
            );
            mountedSet(setSearchEmployee, {
              ...searchEmployee,
              branchId: details?.branchId,
              divisionId: details?.divisionId,
              total: response.pagination.total,
            });
          }
        },
      });
    }
  }, [details?.id]);

  useEffect(() => {
    if (defaultBranch?.id && !params?.id) {
      mountedSet(setSearchParent, { ...searchParent, loading: true });
      dispatch({
        type: 'notificationAdd/GET_PARENTS',
        payload: {
          ...searchParent,
        },
        callback: (response) => {
          if (response) {
            mountedSet(
              setParents,
              response.items,
            );
            mountedSet(setSearchParent, { ...searchParent, total: response.totalCount, loading: false });
          }
        },
      });
      dispatch({
        type: 'notificationAdd/GET_CLASS',
        payload: {
          branch: defaultBranch?.id,
        },
        callback: (response) => {
          if (response) {
            mountedSet(setDataClass, response.items);
          }
        },
      });

      dispatch({
        type: 'notificationAdd/GET_EMPLOYEES',
        payload: {
          ...searchParent,
        },
        callback: (response) => {
          if (response) {
            setEmployees(response.parsePayload);
            mountedSet(setSearchEmployee, {
              ...searchEmployee,
              total: response.pagination.total,
            });
          }
        },
      });
    }
  }, [defaultBranch?.id]);

  useEffect(() => {
    if (params?.id && details?.id) {
      dispatch({
        type: 'notificationAdd/GET_PARENTS',
        payload: {
          ...searchParent,
          branchId: details?.branch?.id,
          class: details?.class?.id,
          total: undefined,
        },
        callback: (response) => {
          if (response) {
            mountedSet(
              setParents,
              response.items?.map((item) => {
                const itemEmloyee = details.parentNews?.find(
                  (itemE) => itemE?.student?.id === item?.student?.id,
                );
                return {
                  ...item,
                  checked: !!itemEmloyee,
                };
              }),
            );
            // mountedSet(
            //   setParents,
            //   parents.map((item) => {
            //     const itemParent = response.parentNews.find(
            //       (itemE) => itemE?.parent?.id === item.id,
            //     );
            //     return {
            //       ...item,
            //       checked: !!itemParent,
            //     };
            //   }),
            // );
            mountedSet(setSearchParent, {
              ...searchParent,
              total: response.totalCount,
              branchId: details?.branch?.id,
              class: details?.class?.id,
              hasMore: true,
            });
          }
        },
      });
    }
  }, [details]);

  const onChangeBranch = (value) => {
    mountedSet(setSearchEmployee, { ...searchEmployee, loading: true, branchId: value });
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
    dispatch({
      type: 'notificationAdd/GET_PARENTS',
      payload: {
        ...searchParent,
      },
      callback: (response) => {
        if (response) {
          mountedSet(
            setParents,
            response.items,
          );
          mountedSet(setSearchParent, { ...searchParent, total: response.totalCount, loading: false });
        }
      },
    });
  };

  const onChangeBranchParent = (value) => {
    // formRef.current.setFieldsValue({
    //   class: "Chọn",
    // });
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
    mountedSet(setSearchParent, { ...searchParent, loading: true });
    dispatch({
      type: 'notificationAdd/GET_PARENTS',
      payload: {
        ...searchParent,
        total: undefined,
        branchId: value,
      },
      callback: (response) => {
        if (response) {
          mountedSet(setParents, response.items);
          mountedSet(setSearchParent, {
            ...searchParent,
            total: response.totalCount,
            branchId: value,
            skipCount: 0,
          });
        }
      },
    });
  };

  const onChangeDivision = (value) => {
    setIsAllEmployees(false);
    setCheckboxAllEmployees(true);
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
            divisionId: value,
            total: response.pagination.total,
            loading: false,
            page: 1,
            limit: 10,
            hasMore: true,
          });
        }
      },
    });
  };

  const onChangeClass = (value) => {
    setIsAllParents(false);
    setCheckboxAll(true);
    mountedSet(setSearchParent, {
      ...searchParent, loading: true, page: 1,
      limit: 10,
      classStatus: 'HAS_CLASS',
    });
    dispatch({
      type: 'notificationAdd/GET_PARENTS',
      payload: {
        branchId: searchParent.branchId,
        class: value,
        KeyWord: searchParent?.KeyWord,
        page: 1,
        limit: 10,
        classStatus: 'HAS_CLASS',
      },
      callback: (response) => {
        if (response) {
          setParents(response.items);
          mountedSet(setSearchParent, {
            ...searchParent,
            skipCount: 0,
            total: response.totalCount,
            class: value,
            classStatus: 'HAS_CLASS',
            page: 1,
            limit: 10,
            hasMore: true,
            loading: false
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
        branchId: searchEmployee?.branchId,
        divisionId: searchEmployee?.divisionId,
      },
      callback: (response) => {
        if (response) {
          mountedSet(setEmployees, response.parsePayload);
          setSearchEmployee({
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
  }, 300);

  const onChangeSearch = (value) => {
    debouncedSearchUser(value);
    setIsAllEmployees(false);
    setSearchEmployee({
      ...searchEmployee,
      fullName: value,
    });
  };

  const changeCheckboxEmployee = (id) => {
    setCheckboxInput(true);
    mountedSet(
      setEmployees,
      employees.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)),
    );
    const dataCheck = employees?.filter(i => i?.checked);
    if (dataCheck?.length <= 1 && head(dataCheck)?.id === id) {
      mountedSet(setIsAllEmployees, false);
    }
  };

  const changeCheckboxParent = (id) => {
    setCheckboxInput(true);
    mountedSet(
      setParents,
      parents.map((item) => (item?.student?.id === id ? { ...item, checked: !item.checked } : item)),
    );
    const dataCheckParent = parents?.filter(i => i?.checked);
    if (dataCheckParent?.length <= 1 && head(dataCheckParent)?.id === id) {
      mountedSet(setIsAllParents, false);
    }
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
        total: undefined,
        page: searchEmployee.page + 1,
      },
      callback: (response, error) => {
        if (response) {
          if (checkboxAllEmployees) {
            if (isAllEmployees) {
              mountedSet(setEmployees, employees.concat(response.parsePayload?.map(i => ({
                ...i,
                checked: true,
              }))));
            }
            else {
              mountedSet(setEmployees, employees.concat(response.parsePayload));
            }
          } else if (params.id) {
            mountedSet(setEmployees, employees.concat(
              response.parsePayload?.map((item) => {
                const itemEmloyee = details.employeeNews?.find(
                  (itemE) => itemE?.employee?.id === item.id,
                );
                return {
                  ...item,
                  checked: !!itemEmloyee,
                };
              }),
            ));
          }
          else if (isAllParents) {
            mountedSet(setEmployees, employees.concat(response.parsePayload?.map(i => ({
              ...i,
              checked: true,
            }))));
          }
          else {
            mountedSet(setEmployees, employees.concat(response.parsePayload));
          }
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
    if (parents.length >= searchParent.total) {
      message.warning('Danh sách đã hiển thị tất cả.');
      mountedSet(setSearchParent, { ...searchParent, hasMore: false, loading: false });
      return;
    }
    dispatch({
      type: 'notificationAdd/GET_PARENTS',
      payload: {
        ...searchParent,
        total: undefined,
        page: searchParent.page + 1,
      },
      callback: (response, error) => {
        if (response) {
          if (checkboxAll) {
            if (isAllParents) {
              mountedSet(setParents, parents.concat(response.items?.map(i => ({
                ...i,
                checked: true,
              }))));
            }
            else {
              mountedSet(setParents, parents.concat(response.items));
            }
          } else if (params.id) {
            mountedSet(setParents, parents.concat(
              response.items?.map((item) => {
                const itemEmloyee = details.parentNews?.find(
                  (itemE) => itemE?.student?.id === item?.student?.id,
                );
                return {
                  ...item,
                  checked: !!itemEmloyee,
                };
              }),
            ));
          }
          else if (isAllParents) {
            mountedSet(setParents, parents.concat(response.items?.map(i => ({
              ...i,
              checked: true,
            }))));
          }
          else {
            mountedSet(setParents, parents.concat(response.items));
          }

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
    setCheckboxInput(true);
    if (type === variablesModules.TYPE.EMPLOYEE) {
      mountedSet(setIsAllEmployees, event.target.checked);
      mountedSet(
        setEmployees,
        employees?.map((item) => ({
          ...item,
          checked: !!event.target.checked,
        })),
      );
    } else {
      mountedSet(setIsAllParents, event.target.checked);
      mountedSet(
        setParents,
        parents?.map((item) => ({
          ...item,
          checked: !!event.target.checked,
        })),
      );
    }
  };

  const onFinish = () => {
    const values = formRef.current.getFieldsValue();
    const payload = {
      ...values,
      classId: values.class,
      class: undefined,
      isReminded: !!values?.isReminded,
      remindDate: values?.isReminded
        ? Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: values.remindDate,
          }),
          format: variables.DATE_FORMAT.DATE_AFTER,
          isUTC: false,
        }) : undefined,
      remindTime: values?.isReminded
        ? Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: values.remindTime,
          }),
          format: variables.DATE_FORMAT.HOUR,
          isUTC: false,
        }) : undefined,
      id: params.id,
      content,
      // sentDate: moment(),
      isAllEmployees,
      isAllStudents: isAllParents,
      employeeIds:
        !isAllEmployees && type === variablesModules.TYPE.EMPLOYEE
          ? employees.filter((item) => item.checked).map((item) => (item.id))
          : [],
      studentIds:
        !isAllParents && type === variablesModules.TYPE.PARENT
          ? parents.filter((item) => item.checked).map((item) => (item?.student?.id))
          : [],
      excludedEmployeeIds: isAllEmployees && type === variablesModules.TYPE.EMPLOYEE
        ? employees.filter((item) => !item.checked).map((item) => (item.id))
        : [],
      excludedStudentIds: isAllParents && type === variablesModules.TYPE.PARENT
        ? parents.filter((item) => !item.checked).map((item) => (item?.student?.id))
        : [],
    };
    if (values?.title) {
      if (values?.isReminded) {
        if (values?.remindDate && values?.remindTime) {
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
        }
      } else {
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
      }
    }
  };

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'notificationAdd/GET_DETAILS',
        payload: params,
        callback: (response) => {
          if (response) {
            setDetails(response);
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
              class: response?.class?.id,
              isReminded: response?.isReminded,
              remindTime: response?.isReminded ? moment(response?.remindTime, variables.DATE_FORMAT.HOUR) : undefined,
              remindDate: response?.isReminded ? moment(response.remindDate) : undefined,
            });
            // mountedSet(
            //   setParents,
            //   parents.map((item) => {
            //     const itemParent = response.parentNews.find(
            //       (itemE) => itemE?.parent?.id === item.id,
            //     );
            //     return {
            //       ...item,
            //       checked: !!itemParent,
            //     };
            //   }),
            // );
            mountedSet(setCheckTime, response.isReminded);
            mountedSet(setIsAllEmployees, response.isAllEmployees);
            mountedSet(setIsAllParents, response.isAllStudents);
            // mountedSet(setEmployeesActive, response?.employeeNews);
            // mountedSet(
            //   setParentsActive,
            //   response?.parentNews?.map((i) => ({
            //     ...i,
            //     checked: true,
            //   })),
            // );
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
  }, [params.id]);
  const onchangCheck = (e) => {
    setCheckTime(e.target.checked);
  };

  const changeSend = () => {
    const values = formRef.current.getFieldsValue();
    const payload = {
      ...values,
      classId: values.class,
      class: undefined,
      isReminded: !!values?.isReminded,
      remindDate: values?.isReminded
        ? Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: values.remindDate,
          }),
          format: variables.DATE_FORMAT.DATE_AFTER,
          isUTC: false,
        }) : undefined,
      remindTime: values?.isReminded
        ? Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: values.remindTime,
          }),
          format: variables.DATE_FORMAT.HOUR,
          isUTC: false,
        }) : undefined,
      id: params.id,
      content,
      // sentDate: moment(),
      isAllEmployees,
      isAllStudents: isAllParents,
      employeeIds:
        !isAllEmployees && type === variablesModules.TYPE.EMPLOYEE
          ? employees.filter((item) => item.checked).map((item) => (item.id))
          : [],
      studentIds:
        !isAllParents && type === variablesModules.TYPE.PARENT
          ? parents.filter((item) => item.checked).map((item) => (item?.student?.id))
          : [],
      excludedEmployeeIds: isAllEmployees && type === variablesModules.TYPE.EMPLOYEE
        ? employees.filter((item) => !item.checked).map((item) => (item.id))
        : [],
      excludedStudentIds: isAllParents && type === variablesModules.TYPE.PARENT
        ? parents.filter((item) => !item.checked).map((item) => (item?.student?.id))
        : [],
    };
    if (values?.title) {
      if (values?.isReminded) {
        if (values?.remindDate && values?.remindTime) {
          dispatch({
            type: 'notificationAdd/SEND',
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
        }
      } else {
        dispatch({
          type: 'notificationAdd/SEND',
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
      }
    }
  };

  return (
    <Form
      layout="vertical"
      ref={formRef}
      initialValues={{
        branchId: defaultBranch?.id || null,
      }}
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
                      {
                        !defaultBranch?.id && (
                          <Pane className="col-lg-6">
                            <FormItem
                              label="Cơ sở"
                              name="branchId"
                              data={branches}
                              type={variables.SELECT}
                              onChange={onChangeBranch}
                            />
                          </Pane>
                        )
                      }
                      {
                        defaultBranch?.id && (
                          <Pane className="col-lg-6">
                            <FormItem
                              label="Cơ sở"
                              name="branchId"
                              data={defaultBranchs}
                              type={variables.SELECT}
                              onChange={onChangeBranch}
                            />
                          </Pane>
                        )
                      }
                      <Pane className="col-lg-6">
                        <FormItem
                          label="Bộ phận"
                          name="divisionId"
                          data={[{ id: null, name: 'Chọn tất cả bộ phận' }, ...divisions]}
                          type={variables.SELECT}
                          onChange={onChangeDivision}
                        />
                      </Pane>
                    </Pane>
                  </Pane>
                  <Pane className="border-bottom" style={{ padding: '10px 20px 0 20px' }}>
                    <FormItemAntd label="Người nhận thông báo">
                      <FormItem
                        name="keyWord"
                        placeholder="Nhập từ khóa tìm kiếm"
                        type={variables.INPUT_SEARCH}
                        onChange={(e) => onChangeSearch(e.target.value)}
                      />
                      {employees?.length > 0 && (
                        <Checkbox
                          checked={isAllEmployees}
                          onChange={(event) => changeAll(variablesModules.TYPE.EMPLOYEE, event)}
                        >
                          Tất cả nhân viên
                        </Checkbox>
                      )}
                    </FormItemAntd>
                  </Pane>
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
                          renderItem={({ id, fullName, fileImage, checked, hasAccount, positionLevelNow }) => (
                            <ListItem key={id} className={styles.listItem}>
                              <Pane className="px20 w-100 d-flex align-items-center">
                                <Checkbox
                                  checked={checked}
                                  className="mr15"
                                  onChange={() => changeCheckboxEmployee(id)}
                                />
                                <Pane className={styles.userInformation}>
                                  <AvatarTable
                                    fileImage={Helper.getPathAvatarJson(fileImage)}
                                  />
                                  <Pane>
                                    <h3>{fullName}</h3>
                                    <div className='d-flex'>
                                      {positionLevelNow.division?.name && !hasAccount ? (<p className='pr5'>{positionLevelNow.division?.name} -</p>) : <p >{positionLevelNow.division?.name}</p>}
                                      {!hasAccount && (<p className='text-danger'>Chưa có tài khoản</p>)}
                                    </div>
                                  </Pane>
                                </Pane>
                              </Pane>
                            </ListItem>
                          )
                          }
                        />
                      </InfiniteScroll>
                    </Scrollbars>
                  </Pane>


                  <Pane className="p20">
                    {
                      !checkboxInput ?
                        <Text color="dark" size="normal">
                          Đã chọn {size(details?.employeeNews)} nhân viên
                        </Text>
                        :

                        <Text color="dark" size="normal">
                          Đã chọn {size(employees?.filter((item) => item.checked))} nhân viên
                        </Text>
                    }
                  </Pane>
                </>
              )}
              {type === variablesModules.TYPE.PARENT && (
                <>
                  <Pane className="border-bottom" style={{ padding: '20px 20px 0 20px' }}>
                    <Pane className="row">
                      {
                        !defaultBranch?.id && (
                          <Pane className="col-lg-6">
                            <FormItem
                              label="Cơ sở"
                              name="branchId"
                              data={branches}
                              type={variables.SELECT}
                              onChange={onChangeBranchParent}
                            />
                          </Pane>
                        )
                      }
                      {
                        defaultBranch?.id && (
                          <Pane className="col-lg-6">
                            <FormItem
                              label="Cơ sở"
                              name="branchId"
                              data={defaultBranchs}
                              type={variables.SELECT}
                              onChange={onChangeBranchParent}
                            />
                          </Pane>
                        )
                      }
                      <Pane className="col-lg-6">
                        <FormItem
                          label="Lớp"
                          name="class"
                          data={[{ id: null, name: 'Chọn tất cả lớp' }, ...dataClass]}
                          type={variables.SELECT}
                          onChange={onChangeClass}
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
                  {parents?.length > 0 && (
                    <Pane className="border-bottom" style={{ padding: '10px 20px 0 20px' }}>
                      <FormItemAntd label="Người nhận thông báo">
                        <Checkbox
                          checked={isAllParents}
                          onChange={(event) => changeAll(variablesModules.TYPE.PARENT, event)}
                        >
                          Tất cả học sinh
                        </Checkbox>
                      </FormItemAntd>
                    </Pane>
                  )}

                  {
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
                            renderItem={(i) =>
                            (
                              <ListItem key={i?.student?.id} className={styles.listItem}>
                                <Pane className="px20 w-100 d-flex align-items-center">
                                  <Checkbox
                                    checked={i?.checked}
                                    className="mr15"
                                    onChange={() => changeCheckboxParent(i?.student?.id)}
                                  />
                                  <Pane className={styles.userInformation}>
                                    <AvatarTable
                                      fileImage={Helper.getPathAvatarJson(i?.student?.fileImage)}
                                    />
                                    <Pane>
                                      <h3>{i?.student?.fullName}</h3>
                                      <div className='d-flex'>
                                        {i?.student?.class && !i?.hasParentAccount ? (<p className='pr5'>{i?.student?.class?.name} -</p>) : <p >{i?.student?.class?.name}</p>}
                                        {!i?.hasParentAccount && (<p className='text-danger'>Chưa có tài khoản PH</p>)}
                                      </div>
                                    </Pane>
                                  </Pane>
                                </Pane>
                              </ListItem>
                            )
                            }
                          />
                        </InfiniteScroll>
                      </Scrollbars>
                    </Pane>
                  }

                  <Pane className="p20">
                    {
                      !checkboxInput ?
                        <Text color="dark" size="normal">
                          Đã chọn {size(details?.parentNews)} Học sinh
                        </Text>
                        :
                        <Text color="dark" size="normal">
                          Đã chọn {size(parents?.filter((item) => item.checked))} học sinh
                        </Text>
                    }
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
                <Quill
                  onChange={onChangeEditor}
                  value={content}
                  theme="snow"
                  modules={modules}
                  formats={formats}
                />
                <Pane className="col-lg-12 mt20 d-flex p0">
                  <Pane className="mr15">
                    <FormItem
                      className="checkbox-row checkbox-small p0"
                      label="Đặt hẹn giờ gửi"
                      name="isReminded"
                      type={variables.CHECKBOX_FORM}
                      valuePropName="checked"
                      onClick={onchangCheck}
                    />
                  </Pane>
                  {
                    checkTime && (
                      <>
                        <Pane className="mr15">
                          <FormItem
                            name="remindDate"
                            type={variables.DATE_PICKER}
                            rules={checkTime ? [variables.RULES.EMPTY] : []}
                          />
                        </Pane>
                        <Pane>
                          <FormItem
                            name="remindTime"
                            type={variables.TIME_PICKER}
                            rules={checkTime ? [variables.RULES.EMPTY] : []}
                          />
                        </Pane>
                      </>
                    )
                  }
                </Pane>
              </Pane>
              <Pane className="d-flex" style={{ marginLeft: 'auto', padding: 20 }}>
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
                  onClick={() => onFinish()}
                  disabled={
                    !employees.find((item) => item.checked) &&
                    !parents.find((item) => item.checked) &&
                    !isAllEmployees &&
                    !isAllParents &&
                    checkboxInput
                  }
                >
                  Lưu
                </Button>
                <Button
                  color="primary"
                  size="large"
                  className='ml10'
                  htmlType="submit"
                  loading={
                    loading['notificationAdd/SEND']
                  }
                  style={{ marginLeft: 'auto' }}
                  onClick={() => changeSend()}
                  disabled={
                    !employees.find((item) => item.checked) &&
                    !parents.find((item) => item.checked) &&
                    !isAllEmployees &&
                    checkboxInput &&
                    !isAllParents || (details?.sentDate && params?.id)

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

