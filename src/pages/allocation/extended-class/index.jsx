import React, { useEffect, useState, memo, useMemo } from 'react';
import Text from '@/components/CommonComponent/Text';
import { Helper, variables } from '@/utils';
import { Input, Avatar, notification } from 'antd';
import classnames from 'classnames';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'dva';
import { isEmpty, size, head } from 'lodash';
import { Helmet } from 'react-helmet';
import { useHistory, useLocation } from 'umi';
import { v4 as uuidv4 } from 'uuid';
import { SearchOutlined } from '@ant-design/icons';
import styles from '@/assets/styles/Common/common.scss';
import Select from '@/components/CommonComponent/Select';
import moment from 'moment';
import stylesModule from './styles.module.scss';

const getListStyle = (isDraggingOver) => ({
  paddingBottom: '1px !important',
  backgroundColor: isDraggingOver ? 'rgba(123, 237, 159, 0.3)' : '',
  border: isDraggingOver ? '1px solid #CB2020' : '1px solid #DFE3EC',
  pointerEvents: isDraggingOver ? 'none' : 'unset',
});

const Index = memo(() => {
  const [items, setItems] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [{ classes, branches }, { defaultBranch }] = useSelector(({ extendedClass, user }) => [
    extendedClass,
    user,
  ]);

  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const history = useHistory();

  const [search, setSearch] = useState({
    isGroupByDayOfWeek: false,
    branchId: defaultBranch?.id,
    timetableSettingId: null,
    fromDate: moment().startOf('weeks'),
    toDate: moment().endOf('weeks'),
  });

  const [searchText, setSearchText] = useState('');

  const onLoad = () => {
    dispatch({
      type: 'extendedClass/GET_DATA',
      payload: {
        ...search,
      },
      callback: (response) => {
        if (response) {
          setItems(response);
        }
      },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch({
        ...search,
        fromDate: Helper.getDate(search.fromDate, variables.DATE_FORMAT.DATE_AFTER),
        toDate: Helper.getDate(search.toDate, variables.DATE_FORMAT.DATE_AFTER),
      }),
    });
  };

  useEffect(() => {
    if (defaultBranch?.id) {
      dispatch({
        type: 'extendedClass/GET_BRANCHES',
        payload: {},
        callback: (response) => {
          if (response) {
            dispatch({
              type: 'extendedClass/GET_CLASSES',
              payload: {
                branch: defaultBranch?.id,
              },
            });
          }
        },
      });
    } else {
      dispatch({
        type: 'extendedClass/GET_BRANCHES',
        payload: {},
        callback: (response) => {
          if (response) {
            setSearch((prev) => ({ ...prev, branchId: head(response)?.id }));
            dispatch({
              type: 'extendedClass/GET_CLASSES',
              payload: {
                branch: head(response)?.id,
              },
            });
          }
        },
      });
    }
  }, []);

  useEffect(() => {
    if (search.branchId) {
      dispatch({
        type: 'categories/GET_TEACHERS',
        payload: {
          hasClass: 'false',
          include: Helper.convertIncludes(['positionLevelNow']),
          branchId: search.branchId,
        },
        callback: (response) => {
          if (response) {
            setTeachers(response.parsePayload || []);
          }
        },
      });
    }
  }, [search.branchId]);

  useEffect(() => {
    if (search.branchId && search.fromDate && search.toDate) {
      onLoad();
    }
  }, [search]);

  const formatTextSearch = useMemo(() => {
    if (searchText) {
      return teachers.filter(
        (item) => Helper.slugify(item.fullName)?.indexOf(Helper.slugify(searchText)) >= 0,
      );
    }
    return teachers;
  }, [teachers, searchText]);

  const formatData = useMemo(() => {
    const completed = items
      .map((item) => ({
        ...item,
        extendedClassRegistrationGroupByClasses: item?.extendedClassRegistrationGroupByClasses.map(
          (item) => ({ ...item, uuid: uuidv4() }),
        ),
      }))
      .reduce(
        (a, v) => ({ ...a, [Helper.getDate(v.date, variables.DATE_FORMAT.DATE_AFTER)]: v }),
        {},
      );
    return completed;
  }, [items, classes]);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    if (source.droppableId !== destination.droppableId) {
      const date = destination.droppableId.split('.')[1];
      const classId = destination.droppableId.split('.')[2];
      const teacherId = draggableId;
      const itemData = formatData[date];
      if (itemData) {
        const extendedExits = items
          ?.find(
            (item) =>
              Helper.getDate(item.date, variables.DATE_FORMAT.DATE_AFTER) ===
              Helper.getDate(date, variables.DATE_FORMAT.DATE_AFTER),
          )
          ?.extendedClassRegistrationGroupByClasses?.find((item) => item?.class?.id === classId)
          ?.extendedClassAssignments?.find((item) => item?.employee?.id === teacherId);
        if (extendedExits) {
          notification.error({
            message: 'THÔNG BÁO',
            description: `Giáo viên ${
              teachers.find((item) => item.id === teacherId)?.fullName
            } đã được phân bổ vào lớp ${
              classes.find((item) => item.id === classId)?.name
            } xin vui lòng thử lại lớp khác.`,
          });
          return;
        }
        const extendedClass = itemData?.extendedClassRegistrationGroupByClasses?.find(
          (item) => item?.class?.id === classId,
        );

        if (!extendedClass?.fromTime && !extendedClass?.toTime) {
          return;
        }
        setItems((prev) =>
          prev.map((item) => {
            if (
              Helper.getDate(item.date, variables.DATE_FORMAT.DATE_AFTER) ===
              Helper.getDate(date, variables.DATE_FORMAT.DATE_AFTER)
            ) {
              return {
                ...item,
                extendedClassRegistrationGroupByClasses: item.extendedClassRegistrationGroupByClasses.map(
                  (item) => {
                    if (item?.class?.id === classId) {
                      return {
                        ...item,
                        extendedClassAssignments: item?.extendedClassAssignments?.some(
                          (itemExtended) => itemExtended.id === teacherId,
                        )
                          ? item.extendedClassAssignments
                          : [
                              ...item.extendedClassAssignments,
                              {
                                employee: teachers.find((item) => item.id === teacherId),
                              },
                            ],
                      };
                    }
                    return item;
                  },
                ),
              };
            }
            return item;
          }),
        );
        dispatch({
          type: 'extendedClass/DRAG',
          payload: {
            branchId: search.branchId,
            classId,
            employeeId: teacherId,
            date: moment(date).endOf('days'),
            status: variables.STATUS_EXTENDED.WAITING,
            fromTime: moment(extendedClass?.fromTime, variables.DATE_FORMAT.HOUR),
            toTime: moment(extendedClass?.toTime, variables.DATE_FORMAT.HOUR),
          },
          callback: () => {
            dispatch({
              type: 'extendedClass/DRAG_AFTER',
              payload: {
                ...search,
              },
              callback: (response) => {
                if (response) {
                  setItems(response);
                }
              },
            });
          },
        });
      }
    }
  };

  return (
    <>
      <Helmet title="Phân bổ giáo viên phụ trách ngoài giờ" />
      <div className={classnames(styles['content-form'], styles['content-form-children'])}>
        <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
          <Text color="dark">Phân bổ giáo viên phụ trách ngoài giờ</Text>
        </div>
        {/* FORM DRAG */}
        <div className={classnames(stylesModule.wrapper, 'mt20')}>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className={stylesModule.sidebar}>
              <h4 className={stylesModule.sidebar__title}>Giáo viên</h4>
              <Input
                placeholder="Nhập"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                prefix={<SearchOutlined />}
                className={stylesModule.sidebar__input}
              />
              {isEmpty(teachers) && (
                <div className={stylesModule.sidebar__empty}>
                  <span>Vui lòng chọn cơ sở để phân bổ giáo viên</span>
                </div>
              )}
              {!isEmpty(teachers) && (
                <Droppable droppableId="TEACHER">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={stylesModule.sidebar__list}
                    >
                      {formatTextSearch.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <div className={stylesModule.sidebar__item}>
                                <Avatar
                                  size={32}
                                  shape="circle"
                                  src={
                                    Helper.getPathAvatarJson(item?.fileImage)
                                      ? `${API_UPLOAD}${Helper.getPathAvatarJson(item?.fileImage)}`
                                      : '/images/avatar-default.png'
                                  }
                                />
                                <p className={stylesModule.sidebar_norm}>{item.fullName}</p>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              )}
            </div>
            <div className={stylesModule.main}>
              <div className={stylesModule.header}>
                <div>
                  <Select
                    dataSet={branches}
                    placeholder="Chọn cơ sở"
                    className={stylesModule.select}
                    allowClear={false}
                    value={search.branchId}
                    onChange={(branchId) => setSearch((prev) => ({ ...prev, branchId }))}
                  />
                </div>
                <div className={stylesModule.header__action}>
                  <button
                    type="button"
                    className={stylesModule['button-today']}
                    onClick={() =>
                      setSearch((prev) => ({
                        ...prev,
                        fromDate: moment().startOf('weeks'),
                        toDate: moment().endOf('weeks'),
                      }))
                    }
                  >
                    Hôm nay
                  </button>
                  <h4 className={stylesModule.time}>
                    {moment(search.fromDate).format('[Tuần] WW - [Tháng] MM/YYYY')}
                  </h4>
                  <div className={stylesModule.header__next}>
                    <button
                      type="button"
                      onClick={() =>
                        setSearch((prev) => ({
                          ...prev,
                          fromDate: moment(prev.fromDate).subtract(1, 'weeks'),
                          toDate: moment(prev.toDate).subtract(1, 'weeks'),
                        }))
                      }
                    >
                      <span className="icon-back" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSearch((prev) => ({
                          ...prev,
                          fromDate: moment(prev.fromDate).add(1, 'weeks'),
                          toDate: moment(prev.toDate).add(1, 'weeks'),
                        }))
                      }
                    >
                      <span className="icon-next" />
                    </button>
                  </div>
                </div>
              </div>
              <div className={stylesModule.schedule}>
                {Helper.convertArrayDaysNotSunday(search.fromDate, search.toDate).map((item) => {
                  const date = Helper.getDate(item, variables.DATE_FORMAT.DATE_AFTER);
                  return (
                    <div className={stylesModule.schedule__item} key={item}>
                      <div className={stylesModule.schedule__header}>
                        <div className={stylesModule.schedule__title}>
                          {Helper.getDayOfWeek(moment(item).format('d'))}
                        </div>
                        <div className={stylesModule.schedule__subTitle}>
                          {Helper.getDate(item, variables.DATE_FORMAT.DATE_MONTH)}
                        </div>
                      </div>
                      {formatData[
                        Helper.getDate(item, variables.DATE_FORMAT.DATE_AFTER)
                      ]?.extendedClassRegistrationGroupByClasses?.map((item) => (
                        <div className={stylesModule.schedule__content} key={item.uuid}>
                          <Droppable droppableId={`${item.uuid}.${date}.${item?.class?.id}`}>
                            {(provided, snapshot) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}
                                className={stylesModule.schedule__droppable}
                              >
                                {!item.extendedClassRegistrations &&
                                  !item.extendedClassAssignments && (
                                    <div
                                      className={classnames(
                                        stylesModule.schedule__children,
                                        stylesModule['schedule__children--empty'],
                                      )}
                                    />
                                  )}
                                {item.extendedClassRegistrations && item.extendedClassAssignments && (
                                  <div
                                    className={classnames(
                                      stylesModule.schedule__children,
                                      {
                                        [stylesModule['schedule__children--yellow']]:
                                          variables.STATUS_EXTENDED.NOT_DISTRIBUTION ===
                                          item.status,
                                      },
                                      {
                                        [stylesModule['schedule__children--success']]:
                                          variables.STATUS_EXTENDED.CONFIRMED === item.status,
                                      },
                                      {
                                        [stylesModule['schedule__children--orange']]:
                                          variables.STATUS_EXTENDED.WAITING === item.status,
                                      },
                                    )}
                                  >
                                    <h4 className={stylesModule.schedule__children__title}>
                                      {item.name}
                                    </h4>
                                    <p className={stylesModule.schedule__children__norm}>
                                      {item.fromTime} - {item.toTime}
                                    </p>
                                    <p className={stylesModule.schedule__children__norm}>
                                      Học sinh: {size(item.extendedClassRegistrations)}
                                    </p>
                                    <Avatar.Group
                                      maxCount={2}
                                      maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
                                      className={stylesModule.schedule__children__avatar}
                                      maxPopoverTrigger="click"
                                    >
                                      {item?.extendedClassAssignments?.map((item) => {
                                        if (Helper.getPathAvatarJson(item?.employee?.fileImage)) {
                                          return (
                                            <Avatar
                                              key={item?.employee?.id}
                                              src={`${API_UPLOAD}${Helper.getPathAvatarJson(
                                                item?.employee?.fileImage,
                                              )}`}
                                            />
                                          );
                                        }
                                        return (
                                          <Avatar
                                            style={{ backgroundColor: '#f56a00' }}
                                            key={item?.employee?.id}
                                          >
                                            {head(item?.employee.fullName)}
                                          </Avatar>
                                        );
                                      })}
                                    </Avatar.Group>
                                  </div>
                                )}
                              </div>
                            )}
                          </Droppable>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
            {/* <div className="activiies-block">
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
                                                // onClick={() => showModal(key)}
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
                </div> */}
          </DragDropContext>
        </div>
      </div>
    </>
  );
});

export default Index;
