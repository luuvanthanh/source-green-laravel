import React, { PureComponent } from 'react';
import { Form, Tag, Input } from 'antd';
import classnames from 'classnames';
import Text from '@/components/CommonComponent/Text';
import Heading from '@/components/CommonComponent/Heading';
import Pane from '@/components/CommonComponent/Pane';
import styles from '@/assets/styles/Common/common.scss';

class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tags: ['Tag 1', 'Tag 2', 'Tag 3'],
      inputVisible: false,
      inputValue: '',
    };
  }

  handleClose = (removedTag) => {
    this.setState((prevState) => ({
      tags: prevState.tags.filter((item) => item !== removedTag),
    }));
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.setState({
      tags,
      inputVisible: true,
      inputValue: '',
    });
  };

  saveInputRef = (input) => {
    this.input = input;
  };

  forMap = (tag) => {
    const tagElem = (
      <Tag
        closable
        color="#27a600"
        onClose={(e) => {
          e.preventDefault();
          this.handleClose(tag);
        }}
      >
        {tag}
      </Tag>
    );
    return (
      <span key={tag} style={{ display: 'inline-block' }}>
        {tagElem}
      </span>
    );
  };

  render() {
    const { tags, inputVisible, inputValue } = this.state;
    const tagChild = tags.map(this.forMap);
    return (
      <>
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark">Tags</Text>
          </div>
          <Form className={styles['layout-form']} layout="vertical">
            <Pane className="card">
              <Pane className="p20">
                <Heading type="form-title" className="mb20">
                  Thông tin tags
                </Heading>
                <div className={styles['wrapper-tag']}>
                  <div style={{ marginBottom: 16 }}>
                    <div
                      enter={{
                        scale: 0.8,
                        opacity: 0,
                        type: 'from',
                        duration: 100,
                        onComplete: (e) => {
                          e.target.style = '';
                        },
                      }}
                      leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
                      appear={false}
                    >
                      {tagChild}
                    </div>
                  </div>
                  {inputVisible && (
                    <Input
                      ref={this.saveInputRef}
                      type="text"
                      size="small"
                      style={{ width: 78 }}
                      value={inputValue}
                      onChange={this.handleInputChange}
                      onBlur={this.handleInputConfirm}
                      onPressEnter={this.handleInputConfirm}
                    />
                  )}
                  {!inputVisible && (
                    <Tag onClick={this.showInput} className={styles['site-tag-plus']}>
                      <span className="icon-plus" size="small" /> New Tag
                    </Tag>
                  )}
                </div>
              </Pane>
            </Pane>
          </Form>
        </div>
      </>
    );
  }
}

export default Index;
