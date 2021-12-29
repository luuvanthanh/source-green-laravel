import React, { useEffect, useState, memo, useMemo } from 'react';
import styles from '@/assets/styles/Common/common.scss';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Text from '@/components/CommonComponent/Text';
import { Helper, variables } from '@/utils';
import { Form, Typography, Modal } from 'antd';
import classnames from 'classnames';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'dva';
import { isEmpty, groupBy } from 'lodash';
import { Helmet } from 'react-helmet';
import { useHistory, useLocation } from 'umi';
import { timeStamp } from './initial';
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
  const [columnInfo, setColumnInfo] = useState({});

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
  const { pathname, query } = useLocation();
  const history = useHistory();

  const [search, setSearch] = useState({
    isGroupByDayOfWeek: false,
    branchId: query.branchId,
    timetableSettingId: query.timetableSettingId,
  });

  const loadCategories = () => {
    dispatch({
      type: 'timeTablesAuto/GET_BRANCHES',
      payload: {},
    });
    if (search.branchId) {
      dispatch({
        type: 'timeTablesAuto/GET_CLASSES',
        payload: {
          branch: search.branchId,
        },
      });
    }
  };

  const loadYears = () => {
    dispatch({
      type: 'timeTablesAuto/GET_YEARS',
      payload: {},
    });
    dispatch({
      type: 'timeTablesAuto/GET_ACTIVITIES',
      payload: {},
    });
  };

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
            timeStamp.map((timeItem) => {
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
      onLoad();
    }
  }, [search, classes]);

  const onChangeBranch = (branch) => {
    if (branch) {
      dispatch({
        type: 'timeTablesAuto/GET_CLASSES',
        payload: {
          branch,
        },
      });
    }
  };

  const onConfigChange = (values) => {
    setSearch((prev) => ({
      ...prev,
      branchId: values.branchId,
      timetableSettingId: values.timetableSettingId,
    }));
  };

  const formatColumns = useMemo(() => {
    const taskArr = activities.map((item) => item.name);
    const activyColumns = { 'columns-1': { tasks: taskArr } };
    const newColumns = Object.assign(
      {},
      ...items.flat(1).map((item, index) => ({ [`columns-${index + 2}`]: item })),
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

      const columnsAfter = {
        ...formatColumns,
        [destination.droppableId]: {
          ...formatColumns[destination.droppableId],
          tasks: [
            ...(formatColumns[destination.droppableId].tasks || []),
            { timetableActivityDetail },
          ],
        },
      };

      const arr = Object.keys(columnsAfter).map((key) => columnsAfter[key]);

      const groups = groupBy(
        arr.filter((item) => item.classId),
        'classId',
      );
      setItems(Object.keys(groups).map((key) => groups[key]));
      const payload = {
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
  };

  const showModal = (value) => {
    setIsModalVisible(true);
    setColumnInfo(formatColumns[value]);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = () => {};

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
          <a key="back" role="presentation" onClick={handleCancel}>
            Hủy
          </a>,
          <Button key="submit" color="success" type="primary" onClick={handleOk}>
            Lưu
          </Button>,
        ]}
      >
        <Form form={propertyForm} initialValues={{ ...columnInfo }}>
          <div className="row">
            <div className="col-lg-4">
              <FormItem
                className="flex-column"
                label="Thời gian"
                name="time"
                type={variables.INPUT}
                disabled
              />
            </div>

            <div className="col-lg-4">
              <FormItem
                className="flex-column"
                label="Cơ sở"
                name="branchName"
                type={variables.INPUT}
                disabled
              />
            </div>

            <div className="col-lg-12">
              <FormItem
                className="flex-column"
                data={classes}
                label="Lớp áp dụng"
                name="classId"
                type={variables.SELECT_MUTILPLE}
                allowClear
              />
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
          <Form
            layout="vertical"
            form={formRef}
            initialValues={{ ...search }}
            onFinish={onConfigChange}
          >
            <div className="row">
              <div className="col-lg-4">
                <FormItem
                  className="ant-form-item-row"
                  data={dataYears}
                  label="NĂM HỌC"
                  name="timetableSettingId"
                  type={variables.SELECT}
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
                  onChange={onChangeBranch}
                />
              </div>
              <div className="col-lg-4">
                <Button
                  color="success"
                  permission="TKB"
                  htmlType="submit"
                  loading={loading['timeTablesAuto/GET_DATA']}
                >
                  Cấu hình
                </Button>
              </div>
            </div>
          </Form>
        </div>
        {/* FORM DRAG */}
        {!isEmpty(classes) && !isEmpty(items) && (
          <Form layout="vertical" form={dragRef} onFinish={onFinish}>
            <div className={classnames('schedules-custom', 'mt20', 'row')}>
              <DragDropContext onDragEnd={onDragEnd}>
                <div className="col-lg-2">
                  {Object.entries(formatColumns)
                    .slice(0, 1)
                    .map(([key, value], index) => {
                      const tasks = value.tasks.map((taskId) => formatNewItems[taskId]);

                      return (
                        <Droppable key={index} droppableId={key}>
                          {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                              <div className={classnames(styles['block-table'])}>
                                <FormItem
                                  className="ant-form-item-row"
                                  name="type"
                                  type={variables.INPUT}
                                />
                                {tasks.map((task, index) => (
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
                                            backgroundColor: task.color,
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

                <div className="col-lg-10">
                  <div className={classnames(styles['block-table'])}>
                    <div className="row time-table">
                      <div className={classes.length > 3 ? 'col-lg-2' : 'col-lg-3'}>
                        <Paragraph className="header-row">Thời gian</Paragraph>
                        {timeStamp.map((item) => (
                          <Paragraph className="data-row cell" key={item.id}>
                            {`${item.startTime} - ${item.endTime}`}
                          </Paragraph>
                        ))}
                      </div>

                      {classes.map((classItem, index) => (
                        <div className="col-lg-3" key={index}>
                          <Paragraph className="header-row">{classItem.name}</Paragraph>
                          {Object.entries(formatColumns)
                            .slice(1)
                            .filter((column) => column[1].classId === classItem.id)
                            .map(([key, value], index) => {
                              const tasks = value.tasks.map(
                                (task) => formatNewItems[task?.timetableActivityDetail?.name],
                              );
                              let cell = null;

                              if (isEmpty(value.tasks)) {
                                cell = (
                                  <Droppable key={index} droppableId={key} direction="horizontal">
                                    {(provided, snapshot) => (
                                      <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        style={getListStyle(snapshot.isDraggingOver)}
                                        className="no-data-row cell"
                                      >
                                        {tasks.map((task, index) => (
                                          <Paragraph key={index}>{task?.name}</Paragraph>
                                        ))}
                                        {provided.placeholder}
                                      </div>
                                    )}
                                  </Droppable>
                                );
                              } else {
                                cell = (
                                  <div key={index} className="cell">
                                    {tasks.map((task, index) => (
                                      <Paragraph
                                        key={index}
                                        style={{
                                          backgroundColor: task?.timetableActivityDetail?.color,
                                        }}
                                        className="data-row"
                                        onClick={() => showModal(key)}
                                      >
                                        {task?.name}
                                      </Paragraph>
                                    ))}
                                  </div>
                                );
                              }

                              return cell;
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
