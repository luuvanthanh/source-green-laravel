import { memo, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { List, Timeline, Image } from 'antd';
import { useHistory, useLocation, useDispatch, useSelector } from 'dva';
import { useParams } from 'umi';
import { EyeOutlined } from '@ant-design/icons';
import { Scrollbars } from 'react-custom-scrollbars';
import 'moment/locale/vi';
import { isEmpty, head } from 'lodash';

import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import classnames from 'classnames';

import { variables, Helper } from '@/utils';
import styles from './style.module.scss';

const { Item: ListItem } = List;
const { Item: TimelineItem } = Timeline;

const Index = memo(() => {
  const [
    menuData,
    loadingReducer,
    { data },
  ] = useSelector(({ menu: { menuLeftChildren }, loading, kitchenMenusDetails }) => [
    menuLeftChildren,
    loading,
    kitchenMenusDetails,
  ]);
  const loading = loadingReducer?.effects['kitchenMenusDetails/GET_DATA'];
  const params = useParams();
  const dispatch = useDispatch();
  const mounted = useRef(false);
  const history = useHistory();
  const { pathname } = useLocation();

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

  const mergeMenuMeal = (items) => {
    let menuMeal = [];
    if (!isEmpty(items)) {
      items.forEach((item) => {
        menuMeal = [...menuMeal, ...item.menuMealGroupByDay];
      });
    }
    return menuMeal;
  };

  return (
    <>
      <Helmet title="Danh sách thực đơn" />
      <Breadcrumbs last="Thực đơn" menu={menuData} />
      <Pane className="p20">
        <Pane className="row justify-content-center">
          <Pane className={classnames('col-lg-6 card', styles['card-container'])}>
            <Heading type="form-title">Thông tin chung</Heading>
            <div className={classnames(styles['list-info'], 'mt10')}>
              <div className={styles['info-item']}>
                <div className={styles['info-image']}>
                  <span className="icon-clock" />
                </div>
                <div className={styles['info-content']}>
                  <p className={styles['info-norm']}>Thời gian</p>
                  <p className={styles['info-title']}>
                    {Helper.getDate(data?.fromDate, variables.DATE_FORMAT.MONTH_FULL)}
                  </p>
                </div>
              </div>
              <div className={styles['info-item']}>
                <div className={styles['info-image']}>
                  <span className="icon-school" />
                </div>
                <div className={styles['info-content']}>
                  <p className={styles['info-norm']}>Cơ sở</p>
                  <p className={styles['info-title']}>{data?.branch?.name}</p>
                </div>
              </div>
              <div className={styles['info-item']}>
                <div className={styles['info-image']}>
                  <span className="icon-open-book" />
                </div>
                <div className={styles['info-content']}>
                  <p className={styles['info-norm']}>Loại lớp</p>
                  <p className={styles['info-title']}>{data?.classType?.name}</p>
                </div>
              </div>
            </div>
          </Pane>
        </Pane>
        <Pane className="row justify-content-center">
          <Pane className="col-lg-6 card">
            <Scrollbars autoHeight autoHeightMax={window.innerHeight - 400}>
              <List
                loading={loading}
                dataSource={mergeMenuMeal(data.menuMealGroupByWeekAndDayIndex)}
                renderItem={({ date, menuMealGroupByMenuTypes = [] }, index) => (
                  <ListItem key={index}>
                    <Pane className="w-100">
                      <Pane className="mb10">
                        <Heading type="form-block-title">
                          {Helper.getDate(date, variables.DATE_FORMAT.SHOW_FULL_DATE)}
                        </Heading>
                      </Pane>
                      <Timeline>
                        {head(menuMealGroupByMenuTypes)?.menuMealInfors?.map(
                          ({ fromTime, toTime, menuMealDetails }, index) => (
                            <TimelineItem color="red" key={index} style={{ paddingBottom: 10 }}>
                              <Pane>
                                <b>
                                  {Helper.getDate(fromTime, variables.DATE_FORMAT.HOUR)} -{' '}
                                  {Helper.getDate(toTime, variables.DATE_FORMAT.HOUR)}
                                </b>
                              </Pane>
                              {menuMealDetails?.map((item, index) => (
                                <Pane key={index} className="mb5">
                                  <Text size="normal">{item?.food?.name}</Text>
                                  {Helper.isJSON(item?.food?.pathImage) && (
                                    <Image.PreviewGroup>
                                      {Helper.isJSON(item?.food?.pathImage) &&
                                        JSON.parse(item?.food?.pathImage).map((item, index) => (
                                          <Image
                                            width={80}
                                            height={80}
                                            src={`${API_UPLOAD}${item?.url}`}
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
                          ),
                        )}
                      </Timeline>
                    </Pane>
                  </ListItem>
                )}
              />
            </Scrollbars>
          </Pane>
        </Pane>
        <Pane className="row justify-content-center">
          <Pane className="col-lg-6 ">
            <Pane className="d-flex justify-content-end align-items-center">
              <Button
                color="success"
                className="mr10"
                onClick={() => history.push(pathname.replace('chi-tiet', 'chinh-sua'))}
              >
                Sửa
              </Button>
              <Button color="success">Thêm bản sao</Button>
            </Pane>
          </Pane>
        </Pane>
      </Pane>
    </>
  );
});

Index.propTypes = {};

Index.defaultProps = {};

export default Index;
