import { memo, useRef, useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Tabs, Checkbox, Input, Modal } from 'antd';
import csx from 'classnames';
import { useSelector, useDispatch } from 'dva';
import { useLocation, useHistory, Link } from 'umi';
import moment from 'moment';
import { debounce, isEmpty } from 'lodash';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Text from '@/components/CommonComponent/Text';
import AvatarTable from '@/components/CommonComponent/AvatarTable';

import styles from '@/assets/styles/Common/common.scss';
import { Helper, variables } from '@/utils';
import variablesModules from '../utils/variables';
import RouteModal from './route';

const { TabPane } = Tabs;

const Index = memo(() => {
  const filterRef = useRef();
  const formRef = useRef();
  const [busRoutes, summary, data, timelines, years, user] = useSelector(({ busToday = {},user = {} }) => [
    busToday?.busRoutes,
    busToday?.summary,
    busToday?.data,
    busToday?.timelines,
    busToday?.years,
    user?.user,
  ]);

  const history = useHistory();
  const { query, pathname } = useLocation();
  const dispatch = useDispatch();

  const mounted = useRef(false);
  const mountedSet = (setFunction, value) =>
    !!mounted?.current && setFunction && setFunction(value);

  const [visibleRoute, setVisibleRoute] = useState(false);
  const [search, setSearch] = useState({
    id: query?.id,
    date: moment(),
    status: query?.status || variablesModules.STATUS_TABS.SCHOOLWARD,
    page: variables.PAGINATION.PAGE,
    limit: variables.PAGINATION.SIZEMAX,
    schoolYearId: query?.schoolYearId || user?.schoolYear?.id,
  });
  const [listSDT, setListSDT] = useState({});

  const hiddenRoute = () => {
    mountedSet(setVisibleRoute, false);
  };

  const loadData = useCallback(() => {
    if (search.id && search.date) {
      dispatch({
        type: 'busToday/GET_DATA',
        payload: {
          ...search,
        },
      });
      history.push({
        pathname,
        query: Helper.convertParamSearch({
          ...search,
          date: search.date && Helper.getDate(search.date, variables.DATE_FORMAT.DATE_AFTER),
        }),
      });
    }
  }, [search]);

  useEffect(() => {
    dispatch({
      type: 'busToday/GET_BUS_ROUTES',
      payload: {},
    });
    dispatch({
      type: 'busToday/GET_YEARS',
      payload: {},
    });
  }, []);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const debouncedSearchStatus = debounce((value) => {
    mountedSet(setSearch, {
      ...search,
      status: value,
      page: variables.PAGINATION.PAGE,
      limit: variables.PAGINATION.PAGE_SIZE,
    });
  }, 300);

  /**
   * Function change select
   * @param {object} e value of select
   * @param {string} type key of object search
   */
  const onChangeSelectStatus = (e) => {
    debouncedSearchStatus(e);
  };

  const formUpdate = (value, values) => {
    if (values.id) {
      mountedSet(setSearch, { ...search, ...values });
    }
  };

  const cancelModal = () => {
    setListSDT({});
  };

  const openModal = (name, item) => {
    let title = '';
    let data = [];
    if (name === 'employee') {
      title = "Gọi bảo mẫu";
      data.push({
        fullName: item?.fullName || '',
        fileImage: item?.fileImage || '',
        type: 'Bảo mẫu',
        phone: item?.phoneNumber || ''
      });
    }
    if (name === 'parents') {
      title = "Gọi phụ huynh";
      data = item?.map(item => ({
        fullName: item?.parent?.fullName || '',
        fileImage: item?.parent?.fileImage || '',
        type: item?.relationType ? 'phụ huynh' : 'Người đưa đón',
        phone: item?.parent?.phone || ''
      }));
    }
    setListSDT({
      title,
      data,
    });
  };

  return (
    <>
      <Helmet title="Điểm danh trẻ lên xe hôm nay" />
      <Pane className="p20">
        <Pane className="d-flex mb20">
          <Heading type="page-title">
            Điểm danh trẻ lên xe hôm nay {Helper.getDate(search.date, variables.DATE_FORMAT.DATE)}
          </Heading>
        </Pane>

        <Pane className="card">
          <Pane className={csx(styles['block-table'], styles['block-table-tab'])}>
            <Tabs
              defaultActiveKey={search?.status || variablesModules.STATUS_TABS.SCHOOLWARD}
              onChange={onChangeSelectStatus}
            >
              {variablesModules.TABS.map(({ id, name }) => (
                <TabPane tab={name} key={id} />
              ))}
            </Tabs>

            <Form
              layout="vertical"
              ref={filterRef}
              initialValues={{
                ...search,
              }}
              className="border-bottom"
              onValuesChange={formUpdate}
            >
              <Pane className="row">
                <Pane className="col-lg-4">
                  <FormItem
                    name="id"
                    type={variables.SELECT}
                    data={busRoutes.map((item) => ({
                      id: item?.busRoute?.id,
                      name: item?.busRoute?.name,
                    }))}
                    placeholder="Chọn lộ trình"
                  />
                </Pane>
                <Pane className="col-lg-3">
                  <FormItem
                    data={[{ id: null, name: 'Chọn tất cả năm học' }, ...years]}
                    name="schoolYearId"
                    type={variables.SELECT}
                    placeholder="Chọn năm học"
                    allowClear={false}
                  />
                </Pane>
              </Pane>
            </Form>

            {!isEmpty(data) && (
              <Form ref={formRef}>
                <Pane className="border-bottom py20 d-flex align-items-center">
                  <Text size="normal">
                    Số trẻ đã lên xe:{' '}
                    <b>
                      {search.status === variablesModules.STATUS_TABS.SCHOOLWARD
                        ? summary.schoolGetInStatusTotal
                        : summary.homeGetInStatusTotal}
                      /{summary.studentTotal}
                    </b>
                  </Text>
                  <Button className="ml-auto" color="success" onClick={() => setVisibleRoute(true)}>
                    Xem lộ trình
                  </Button>
                </Pane>

                {data.map(({ address, studentBusPlaces = [] }, index) => (
                  <Pane key={index} className="pt20 border-bottom">
                    <Pane className="mb10">
                      <Text size="normal">
                        Điểm đón số {index + 1}: {address}
                      </Text>
                    </Pane>

                    {studentBusPlaces.map((item, index) => (
                      <Pane className="row mb15 mt15 align-items-end" key={index}>
                        <Pane className="col-lg-3">
                          <AvatarTable
                            fileImage={Helper.getPathAvatarJson(item?.student?.fileImage)}
                            fullName={item?.student?.fullName}
                          />
                        </Pane>

                        {isEmpty(item?.student?.absentStudents) && (
                          <Pane className="col-lg-9">
                            <div className="d-flex flex-wrap align-items-center">
                              {item?.busPlaceLog && (
                                <Checkbox.Group
                                  className="checkbox-large mt5"
                                  value={
                                    search.status === variablesModules.STATUS_TABS.SCHOOLWARD
                                      ? item?.busPlaceLog?.schoolwardStatus
                                      : item?.busPlaceLog?.homewardStatus
                                  }
                                  options={variablesModules.STATUS_BUS}
                                />
                              )}
                              {!item?.busPlaceLog && (
                                <Checkbox.Group
                                  className="checkbox-large mt5"
                                  value={variablesModules.STATUS.NOT_YET_GOING}
                                  options={variablesModules.STATUS_BUS}
                                />
                              )}
                              {!isEmpty(item?.student?.employee) && (
                                <div
                                  className="ml15 pointer mt5 color-success"
                                  onClick={() => openModal('employee', item?.student?.employee)}
                                  aria-hidden
                                >
                                  <span className="icon icon-phone mr5" />
                                  <span>Gọi bảo mẫu</span>
                                </div>
                              )}
                              {!isEmpty(item?.student?.studentParents) && (
                                <div
                                  className="ml15 pointer mt5 color-success"
                                  onClick={() => openModal('parents', item?.student?.studentParents)}
                                  aria-hidden
                                >
                                  <span className="icon icon-phone mr5" />
                                  <span>Gọi phụ huynh</span>
                                </div>
                              )}
                            </div>
                            {item.description && <Input value={item.description} className="mt5" />}
                          </Pane>
                        )}

                        {!isEmpty(item?.student?.absentStudents) && (
                          <Pane className="col-lg-6">
                            <Link
                              to={`/diem-danh/don-xin-phep-cho-be?endDate=${moment()}&startDate=${moment()}&fullName=${
                                item?.student?.fullName
                              }`}
                            >
                              Đã xin nghỉ phép
                            </Link>
                          </Pane>
                        )}
                      </Pane>
                    ))}
                  </Pane>
                ))}
              </Form>
            )}
          </Pane>
        </Pane>
      </Pane>
      <Modal
        className={styles['modal-note']}
        title={listSDT?.title}
        visible={!!(listSDT?.title)}
        width={576}
        onCancel={cancelModal}
        footer={null}
      >
        {!isEmpty(listSDT?.data) && listSDT?.data.map((item, index) => (
          <div className={`d-flex justify-content-between align-items-center ${index !== 0 ? 'mt15' : ''}`} key={index}>
            <AvatarTable
              fileImage={Helper.getPathAvatarJson(item?.fileImage)}
              fullName={item?.fullName}
              description={item?.type}
            />
            <div className="ml15 pointer mt5 color-success">
              <span className="icon icon-phone mr5" />
              <span>{item?.phone || ''}</span>
            </div>
          </div>
        ))}
      </Modal>
      {visibleRoute && (
        <RouteModal
          routes={data}
          search={search}
          summary={summary}
          timelines={timelines}
          visible={visibleRoute}
          onCancel={hiddenRoute}
        />
      )}
    </>
  );
});

export default Index;
