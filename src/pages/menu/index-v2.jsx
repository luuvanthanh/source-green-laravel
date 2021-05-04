import { memo, useRef, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Form, List, Timeline } from 'antd';
import { useHistory, useLocation, useDispatch, useSelector } from 'dva';
import { Scrollbars } from 'react-custom-scrollbars';
import moment from 'moment';
import 'moment/locale/vi';
import { RRule, RRuleSet } from 'rrule';
import { isEmpty } from 'lodash';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Text from '@/components/CommonComponent/Text';

import { variables, Helper } from '@/utils';
import variablesModules from './utils/variables';
import styles from '@/assets/styles/Common/common.scss';

const { Item: ListItem } = List;
const { Item: TimelineItem } = Timeline;

const Index = memo(() => {
  const [loadingReducer, { data, pagination, error }] = useSelector(({ loading, menuKid }) => [
    loading,
    menuKid,
  ]);
  const loading = loadingReducer?.effects['menuKid/GET_DATA'];
  const dispatch = useDispatch();
  const mounted = useRef(false);
  const mountedSet = (action, value) => mounted?.current && action(value);

  const history = useHistory();
  const { query } = useLocation();

  const filterRef = useRef();

  const [search /*setSearch*/] = useState({
    position: query?.position || 1,
    class: query?.class || 1,
    rangeTime: query?.rangeTime || [moment('2021/03/01'), moment('2021/03/15')],
  });

  useEffect(() => {
    dispatch({
      type: 'menuKid/GET_DATA',
      payload: {},
    });
  }, []);

  useEffect(() => {
    mounted.current = true;
    return () => (mounted.current = false);
  }, []);

  const onConvertItemRRule = (item) => {
    if (!isEmpty(item)) {
      const rule = new RRuleSet();
      rule.rrule(
        new RRule({
          freq: RRule[variablesModules.WEEKLY],
          interval: 1,
          byweekday: item.menuWeeks
            ? item.menuWeeks.map(
                (itemWeek) => RRule[variablesModules.DAY_OF_WEEK[itemWeek.dayOfWeek].toUpperCase()],
              )
            : null,
          dtstart: new Date(Helper.getDate(item.fromDate, variables.DATE_FORMAT.DATE_AFTER)),
          until: new Date(Helper.getDate(item.toDate, variables.DATE_FORMAT.DATE_AFTER)),
        }),
      );
      return rule.all();
    }
    return [];
  };

  const convertDataMenus = (data) => {
    if (!isEmpty(data)) {
      let array = [];
      data.map((item) => {
        const dataRRule = onConvertItemRRule(item);
        array = [
          ...array,
          ...dataRRule.map((itemRuule) => ({
            ...item,
            date: moment(itemRuule),
          })),
        ];
      });
      return Helper.onSortDates(array, 'date');
    }
    return [];
  };

  return (
    <>
      <Helmet title="Danh sách thông báo" />
      <Pane className="p20">
        <Pane className="d-flex mb20">
          <Heading type="page-title">Thực đơn</Heading>
          <Button
            className="ml-auto"
            color="success"
            icon="plus"
            onClick={() => history.push(`/thuc-don/tao-moi`)}
          >
            Tạo thực đơn
          </Button>
        </Pane>

        <Pane className="card mb20">
          <Pane className="pb-0" style={{ padding: 20 }}>
            <Form layout="vertical" ref={filterRef} initialValues={search}>
              <Pane className="row">
                <Pane className="col-lg-4">
                  <FormItem
                    name="position"
                    type={variables.SELECT}
                    data={[{ id: 1, name: 'Lake View' }]}
                  />
                </Pane>
                <Pane className="col-lg-4">
                  <FormItem
                    name="class"
                    type={variables.SELECT}
                    data={[{ id: 1, name: 'Preschool 1' }]}
                  />
                </Pane>
                <Pane className="col-lg-4">
                  <FormItem name="rangeTime" type={variables.RANGE_PICKER} />
                </Pane>
              </Pane>
            </Form>
          </Pane>
        </Pane>

        <Pane className="row justify-content-center">
          <Pane className="col-lg-6 card">
            <Scrollbars autoHeight autoHeightMax={window.innerHeight - 278}>
              <List
                loading={loading}
                dataSource={convertDataMenus(data)}
                renderItem={({ date, menuDetails = [] }, index) => (
                  <ListItem key={index}>
                    <Pane className="w-100">
                      <Pane className="mb10">
                        <Heading type="form-block-title">
                          {Helper.getDate(date, 'dddd - DD/MM/YYYY')}
                        </Heading>
                      </Pane>
                      <Timeline>
                        {menuDetails?.map(({ fromTime, toTime, foods }, index) => (
                          <TimelineItem color="red" key={index} style={{ paddingBottom: 10 }}>
                            <Pane>
                              <b>
                                {Helper.getDate(fromTime, variables.DATE_FORMAT.TIME_FULL)} -{' '}
                                {Helper.getDate(toTime, variables.DATE_FORMAT.TIME_FULL)}
                              </b>
                            </Pane>
                            {foods?.map(({ name, image }, index) => (
                              <Pane key={index} className="mb5">
                                <Text size="normal">{name}</Text>
                                <img
                                  src={'https://bit.ly/3mF1QGn'}
                                  alt="dishes-preview"
                                  className={styles['dishes-image']}
                                />
                              </Pane>
                            ))}
                          </TimelineItem>
                        ))}
                      </Timeline>
                    </Pane>
                  </ListItem>
                )}
              />
            </Scrollbars>
          </Pane>
        </Pane>
      </Pane>
    </>
  );
});

export default Index;
