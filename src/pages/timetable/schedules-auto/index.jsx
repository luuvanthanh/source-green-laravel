import React, { useEffect, useState, memo, useMemo } from 'react';
import styles from '@/assets/styles/Common/common.scss';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Text from '@/components/CommonComponent/Text';
import { Helper, variables } from '@/utils';
import { Form, Typography, Modal, Input } from 'antd';
import classnames from 'classnames';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'dva';
import { isEmpty, groupBy, size, maxBy, head, last, debounce } from 'lodash';
import { Helmet } from 'react-helmet';
import { useHistory, useLocation } from 'umi';
import { v4 as uuidv4 } from 'uuid';
import '@/assets/styles/Modules/TimeTables/styles.module.scss';

const getListStyle = (isDraggingOver) => ({
  backgroundColor: isDraggingOver ? 'rgba(123, 237, 159, 0.3)' : '',
});

const { Paragraph } = Typography;
const Index = memo(() => {
  const [formRef] = Form.useForm();
  const [dragRef] = Form.useForm();
  const [propertyForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [timeline, setTimeline] = useState('');
  const [items, setItems] = useState([]);

  const [
    loading,
    { classes, branches, years, activities },
  ] = useSelector(({ loading: { effects }, timeTablesAuto }) => [effects, timeTablesAuto]);

  const dataYears = years.map((item) => ({
    id: item.id,
    name: `${item.fromYear} - ${item.toYear}`,
  }));

  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const history = useHistory();

  const [search, setSearch] = useState({
    isGroupByDayOfWeek: false,
    branchId: null,
    timetableSettingId: null,
  });

  const [searchText, setSearchText] = useState('');

  const loadCategories = () => {
    dispatch({
      type: 'timeTablesAuto/GET_BRANCHES',
      payload: {},
      callback: (response) => {
        if (response) {
          setSearch((prev) => ({ ...prev, branchId: head(response)?.id }));
          formRef.setFieldsValue({
            branchId: head(response)?.id,
          });
          dispatch({
            type: 'timeTablesAuto/GET_CLASSES',
            payload: {
              branch: head(response)?.id,
            },
          });
        }
      },
    });
  };

  const loadYears = () => {
    dispatch({
      type: 'timeTablesAuto/GET_YEARS',
      payload: {},
      callback: (response) => {
        if (response) {
          setSearch((prev) => ({ ...prev, timetableSettingId: head(response)?.id }));
          formRef.setFieldsValue({
            timetableSettingId: head(response)?.id,
          });
          setTimeline(head(response)?.id);
        }
      },
    });
    dispatch({
      type: 'timeTablesAuto/GET_ACTIVITIES',
      payload: {},
    });
  };

  const formatTimeline = Object.assign({}, ...years.map((item) => ({ [item?.id]: item })));
  const timelineColumns = Helper.generateTimeline(
    formatTimeline[timeline]?.periodDuration,
    formatTimeline[timeline]?.fromTime,
    formatTimeline[timeline]?.toTime,
  );

  const onLoad = () => {
    dispatch({
      type: 'timeTablesAuto/GET_DATA',
      payload: {
        ...search,
      },
      callback: (response) => {
        if (response) {
          const { timetableDetailGroupByTimes } = response;
          const arr = classes.map((classItem) =>
            timelineColumns.map((timeItem) => {
              const timetableDetail = timetableDetailGroupByTimes?.find(
                (item) =>
                  item.startTime === timeItem.startTime && item.endTime === timeItem.endTime,
              );
              const timetableDetailClass = timetableDetail?.timetableDetailGroupByClasses?.find(
                (item) => item?.class?.id === classItem?.id,
              );
              return {
                branchId: search?.branchId,
                timetableSettingId: search?.timetableSettingId,
                classId: classItem?.id,
                tasks: timetableDetailClass?.timetableDetailActivities || [],
                timetableDetailByClassAndActivy: {
                  startTime: timeItem?.startTime,
                  endTime: timeItem?.endTime,
                },
              };
            }),
          );
          setItems(arr);
        }
      },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch({
        ...search,
      }),
    });
  };

  useEffect(() => {
    loadCategories();
    loadYears();
  }, []);

  useEffect(() => {
    if (search.branchId && search.timetableSettingId && !isEmpty(classes)) {
      setTimeline(search.timetableSettingId);
      onLoad();
    }
  }, [search, classes]);

  const formatColumns = useMemo(() => {
    const taskArr = activities.map((item) => item.name);
    const activyColumns = { 'columns-1': { tasks: taskArr } };
    const newColumns = Object.assign(
      {},
      ...items.flat(1).map((item, index) => ({
        [`columns-${index + 2}`]: {
          ...item,
          dragId: uuidv4(),
          tasks: item?.tasks?.map((item) => ({ ...item, dragId: uuidv4() })),
        },
      })),
    );
    return { ...activyColumns, ...newColumns };
  }, [items]);

  const formatNewItems = useMemo(() => {
    const newItemsFromBackend = Object.assign(
      {},
      ...activities.map((item) => ({ [item?.name]: item })),
    );
    return newItemsFromBackend;
  }, [activities]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = formatColumns[source.droppableId];
      const destColumn = formatColumns[destination.droppableId];
      const sourceItems = [...sourceColumn.tasks];
      const [removed] = sourceItems.splice(source.index, 1);
      const timetableActivityDetail = activities.find((item) => item.name === removed);
      let columnsAfter = {};
      let arr = [];
      let groups = {};
      let payload = {};
      if (destination.droppableId === 'columns-1') {
        columnsAfter = {
          ...formatColumns,
          [source.droppableId]: {
            ...formatColumns[source.droppableId],
            tasks: formatColumns[source.droppableId].tasks.filter(
              (item) => item?.id !== removed?.id,
            ),
          },
        };
        arr = Object.keys(columnsAfter).map((key) => columnsAfter[key]);
        groups = groupBy(
          arr.filter((item) => item.classId),
          'classId',
        );
        setItems(Object.keys(groups).map((key) => groups[key]));
        dispatch({
          type: 'timeTablesAuto/REMOVE',
          payload: {
            id: removed?.id,
          },
          callback: (response, error) => {
            if (error) {
              columnsAfter = {
                ...formatColumns,
              };
              const arr = Object.keys(columnsAfter).map((key) => columnsAfter[key]);
              const groups = groupBy(
                arr.filter((item) => item.classId),
                'classId',
              );
              setItems(Object.keys(groups).map((key) => groups[key]));
            }
          },
        });
      } else if (destination.droppableId !== 'columns-1' && source.droppableId !== 'columns-1') {
        columnsAfter = {
          ...formatColumns,
          [destination.droppableId]: {
            ...formatColumns[destination.droppableId],
            tasks: [...(formatColumns[destination.droppableId].tasks || []), removed],
          },
          [source.droppableId]: {
            ...formatColumns[source.droppableId],
            tasks: formatColumns[source.droppableId].tasks.filter(
              (item) => item?.id !== removed?.id,
            ),
          },
        };
        arr = Object.keys(columnsAfter).map((key) => columnsAfter[key]);
        groups = groupBy(
          arr.filter((item) => item.classId),
          'classId',
        );
        setItems(Object.keys(groups).map((key) => groups[key]));
        dispatch({
          type: 'timeTablesAuto/DRAG_CELL_BY_CELL',
          payload: {
            branchId: destColumn.branchId,
            timetableSettingId: destColumn.timetableSettingId,
            timetableDetailByClassAndActivy: {
              startTime: destColumn.timetableDetailByClassAndActivy.startTime,
              endTime: destColumn.timetableDetailByClassAndActivy.endTime,
              classId: destColumn.classId,
              timetableActivityDetailId: removed?.timetableActivityDetailId,
            },
            id: removed?.id,
          },
          callback: (response, error) => {
            if (error) {
              const columnsAfter = {
                ...formatColumns,
              };
              const arr = Object.keys(columnsAfter).map((key) => columnsAfter[key]);
              const groups = groupBy(
                arr.filter((item) => item.classId),
                'classId',
              );
              setItems(Object.keys(groups).map((key) => groups[key]));
            }
          },
        });
      } else {
        columnsAfter = {
          ...formatColumns,
          [destination.droppableId]: {
            ...formatColumns[destination.droppableId],
            tasks: [
              ...(formatColumns[destination.droppableId].tasks || []),
              { timetableActivityDetail },
            ],
          },
        };
        arr = Object.keys(columnsAfter).map((key) => columnsAfter[key]);
        groups = groupBy(
          arr.filter((item) => item.classId),
          'classId',
        );
        setItems(Object.keys(groups).map((key) => groups[key]));
        payload = {
          branchId: destColumn.branchId,
          timetableSettingId: destColumn.timetableSettingId,
          timetableDetailByClassAndActivy: {
            startTime: destColumn.timetableDetailByClassAndActivy.startTime,
            endTime: destColumn.timetableDetailByClassAndActivy.endTime,
            classId: destColumn.classId,
            timetableActivityDetailId: timetableActivityDetail.id,
          },
        };
        dispatch({
          type: 'timeTablesAuto/ADD_DRAG',
          payload,
          callback: (response, error) => {
            if (response) {
              dispatch({
                type: 'timeTablesAuto/DRAG_AFTER',
                payload: {
                  ...search,
                },
                callback: (response) => {
                  if (response) {
                    const { timetableDetailGroupByTimes } = response;
                    const arr = classes.map((classItem) =>
                      timelineColumns.map((timeItem) => {
                        const timetableDetail = timetableDetailGroupByTimes?.find(
                          (item) =>
                            item.startTime === timeItem.startTime &&
                            item.endTime === timeItem.endTime,
                        );
                        const timetableDetailClass = timetableDetail?.timetableDetailGroupByClasses?.find(
                          (item) => item?.class?.id === classItem?.id,
                        );
                        return {
                          branchId: search?.branchId,
                          timetableSettingId: search?.timetableSettingId,
                          classId: classItem?.id,
                          tasks: timetableDetailClass?.timetableDetailActivities || [],
                          timetableDetailByClassAndActivy: {
                            startTime: timeItem?.startTime,
                            endTime: timeItem?.endTime,
                          },
                        };
                      }),
                    );
                    setItems(arr);
                  }
                },
              });
            }
            if (error) {
              const columnsAfter = {
                ...formatColumns,
                [destination.droppableId]: {
                  ...formatColumns[destination.droppableId],
                },
              };
              const arr = Object.keys(columnsAfter).map((key) => columnsAfter[key]);
              const groups = groupBy(
                arr.filter((item) => item.classId),
                'classId',
              );
              setItems(Object.keys(groups).map((key) => groups[key]));
            }
          },
        });
      }
    }
  };

  const showModal = (value) => {
    const columnInfo = formatColumns[value];
    const { timetableDetailByClassAndActivy } = columnInfo;
    propertyForm.setFieldsValue({
      ...columnInfo,
      time: `${timetableDetailByClassAndActivy.startTime} - ${timetableDetailByClassAndActivy.endTime}`,
      branchId: columnInfo?.branchId,
      classIds: [columnInfo?.classId],
      activities: columnInfo?.tasks.map((item) => ({
        id: item.id,
        name: item?.timetableActivityDetail?.name,
        timetableActivityDetailId: item.timetableActivityDetailId,
        timetableDetailId: item.timetableDetailId,
        dayOfWeeks: item?.dayOfWeeks.filter(Boolean),
      })),
    });
    setIsModalVisible(true);
  };

  const handleOk = () => {
    propertyForm.validateFields().then((values) => {
      const payload = {
        branchId: search.branchId,
        timetableSettingId: search.timetableSettingId,
        timetableDetailByClassesAndActivities: {
          startTime: head(values?.time?.split('-')).trim(),
          endTime: last(values?.time?.split('-')).trim(),
          classIds: values.classIds,
          activities: values?.activities?.map((item) => ({
            timetableActivityDetailId: item?.timetableActivityDetailId,
            dayOfWeeks: item?.dayOfWeeks,
          })),
        },
      };
      dispatch({
        type: 'timeTablesAuto/UPDATE_ACTIVITIES',
        payload,
        callback: (response) => {
          if (response) {
            setIsModalVisible(false);
            dispatch({
              type: 'timeTablesAuto/DRAG_AFTER',
              payload: {
                ...search,
              },
              callback: (response) => {
                if (response) {
                  const { timetableDetailGroupByTimes } = response;
                  const arr = classes.map((classItem) =>
                    timelineColumns.map((timeItem) => {
                      const timetableDetail = timetableDetailGroupByTimes?.find(
                        (item) =>
                          item.startTime === timeItem.startTime &&
                          item.endTime === timeItem.endTime,
                      );
                      const timetableDetailClass = timetableDetail?.timetableDetailGroupByClasses?.find(
                        (item) => item?.class?.id === classItem?.id,
                      );
                      return {
                        branchId: search?.branchId,
                        timetableSettingId: search?.timetableSettingId,
                        classId: classItem?.id,
                        tasks: timetableDetailClass?.timetableDetailActivities || [],
                        timetableDetailByClassAndActivy: {
                          startTime: timeItem?.startTime,
                          endTime: timeItem?.endTime,
                        },
                      };
                    }),
                  );
                  setItems(arr);
                }
              },
            });
          }
        },
      });
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getSizeMax = (record) => {
    const itemsFlat = items
      .flat(1)
      .filter(
        (item) =>
          item?.timetableDetailByClassAndActivy?.startTime === record?.startTime &&
          item?.timetableDetailByClassAndActivy?.endTime === record?.endTime,
      )
      .map((item) => ({ ...item, size: size(item.tasks) }));
    return maxBy(itemsFlat, 'size');
  };

  const changeFilterDebouce = debounce((name, value) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      [name]: value,
    }));
  }, 300);

  const changeFilter = (name) => (value) => {
    changeFilterDebouce(name, value);
  };

  const changeBanchFilter = (name) => (value) => {
    if (value) {
      dispatch({
        type: 'timeTablesAuto/GET_CLASSES',
        payload: {
          branch: value,
        },
      });
    }
    changeFilterDebouce(name, value);
  };

  const formatTextSearch = (tasks) => {
    if (searchText) {
      return tasks.filter(
        (item) => Helper.slugify(item.name)?.indexOf(Helper.slugify(searchText)) >= 0,
      );
    }
    return tasks;
  };

  return (
    <>
      <Helmet title="Thời khóa biểu" />
      <Modal
        title="Chi tiết"
        centered
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <p key="back" role="presentation" onClick={handleCancel}>
            Hủy
          </p>,
          <Button
            key="submit"
            color="success"
            type="primary"
            onClick={handleOk}
            loading={loading['timeTablesAuto/UPDATE_ACTIVITIES']}
          >
            Lưu
          </Button>,
        ]}
      >
        <Form form={propertyForm}>
          <div className="row">
            <div className="col-lg-4">
              <FormItem
                className="flex-column form-timetable-disabled"
                label="Thời gian"
                name="time"
                type={variables.INPUT}
                disabled
              />
            </div>

            <div className="col-lg-4">
              <FormItem
                className="flex-column form-timetable-disabled"
                data={branches}
                label="Cơ sở"
                name="branchId"
                type={variables.SELECT}
                disabled
              />
            </div>

            <div className="col-lg-12">
              <FormItem
                className="flex-column"
                data={classes}
                label="Lớp áp dụng"
                name="classIds"
                type={variables.SELECT_MUTILPLE}
                disabled
              />
            </div>

            <div className="col-lg-12">
              <Form.List name="activities">
                {(fields, { remove }) => (
                  <>
                    {fields.map((field, index) => (
                      <div className="row align-items-center" key={index}>
                        <div className="col-10">
                          <FormItem
                            className="flex-column form-timetable-disabled"
                            label={`Hoạt động ${index + 1}`}
                            name={[field.name, 'name']}
                            type={variables.INPUT}
                            disabled
                          />
                        </div>

                        <div className="col-2 d-flex justify-content-end">
                          {fields.length > 1 && (
                            <button
                              type="button"
                              className={styles['button-remove']}
                              onClick={() => remove(field.name)}
                            >
                              <span className="icon-remove" />
                            </button>
                          )}
                        </div>

                        <div className="col-12">
                          <FormItem
                            className="flex-column"
                            data={Helper.objectToArray(variables.DAY_OF_WEEKS_TEXT)}
                            label="Thứ"
                            name={[field.name, 'dayOfWeeks']}
                            type={variables.SELECT_MUTILPLE}
                            allowClear
                          />
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </Form.List>
            </div>
          </div>
        </Form>
      </Modal>
      <div className={classnames(styles['content-form'], styles['content-form-children'])}>
        <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
          <Text color="dark">Thời khóa biểu</Text>
        </div>
        {/* FORM SEARCH */}
        <div className={classnames(styles.search, 'pt20')}>
          <Form layout="vertical" form={formRef} initialValues={{ ...search }}>
            <div className="row">
              <div className="col-lg-4">
                <FormItem
                  className="ant-form-item-row"
                  data={dataYears}
                  label="NĂM HỌC"
                  name="timetableSettingId"
                  type={variables.SELECT}
                  allowClear={false}
                  onChange={(value) => changeFilter('timetableSettingId')(value)}
                />
              </div>
              <div className="col-lg-4">
                <FormItem
                  className="ant-form-item-row"
                  data={branches}
                  label="CƠ SỞ"
                  name="branchId"
                  type={variables.SELECT}
                  allowClear={false}
                  onChange={(value) => changeBanchFilter('branchId')(value)}
                />
              </div>
            </div>
          </Form>
        </div>
        {/* FORM DRAG */}
        {!isEmpty(classes) && !isEmpty(items) && (
          <Form layout="vertical" form={dragRef}>
            <div className={classnames('schedules-custom', 'mt20')}>
              <DragDropContext onDragEnd={onDragEnd}>
                <div className="col-activites">
                  {Object.entries(formatColumns)
                    .slice(0, 1)
                    .map(([key, value], index) => {
                      const tasks = value.tasks.map((taskId) => formatNewItems[taskId]);

                      return (
                        <Droppable key={index} droppableId={key}>
                          {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                              <div className={classnames(styles['block-table'])}>
                                <div className="mb15">
                                  <Input
                                    placeholder="Nhập"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                  />
                                </div>
                                {formatTextSearch(tasks).map((task, index) => (
                                  <Draggable key={task.id} draggableId={task.name} index={index}>
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        <Paragraph
                                          className="py5 px10"
                                          style={{
                                            backgroundColor: task.colorCode,
                                          }}
                                        >
                                          {task.name}
                                        </Paragraph>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                              </div>
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      );
                    })}
                </div>
                <div className="activiies-block">
                  <div className={classnames(styles['block-table'], 'block')}>
                    <div className="col-time">
                      <Paragraph className="header-row">Thời gian</Paragraph>
                      {timelineColumns.map((item) => (
                        <Paragraph
                          className={classnames(
                            'data-row cell',
                            `size-row-${getSizeMax(item)?.size || 1}`,
                          )}
                          key={item.id}
                        >
                          {`${item.startTime} - ${item.endTime}`}
                        </Paragraph>
                      ))}
                    </div>
                    <div className="wrapper-droppable">
                      {classes.map((classItem, index) => (
                        <div className="col-block" key={index}>
                          <Paragraph className="header-row">{classItem.name}</Paragraph>
                          {Object.entries(formatColumns)
                            .slice(1)
                            .filter((column) => column[1].classId === classItem.id)
                            .map(([key, value], index) => {
                              const indexParent = index;
                              const tasks = value.tasks.map((task) => ({
                                ...formatNewItems[task?.timetableActivityDetail?.name],
                                dragId: task.dragId,
                                isEmptyDayOfWeek: task.isEmptyDayOfWeek,
                              }));
                              const sizeMax = getSizeMax(value?.timetableDetailByClassAndActivy);

                              return (
                                <Droppable key={index} droppableId={key}>
                                  {(provided, snapshot) => (
                                    <div
                                      {...provided.droppableProps}
                                      ref={provided.innerRef}
                                      style={getListStyle(snapshot.isDraggingOver)}
                                      className={classnames(
                                        'cell',
                                        `size-row-${sizeMax?.size || 1}`,
                                      )}
                                    >
                                      {tasks.map((task, index) => (
                                        <Draggable
                                          key={`${task.id}-${indexParent}-${index}`}
                                          draggableId={task.dragId}
                                          index={index}
                                        >
                                          {(provided) => (
                                            <div
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}
                                            >
                                              <Paragraph
                                                style={{
                                                  backgroundColor: task?.colorCode,
                                                }}
                                                className="data-row"
                                                onClick={() => showModal(key)}
                                              >
                                                {task?.isEmptyDayOfWeek && (
                                                  <span className="dot-warning" />
                                                )}
                                                {task?.name}
                                              </Paragraph>
                                            </div>
                                          )}
                                        </Draggable>
                                      ))}
                                    </div>
                                  )}
                                </Droppable>
                              );
                            })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </DragDropContext>
            </div>
          </Form>
        )}
      </div>
    </>
  );
});

export default Index;
