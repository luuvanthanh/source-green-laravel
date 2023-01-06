import React, { useEffect, useState, memo, useMemo } from 'react';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import { Helper, variables } from '@/utils';
import { Form, Modal } from 'antd';
import classnames from 'classnames';
import { DragDropContext } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'dva';
import moment from 'moment';

import { isEmpty, head, debounce } from 'lodash';
import { Helmet } from 'react-helmet';
import { useHistory, useLocation } from 'umi';


import { v4 as uuidv4 } from 'uuid';

import Search from './components/search';
import MenuLeft from './components/menu-left';
import TableItem from './components/table';


import '@/assets/styles/Modules/TimeTables/styles.module.scss';
import stylesModule from './styles.module.scss';


const getListStyle = (isDraggingOver) => ({
  backgroundColor: isDraggingOver ? 'rgba(123, 237, 159, 0.3)' : '',
});

const Index = memo(() => {
  const [
    loading,
    { classes, branches, years, program, checkModal },
    { defaultBranch, user },
  ] = useSelector(({ loading: { effects }, englishStudyPlan, user }) => [
    effects,
    englishStudyPlan,
    user,
  ]);

  const [formRef] = Form.useForm();
  const { query } = useLocation();
  const [dragRef] = Form.useForm();
  const [items, setItems] = useState([]);

  const [formatColumns, setFormatColumns] = useState();
  const [checkUse, setCheckUse] = useState(false);

  const [searchLeft, setSearchLeft] = useState({
    programId: undefined,
  });

  const [dataUnit, setDataUnit] = useState([]);
  const [dataItemProgram, setDataItemProgram] = useState([]);
  const [dataProgram, setDataProgram] = useState([]);

  const [checkEdit, setCheckEdit] = useState(false);

  //Time table
  const [searchDate, setSearchDate] = useState({
    fromDate: Helper.getDate(moment(), variables.DATE_FORMAT.DATE_AFTER),
    toDate: moment().endOf('week').format(variables.DATE_FORMAT.DATE_AFTER),
    type: 'timeGridWeek',
    branchId: query?.branchId || defaultBranch?.id,
    classId: query?.classId || user?.roleCode === variables?.LIST_ROLE_CODE?.TEACHER && head(user?.objectInfo?.classTeachers)?.classId,
    schoolYearId: query?.schoolYearId,
  });

  const arrDate = useMemo(() => {
    const startWeek = moment(searchDate.fromDate).startOf('week').subtract(1, 'day');

    const arr = [{ day: 'Time' }];
    let i = 1;
    while (startWeek.isBefore(searchDate.toDate)) {
      arr.push({ date: Helper.getDateUtc(moment(startWeek.add(1, 'day').clone().toISOString())), day: Helper.getDayOfWeek(i), dayfull: Helper.getDayOfWeekFull(i) });
      i += 1;
    }
    return arr;
  }, [searchDate]);

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
        }
      },
    });
    dispatch({
      type: 'englishStudyPlan/GET_ACTIVITIES',
      payload: {},
    });
  };

  const onLoad = () => {
    dispatch({
      type: 'englishStudyPlan/GET_DATA',
      payload: {
        ...search,
        fromDate: Helper.getDateSearch(moment(searchDate?.fromDate).startOf('week')),
        toDate: searchDate?.toDate
      },
      callback: (response) => {
        if (response) {
          setItems(response?.timeTableSettingByTime?.concat(response?.studyPlanGroupByTime));
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
                lessionName: k?.name,
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
                lessionName: k?.name,
              }))))).flat(Infinity));
        }
      },
    });
  }, []);

  useEffect(() => {
    if (search.branchId && search.schoolYearId && search.classId) {
      onLoad();
    }
  }, [search]);

  useEffect(() => {
    if (search.branchId && search.schoolYearId && search.classId) {
      onLoad();
    }
  }, [arrDate]);

  useEffect(() => {
    const activyColumns = { 'columns-1': { tasks: dataItemProgram } };
    const groupItem = _(items)
      .groupBy('fromTime', 'toTime')
      .map(item => ({
        fromTime: head(item)?.fromTime,
        toTime: head(item)?.toTime,
        dragId: uuidv4(),
        dayOfWeeks: head(item)?.dayOfWeeks,
        tasks: head(item?.filter(i => i?.itemsGroupByDate))?.itemsGroupByDate?.map(i =>
        (
          {
            ...i,
            dragId: uuidv4(),
            programId: item?.program?.id,
            lessions: i?.lessions?.map(k => ({
              date: i?.date,
              dragId: uuidv4(),
              programId: k?.program?.id,
              lession: {
                activities: k?.lession?.activities,
                classPeriod: k?.lession?.classPeriod,
                colorText: k?.program?.colorText,
                lessionName: k?.lession?.lessionName,
                programName: k?.program?.name,
                unitIndex: k?.lession?.unitIndex,
                unitName: k?.lession?.unitName,
                week: k?.lession?.week,
              }
            }))
          }
        )) || [],
      })
      ).value();
    const newColumns = Object.assign(
      {},
      ...groupItem.map((item, index) => ({
        [`columns-${index + 2}`]: {
          ...item,
        },
      })),
    );
    if (!isEmpty(searchLeft?.programId)) {
      setFormatColumns({ "columns-1": formatColumns?.["columns-1"], ...newColumns });
    } else {
      setFormatColumns({ ...activyColumns, ...newColumns });
    }
  }, [items]);

  const onDragEnd = (result) => {
    //cột menu left trùng cột menu left 
    if (result?.destination?.droppableId === 'columns-1' && result?.source?.droppableId === 'columns-1') {
      return;
    }
    if (!isEmpty(result?.destination)) {
      setCheckUse(true);
      // xóa item khỏi cột table
      if (result?.destination?.droppableId === 'columns-1') {
        const stringData = JSON?.parse(result?.source?.droppableId);
        const dataItem = formatColumns?.[stringData?.key]?.tasks?.filter(i => i?.date === stringData?.date)?.map(i => ({
          ...i,
          lessions: i?.lessions?.filter((i, index) => index !== result?.source?.index),
        }));
        setFormatColumns(
          {
            ...formatColumns,
            [stringData?.key]:
            {
              ...formatColumns?.[stringData?.key],
              tasks: formatColumns?.[stringData?.key]?.tasks?.map(i => ({ ...i, ...(i?.date === head(dataItem)?.date && head(dataItem)) }))
            }
          });
      }
      // kéo data vào cột table
      else if (result?.source?.droppableId === 'columns-1') {
        const stringData = JSON?.parse(result?.destination?.droppableId);
        const keyColumns = "columns-1";
        const dataProgram = formatColumns?.[keyColumns]?.tasks?.find((i, index) => index === result?.source?.index);
        const key = stringData?.key;
        const data = formatColumns?.[key]?.tasks;
        // cột table đã có dữ liệu
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
          data?.push(
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
        setFormatColumns({ ...formatColumns, [key]: { ...formatColumns?.[key], tasks: data } });
      }
      // kéo cột table sang cột table khác
      else {
        const stringDestination = JSON?.parse(result?.destination?.droppableId);
        const stringSource = JSON?.parse(result?.source?.droppableId);

        const dataNewItemSource = formatColumns?.[stringSource?.key]?.tasks?.filter(i => i?.date === stringSource?.date)?.map(i => ({
          ...i,
          lessions: i?.lessions?.filter((i, index) => index !== result?.source?.index),
        }));
        const dataItemSource = formatColumns?.[stringSource?.key]?.tasks?.filter(i => i?.date === stringSource?.date);

        const dataProgram = head(dataItemSource)?.lessions?.find((_, index) => index === result?.source?.index);
        const checkDate = formatColumns?.[stringDestination?.key]?.tasks?.find(i => i?.date === stringDestination?.date);

        const dataNewColumns = formatColumns?.[stringDestination?.key]?.tasks;

        const dataFilter = formatColumns?.[stringSource?.key]?.tasks?.map(i => ({ ...i, ...(i?.date === head(dataNewItemSource)?.date && head(dataNewItemSource)) }));
        // kéo cột table trùng cột table 
        if (stringDestination?.date === stringSource?.date && stringDestination?.key === stringSource?.key) {
          return;
        }
        // kéo cột table trùng hàng với nhau 
        if (stringDestination?.key === stringSource?.key) {
          setFormatColumns(
            {
              ...formatColumns,
              [stringDestination?.key]:
              {
                ...formatColumns?.[stringDestination?.key],
                tasks: isEmpty(checkDate) ? dataFilter?.concat(
                  [{
                    date: stringDestination?.date,
                    lessions: [
                      {
                        date: stringDestination?.date,
                        programId: dataProgram?.programId,
                        dragId: uuidv4(),
                        lession: {
                          colorText: dataProgram?.lession?.colorText,
                          programName: dataProgram?.lession?.programName,
                          unitIndex: dataProgram?.lession?.unitIndex,
                          unitName: dataProgram?.lession?.unitName,
                          lessionName: dataProgram?.lession?.lessionName,
                          activities: dataProgram?.lession?.activities,
                          week: dataProgram?.lession?.week,
                          classPeriod: dataProgram?.lession?.classPeriod,
                        },
                      }
                    ]
                  }]
                ) :
                  dataFilter?.map(i => ({
                    ...i,
                    lessions: i?.date === stringDestination?.date ? i.lessions?.concat([{
                      date: stringDestination?.date,
                      programId: dataProgram?.programId,
                      dragId: uuidv4(),
                      lession: {
                        colorText: dataProgram?.lession?.colorText,
                        programName: dataProgram?.lession?.programName,
                        unitIndex: dataProgram?.lession?.unitIndex,
                        unitName: dataProgram?.lession?.unitName,
                        lessionName: dataProgram?.lession?.lessionName,
                        activities: dataProgram?.lession?.activities,
                        week: dataProgram?.lession?.week,
                        classPeriod: dataProgram?.lession?.classPeriod,
                      },
                    }]) : i?.lessions,
                  })),
              }
            });
        }
        // kéo cột table khác hàng với nhau  
        else {
          setFormatColumns(
            {
              ...formatColumns,
              [stringSource?.key]:
              {
                ...formatColumns?.[stringSource?.key],
                tasks: formatColumns?.[stringSource?.key]?.tasks?.map(i => ({ ...i, ...(i?.date === head(dataNewItemSource)?.date && head(dataNewItemSource)) }))
              },
              [stringDestination?.key]:
              {
                ...formatColumns?.[stringDestination?.key],
                tasks: isEmpty(checkDate) ? dataNewColumns?.concat(
                  [{
                    date: stringDestination?.date,
                    lessions: [
                      {
                        date: stringDestination?.date,
                        programId: dataProgram?.programId,
                        dragId: uuidv4(),
                        lession: {
                          colorText: dataProgram?.lession?.colorText,
                          programName: dataProgram?.lession?.programName,
                          unitIndex: dataProgram?.lession?.unitIndex,
                          unitName: dataProgram?.lession?.unitName,
                          lessionName: dataProgram?.lession?.lessionName,
                          activities: dataProgram?.lession?.activities,
                          week: dataProgram?.lession?.week,
                          classPeriod: dataProgram?.lession?.classPeriod,
                        },
                      }
                    ]
                  }]
                ) :
                  dataNewColumns?.map(i => ({
                    ...i,
                    lessions: i?.date === stringDestination?.date ? i.lessions?.concat([{
                      date: stringDestination?.date,
                      programId: dataProgram?.programId,
                      dragId: uuidv4(),
                      lession: {
                        colorText: dataProgram?.lession?.colorText,
                        programName: dataProgram?.lession?.programName,
                        unitIndex: dataProgram?.lession?.unitIndex,
                        unitName: dataProgram?.lession?.unitName,
                        lessionName: dataProgram?.lession?.lessionName,
                        activities: dataProgram?.lession?.activities,
                        week: dataProgram?.lession?.week,
                        classPeriod: dataProgram?.lession?.classPeriod,
                      },
                    }]) : i?.lessions,
                  })),
              }
            });
        }

      }
    }
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
        type: 'englishStudyPlan/GET_CLASSES',
        payload: {
          branch: value,
        },
      });
      setSearch({
        ...search,
        classId: undefined,
      });
      formRef.setFieldsValue({
        classId: undefined,
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

  const handleSave = () => {
    setCheckUse(false);
    const data = Object.keys(formatColumns)
      .slice(1)
      .map((key) => formatColumns[key]?.tasks
        ?.map(i => i?.lessions
          ?.map(k => ({
            programId: k?.programId,
            date: k?.date,
            fromTime: formatColumns[key]?.fromTime,
            toTime: formatColumns[key]?.toTime,
            lession: {
              unitIndex: k?.lession?.unitIndex,
              unitName: k?.lession?.unitName,
              lessionName: k?.lession?.lessionName,
              activities: k?.lession?.activities,
              week: k?.lession?.week,
              classPeriod: k?.lession?.classPeriod,
            }
          })))).flat(Infinity);

    dispatch({
      type: 'englishStudyPlan/ADD_STUDY_PLAN',
      payload: {
        branchId: search?.branchId,
        classId: search?.classId,
        studyPlanLessions: data,
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

  const onCancelModal = () => {
    dispatch({
      type: 'englishStudyPlan/SET_MODAL_ITEM',
      payload: { check: false },
    });
  };

  return (
    < div className={stylesModule['container-study']}>
      <Modal
        centered
        title=""
        visible={checkModal?.check}
        onCancel={() => onCancelModal()}
        footer={null}
        className={stylesModule['study-modal']}
        width={300}
      >
        <div
          style={{
            backgroundColor: checkModal?.data?.lession?.colorText,
          }}
          className={stylesModule['card-item']}
        >
          <p className={stylesModule?.text}>{checkModal?.data?.lession?.programName}</p>
          <div className={stylesModule?.textFlex}>
            <p className={stylesModule?.text}>Week {checkModal?.data?.lession?.week}</p>
            <p className={stylesModule?.textPadding}> - </p>
            <p className={stylesModule?.text}>Class period {checkModal?.data?.lession?.classPeriod}</p>
          </div>
          <h3 className={stylesModule?.textUnit}>Unit {checkModal?.data?.lession?.unitIndex}: {checkModal?.data?.lession?.unitName}</h3>
          <p className={stylesModule?.text}>Content: {checkModal?.data?.lession?.lessionName}</p>
          <p className={stylesModule?.text}>Activities: {checkModal?.data?.lession?.activities}</p>
        </div>
      </Modal>
      <Helmet title="Study Plan" />
      <div className={classnames(styles['content-form'], styles['content-form-children'])}>
        <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
          <Text color="dark">Study Plan</Text>
        </div>
        {/* FORM SEARCH */}
        <Search
          formRef={formRef}
          search={search}
          dataYears={dataYears}
          changeFilter={changeFilter}
          changeBanchFilter={changeBanchFilter}
          checkEdit={checkEdit}
          setCheckEdit={setCheckEdit}
          handleSave={handleSave}
          branches={branches}
          classes={classes}
          defaultBranch={defaultBranch}
          loading={loading}
        />
        {/* FORM DRAG */}
        {!isEmpty(classes) && !isEmpty(items) && (
          <Form layout="vertical" form={dragRef}>
            <div className={classnames('schedules-custom', 'mt20')}>
              <DragDropContext onDragEnd={onDragEnd}>
                <div className="col-activites">
                  {Object.entries(formatColumns)
                    .slice(0, 1)
                    .map(([keyItem, value], index) => (
                      <MenuLeft
                        index={index}
                        keyItem={keyItem}
                        program={program}
                        dataUnit={dataUnit}
                        searchText={searchText}
                        setSearchText={setSearchText}
                        formatTextSearch={formatTextSearch}
                        searchDate={searchDate}
                        value={value}
                        checkEdit={checkEdit}
                        setSearchLeft={setSearchLeft}
                        searchLeft={searchLeft}
                        setDataUnit={setDataUnit}
                        setFormatColumns={setFormatColumns}
                        formatColumns={formatColumns}
                        dataProgram={dataProgram}
                      />
                    )
                    )}
                </div>
                <TableItem
                  setSearchDate={setSearchDate}
                  searchDate={searchDate}
                  search={search}
                  loading={loading}
                  formatColumns={formatColumns}
                  arrDate={arrDate}
                  getListStyle={getListStyle}
                  checkEdit={checkEdit}
                  checkUse={checkUse}
                  setCheckUse={setCheckUse}
                />
              </DragDropContext>
            </div>
          </Form>
        )
        }
      </div >
    </div>
  );
});

export default Index;