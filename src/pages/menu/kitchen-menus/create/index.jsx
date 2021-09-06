import { memo, useRef, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Modal, message, Upload } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useHistory, useParams, useLocation } from 'umi';
import { head, isEmpty, last, omit, size } from 'lodash';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import Select from '@/components/CommonComponent/Select';
import classnames from 'classnames';
import Loading from '@/components/CommonComponent/Loading';
import styles from './style.module.scss';
import variablesModules from '../../utils/variables';

const Index = memo(() => {
  const [
    menuData,
    loading,
    { branches, classTypes, foodCommons, meals, error },
  ] = useSelector(({ menu: { menuLeftChildren }, loading: { effects }, kitchenMenusCreate }) => [
    menuLeftChildren,
    effects,
    kitchenMenusCreate,
  ]);
  const dispatch = useDispatch();
  const params = useParams();

  const [visible, setVisible] = useState(false);
  const [object, setObect] = useState({});
  const [weeksKitchen, setWeeksKitchen] = useState([]);
  const [fromDate, setFromDate] = useState([]);
  const [toDate, setToDate] = useState([]);

  const history = useHistory();
  const { query } = useLocation();
  const formRef = useRef();
  const formRefModal = useRef();
  const mounted = useRef(false);

  const onFinish = (values) => {
    let menuMeals = [];
    weeksKitchen.forEach((item) => {
      let timeline = [];
      item?.menuMeals.forEach((itemMenu) => {
        if (!isEmpty(itemMenu.timeline)) {
          timeline = [
            ...timeline,
            ...itemMenu.timeline.map((itemTimeline) => {
              let menuMealDetails = [];
              itemTimeline?.menuMealDetails?.forEach((itemMenuDetail) => {
                menuMealDetails = [
                  ...menuMealDetails,
                  ...itemMenuDetail.week.map((itemWeek) => ({
                    ...itemWeek,
                    id: itemMenuDetail.id,
                    isAdd: itemMenuDetail.isAdd,
                    foodOrderIndex: itemMenuDetail.foodOrderIndex,
                  })),
                ];
              });
              return {
                weekIndex: itemMenu.weekIndex,
                ...itemTimeline,
                menuMealDetails,
                mealId: itemMenu.mealId,
              };
            }),
          ];
        } else {
          timeline = [...timeline, itemMenu];
        }
      });
      menuMeals = [...menuMeals, ...timeline];
    });
    const payload = {
      ...omit(values, 'month'),
      fromDate: Helper.getDate(fromDate, variables.DATE_FORMAT.DATE_AFTER),
      toDate: Helper.getDate(toDate, variables.DATE_FORMAT.DATE_AFTER),
      menuType: 'STUDENT',
      menuMeals: menuMeals.map((item) => ({
        ...omit(item, 'timeline', 'isAdd'),
        menuMealDetails:
          item?.menuMealDetails?.map((menuItem) => ({
            ...(menuItem.isAdd
              ? omit(menuItem, 'id', 'isAdd')
              : { ...omit(menuItem, 'originId'), id: menuItem.originId }),
          })) || undefined,
        name: item.menuMealDetails ? item.name : undefined,
      })),
    };
    dispatch({
      type: params.id ? 'kitchenMenusCreate/UPDATE' : 'kitchenMenusCreate/ADD',
      payload: {
        ...payload,
        ...params,
      },
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

  const onApply = () => {
    formRef.current.validateFields().then((values) => {
      dispatch({
        type: 'kitchenMenusCreate/GET_TIMETABLE_FEES',
        payload: {
          month: Helper.getDate(values.month, variables.DATE_FORMAT.MONTH),
          year: Helper.getDate(values.month, variables.DATE_FORMAT.YEAR),
        },
        callback: (response) => {
          if (response) {
            const weeks = response.timetableFeeGroupByWeeks.map((item) => ({
              weekIndex: item.week,
              menuMeals: meals.map((itemMeal) => ({
                weekIndex: item.week,
                mealId: itemMeal.id,
                name: itemMeal.name,
                timeline: [],
              })),
            }));
            setFromDate(response.fromDate);
            setToDate(response.toDate);
            setWeeksKitchen(weeks);
          }
        },
      });
    });
  };

  const importExcel = (file) => {
    formRef.current.validateFields().then((values) => {
      const payload = {
        ...values,
        input: file,
        month: Helper.getDate(values.month, variables.DATE_FORMAT.MONTH),
        year: Helper.getDate(values.month, variables.DATE_FORMAT.YEAR),
      };
      dispatch({
        type: 'kitchenMenusCreate/IMPORT_EXCEL',
        payload,
        callback: (response) => {
          if (response) {
            const weeks = response.timetableFeeGroupByWeeks.map((item) => ({
              weekIndex: item.week,
              menuMeals: meals.map((itemMeal) => ({
                weekIndex: item.week,
                mealId: itemMeal.id,
                name: itemMeal.name,
                timeline: [],
              })),
            }));
            setFromDate(response.fromDate);
            setToDate(response.toDate);
            setWeeksKitchen(weeks);
          }
        },
      });
    });
  };

  const remove = () => {
    Helper.confirmAction({
      callback: () => {
        dispatch({
          type: 'kitchenMenusCreate/REMOVE',
          payload: {
            ...params,
          },
          callback: (response) => {
            if (response) {
              history.push('/thuc-don');
            }
          },
        });
      },
    });
  };

  const convertMenuMeal = (items) => {
    const o = {};
    return items?.reduce((r, el) => {
      if (!o[el.weekIndex]) {
        o[el.weekIndex] = {
          weekIndex: el.weekIndex,
          menuMeals: [],
        };
        r.push(o[el.weekIndex]);
      }
      o[el.weekIndex].menuMeals.push(el);
      return r;
    }, []);
  };

  const covertTimeline = (items) => {
    const o = {};
    return items.reduce((r, el) => {
      if (!o[el.mealId]) {
        o[el.mealId] = {
          mealId: el.mealId,
          name: el?.meal?.name,
          timeline: [],
        };
        r.push(o[el.mealId]);
      }
      if (!isEmpty(el.menuMealDetails)) {
        o[el.mealId].timeline.push(el);
      }
      return r;
    }, []);
  };

  const covertWeek = (items) => {
    const o = {};
    return items.reduce((r, el) => {
      if (!o[el.foodOrderIndex]) {
        o[el.foodOrderIndex] = {
          foodOrderIndex: el.foodOrderIndex,
          id: el?.id || uuidv4(),
          originId: el.id,
          week: [],
        };
        r.push(o[el.foodOrderIndex]);
      }
      o[el.foodOrderIndex].week.push({
        dayOfWeek: el.dayOfWeek,
        id: el?.id || uuidv4(),
        originId: el.id,
        foodId: el.foodId,
      });
      return r;
    }, []);
  };

  useEffect(() => {
    if (query.id) {
      dispatch({
        type: 'kitchenMenusCreate/GET_DATA',
        payload: {
          ...query,
        },
        callback: (response) => {
          if (response) {
            setFromDate(response.fromDate);
            setToDate(response.toDate);
            const result = convertMenuMeal(response?.menuMeals)
              .sort((a, b) => a.weekIndex - b.weekIndex)
              .map((item) => ({
                ...item,
                menuMeals: covertTimeline(
                  item?.menuMeals?.sort((a, b) => a?.meal?.orderIndex - b?.meal?.orderIndex),
                ).map((itemMenuMeals) => ({
                  ...itemMenuMeals,
                  weekIndex: item.weekIndex,
                  timeline: itemMenuMeals?.timeline?.map((itemTimeline) => ({
                    ...itemTimeline,
                    menuMealDetails: covertWeek(itemTimeline?.menuMealDetails),
                  })),
                })),
              }));
            setWeeksKitchen(result);
            formRef.current.setFieldsValue({
              ...response,
              branchId: response?.branch?.id,
              month: response.fromDate && moment(response.fromDate),
            });
          }
        },
      });
    }
    if (params.id) {
      dispatch({
        type: 'kitchenMenusCreate/GET_DATA',
        payload: {
          ...params,
        },
        callback: (response) => {
          if (response) {
            setFromDate(response.fromDate);
            setToDate(response.toDate);
            const result = convertMenuMeal(response?.menuMeals)
              .sort((a, b) => a.weekIndex - b.weekIndex)
              .map((item) => ({
                ...item,
                menuMeals: covertTimeline(
                  item?.menuMeals?.sort((a, b) => a?.meal?.orderIndex - b?.meal?.orderIndex),
                ).map((itemMenuMeals) => ({
                  ...itemMenuMeals,
                  weekIndex: item.weekIndex,
                  timeline: itemMenuMeals?.timeline?.map((itemTimeline) => ({
                    ...itemTimeline,
                    menuMealDetails: covertWeek(itemTimeline?.menuMealDetails),
                  })),
                })),
              }));
            setWeeksKitchen(result);
            formRef.current.setFieldsValue({
              ...response,
              branchId: response?.branch?.id,
              month: response.fromDate && moment(response.fromDate),
            });
          }
        },
      });
    }
  }, [params.id]);

  useEffect(() => {
    dispatch({
      type: 'kitchenMenusCreate/GET_BRANCHES',
      payload: {
        ...params,
      },
    });
    dispatch({
      type: 'kitchenMenusCreate/GET_CLASS_TYPES',
      payload: {},
    });
    dispatch({
      type: 'kitchenMenusCreate/GET_FOOD_COMMONS',
      payload: {},
    });
    dispatch({
      type: 'kitchenMenusCreate/GET_MEALS',
      payload: {
        forUsing: true,
      },
    });
  }, []);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const onMenuMeal = (itemWeek, itemMenuMeals, timeline) => {
    setWeeksKitchen((prevState) =>
      prevState.map((item) => {
        if (item.weekIndex === itemWeek.weekIndex) {
          return {
            ...item,
            menuMeals: item?.menuMeals?.map((itemMeal) => {
              if (itemMeal.mealId === itemMenuMeals.mealId) {
                return {
                  ...itemMeal,
                  timeline: itemMeal?.timeline?.map((itemTimeline) => {
                    if (itemTimeline.id === timeline.id) {
                      return {
                        ...itemTimeline,
                        menuMealDetails: [
                          ...itemTimeline.menuMealDetails,
                          {
                            foodOrderIndex: last(itemTimeline?.menuMealDetails)?.foodOrderIndex
                              ? last(itemTimeline?.menuMealDetails)?.foodOrderIndex + 1
                              : 1,
                            id: uuidv4(),
                            isAdd: true,
                            foodId: null,
                            week: [
                              {
                                dayOfWeek: 'Monday',
                                foodId: null,
                              },
                              {
                                dayOfWeek: 'Tuesday',
                                foodId: null,
                              },
                              {
                                dayOfWeek: 'Wednesday',
                                foodId: null,
                              },
                              {
                                dayOfWeek: 'Thursday',
                                foodId: null,
                              },
                              {
                                dayOfWeek: 'Friday',
                                foodId: null,
                              },
                            ],
                          },
                        ],
                      };
                    }
                    return itemTimeline;
                  }),
                };
              }
              return itemMeal;
            }),
          };
        }
        return item;
      }),
    );
  };

  const onRemoveMenuMeal = (itemWeek, itemMenuMeals, timeline, itemMenuMealDetail) => {
    setWeeksKitchen((prevState) =>
      prevState.map((item) => {
        if (item.weekIndex === itemWeek.weekIndex) {
          return {
            ...item,
            menuMeals: item?.menuMeals?.map((itemMeal) => {
              if (itemMeal.mealId === itemMenuMeals.mealId) {
                return {
                  ...itemMeal,
                  timeline: itemMeal?.timeline?.map((itemTimeline) => {
                    if (itemTimeline.id === timeline.id) {
                      return {
                        ...itemTimeline,
                        menuMealDetails: itemTimeline.menuMealDetails.filter(
                          (itemMenuMealDetails) => itemMenuMealDetails.id !== itemMenuMealDetail.id,
                        ),
                      };
                    }
                    return itemTimeline;
                  }),
                };
              }
              return itemMeal;
            }),
          };
        }
        return item;
      }),
    );
  };

  const onChangeFood = (foodId, itemWeek, itemMenuMeals, timeline, itemMenuMealDetail, itemDay) => {
    setWeeksKitchen((prevState) =>
      prevState.map((item) => {
        if (item.weekIndex === itemWeek.weekIndex) {
          return {
            ...item,
            menuMeals: item?.menuMeals?.map((itemMeal) => {
              if (itemMeal.mealId === itemMenuMeals.mealId) {
                return {
                  ...itemMeal,
                  timeline: itemMeal?.timeline?.map((itemTimeline) => {
                    if (itemTimeline.id === timeline.id) {
                      return {
                        ...itemTimeline,
                        menuMealDetails: itemTimeline?.menuMealDetails?.map((itemMenuDetail) => {
                          if (itemMenuDetail.id === itemMenuMealDetail.id) {
                            return {
                              ...itemMenuDetail,
                              week: itemMenuDetail.week.map((itemWeekDetail) =>
                                itemWeekDetail.dayOfWeek === itemDay.id
                                  ? { ...itemWeekDetail, foodId }
                                  : itemWeekDetail,
                              ),
                            };
                          }
                          return itemMenuDetail;
                        }),
                      };
                    }
                    return itemTimeline;
                  }),
                };
              }
              return itemMeal;
            }),
          };
        }
        return item;
      }),
    );
  };

  const handleCancel = () => {
    setVisible(false);
    setObect({});
    formRefModal.current.resetFields();
  };

  const addTimeline = (item, itemMenu) => {
    setObect({ item, itemMenu });
    setVisible(true);
  };

  const onSaveTimeline = () => {
    formRefModal.current.validateFields().then((values) => {
      const fromTime = Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: values.time[0],
        }),
        isUTC: true,
      });
      const toTime = Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: values.time[1],
        }),
        isUTC: true,
      });
      if (object.timeline) {
        setWeeksKitchen((prevState) =>
          prevState.map((item) => {
            if (item.weekIndex === object?.item?.weekIndex) {
              return {
                ...item,
                menuMeals: item?.menuMeals?.map((itemMeal) => {
                  if (itemMeal.mealId === object?.itemMenu?.mealId) {
                    return {
                      ...itemMeal,
                      timeline: itemMeal?.timeline?.map((itemTimeline) =>
                        itemTimeline?.id === object?.timeline?.id
                          ? { ...itemTimeline, name: values.name, fromTime, toTime }
                          : itemTimeline,
                      ),
                    };
                  }
                  return itemMeal;
                }),
              };
            }
            return item;
          }),
        );
      } else {
        setWeeksKitchen((prevState) =>
          prevState.map((item) => {
            if (item.weekIndex === object?.item?.weekIndex) {
              return {
                ...item,
                menuMeals: item?.menuMeals?.map((itemMeal) => {
                  if (itemMeal.mealId === object?.itemMenu?.mealId) {
                    return {
                      ...itemMeal,
                      timeline: [
                        ...itemMeal?.timeline,
                        {
                          id: uuidv4(),
                          isAdd: true,
                          name: values.name,
                          fromTime,
                          toTime,
                          menuMealDetails: [],
                        },
                      ],
                    };
                  }
                  return itemMeal;
                }),
              };
            }
            return item;
          }),
        );
      }

      handleCancel();
    });
  };

  const removeTimeline = (item, itemMenu, timeline) => {
    setWeeksKitchen((prevState) =>
      prevState.map((item) => {
        if (item.weekIndex === item?.weekIndex) {
          return {
            ...item,
            menuMeals: item?.menuMeals?.map((itemMeal) => {
              if (itemMeal.mealId === itemMenu?.mealId) {
                return {
                  ...itemMeal,
                  timeline: itemMeal?.timeline?.filter(
                    (itemTimeline) => itemTimeline.id !== timeline.id,
                  ),
                };
              }
              return itemMeal;
            }),
          };
        }
        return item;
      }),
    );
  };

  const editTimeline = (item, itemMenu, timeline) => {
    setVisible(true);
    setObect({ item, itemMenu, timeline });
    formRefModal.current.setFieldsValue({
      name: timeline?.name,
      time:
        timeline?.fromTime && timeline?.toTime
          ? [moment(timeline?.fromTime), moment(timeline?.toTime)]
          : undefined,
    });
  };

  const enableButton = (items) => {
    let listEnable = [];
    items.forEach((item) => {
      item?.menuMeals?.forEach((item) => {
        item?.timeline?.forEach((item) => {
          item?.menuMealDetails?.forEach((item) => {
            if (item.week) {
              listEnable = [...listEnable, ...item.week.filter((item) => !item.foodId)];
            }
          });
        });
      });
    });
    return size(listEnable);
  };

  const onCollapsed = (record) => {
    setWeeksKitchen((prevState) =>
      prevState.map((item) =>
        item.weekIndex === record.weekIndex ? { ...item, collapsed: !record.collapsed } : item,
      ),
    );
  };

  const exportData = () => {
    formRef.current.validateFields().then((values) => {
      const payload = {
        ...values,
        month: Helper.getDate(values.month, variables.DATE_FORMAT.MONTH),
        year: Helper.getDate(values.month, variables.DATE_FORMAT.YEAR),
      };
      Helper.exportExcel(
        '/kitchen-menus/export-menu-template',
        { ...payload },
        'ThucDon.xlxs',
        API_URL,
      );
    });
  };

  const props = {
    beforeUpload() {
      return null;
    },
    customRequest({ file }) {
      const { name, size } = file;
      const allowTypes = ['xlxs'];
      const maxSize = 5 * 2 ** 20;
      if (!allowTypes.includes(last(name.split('.'))) || size > maxSize) {
        message.error('Định dạng hỗ trợ:  .xlxs. Tổng dung lượng không vượt quá 20MB');
        return;
      }
      importExcel(file);
    },
    showUploadList: false,
    fileList: [],
  };

  return (
    <Pane style={{ paddingTop: 20 }}>
      <Modal
        centered
        footer={[
          <div className={classnames('d-flex', 'justify-content-end')} key="action">
            <Button
              color="white"
              icon="cross"
              size="medium"
              onClick={handleCancel}
              loading={loading['kitchenMenusCreate/GET_TIMETABLE_FEES']}
            >
              HỦY
            </Button>
            <Button
              color="green"
              icon="save"
              size="medium"
              onClick={onSaveTimeline}
              loading={loading['kitchenMenusCreate/GET_TIMETABLE_FEES']}
            >
              LƯU
            </Button>
          </div>,
        ]}
        onCancel={handleCancel}
        title="THÊM MỐC"
        visible={visible}
      >
        <Form
          layout="vertical"
          ref={formRefModal}
          initialValues={{
            name: object?.timeline?.name,
            time:
              object?.timeline?.fromTime && object?.timeline?.toTime
                ? [moment(object?.timeline?.fromTime), moment(object?.timeline?.toTime)]
                : undefined,
          }}
        >
          <div className="row">
            <div className="col-lg-6">
              <FormItem
                label="Tên mốc"
                name="name"
                rules={[variables.RULES.EMPTY_INPUT]}
                type={variables.INPUT}
              />
            </div>
            <div className="col-lg-6">
              <FormItem
                label="Thời gian"
                name="time"
                rules={[variables.RULES.EMPTY]}
                type={variables.TIME_RANGE}
              />
            </div>
          </div>
        </Form>
      </Modal>
      <Helmet title={params.id ? 'Chỉnh sửa thực đơn' : 'Tạo thực đơn'} />
      <Breadcrumbs
        className="pt0"
        last={params.id ? 'Chỉnh sửa thực đơn' : 'Tạo thực đơn'}
        menu={menuData}
      />
      <Pane style={{ padding: 20, paddingBottom: 0 }} className={styles.wrapper}>
        <Pane className="row">
          <Pane className="col-lg-12">
            <Form layout="vertical" ref={formRef} onFinish={onFinish} initialValues={{}}>
              <Loading
                loading={
                  loading['kitchenMenusCreate/GET_DATA'] ||
                  loading['kitchenMenusCreate/GET_BRANCHES'] ||
                  loading['kitchenMenusCreate/GET_CLASS_TYPES'] ||
                  loading['kitchenMenusCreate/GET_FOOD_COMMONS'] ||
                  loading['kitchenMenusCreate/GET_MEALS']
                }
                isError={error.isError}
                params={{ error, goBack: '/thuc-don' }}
              >
                <Pane>
                  <Pane className="p20 pt20 card">
                    <Heading type="form-title" className="mb20">
                      Thông tin chung
                    </Heading>
                    <Pane className="row align-items-center">
                      <Pane className="col-2">
                        <FormItem
                          label="Thời gian"
                          name="month"
                          type={variables.MONTH_PICKER}
                          rules={[variables.RULES.EMPTY]}
                        />
                      </Pane>
                      <Pane className="col-3">
                        <FormItem
                          data={branches}
                          label="Cơ sở"
                          name="branchId"
                          type={variables.SELECT}
                          rules={[variables.RULES.EMPTY]}
                        />
                      </Pane>
                      <Pane className="col-3">
                        <FormItem
                          data={classTypes}
                          label="Loại lớp"
                          name="classTypeId"
                          type={variables.SELECT}
                          rules={[variables.RULES.EMPTY]}
                        />
                      </Pane>
                      <Pane className="col-4 d-flex">
                        <Button
                          color="success"
                          onClick={onApply}
                          loading={loading['kitchenMenusCreate/GET_TIMETABLE_FEES']}
                        >
                          {params.id ? 'Áp dụng thực đơn' : 'Tạo mới thực đơn'}
                        </Button>
                        {isEmpty(weeksKitchen) && (
                          <Button color="primary" onClick={exportData} className="ml10">
                            Export
                          </Button>
                        )}
                        {!isEmpty(weeksKitchen) && (
                          <Upload {...props}>
                            <Button
                              color="primary"
                              className="ml10"
                              loading={loading['kitchenMenusCreate/GET_TIMETABLE_FEES']}
                            >
                              Import excel
                            </Button>
                          </Upload>
                        )}
                      </Pane>
                    </Pane>
                  </Pane>
                  {!isEmpty(weeksKitchen) &&
                    weeksKitchen.map((item) => (
                      <div className={styles['menu-container']} key={item.weekIndex}>
                        <div className={styles['menu-header']}>
                          <h3 className={styles.title}>Tuần {item.weekIndex}</h3>
                          <div
                            className={styles.icon}
                            role="presentation"
                            onClick={() => onCollapsed(item)}
                          >
                            {item.collapsed && <span className="icon-up" />}
                            {!item.collapsed && <span className="icon-down" />}
                          </div>
                        </div>
                        <div
                          className={classnames(styles['menu-content'], {
                            [`${styles.collapsed}`]: item.collapsed,
                          })}
                        >
                          <div className={styles['list-container']}>
                            <div className={styles['list-header']}>
                              <div
                                className={classnames(
                                  styles.col,
                                  styles.first,
                                  'min-width-150',
                                  'text-center',
                                )}
                              >
                                Bữa ăn
                              </div>
                              <div className={classnames(styles.col, 'min-width-150')}>Mốc</div>
                              <div className={classnames(styles.col, styles['col-group'])}>
                                {variablesModules.DAYS.map((item) => (
                                  <div
                                    className={classnames(styles.col, 'min-width-200')}
                                    key={item.id}
                                  >
                                    {item.name}
                                  </div>
                                ))}
                                <div className={classnames(styles.col, 'min-width-50')} />
                              </div>
                            </div>
                            <div className={styles['list-content']}>
                              {item?.menuMeals?.map((itemMenu) => (
                                <div className={styles['list-item']} key={itemMenu.mealId}>
                                  <div
                                    className={classnames(
                                      styles.col,
                                      styles.first,
                                      'min-width-150',
                                    )}
                                  >
                                    <h4 className={styles.title}>{itemMenu.name}</h4>
                                  </div>
                                  <div className={styles['col-parent']}>
                                    {itemMenu?.timeline?.map((itemTimeline, indexTimeline) => (
                                      <div className={styles['col-children']} key={indexTimeline}>
                                        <div
                                          className={classnames(
                                            styles.col,
                                            'min-width-150',
                                            'max-width-150',
                                          )}
                                        >
                                          <p className={styles.norm}>
                                            {itemTimeline.name}
                                            {itemTimeline.fromTime &&
                                              itemTimeline.toTime &&
                                              `(${Helper.getDate(
                                                itemTimeline.fromTime,
                                                variables.DATE_FORMAT.HOUR,
                                              )} - ${Helper.getDate(
                                                itemTimeline.toTime,
                                                variables.DATE_FORMAT.HOUR,
                                              )})`}
                                          </p>
                                          <div className={styles.action}>
                                            <div className={classnames(styles.icon, styles.edit)}>
                                              <span
                                                className="icon-edit"
                                                role="presentation"
                                                onClick={() =>
                                                  editTimeline(item, itemMenu, itemTimeline)
                                                }
                                              />
                                            </div>
                                            <div className={styles.icon}>
                                              <span
                                                className="icon-remove"
                                                role="presentation"
                                                onClick={() =>
                                                  removeTimeline(item, itemMenu, itemTimeline)
                                                }
                                              />
                                            </div>
                                          </div>
                                        </div>
                                        <div
                                          className={classnames(styles.col, styles['col-groups'])}
                                        >
                                          {itemTimeline?.menuMealDetails?.map(
                                            (itemMenuMeal, indexMenuMeal) => (
                                              <div className={styles.item} key={indexMenuMeal}>
                                                {variablesModules.DAYS.map((itemDay) => {
                                                  const itemMenuOfDay = itemMenuMeal?.week?.find(
                                                    (item) => item.dayOfWeek === itemDay.id,
                                                  );
                                                  return (
                                                    <div
                                                      className={classnames(
                                                        styles['col-item'],
                                                        'min-width-200',
                                                        'max-width-200',
                                                      )}
                                                      key={itemDay.id}
                                                    >
                                                      <Select
                                                        dataSet={foodCommons}
                                                        placeholder="Chọn"
                                                        showSearch
                                                        value={itemMenuOfDay?.foodId || null}
                                                        onChange={(e) =>
                                                          onChangeFood(
                                                            e,
                                                            item,
                                                            itemMenu,
                                                            itemTimeline,
                                                            itemMenuMeal,
                                                            itemDay,
                                                          )
                                                        }
                                                      />
                                                    </div>
                                                  );
                                                })}
                                                <div
                                                  className={classnames(
                                                    styles['col-item'],
                                                    'min-width-50',
                                                  )}
                                                  role="presentation"
                                                  onClick={() =>
                                                    onRemoveMenuMeal(
                                                      item,
                                                      itemMenu,
                                                      itemTimeline,
                                                      itemMenuMeal,
                                                    )
                                                  }
                                                >
                                                  <div className={styles.icon}>
                                                    <span className="icon-remove" />
                                                  </div>
                                                </div>
                                              </div>
                                            ),
                                          )}

                                          <div className={styles.item}>
                                            <Button
                                              icon="plus"
                                              color="dash-success"
                                              onClick={() =>
                                                onMenuMeal(item, itemMenu, itemTimeline)
                                              }
                                            >
                                              Thêm món
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                    <div className={styles['col-children']}>
                                      <Button
                                        icon="plus"
                                        color="dash-success"
                                        onClick={() => addTimeline(item, itemMenu)}
                                      >
                                        Thêm mốc
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  {!params.id && (
                    <Pane className="py20 d-flex justify-content-between align-items-center">
                      <p
                        className="btn-delete"
                        role="presentation"
                        onClick={() => history.goBack()}
                      >
                        Hủy
                      </p>
                      {!isEmpty(weeksKitchen) && (
                        <Button
                          className="ml-auto px25"
                          color="success"
                          htmlType="submit"
                          size="large"
                          disabled={enableButton(weeksKitchen)}
                          loading={
                            loading['kitchenMenusCreate/ADD'] ||
                            loading['kitchenMenusCreate/UPDATE'] ||
                            loading['kitchenMenusCreate/GET_DATA']
                          }
                        >
                          Lưu
                        </Button>
                      )}
                    </Pane>
                  )}
                  {params.id && (
                    <Pane className="py20 d-flex justify-content-between align-items-center">
                      <p className="btn-delete" role="presentation" onClick={remove}>
                        Hủy
                      </p>
                      <div className="d-flex">
                        {!isEmpty(weeksKitchen) && (
                          <Button
                            className="ml-auto px25 ml10"
                            color="success"
                            htmlType="submit"
                            size="large"
                            disabled={enableButton(weeksKitchen)}
                            loading={
                              loading['kitchenMenusCreate/ADD'] ||
                              loading['kitchenMenusCreate/UPDATE'] ||
                              loading['kitchenMenusCreate/GET_DATA']
                            }
                          >
                            Lưu
                          </Button>
                        )}
                      </div>
                    </Pane>
                  )}
                </Pane>
              </Loading>
            </Form>
          </Pane>
        </Pane>
      </Pane>
    </Pane>
  );
});

export default Index;
