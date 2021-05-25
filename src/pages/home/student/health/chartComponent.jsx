import { memo, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'dva';
import { Form, Skeleton } from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import ReactApexChart from 'react-apexcharts';

import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';


const Index = memo(({ studentId }) => {
  const dispatch = useDispatch();
  const [ { criteriaGroupProperties }, loading ] = useSelector(({ loading: { effects }, studentHomePage }) => [
    studentHomePage,
    effects,
  ]);

  const [options] = useState({
    chart: {
      height: 650,
      type: 'scatter',
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    colors: ['#27A600'],
    dataLabels: {
      enabled: false,
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    xaxis: {
      type: 'datetime',
      labels: {
        formatter: (value) => moment(value).format('DD/MM'),
      },
    },
    yaxis: {
      labels: {
        show: true,
        align: 'right',
        minWidth: 0,
        maxWidth: 160,
        offsetX: 0,
        offsetY: 0,
        rotate: 0,
        formatter: (value) => moment().startOf('day').seconds(value).format('HH:mm'),
      },
    },
  });
  const [series, setSeries] = useState([
    {
      name: 'Thống kê sức khỏe',
      data: [],
    },
  ]);
  const [search, setSearch] = useState({
    PropertyId: undefined,
    rangeTime: [
      moment().clone().startOf('month').format(variables.DATE_FORMAT.DATE_AFTER),
      moment().clone().endOf('month').format(variables.DATE_FORMAT.DATE_AFTER)
    ]
  });

  const getMiliseconds = (date) => {
    const a = date.split(':'); // split it at the colons
    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    const seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
    return seconds;
  };

  const onLoad = () => {
    dispatch({
      type: 'studentHomePage/GET_DATA_HEALTH_CHART',
      payload: {
        studentId,
        PropertyId: search.PropertyId,
        FromDate: !_.isEmpty(search.rangeTime) ? Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: search.rangeTime[0],
            targetValue: '00:00:00',
          }),
          isUTC: false,
        }) : null,
        ToDate: !_.isEmpty(search.rangeTime) ? Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: search.rangeTime[1],
            targetValue: '23:59:59',
          }),
          isUTC: false,
        }) : null,
      },
      callback: (response) => {
        if (!_.isEmpty(response)) {
          let items = [];
          response.forEach((item) => {
            item.history.forEach((itemHistory) => {
              items = [
                ...items,
                [
                  new Date(item.reportDate).getTime(),
                  getMiliseconds(
                    Helper.getDate(
                      _.get(itemHistory, 'studentCritetiaEntityChanges[0].changeTime'),
                      variables.DATE_FORMAT.TIME_FULL,
                    ),
                  ),
                ],
              ];
            });
          });
          setSeries((prev) => ([
            {
              ...prev,
              name: 'Thống kê sức khỏe',
              data: items
            }
          ]));
        }
      },
    });
  };

  useEffect(() => {
    dispatch({
      type: 'studentHomePage/GET_CRITERIA_GROUP_PROPERTIES',
      payload: {},
    });
  }, [search]);

  useEffect(() => {
    onLoad();
  }, [search]);

  const handleSearch = _.debounce((value, name) => {
    if (value) {
      setSearch((prevSearch) => ({
        ...prevSearch,
        [name]: value
      }));
    }
  }, 300);

  return (
    <div>
      <Form initialValues={{
        ...search,
        rangeTime: [
          search?.rangeTime[0] ? moment(search?.rangeTime[0]) : null,
          search?.rangeTime[1] ? moment(search?.rangeTime[1]) : null,
        ],
      }}>
        <div className="row">
          <div className="col-md-4">
            <FormItem
              className="mb0"
              name="rangeTime"
              type={variables.RANGE_PICKER}
              onChange={(event) => handleSearch(event, 'rangeTime')}
            />
          </div>
          <div className="col-md-4">
            <FormItem
              className="mb0"
              data={criteriaGroupProperties.map((item) => ({
                id: item.id,
                name: item.property,
              }))}
              name="propertyId"
              onChange={(event) => handleSearch(event, 'PropertyId')}
              type={variables.SELECT}
            />
          </div>
        </div>
      </Form>
      <div className="py10">
        {loading['studentHomePage/GET_DATA_HEALTH_CHART'] ? (
          <>
           <Skeleton avatar paragraph={{ rows: 4 }} active />
           <Skeleton avatar paragraph={{ rows: 4 }} active />
           <Skeleton avatar paragraph={{ rows: 4 }} active />
         </>
        ) : (
          <div id="chart">
            <ReactApexChart
              options={options}
              series={series}
              type="scatter"
              height={600}
            />
          </div>
        )}
      </div>
    </div>
  );
});

Index.propTypes = {
  studentId: PropTypes.string,
};

Index.defaultProps = {
  studentId: '',
};

export default Index;
