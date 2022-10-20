import { memo, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { List } from 'antd';
import { useSelector, useDispatch } from 'dva';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from '@/assets/styles/Common/information.module.scss';
import InfiniteScroll from 'react-infinite-scroller';
import AvatarTable from '@/components/CommonComponent/AvatarTable';

import { variables, Helper } from '@/utils';
import moment from 'moment';
import Loading from '@/components/CommonComponent/Loading';
import stylesModule from './styles.module.scss';


const { Item: ListItem } = List;

const Index = memo(() => {

    const dispatch = useDispatch();

    const [
        { details },
        effects
    ] = useSelector(({ hrmHome, loading, user, menu }) => [
        hrmHome,
        loading,
        user,
        menu,
    ]);


    useEffect(() => {
        dispatch({
            type: 'hrmHome/GET_DETAILS',
            payload: {},
        });
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <Helmet title="Trang chủ" />
            <Heading type="form-title" className="pb20">
                Trang chủ
            </Heading>

            <Loading loading={effects['hrmHome/GET_DETAILS']} >
                <div className="card p20">
                    <Pane className="row border-bottom" >
                        <Heading type="form-block-title" style={{ padding: 20 }}>
                            Sinh nhật hôm nay - Ngày {Helper.getDate(moment(), variables.DATE_FORMAT.DATE)}
                        </Heading>
                        <Pane className="col-lg-12 mb20">
                            <Scrollbars autoHeight autoHeightMax="30vh">
                                <InfiniteScroll
                                    pageStart={0}
                                    useWindow={false}
                                >
                                    <List
                                        dataSource={details?.dataEmployeeBirthday}
                                        renderItem={({ id, fullName, fileImage, division, age }) => (
                                            <ListItem key={id} className={styles.listItem}>
                                                <Pane className={stylesModule['wrapper-items']}>
                                                    <Pane className={stylesModule.userInformation}>
                                                        <AvatarTable
                                                            fileImage={Helper.getPathAvatarJson(fileImage)}
                                                        />
                                                        <Pane >
                                                            <div className={stylesModule['wrapper-title']}>
                                                                <h3>{fullName}</h3>
                                                            </div>
                                                            <div className={stylesModule['wrapper-title']}>
                                                                <p>{division}</p>
                                                                <div className="d-flex">
                                                                    <h4 className={stylesModule.age}>{age}</h4>
                                                                    <p className={stylesModule.text}>Tuổi</p>
                                                                </div>
                                                            </div>
                                                        </Pane>
                                                    </Pane>
                                                </Pane>
                                            </ListItem>
                                        )
                                        }
                                    />
                                </InfiniteScroll>
                            </Scrollbars>
                        </Pane>
                    </Pane>
                    <Pane className="row">
                        <Heading type="form-block-title" style={{ padding: 20 }}>
                            Sinh nhật sắp đến
                        </Heading>
                        <Pane className="col-lg-12">
                            <Scrollbars autoHeight autoHeightMax="30vh">
                                <InfiniteScroll
                                    pageStart={0}
                                    useWindow={false}
                                >
                                    <List
                                        dataSource={details?.dataEmployeeBirthdayUpcoming}
                                        renderItem={({ id, fullName, fileImage, division, dateOfBirth, age }) => (
                                            <ListItem key={id} className={styles.listItem}>
                                                <Pane className={stylesModule['wrapper-items']}>
                                                    <Pane className={stylesModule.userInformation}>
                                                        <AvatarTable
                                                            fileImage={Helper.getPathAvatarJson(fileImage)}
                                                        />
                                                        <Pane >
                                                            <div className={stylesModule['wrapper-title']}>
                                                                <h3>{fullName}</h3>
                                                                <h3 className={stylesModule.date}>{dateOfBirth}</h3>
                                                            </div>
                                                            <div className={stylesModule['wrapper-title']}>
                                                                <p>{division}</p>
                                                                <div className="d-flex">
                                                                    <h4 className={stylesModule.age}>{age}</h4>
                                                                    <p className={stylesModule.text}>Tuổi</p>
                                                                </div>
                                                            </div>
                                                        </Pane>
                                                    </Pane>
                                                </Pane>
                                            </ListItem>
                                        )
                                        }
                                    />
                                </InfiniteScroll>
                            </Scrollbars>
                        </Pane>
                    </Pane>
                </div>
            </Loading>
        </div>
    );
});

Index.propTypes = {
};

Index.defaultProps = {
};

export default Index;
