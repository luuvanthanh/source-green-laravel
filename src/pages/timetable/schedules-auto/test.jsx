import React, { useEffect, useState, memo } from 'react';
import styles from '@/assets/styles/Common/common.scss';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Text from '@/components/CommonComponent/Text';
import { Helper, variables } from '@/utils';
import { Form, Typography, Modal } from 'antd';
import classnames from 'classnames';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'dva';
import { isEmpty } from 'lodash';
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
  const [keyColumn, setKeyColumn] = useState(null);
  const [columnInfo, setColumnInfo] = useState({});

  const [
    { data, classes, branches, years, activities },
    { defaultBranch },
  ] = useSelector(({ loading: { effects }, timeTablesAuto }) => [timeTablesAuto, effects]);

  const dataYears = years.map((item) => ({
    id: item.id,
    name: `${item.fromYear} - ${item.toYear}`,
  }));

  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const history = useHistory();

  const [defaultBranchs] = useState(defaultBranch?.id ? [defaultBranch] : []);
  const [search, setSearch] = useState({
    IsGroupByDayOfWeek: false,
  });

  const loadCategories = () => {
    if (search.branchId) {
      dispatch({
        type: 'timeTablesAuto/GET_CLASSES',
        payload: {
          branch: search.branchId,
        },
      });
    }
    if (!defaultBranch?.id) {
      dispatch({
        type: 'timeTablesAuto/GET_BRANCHES',
        payload: {},
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
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch({
        ...search,
      }),
    });
  };

  useEffect(() => {
    onLoad();
    loadCategories();
    loadYears();
  }, [search]);

  const onConfigChange = (values) => {
    setSearch((prev) => ({
      ...prev,
      branchId: values.branchId,
      timetableSettingId: values.timetableSettingId,
    }));

    dispatch({
      type: 'timeTablesAuto/GET_DATA',
      payload: { ...search },
    });
  };

  const taskArr = activities.map((item) => `${item.name}`);
  const activyColumns = { 'columns-1': { tasks: taskArr } };
  const arr = classes.map((classItem) => {
    const a = timeStamp.map((timeItem) => {
      const checkTime = data.timetableDetailGroupByTimes.find(
        (i) => i.startTime === timeItem.startTime,
      );

      let fullInfo = null;
      if (checkTime) {
        const checkAllInfo = checkTime.timetableDetailGroupByClasses.map((allInfo) => {
          const c = allInfo.timetableDetailActivities.map((col) => ({
            branchId: search?.branchId,
            timetableSettingId: search?.timetableSettingId,
            classId: col?.classId === classItem.classId && col?.classId,
            tasks: [col?.timetableActivityDetail.name],
            timetableDetailByClassAndActivy: {
              startTime: timeItem?.startTime,
              endTime: timeItem?.endTime,
            },
          }));
          return c;
        });
        fullInfo = checkAllInfo;
      } else {
        fullInfo = {
          branchId: search?.branchId,
          timetableSettingId: search?.timetableSettingId,
          classId: classItem?.id,
          tasks: [],
          timetableDetailByClassAndActivy: {
            startTime: timeItem?.startTime,
            endTime: timeItem?.endTime,
          },
        };
      }
      return fullInfo;
    });
    return a;
  });
  const newColumns = Object.assign(
    {},
    ...arr.flat(1).map((item, index) => ({ [`columns-${index + 2}`]: item })),
  );
  const newColumnsFromBackend = { ...activyColumns, ...newColumns };

  const newItemsFromBackend = Object.assign(
    {},
    ...activities.map((item) => ({ [`${item?.name}`]: item })),
  );

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = newColumnsFromBackend[source.droppableId];
      const destColumn = newColumnsFromBackend[destination.droppableId];
      const sourceItems = [...sourceColumn.tasks];
      const destItems = [...destColumn.tasks];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      const payload = {
        branchId: destColumn.branchId,
        timetableSettingId: destColumn.timetableSettingId,
        timetableDetailByClassAndActivy: {
          startTime: destColumn.timetableDetailByClassAndActivy.startTime,
          endTime: destColumn.timetableDetailByClassAndActivy.endTime,
          classId: destColumn.classId,
          timetableActivityDetailId: newItemsFromBackend[result.draggableId].id,
        },
      };
      dispatch({
        type: 'timeTablesAuto/ADD_DRAG',
        payload,
      });
    }
  };

  const showModal = (value) => {
    setIsModalVisible(true);
    setKeyColumn(value);
    setColumnInfo(newColumnsFromBackend[value]);
  };

  useEffect(() => {
    propertyForm?.setFieldsValue({
      ...columnInfo,
      time: columnInfo?.time,
      branchName: columnInfo?.branchName,
      tasks: columnInfo?.tasks,
    });
  }, [keyColumn]);

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
        <Form form={propertyForm}>
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
          <Form layout="vertical" form={formRef} onFinish={onConfigChange}>
            <div className="row">
              <div className="col-lg-3">
                <FormItem
                  className="ant-form-item-row"
                  data={dataYears}
                  label="NĂM HỌC"
                  name="timetableSettingId"
                  type={variables.SELECT}
                  rules={[variables.RULES.EMPTY]}
                />
              </div>

              {!defaultBranch?.id && (
                <div className="col-lg-3">
                  <FormItem
                    className="ant-form-item-row"
                    data={branches}
                    label="CƠ SỞ"
                    name="branchId"
                    type={variables.SELECT}
                    allowClear={false}
                  />
                </div>
              )}
              {defaultBranch?.id && (
                <div className="col-lg-3">
                  <FormItem
                    className="ant-form-item-row"
                    data={defaultBranchs}
                    label="CƠ SỞ"
                    name="branchId"
                    type={variables.SELECT}
                    allowClear={false}
                  />
                </div>
              )}
              <div className="col-lg-4">
                <Button color="success" permission="TKB" htmlType="submit">
                  Cấu hình
                </Button>
              </div>
            </div>
          </Form>
        </div>
        {/* FORM DRAG */}
        {!isEmpty(classes) && (
          <Form layout="vertical" form={dragRef} onFinish={onFinish}>
            <div className={classnames('schedules-custom', 'mt20', 'row')}>
              <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
                <div className="col-lg-2">
                  {Object.entries(newColumnsFromBackend)
                    .slice(0, 1)
                    .map(([key, value], index) => {
                      const tasks = value.tasks.map((taskId) => newItemsFromBackend[taskId]);

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
                          {Object.entries(newColumnsFromBackend)
                            .slice(1)
                            .filter((column) => column[1].classId === classItem.id)
                            .map(([key, value], index) => {
                              const tasks = value.tasks.map(
                                (taskId) => newItemsFromBackend[taskId],
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
                                          <Paragraph key={index}>{task.name}</Paragraph>
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
                                          backgroundColor: task.color,
                                        }}
                                        className="data-row"
                                        onClick={() => showModal(key)}
                                      >
                                        {task.name}
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
