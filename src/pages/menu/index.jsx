import { memo, useRef, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Form, List, Timeline, Image } from 'antd';
import { useHistory, useLocation, useDispatch, useSelector } from 'dva';
import { EyeOutlined } from '@ant-design/icons';
import { Scrollbars } from 'react-custom-scrollbars';
import moment from 'moment';
import 'moment/locale/vi';
import { debounce } from 'lodash';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Text from '@/components/CommonComponent/Text';

import { variables, Helper } from '@/utils';

const { Item: ListItem } = List;
const { Item: TimelineItem } = Timeline;

const Index = memo(() => {
  const [loadingReducer, { data, branches, classes }] = useSelector(({ loading, menuKid }) => [
    loading,
    menuKid,
  ]);
  const loading = loadingReducer?.effects['menuKid/GET_DATA'];
  const dispatch = useDispatch();
  const mounted = useRef(false);
  // const mountedSet = (action, value) => mounted?.current && action(value);

  const history = useHistory();
  const { query, pathname } = useLocation();

  const filterRef = useRef();

  const [search, setSearch] = useState({
    branchId: query?.branchId,
    classId: query?.classId,
    rangeTime:
      query.fromDate && query.toDate
        ? [moment(query.fromDate), moment(query.toDate)]
        : [moment().startOf('weeks'), moment().endOf('weeks')],
  });

  useEffect(() => {
    dispatch({
      type: 'menuKid/GET_DATA',
      payload: {
        branchId: search?.branchId,
        classId: search?.classId,
        fromDate: search.rangeTime[0],
        toDate: search.rangeTime[1],
      },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch({
        branchId: search?.branchId,
        classId: search?.classId,
        fromDate: Helper.getDate(search.rangeTime[0], variables.DATE_FORMAT.DATE_AFTER),
        toDate: Helper.getDate(search.rangeTime[1], variables.DATE_FORMAT.DATE_AFTER),
      }),
    });
  }, [search]);

  const changeFilterDebouce = debounce((value, name) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      [name]: value,
    }));
  }, 300);

  const changeFilterDateDebouce = debounce((value) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      rangeTime: value,
    }));
  }, 300);

  const changeFilter = (value, name) => {
    changeFilterDebouce(value, name);
  };

  const fetchClasses = (branchId) => {
    dispatch({
      type: 'menuKid/GET_CLASSES',
      payload: {
        branch: branchId,
      },
    });
  };

  const changeFilterBranch = (value, name) => {
    changeFilterDebouce(value, name);
    fetchClasses(value);
  };

  const changeFilterDate = (value) => {
    changeFilterDateDebouce(value);
  };

  useEffect(() => {
    if (search.branchId) {
      dispatch({
        type: 'menuKid/GET_CLASSES',
        payload: {
          branch: search.branchId,
        },
      });
    }
    dispatch({
      type: 'menuKid/GET_BRANCHES',
      payload: {},
    });
  }, []);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

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
            permission="BEP_THEM"
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
                    name="branchId"
                    type={variables.SELECT}
                    data={branches}
                    onChange={(event) => changeFilterBranch(event, 'branchId')}
                  />
                </Pane>
                <Pane className="col-lg-4">
                  <FormItem
                    name="classId"
                    type={variables.SELECT}
                    data={classes}
                    onChange={(event) => changeFilter(event, 'classId')}
                  />
                </Pane>
                <Pane className="col-lg-4">
                  <FormItem
                    name="rangeTime"
                    type={variables.RANGE_PICKER}
                    onChange={changeFilterDate}
                  />
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
                dataSource={data}
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
                            {foods?.map(({ name, imageUrl }, index) => (
                              <Pane key={index} className="mb5">
                                <Text size="normal">{name}</Text>
                                {Helper.isJSON(imageUrl) && (
                                  <Image.PreviewGroup>
                                    {Helper.isJSON(imageUrl) &&
                                      JSON.parse(imageUrl).map((item, index) => (
                                        <Image
                                          width={80}
                                          height={80}
                                          src={`${API_UPLOAD}${item}`}
                                          key={index}
                                          preview={{
                                            maskClassName: 'customize-mask',
                                            mask: <EyeOutlined className="mr5" />,
                                          }}
                                        />
                                      ))}
                                  </Image.PreviewGroup>
                                )}
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

Index.propTypes = {};

Index.defaultProps = {};

export default Index;
