import { memo, useEffect, useState } from 'react';
import { Form, Image } from 'antd';
import { useSelector, useDispatch } from 'dva';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';
import AvatarTable from '@/components/CommonComponent/AvatarTable';

import styles from '../index.scss';
import variablesModules from '../variables';

const Index = memo(({ studentId }) => {
  const dispatch = useDispatch();
  const [ { notes, paginationNote }, loading] = useSelector(({ loading: { effects }, studentHomePage }) => [
    studentHomePage,
    effects,
  ]);

  const [search, setSearch] = useState({
    classId: undefined,
    page: variables.PAGINATION.PAGE,
    limit: variables.PAGINATION.PAGE_SIZE_SMALL,
    status: '',
    rangeTime: [
      moment().clone().startOf('month').format(variables.DATE_FORMAT.DATE_AFTER),
      moment().clone().endOf('month').format(variables.DATE_FORMAT.DATE_AFTER)
    ]
  });

  const onLoad = () => {
    dispatch({
      type: 'studentHomePage/GET_DATA_NOTE',
      payload: {
        StudentId: studentId,
        ...search,
        rangeTime: undefined,
        From: !_.isEmpty(search.rangeTime) ? Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: search.rangeTime[0],
            targetValue: '00:00:00',
          }),
          isUTC: false,
        }) : null,
        To: !_.isEmpty(search.rangeTime) ? Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: search.rangeTime[1],
            targetValue: '23:59:59',
          }),
          isUTC: false,
        }) : null,
      },
    });
  };

  useEffect(() => {
    onLoad();
  }, [search, studentId]);


  /**
   * Function header table
   */
  const header = () => [
    {
      title: 'Thời gian tạo',
      key: 'creationTime',
      className: 'min-width-140',
      width: 140,
      render: (record) => (
        <Text size="normal">
          {Helper.getDate(record?.creationTime, variables.DATE_FORMAT.TIME_DATE)}
        </Text>
      ),
    },
    {
      title: 'Nội dung',
      key: 'note',
      className: 'min-width-300',
      render: (record) => (
        <>
          <p className="font-weight-bold font-size-14 mb5">{record?.name}</p>
          {record?.description && (
            <p className="font-size-14 mb0">Bé hay bị lạnh, nhờ các cô giúp bé luôn mang áo ấm và tránh bé đứng trước quạt gió nhé.</p>
          )}
        </>
      ),
    },
    {
      title: 'Hình ảnh',
      key: 'image',
      className: 'min-width-200',
      width: 200,
      render: (record) => (
        <Image.PreviewGroup>
          {Helper.isJSON(record.fileImage) &&
            JSON.parse(record.fileImage).map((item, index) => (
              <div  key={index} className={styles['group-image']}>
                <Image
                  key={index}
                  width={50}
                  height={50}
                  src={`${API_UPLOAD}${item}`}
                  data-viewmore={`+${JSON.parse(record?.fileImage)?.length - 1}`}
                />
              </div>
          ))}
        </Image.PreviewGroup>
      ),
    },
    {
      title: 'Phụ huynh',
      key: 'parents',
      className: 'min-width-250',
      width: 250,
      render: (record) => (
        <AvatarTable
          fileImage={Helper.getPathAvatarJson(_.get(record, 'student.studentParents[0].parent.fileImage'))}
          fullName={_.get(record, 'student.studentParents[0].parent.fullName')}
          size={50}
        />
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      className: 'min-width-120',
      width: 120,
      render: (record) =>Helper.tagStatus(
        `${record?.status === variables.STATUS.CONFIRMING ? variables.STATUS.CONFIRMING : ''}`,
        `${record?.status === variables.STATUS.CONFIRMING ? 'Chờ xác nhận' : 'Đã nhận'}`
      )
    },
    {
      title: 'Giáo viên đã nhận',
      key: 'teacher',
      className: 'min-width-250',
      width: 250,
      render: (record) => (
        <AvatarTable
          fileImage={Helper.getPathAvatarJson(record?.employee?.fileImage)}
          fullName={record?.employee?.fullName || ''}
          size={50}
        />
      ),
    },
    {
      title: 'Thời gian đã nhận',
      key: 'timeReceived',
      className: 'min-width-160',
      width: 160,
      render: (record) => (
        <Text size="normal">
          {Helper.getDate(record?.confirmedTime, variables.DATE_FORMAT.TIME_DATE)}
        </Text>
      ),
    },
  ];

  const handleSearch = _.debounce((value, name) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      [name]: value
    }));
  }, 300);

  /**
   * Function set pagination
   * @param {integer} page page of pagination
   * @param {integer} size size of pagination
   */
  const changePagination = (page, limit) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      page,
      limit,
    }));
  };

  /**
   * Function pagination of table
   * @param {object} pagination value of pagination items
   */
  const pagination = (pagination) => ({
    size: 'default',
    total: pagination?.total,
    pageSize: search.limit,
    defaultCurrent: Number(search.page),
    current: Number(search.page),
    hideOnSinglePage: pagination.total <= 10,
    showSizeChanger: variables.PAGINATION.SHOW_SIZE_CHANGER,
    pageSizeOptions: variables.PAGINATION.PAGE_SIZE_OPTIONS,
    locale: { items_per_page: variables.PAGINATION.PER_PAGE_TEXT },
    onChange: (page, size) => {
      changePagination(page, size);
    },
    onShowSizeChange: (current, size) => {
      changePagination(current, size);
    },
    showTotal: (total, [start, end]) => `Hiển thị ${start}-${end} trong ${total}`,
  });

  return (
    <div className={classnames(styles['container-bus'], 'mt20')}>
      <Form initialValues={{
        ...search,
        rangeTime: [
          _.get(search, 'rangeTime[0]') ? moment(search?.rangeTime[0]) : null,
          _.get(search, 'rangeTime[1]') ? moment(search?.rangeTime[1]) : null,
        ],
      }}>
        <div className="row">
          <div className="col-md-4 col-xl-2">
            <FormItem
              name="rangeTime"
              type={variables.RANGE_PICKER}
              onChange={(event) => handleSearch(event, 'rangeTime')}
            />
          </div>
          <div className="col-md-4 col-xl-2">
            <FormItem
              data={variablesModules.STATUS_NOTE}
              name="status"
              type={variables.SELECT}
              onChange={(event) => handleSearch(event, 'status')}
            />
          </div>
        </div>
      </Form>
      <Table
        bordered
        columns={header()}
        dataSource={notes}
        loading={loading['studentHomePage/GET_DATA_NOTE']}
        pagination={pagination(paginationNote)}
        params={{
          header: header(),
          type: 'table',
        }}
        rowKey={(record) => record.id}
        scroll={{ x: '100%'}}
      />
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
