import { memo, useRef, useEffect, useState } from 'react';
import { Form, Tabs } from 'antd';
import { connect, withRouter } from 'umi';
import PropTypes from 'prop-types';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import classnames from 'classnames';

import Like from './component/like';
import Share from './component/share';
import Comment from './component/comment';


import stylesModule from '../../../styles.module.scss';

const marginProps = { style: { marginBottom: 12 } };

const { TabPane } = Tabs;
const mapStateToProps = ({ loading, crmMarketingManageAdd }) => ({
    loading,
    detailsAddPost: crmMarketingManageAdd.detailsAddPost,
    error: crmMarketingManageAdd.error,
});
const General = memo(
    ({ detailsAddPost }) => {
        const formRef = useRef();
        const [tab, setTab] = useState('like');
        const mounted = useRef(false);

        useEffect(() => {
            mounted.current = true;
            return mounted.current;
        }, []);

        const changeTab = (key) => {
            setTab(key);
        };

        const tabs = () => [
            {
                id: 'like',
                name: 'CHI TIẾT LIKE',
                component: (
                    <Like
                        dataLike={detailsAddPost?.postFacebookInfo?.articleReactionInfo}
                    />
                ),
            },
            {
                id: 'share',
                name: 'CHI TIẾT SHARE',
                component: (
                    <Share
                    />
                ),
            },
            {
                id: 'comment',
                name: 'CHI TIẾT COMMENT',
                component: (
                    <Comment
                        dataComment={detailsAddPost?.postFacebookInfo?.articleCommentInfo}
                    />
                ),
            },
        ];

        return (
            <>
                <Form layout="vertical" ref={formRef} >
                    <Pane >
                        <Pane className="card">
                            <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
                                <Heading type="form-title" style={{ marginBottom: 20 }}>
                                    {detailsAddPost?.name}
                                </Heading>
                            </Pane>
                            <Pane className="row" {...marginProps}>
                                <Pane className={classnames('col-lg-4', stylesModule['item-title'])}>
                                    <div style={{ display: 'block' }}>
                                        <h3 className={stylesModule?.title}>Số lượt like</h3>
                                        <p className={stylesModule?.like}>{detailsAddPost?.postFacebookInfo?.quantity_reaction}</p>
                                    </div>
                                </Pane>
                                <Pane className={classnames('col-lg-4', stylesModule['item-title'])}>
                                    <div style={{ display: 'block' }}>
                                        <h3 className={stylesModule?.title}>Số lượt share</h3>
                                        <p className={stylesModule?.share}>{detailsAddPost?.postFacebookInfo?.quantity_share}</p>
                                    </div>
                                </Pane>
                                <Pane className={classnames('col-lg-4', stylesModule['item-title'])}>
                                    <div style={{ display: 'block' }}>
                                        <h3 className={stylesModule?.title}>Số lượt comment</h3>
                                        <p className={stylesModule?.comment}>{detailsAddPost?.postFacebookInfo?.quantity_comment}</p>
                                    </div>
                                </Pane>
                            </Pane>
                        </Pane>
                    </Pane>
                    <Pane className="card">
                        <Tabs onChange={changeTab} activeKey={tab} className="test-12 p20">
                            {tabs().map(({ id, name, component }) => (
                                <TabPane
                                    tab={<span >{name}</span>}
                                    key={id}
                                >
                                    {component}
                                </TabPane>
                            ))}
                        </Tabs>
                    </Pane>
                </Form>
            </>
        );
    },
);

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
};

export default withRouter(connect(mapStateToProps)(General));