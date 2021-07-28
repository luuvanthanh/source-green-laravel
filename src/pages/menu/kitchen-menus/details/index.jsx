import { memo, useRef, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Form, List, Timeline, Image } from 'antd';
import { useHistory, useLocation, useDispatch, useSelector } from 'dva';
import { useParams } from 'umi';
import { EyeOutlined } from '@ant-design/icons';
import { Scrollbars } from 'react-custom-scrollbars';
import moment from 'moment';
import 'moment/locale/vi';
import { debounce } from 'lodash';

import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Text from '@/components/CommonComponent/Text';

import { variables, Helper } from '@/utils';

const { Item: ListItem } = List;
const { Item: TimelineItem } = Timeline;

const Index = memo(() => {
  const [
    menuData,
    loadingReducer,
    { data, branches, classes },
  ] = useSelector(({ menu: { menuLeftChildren }, loading, kitchenMenusDetails }) => [
    menuLeftChildren,
    loading,
    kitchenMenusDetails,
  ]);
  const loading = loadingReducer?.effects['kitchenMenusDetails/GET_DATA'];
  const params = useParams();
  const dispatch = useDispatch();
  const mounted = useRef(false);
  // const mountedSet = (action, value) => mounted?.current && action(value);

  const history = useHistory();
  const { query, pathname } = useLocation();

  useEffect(() => {
    dispatch({
      type: 'kitchenMenusDetails/GET_DATA',
      payload: { ...params },
    });
  }, [params.id]);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  return (
    <>
      <Helmet title="Danh sách thực đơn" />
      <Breadcrumbs last="Thực đơn" menu={menuData} />
      <Pane className="p20">
        <Pane className="card mb20">
          <Pane className="pb-0" style={{ padding: 20 }} />
        </Pane>

        {/* <Pane className="row justify-content-center">
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
        </Pane> */}
      </Pane>
    </>
  );
});

Index.propTypes = {};

Index.defaultProps = {};

export default Index;
