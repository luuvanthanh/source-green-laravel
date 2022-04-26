import { memo, useRef, useEffect, useState } from 'react';
import { Form, Tabs, Select, Table, } from 'antd';
import { connect, withRouter, useLocation } from 'umi';
import PropTypes from 'prop-types';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Text from '@/components/CommonComponent/Text';
import { isEmpty } from 'lodash';

import { variables } from '@/utils';
import Share from './component/share';
import Like from './component/like';
import Comment from './component/comment';

import stylesModule from '../../../styles.module.scss';

const marginProps = { style: { marginBottom: 12 } };

const { Option } = Select;
const { TabPane } = Tabs;
const mapStateToProps = ({ loading, crmMarketingManageAdd }) => ({
  loading,
  detailsAddPost: crmMarketingManageAdd.detailsAddPost,
  error: crmMarketingManageAdd.error,
  paginationLike: crmMarketingManageAdd.paginationLike,
  paginationComment: crmMarketingManageAdd.paginationComment,
});
const General = memo(({ dispatch, detailsAddPost, paginationLike, paginationComment }) => {
  const formRef = useRef();
  const [tab, setTab] = useState('like');
  const [dataLike, setDataLike] = useState([]);
  const [dataComment, setDataComment] = useState([]);
  const mounted = useRef(false);
  const { query } = useLocation();
  const [page, setPage] = useState([]);
  const [dataSelect, setdataSelect] = useState({});
  const [searchLike, setSearchLike] = useState({
    type: query?.type,
    page: query?.page || variables.PAGINATION.PAGE,
    limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
  });

  const [searchComment, setSearchComment] = useState({
    type: query?.type,
    page: query?.page || variables.PAGINATION.PAGE,
    limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
  });


  const local = JSON?.parse(localStorage.getItem('pageCurrent'));

  useEffect(() => {
    const page = JSON?.parse(localStorage.getItem('pageCurrent'));
    if (page?.length > 0) {
      setPage(page);
    }
  }, [local?.length > 0]);


  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);


  const changeTab = (key) => {
    setTab(key);
  };


  const hanDleChangeLike = (page, limit) => {
    setSearchLike((prevState) => ({
      ...prevState.search,
      page,
      limit,
    }));
  };

  const hanDleChangeComment = (page, limit) => {
    setSearchComment((prevState) => ({
      ...prevState.search,
      page,
      limit,
    }));
  };


  useEffect(() => {
    if (detailsAddPost?.postFacebookInfo?.length > 0) {
      setdataSelect(detailsAddPost?.postFacebookInfo[0]);
    }
  }, [detailsAddPost?.postFacebookInfo?.length > 0]);

  const tabs = () => [
    {
      id: 'like',
      name: 'CHI TIẾT LIKE',
      component: <Like dataLike={dataLike} hanDleChangeLike={hanDleChangeLike} paginationLike={paginationLike} />,
    },
    {
      id: 'share',
      name: 'CHI TIẾT SHARE',
      component: <Share />,
    },
    {
      id: 'comment',
      name: 'CHI TIẾT COMMENT',
      component: <Comment dataComment={dataComment} hanDleChangeComment={hanDleChangeComment} paginationComment={paginationComment} />,
    },
  ];

  const onchangeData = (e) => {
    dispatch({
      type: 'crmMarketingManageAdd/GET_POSTS_LIKE',
      payload: {
        page_id: e?.page_id,
        article_id: e?.article_id,
        ...searchLike,
      },
      callback: (res) => {
        if (res) {
          setDataLike(res?.parsePayload);
        }
      },
    });
    dispatch({
      type: 'crmMarketingManageAdd/GET_POSTS_COMMENT',
      payload: {
        page_id: e?.page_id,
        article_id: e?.article_id,
        ...searchComment,
      },
      callback: (res) => {
        if (res) {
          setDataComment(res?.parsePayload);
        }
      },
    });
  };

  const header = () => {
    const columns = [
      {
        title: 'Fanpage',
        key: 'created_at',
        className: 'min-width-150',
        render: (record) => record?.page?.name,
      },
      {
        title: 'Số lượt like',
        width: 150,
        className: 'min-width-150',
        key: 'quantity_reaction',
        render: (record) => record?.quantity_reaction,
      },
      {
        title: 'Số lượt share',
        key: 'quantity_share',
        className: 'min-width-150',
        width: 150,
        render: (record) => record?.quantity_share,
      },
      {
        title: 'Số lượt comment',
        key: 'quantity_comment',
        className: 'min-width-150',
        width: 150,
        render: (record) => record?.quantity_comment,
      },
    ];
    return columns;
  };

  const onSelect = (e) => {
    setdataSelect(detailsAddPost?.postFacebookInfo?.find((i) => i?.page?.id === e));
    onchangeData(dataSelect);
    setSearchLike(() => ({
      page: query?.page || variables.PAGINATION.PAGE,
      limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
    }));
    setSearchComment(() => ({
      page: query?.page || variables.PAGINATION.PAGE,
      limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
    }));
  };

  useEffect(() => {
    if (!isEmpty(dataSelect)) {
      onchangeData(dataSelect);
    }
  }, [searchComment, searchLike]);

  useEffect(() => {
    if (!isEmpty(dataSelect)) {
      onchangeData(dataSelect);
    }
  }, [dataSelect]);

  // console.log("dataSelect", isEmpty(dataSelect))
  // console.log("dataSelect", dataSelect)
  useEffect(() => {
    if (page?.length > 0 && detailsAddPost?.postFacebookInfo?.length > 0) {
      const details = page?.map(i =>
      ({
        page_id: i?.id,
        page_access_token: i.access_token,
      }));
      dispatch({
        type: 'crmMarketingManageAdd/GET_POSTS_TOKEN_SHARE',
        payload: {
          article_id: detailsAddPost?.id,
          data_page: JSON.stringify(details),
        },
      });
    }
  }, [page?.length > 0, detailsAddPost?.postFacebookInfo?.length > 0]);

  return (
    <>
      {detailsAddPost?.postFacebookInfo?.length > 0 ?
        <Form layout="vertical" ref={formRef}>
          <Pane>
            <Pane className="card">
              <Pane style={{ padding: 20 }} className="pb-0 ">
                <Heading type="form-title" style={{ marginBottom: 20 }}>
                  {detailsAddPost?.name}
                </Heading>
              </Pane>
              <Pane className="row" {...marginProps}>
                <Pane className="col-lg-12">
                  <div className={stylesModule['wrapper-table']}>
                    <Table
                      columns={header()}
                      dataSource={detailsAddPost?.postFacebookInfo}
                      pagination={false}
                      className="table-normal"
                      isEmpty
                      params={{
                        header: header(),
                        type: 'table',
                      }}
                      bordered
                      rowKey={(record) => record.id}
                      scroll={{ x: '100%' }}
                      summary={(pageData) => {
                        let like = 0;
                        let share = 0;
                        let comment = 0;
                        pageData.forEach(
                          ({ quantity_reaction, quantity_share, quantity_comment }) => {
                            like += quantity_reaction;
                            share += quantity_share;
                            comment += quantity_comment;
                          },
                        );
                        return (
                          <>
                            <Table.Summary.Row>
                              <Table.Summary.Cell colSpan={1}>
                                <Text size="normal" style={{ fontWeight: 'bold' }}>
                                  Tổng cộng
                                </Text>
                              </Table.Summary.Cell>
                              <Table.Summary.Cell>
                                <Text size="normal" style={{ fontWeight: 'bold' }}>
                                  {like}
                                </Text>
                              </Table.Summary.Cell>
                              <Table.Summary.Cell>
                                <Text size="normal" style={{ fontWeight: 'bold' }}>
                                  {share}
                                </Text>
                              </Table.Summary.Cell>
                              <Table.Summary.Cell>
                                <Text size="normal" style={{ fontWeight: 'bold' }}>
                                  {comment}
                                </Text>
                              </Table.Summary.Cell>
                            </Table.Summary.Row>
                          </>
                        );
                      }}
                    />
                  </div>
                </Pane>
              </Pane>
            </Pane>
          </Pane>
          <Pane className="card">
            {detailsAddPost?.postFacebookInfo?.length > 0 ? (
              <>
                <div className="pt20 pl20">
                  <Select
                    style={{ width: 200 }}
                    optionFilterProp="children"
                    defaultValue={detailsAddPost?.postFacebookInfo[0]?.page?.id}
                    showSearch
                    onChange={(e) => onSelect(e)}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    filterSort={(optionA, optionB) =>
                      optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                    }
                  >
                    {detailsAddPost?.postFacebookInfo?.map((i) => (
                      <Option value={i?.page?.id}>{i?.page?.name}</Option>
                    ))}
                  </Select>
                </div>
                <Tabs onChange={changeTab} activeKey={tab} className="test-12 p20">
                  {tabs().map(({ id, name, component }) => (
                    <TabPane tab={<span>{name}</span>} key={id}>
                      {component}
                    </TabPane>
                  ))}
                </Tabs>
              </>
            ) : (
              ''
            )}
          </Pane>
        </Form>
        :
        <Pane className="card">
          <div className={stylesModule['wrapper-none-detail']}>
            Bài viết này chưa được đăng lên bất kỳ page nào.
          </div>
        </Pane>
      }
    </>
  );
});

General.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.objectOf(PropTypes.any),
  detailsAddPost: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  branches: PropTypes.arrayOf(PropTypes.any),
  classes: PropTypes.arrayOf(PropTypes.any),
  city: PropTypes.arrayOf(PropTypes.any),
  district: PropTypes.arrayOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
  detailsPost: PropTypes.objectOf(PropTypes.any),
  paginationLike: PropTypes.objectOf(PropTypes.any),
  paginationComment: PropTypes.objectOf(PropTypes.any),
};

General.defaultProps = {
  match: {},
  detailsAddPost: {},
  dispatch: () => { },
  loading: {},
  error: {},
  branches: [],
  classes: [],
  city: [],
  district: [],
  location: {},
  detailsPost: {},
  paginationLike: {},
  paginationComment: {},
};

export default withRouter(connect(mapStateToProps)(General));
