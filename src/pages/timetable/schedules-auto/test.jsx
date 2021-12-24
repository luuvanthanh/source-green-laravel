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
import moment from 'moment';
import React, { useEffect, useState, memo } from 'react';
import { Helmet } from 'react-helmet';
import { useHistory, useLocation } from 'umi';
import { columnsFromBackend, itemsFromBackend, timeStamp } from './initial';
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
  const [columns, setColumns] = useState(columnsFromBackend);

  const [
    { classes, branches },
    { defaultBranch },
  ] = useSelector(({ loading: { effects }, timeTables, user }) => [timeTables, effects, user]);

  const dispatch = useDispatch();
  const { query, pathname } = useLocation();
  const history = useHistory();

  const [defaultBranchs] = useState(defaultBranch?.id ? [defaultBranch] : []);
  const [search, setSearch] = useState({
    fromDate: query?.fromDate
      ? moment(query?.fromDate).format(variables.DATE_FORMAT.DATE_AFTER)
      : moment().startOf('months').format(variables.DATE_FORMAT.DATE_AFTER),
    toDate: query?.toDate
      ? moment(query?.toDate).format(variables.DATE_FORMAT.DATE_AFTER)
      : moment().endOf('months').format(variables.DATE_FORMAT.DATE_AFTER),
  });

  const loadCategories = () => {
    if (search.branchId) {
      dispatch({
        type: 'timeTables/GET_CLASSES',
        payload: {
          branch: search.branchId,
        },
      });
    }
    if (!defaultBranch?.id) {
      dispatch({
        type: 'timeTables/GET_BRANCHES',
        payload: {},
      });
    }
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
        fromDate: moment(search.fromDate).format(variables.DATE_FORMAT.DATE_AFTER),
        toDate: moment(search.toDate).format(variables.DATE_FORMAT.DATE_AFTER),
      }),
    });
  };

  useEffect(() => {
    onLoad();
    loadCategories();
  }, [search]);

  const onConfigChange = (value) => {
    setSearch((prev) => ({
      ...prev.search,
      branchId: value.branchId,
      page: variables.PAGINATION.PAGE,
      limit: variables.PAGINATION.PAGE_SIZE,
    }));

    dispatch({
      type: 'timeTables/GET_CLASSES',
      payload: {
        branch: value.branchId,
      },
    });
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.tasks];
      const destItems = [...destColumn.tasks];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [destination.droppableId]: {
          ...destColumn,
          tasks: destItems,
        },
      });
    }
  };

  const onDeleteDrag = (value) => {
    const dataColumn = columns[value];

    setColumns({
      ...columns,
      [value]: {
        ...dataColumn,
        tasks: [],
      },
    });
  };

  const showModal = (value) => {
    setIsModalVisible(true);
    setKeyColumn(value);
    setColumnInfo(columns[value]);
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
    onDeleteDrag(keyColumn);
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
              <div className="col-lg-4">
                <FormItem
                  className="ant-form-item-row"
                  label="NĂM HỌC"
                  name="year"
                  type={variables.RANGE_PICKER}
                  picker="year"
                />
              </div>

              {!defaultBranch?.id && (
                <div className="col-lg-4">
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
                <div className="col-lg-4">
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
        <Form layout="vertical" form={dragRef} onFinish={onFinish}>
          <div className={classnames('schedules-custom', 'mt20', 'row')}>
            <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
              <div className="col-lg-2">
                {Object.entries(columns)
                  .slice(0, 1)
                  .map(([key, value], index) => {
                    const tasks = value.tasks.map((taskId) => itemsFromBackend[taskId]);

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
                                <Draggable key={task.id} draggableId={task.id} index={index}>
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
                                        {task.content}
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
                          {item.content}
                        </Paragraph>
                      ))}
                    </div>

                    {classes.map((classItem, index) => (
                      <div className="col-lg-3" key={index}>
                        <Paragraph className="header-row">{classItem.name}</Paragraph>
                        {Object.entries(columns)
                          .slice(1)
                          .filter((column) => column[1].classId === classItem.id)
                          .map(([key, value], index) => {
                            const tasks = value.tasks.map((taskId) => itemsFromBackend[taskId]);
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
                                        <Paragraph key={index}>{task.content}</Paragraph>
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
                                      {task.content}
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
            <div className="col-lg-12 d-flex justify-content-end">
              <Button color="success" permission="TKB" className="my20" htmlType="submit">
                Lưu
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
});

export default Index;
