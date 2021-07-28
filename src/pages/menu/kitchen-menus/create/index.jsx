import { memo, useRef, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Modal } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useHistory, useParams } from 'umi';
import { head, isEmpty, last, omit } from 'lodash';
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
import styles from './style.module.scss';
import variablesModules from '../../utils/variables';

const Index = memo(() => {
  const [
    menuData,
    loading,
    { branches, classTypes, foodCommons, meals },
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

  const history = useHistory();
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
                    foodOrderIndex: itemMenuDetail.foodOrderIndex,
                  })),
                ];
              });
              return {
                weekIndex: itemMenu.weekIndex,
                ...itemTimeline,
                menuMealDetails,
                mealId: itemMenu.mealId
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
      fromDate: moment(values.month).startOf('months'),
      toDate: moment(values.month).endOf('months'),
      menuType: 'STUDENT',
      menuMeals: menuMeals
        .map((item) => ({
          ...omit(item, 'timeline', 'id'),
          menuMealDetails: item.menuMealDetails || undefined,
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

  const getRange = (startDate, endDate, type) => {
    const fromDate = moment(startDate);
    const toDate = moment(endDate);
    const diff = toDate.diff(fromDate, type);
    const range = [];
    for (let i = 0; i < diff; i += 1) {
      range.push(moment(startDate).add(i, type));
    }
    return range;
  };

  const onApply = () => {
    formRef.current.validateFields().then((values) => {
      let weeks = [];
      const firstDay = moment(values.month).startOf('month');
      const endDay = moment(values.month).endOf('month');
      const monthRange = getRange(firstDay, endDay, 'days');
      monthRange.forEach((item) => {
        if (!weeks.includes(item.week())) {
          weeks = [...weeks, item.week()];
        }
      });
      setWeeksKitchen(
        weeks.map((item, index) => ({
          weekIndex: index + 1,
          menuMeals: meals.map((itemMeal) => ({
            weekIndex: index + 1,
            mealId: itemMeal.id,
            name: itemMeal.name,
            timeline: [],
          })),
        })),
      );
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
              history.goBack();
            }
          },
        });
      },
    });
  };

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'kitchenMenusCreate/GET_DATA',
        payload: {
          ...params,
        },
        callback: (response) => {
          if (response) {
            formRef.current.setFieldsValue({
              ...response,
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

  return (
    <Pane style={{ paddingTop: 20 }}>
      <Modal
        centered
        footer={[
          <div className={classnames('d-flex', 'justify-content-end')} key="action">
            <Button color="white" icon="cross" size="medium" onClick={handleCancel}>
              HỦY
            </Button>
            <Button color="green" icon="save" size="medium" onClick={onSaveTimeline}>
              LƯU
            </Button>
          </div>,
        ]}
        onCancel={handleCancel}
        title="THÊM MỐC"
        visible={visible}
      >
        <Form layout="vertical" ref={formRefModal}>
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
      <Helmet title="Tạo thực đơn" />
      <Breadcrumbs className="pt0" last="Tạo thực đơn" menu={menuData} />
      <Pane style={{ padding: 20, paddingBottom: 0 }} className={styles.wrapper}>
        <Pane className="row">
          <Pane className="col-lg-12">
            <Form layout="vertical" ref={formRef} onFinish={onFinish} initialValues={{}}>
              <Pane className="p20 pt20 card">
                <Heading type="form-title" className="mb20">
                  Thông tin chung
                </Heading>
                <Pane className="row align-items-center">
                  <Pane className="col-3">
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
                  <Pane className="col-3">
                    <Button color="success" onClick={onApply}>
                      Tạo mới thực đơn
                    </Button>
                  </Pane>
                </Pane>
              </Pane>
              {!isEmpty(weeksKitchen) &&
                weeksKitchen.map((item) => (
                  <div className={styles['menu-container']} key={item.weekIndex}>
                    <div className={styles['menu-header']}>
                      <h3 className={styles.title}>Tuần {item.weekIndex + 1}</h3>
                      <div className={styles.icon}>
                        <span className="icon-up" />
                      </div>
                    </div>
                    <div className={styles['menu-content']}>
                      <div className={styles['list-container']}>
                        <div className={styles['list-header']}>
                          <div
                            className={classnames(
                              styles.col,
                              styles.first,
                              'min-width-100',
                              'text-center',
                            )}
                          >
                            Bữa ăn
                          </div>
                          <div className={classnames(styles.col, 'min-width-150')}>Mốc</div>
                          <div className={classnames(styles.col, styles['col-group'])}>
                            {variablesModules.DAYS.map((item) => (
                              <div
                                className={classnames(styles.col, 'min-width-150')}
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
                                className={classnames(styles.col, styles.first, 'min-width-100')}
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
                                          <span className="icon-edit" />
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
                                    <div className={classnames(styles.col, styles['col-groups'])}>
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
                                                    'min-width-150',
                                                  )}
                                                  key={itemDay.id}
                                                >
                                                  <Select
                                                    dataSet={foodCommons}
                                                    placeholder="Chọn"
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
                                          onClick={() => onMenuMeal(item, itemMenu, itemTimeline)}
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

              <Pane className="py20 d-flex justify-content-between align-items-center">
                {params.id && (
                  <p className="btn-delete" role="presentation" onClick={remove}>
                    Xóa
                  </p>
                )}
                {!isEmpty(weeksKitchen) && (
                  <Button
                    className="ml-auto px25"
                    color="success"
                    htmlType="submit"
                    size="large"
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
            </Form>
          </Pane>
        </Pane>
      </Pane>
    </Pane>
  );
});

export default Index;
