import React, { useEffect, useState, memo, useMemo } from 'react';
import styles from '@/assets/styles/Common/common.scss';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Text from '@/components/CommonComponent/Text';
import { Helper, variables } from '@/utils';
import { Form, Typography, Modal, Input, Select } from 'antd';
import classnames from 'classnames';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'dva';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';

import { isEmpty, groupBy, size, maxBy, head, last, debounce } from 'lodash';
import { Helmet } from 'react-helmet';
import { useHistory, useLocation } from 'umi';
import { v4 as uuidv4 } from 'uuid';
import '@/assets/styles/Modules/TimeTables/styles.module.scss';
import stylesModule from './styles.module.scss';


const getListStyle = (isDraggingOver) => ({
  backgroundColor: isDraggingOver ? 'rgba(123, 237, 159, 0.3)' : '',
});

const { Paragraph } = Typography;
const Index = memo(() => {
  const [
    loading,
    { classes, branches, years, activities, program },
    { defaultBranch, user },
  ] = useSelector(({ loading: { effects }, englishStudyPlan, user }) => [
    effects,
    englishStudyPlan,
    user,
  ]);

  const [formRef] = Form.useForm();
  const { query } = useLocation();
  const [dragRef] = Form.useForm();
  const [propertyForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [timeline, setTimeline] = useState('');
  const [items, setItems] = useState([]);

  const [formatColumns, setFormatColumns] = useState();

  const [dataTime, setDataTime] = useState([]);


  const [dataUnit, setDataUnit] = useState([]);
  const [dataItemProgram, setDataItemProgram] = useState([]);
  const [dataProgram, setDataProgram] = useState([]);

  //Time table
  const [searchDate, setSearchDate] = useState({
    fromDate: Helper.getDate(moment(), variables.DATE_FORMAT.DATE_AFTER),
    toDate: moment().endOf('week').format(variables.DATE_FORMAT.DATE_AFTER),
    type: 'timeGridWeek',
    branchId: query?.branchId || defaultBranch?.id,
    classId: query?.classId || user?.roleCode === variables?.LIST_ROLE_CODE?.TEACHER && head(user?.objectInfo?.classTeachers)?.classId,
    schoolYearId: query?.schoolYearId,
  });

  const getDayOfWeek = (date) => {
    switch (date) {
      case 0:
        return 'Thời gian';
      case 1:
        return 'MON';
      case 2:
        return 'TUE';
      case 3:
        return 'WED';
      case 4:
        return 'THU';
      case 5:
        return 'FRI';
      case 6:
        return 'SAT';
      default:
        return 'SUNDAY';
    }
  };

  const getDayOfWeekFull = (date) => {
    switch (date) {
      case 0:
        return 'Thời gian';
      case 1:
        return 'Monday';
      case 2:
        return 'Tuesday';
      case 3:
        return 'Wednesday';
      case 4:
        return 'Thursday';
      case 5:
        return 'Friday';
      case 6:
        return 'Saturday';
      default:
        return 'Sunday';
    }
  };


  const arrDate = useMemo(() => {
    const startWeek = moment(searchDate.fromDate).startOf('week').subtract(1, 'day');
    const arr = [{ day: 'Thời gian' }];
    let i = 1;
    while (startWeek.isBefore(searchDate.toDate)) {
      arr.push({ date: Helper.getDate(moment(startWeek.add(1, 'day').clone().format(variables.DATE_FORMAT.DATE_AFTER))), day: getDayOfWeek(i), dayfull: getDayOfWeekFull(i) });
      i += 1;
    }
    return arr;
  }, [searchDate.fromDate, searchDate.toDate]);
  console.log("arrDate", arrDate);
  // console.log("arrDate", arrDate);

  const dataYears = years.map((item) => ({
    id: item.id,
    name: `${item.fromYear} - ${item.toYear}`,
  }));

  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const history = useHistory();

  const [search, setSearch] = useState({
    isGroupByDayOfWeek: false,
    branchId: defaultBranch?.id,
    schoolYearId: null,
  });

  const [searchText, setSearchText] = useState('');

  const loadCategories = () => {
    if (defaultBranch?.id) {
      dispatch({
        type: 'englishStudyPlan/GET_BRANCHES',
        payload: {},
        callback: (response) => {
          if (response) {
            dispatch({
              type: 'englishStudyPlan/GET_CLASSES',
              payload: {
                branch: defaultBranch?.id,
              },
            });
          }
        },
      });
    } else {
      dispatch({
        type: 'englishStudyPlan/GET_BRANCHES',
        payload: {},
        callback: (response) => {
          if (response) {
            setSearch((prev) => ({ ...prev, branchId: head(response)?.id }));
            formRef.setFieldsValue({
              branchId: head(response)?.id,
            });
            dispatch({
              type: 'englishStudyPlan/GET_CLASSES',
              payload: {
                branch: head(response)?.id,
              },
            });
          }
        },
      });
    }
  };

  const loadYears = () => {
    dispatch({
      type: 'englishStudyPlan/GET_YEARS',
      payload: {},
      callback: (response) => {
        if (response) {
          setSearch((prev) => ({ ...prev, schoolYearId: head(response)?.id }));
          formRef.setFieldsValue({
            schoolYearId: head(response)?.id,
          });
          setTimeline(head(response)?.id);
        }
      },
    });
    dispatch({
      type: 'englishStudyPlan/GET_ACTIVITIES',
      payload: {},
    });
  };

  const timelineColumns = useMemo(
    () =>
      Helper.generateTimeline(
        Object.assign({}, ...years.map((item) => ({ [item?.id]: item })))[timeline]?.periodDuration,
        Object.assign({}, ...years.map((item) => ({ [item?.id]: item })))[timeline]?.fromTime,
        Object.assign({}, ...years.map((item) => ({ [item?.id]: item })))[timeline]?.toTime,
      ),
    [timeline, years],
  );

  const onLoad = () => {
    dispatch({
      type: 'englishStudyPlan/GET_DATA',
      payload: {
        ...search,
        // fromDate: searchDate?.fromDate,
        // toDate: searchDate?.toDate
        fromDate: "2022-12-20",
        toDate: "2022-12-23"
      },
      callback: (response) => {
        // console.log("response", response);
        if (response) {
          const time = response?.timeTableSettingByTime;
          const data = response?.timeTableSettingByTime.concat(response?.studyPlanGroupByTime);
          setDataTime(time);
          const { timetableDetailGroupByTimes } = response;
          const arr = data.map((classItem) =>
            time.map((timeItem) => {
              const timetableDetail = timetableDetailGroupByTimes?.find(
                (item) =>
                  item.startTime === timeItem.startTime && item.endTime === timeItem.endTime,
              );
              const timetableDetailClass = timetableDetail?.timetableDetailGroupByClasses?.find(
                (item) => item?.class?.id === classItem?.id,
              );
              return {
                branchId: search?.branchId,
                schoolYearId: search?.schoolYearId,
                classId: classItem?.id,
                tasks: timetableDetailClass?.timetableDetailActivities || [],
                timetableDetailByClassAndActivy: {
                  startTime: timeItem?.startTime,
                  endTime: timeItem?.endTime,
                },
              };
            }),
          );
          setItems(data);
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
    dispatch({
      type: 'englishStudyPlan/GET_PROGRAM',
      payload: {
      },
      callback: (response) => {
        if (response?.items) {
          setDataItemProgram(response?.items
            ?.map(i => i.units.map(x => (x.lessions
              ?.map(k => ({
                ...k, idUnit: x?.id,
                programId: i.id,
                colorText: i?.colorText,
                programName: i?.name,
                unitName: x?.name,
                unitIndex: x?.index,
                lessionName: x?.name,
              }))))).flat(Infinity));
          setDataProgram(response?.items
            ?.map(i => i.units.map(x => (x.lessions
              ?.map(k => ({
                ...k, idUnit: x?.id,
                programId: i.id,
                colorText: i?.colorText,
                programName: i?.name,
                unitName: x?.name,
                unitIndex: x?.index,
                lessionName: x?.name,
              }))))).flat(Infinity));
        }
      },
    });
  }, []);

  useEffect(async () => {
    if (search.branchId && search.schoolYearId && !isEmpty(classes)) {
      await setTimeline(search.schoolYearId);
      onLoad();
    }
  }, [search, classes]);

  useEffect(async () => {
    const activyColumns = { 'columns-1': { tasks: dataItemProgram } };
    const newColumns = Object.assign(
      {},
      ...items.flat(1).map((item, index) => ({
        [`columns-${index + 2}`]: {
          ...item,
          dragId: uuidv4(),
          tasks: item?.itemsGroupByDate?.map((item) => ({ ...item, dragId: uuidv4() })) || [],
        },
      })),
    );
    setFormatColumns({ ...activyColumns, ...newColumns });
  }, [items]);
  console.log("items", items);
  console.log("formatColumns", formatColumns);
  // console.log("items", items);
  const formatNewItems = useMemo(() => {
    const newItemsFromBackend = Object.assign(
      {},
      ...activities.map((item) => ({ [item?.name]: item })),
    );
    return newItemsFromBackend;
  }, [activities]);

  const onDragEnd = (result) => {
    console.log(result);
    const stringData = JSON.parse(result?.destination?.droppableId);
    const dataProgram = dataItemProgram?.find((i, index) => index === result?.source?.index);

    const key = stringData?.key;
    const dataColumn = formatColumns?.[key];
    console.log("dataItemProgram", dataItemProgram);
    console.log("dataProgram", dataProgram);
    const data = formatColumns?.[key]?.tasks;
    if (formatColumns?.[key]?.tasks?.find(i => i?.date === stringData?.date)) {
      data?.map(i => ({
        ...i,
        lessions: i?.date === stringData?.date ? i.lessions?.push({
          date: stringData?.date,
          programId: dataProgram?.programId,
          dragId: uuidv4(),
          lession: {
            colorText: dataProgram?.colorText,
            programName: dataProgram?.programName,
            unitIndex: dataProgram?.unitIndex,
            unitName: dataProgram?.unitName,
            lessionName: dataProgram?.lessionName,
            activities: dataProgram?.activities,
            week: dataProgram?.week,
            classPeriod: dataProgram?.classPeriod,
          },
        }) : i?.lessions,
      }));
    } else {
      console.log("FALSE");
      data.push(
        {
          date: stringData?.date,
          lessions: [
            {
              date: stringData?.date,
              programId: dataProgram?.programId,
              dragId: uuidv4(),
              lession: {
                colorText: dataProgram?.colorText,
                programName: dataProgram?.programName,
                unitIndex: dataProgram?.unitIndex,
                unitName: dataProgram?.unitName,
                lessionName: dataProgram?.lessionName,
                activities: dataProgram?.activities,
                week: dataProgram?.week,
                classPeriod: dataProgram?.classPeriod,
              },
            }
          ]
        }
      );
    }
    console.log("formatColumns123", formatColumns);
    if (key) {
      setFormatColumns({ ...formatColumns, [key]: { ...formatColumns?.[key], tasks: data } });
    }
    console.log("formatColumnsdkhas");
    // const payload = {
    //   branchId: search?.branchId,
    //   classId: search?.classId,
    //   studyPlanLessions: [
    //     {
    //       programId: dataProgram?.programId,
    //       date: moment(stringData?.date),
    //       fromTime: dataColumn?.fromTime,
    //       toTime: dataColumn?.toTime,
    //       lession: {
    //         unitIndex: dataProgram,
    //         lessionName: dataProgram,
    //         unitName: dataProgram?.unitName,
    //         activities: dataProgram?.activities,
    //         week: dataProgram?.week,
    //         classPeriod: dataProgram?.classPeriod,
    //       }
    //     }
    //   ],
    // };
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
        schoolYearId: search.schoolYearId,
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
        type: 'englishStudyPlan/UPDATE_ACTIVITIES',
        payload,
        callback: (response) => {
          if (response) {
            setIsModalVisible(false);
            dispatch({
              type: 'englishStudyPlan/DRAG_AFTER',
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
                        schoolYearId: search?.schoolYearId,
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

  const getSizeMax = (key) => {
    const arr1 = formatColumns?.[key]?.tasks?.map(i => ({
      ...i,
      count: size(i?.lessions),
    }));
    return !isEmpty(arr1) ? Math.max(...arr1.map(i => i.count)) : 1;
  };

  const changeFilterDebouce = debounce((name, value) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      [name]: value,
    }));
  }, 300);

  const changeFilter = (name) => (value) => {
    setTimeline(value);
    changeFilterDebouce(name, value);
  };

  const changeBanchFilter = (name) => (value) => {
    if (value) {
      dispatch({
        type: 'englishStudyPlan/GET_CLASSES',
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

  const onProgram = (e) => {
    const data = program?.filter(i => i?.id === e);
    setDataUnit(head(data)?.units);
    setDataItemProgram(dataProgram?.filter(i => i?.programId === e));
  };
  const onProgramUnit = (e) => {
    setDataItemProgram(dataProgram?.filter(i => i?.idUnit === e));
  };
  console.log("items", items);

  return (
    <>
      <Helmet title="Study Plan" />
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
            loading={loading['englishStudyPlan/UPDATE_ACTIVITIES']}
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
          <Text color="dark">Study Plan</Text>
        </div>
        {/* FORM SEARCH */}
        <div className={classnames(styles.search, 'pt20')}>
          <Form layout="vertical" form={formRef} initialValues={{ ...search }}>
            <div className="row">
              <div className="col-lg-4">
                <FormItem
                  className="ant-form-item-row"
                  data={dataYears}
                  label="SHOOL YEAR"
                  name="schoolYearId"
                  type={variables.SELECT}
                  allowClear={false}
                  onChange={(value) => changeFilter('schoolYearId')(value)}
                />
              </div>
              <div className="col-lg-4">
                <FormItem
                  className="ant-form-item-row"
                  data={branches}
                  label="CENTER"
                  name="branchId"
                  type={variables.SELECT}
                  allowClear={false}
                  onChange={(value) => changeBanchFilter('branchId')(value)}
                  disabled={!!defaultBranch?.id}
                />
              </div>
              <div className="col-lg-4">
                <FormItem
                  className="ant-form-item-row"
                  data={classes}
                  label="CLASS"
                  name="classId"
                  onChange={(value) => changeFilter('classId')(value)}
                  type={variables.SELECT}
                  allowClear={false}
                  disabled={!!defaultBranch?.id}
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
                      console.log("TASK", value);
                      return (
                        <Droppable key={index} droppableId={key}>
                          {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                              <div className={classnames(stylesModule['block-table'], "p0")}>
                                <div className="p10 border-bottom">
                                  <FormItem
                                    data={program}
                                    name="programId"
                                    bordered={false}
                                    type={variables.SELECT}
                                    placeholder="All Program"
                                    onChange={onProgram}
                                  />
                                </div>
                                <div className="p10 border-bottom">
                                  <FormItem
                                    data={dataUnit}
                                    name="UnitId"
                                    bordered={false}
                                    type={variables.SELECT}
                                    placeholder="All Unit"
                                    onChange={onProgramUnit}
                                  />
                                </div>
                                <div className="p10 border-bottom">
                                  <Input
                                    prefix={<SearchOutlined style={{
                                      marginRight: '10px',
                                    }} />}
                                    placeholder="Nhập"
                                    value={searchText}
                                    bordered={false}
                                    onChange={(e) => setSearchText(e.target.value)}
                                  />
                                </div>
                                {formatTextSearch(value.tasks).map((task, index) => (
                                  <Draggable key={task.id} draggableId={task.name} index={index}>
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={stylesModule['card-menuLeft']}
                                      >
                                        <Paragraph
                                          style={{
                                            backgroundColor: task.colorText,
                                          }}
                                          className={stylesModule['card-item']}
                                        >
                                          <p className={stylesModule?.text}>{task?.programName}</p>
                                          <div className={stylesModule?.textFlex}>
                                            <p className={stylesModule?.text}>Week {task?.week}</p>
                                            <p className={stylesModule?.textPadding}> - </p>
                                            <p className={stylesModule?.text}>Class period {task?.classPeriod}</p>
                                          </div>
                                          <h3 className={stylesModule?.textUnit}>Unit {task?.unitIndex}: {task?.unitName}</h3>
                                          <p className={stylesModule?.text}>{task?.name}</p>
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
                    <div className="wrapper-droppable">
                      <div className='d-block'>
                        {
                          Object.entries(formatColumns).map(([key, valueParent], indexParent) => {
                            // const tasks = valueParent?.tasks?.map((task) => ({
                            //   ...task,
                            //   dragId: task?.dragId,
                            // })).filter(i => i?.date === classItem?.date);
                            console.log("d");
                            return (
                              <div className='d-flex'>
                                {arrDate.map((classItem, index) => {
                                  const tasks = valueParent?.tasks?.map((task) => ({
                                    ...task,
                                    dragId: task?.dragId,
                                  }));
                                  console.log("tasks", tasks);
                                  return (
                                    <div className="col-block-study-plane" key={index}>
                                      {indexParent === 0 && (<Paragraph className="header-row">{classItem?.day}  {index !== 0 && moment(classItem?.date).format(variables.DATE_FORMAT.DATE_MONTH)}</Paragraph>)}
                                      <Droppable
                                        key={indexParent} droppableId={`{"date":"${classItem?.date}","key":"${key}"}`} index={`${index}-${key}`}>
                                        {(provided, snapshot) => (
                                          <div
                                            {...provided?.droppableProps}
                                            ref={provided.innerRef}
                                            style={getListStyle(snapshot?.isDraggingOver)}
                                            className={stylesModule['item-col']}
                                          >
                                            {
                                              index === 0 && (
                                                <div
                                                // style={{
                                                //   backgroundColor: "red",
                                                // }}
                                                >
                                                  123
                                                </div>
                                              )
                                            }
                                            <div>ádgajsdgasjdga</div>
                                            {head(tasks)?.lessions?.map((taskItem, index) => (
                                              <Draggable key={`${taskItem.id}-${indexParent}-${index}`} draggableId={`${taskItem.dragId}-${index}`} index={index}>
                                                {(provided) => (
                                                  <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={stylesModule['card-table']}
                                                  >
                                                    <Paragraph
                                                      style={{
                                                        backgroundColor: taskItem?.lession?.colorText,
                                                      }}
                                                      className={stylesModule['card-item']}
                                                    >
                                                      <p className={stylesModule?.text}>{taskItem?.lession?.programName}</p>
                                                      <div className={stylesModule?.textFlex}>
                                                        <p className={stylesModule?.text}>Week {taskItem?.lession?.week}</p>
                                                        <p className={stylesModule?.textPadding}> - </p>
                                                        <p className={stylesModule?.text}>Class period {taskItem?.lession?.classPeriod}</p>
                                                      </div>
                                                      <h3 className={stylesModule?.textUnit}>Unit  a a a a a a  a a a a a a  a a a a a a â  a a a a a a a a a  a a a a a a a a a a a  a a a a a a a a a a a a {taskItem?.lession?.unitIndex}: {taskItem?.lession?.unitName}</h3>
                                                      <p className={stylesModule?.text}>{taskItem?.lession?.name}</p>
                                                    </Paragraph>
                                                  </div>
                                                )}
                                              </Draggable>
                                            ))}
                                          </div>
                                        )
                                        }
                                      </Droppable>
                                    </div>);
                                })}
                              </div>);
                          })
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </DragDropContext>
            </div>
          </Form>
        )
        }
      </div >
    </>
  );
});

export default Index;
