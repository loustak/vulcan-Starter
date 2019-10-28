import { Components, registerComponent, withMessages } from 'meteor/vulcan:core';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'meteor/vulcan:i18n';
import { Comments } from '../../modules/comments/index.js';
import moment from 'moment';

class CommentsItem extends PureComponent {
  constructor() {
    super();
    this.state = {
      showReply: false,
      showEdit: false,
    };
  }

  showReply = event => {
    event.preventDefault();
    this.setState({ showReply: true });
  };

  replyCancelCallback = () => {
    this.setState({ showReply: false });
  };

  replySuccessCallback = () => {
    this.setState({ showReply: false });
  };

  showEdit = event => {
    event.preventDefault();
    this.setState({ showEdit: true });
  };

  editCancelCallback = () => {
    this.setState({ showEdit: false });
  };

  editSuccessCallback = () => {
    this.setState({ showEdit: false });
  };

  removeSuccessCallback = ({ documentId }) => {
    this.props.flash({ id: 'comments.delete_success', type: 'success' });
  };

  renderComment() {
    const htmlBody = { __html: this.props.comment.htmlBody };

    const showReplyButton = !this.props.comment.isDeleted && !!this.props.currentUser;

    return (
      <div className="comments-item-text">
        <div dangerouslySetInnerHTML={htmlBody}></div>
        {showReplyButton ? (
          <a className="comments-item-reply-link" onClick={this.showReply}>
            <Components.Icon name="reply" /> <FormattedMessage id="comments.reply" />
          </a>
        ) : null}
      </div>
    );
  }

  renderReply() {
    return (
      <div className="comments-item-reply">
        <Components.CommentsNewForm
          postId={this.props.comment.postId}
          parentComment={this.props.comment}
          successCallback={this.replySuccessCallback}
          cancelCallback={this.replyCancelCallback}
          type="reply"
        />
      </div>
    );
  }

  renderEdit() {
    return (
      <Components.CommentsEditForm
        comment={this.props.comment}
        successCallback={this.editSuccessCallback}
        cancelCallback={this.editCancelCallback}
        removeSuccessCallback={this.removeSuccessCallback}
      />
    );
  }

  render() {
    const { comment, currentUser } = this.props;

    return (
      <div className="comments-item" id={comment._id}>
        <div className="comments-item-body">
          <div className="comments-item-meta">
            <div className="comments-item-vote">
              <Components.Vote collection={Comments} document={comment} currentUser={currentUser} />
            </div>
            <Components.UsersAvatar size="small" user={comment.user} />
            <Components.UsersName user={comment.user} />
            <div className="comments-item-date">{moment(new Date(comment.postedAt)).fromNow()}</div>
            {Users.canUpdate({ collection: Comments, user: currentUser, document: comment }) && (
              <div>
                <a className="comment-edit" onClick={this.showEdit}>
                  <FormattedMessage id="comments.edit" />
                </a>
              </div>
            )}
          </div>
          {this.state.showEdit ? this.renderEdit() : this.renderComment()}
        </div>
        {this.state.showReply ? this.renderReply() : null}
      </div>
    );
  }
}

CommentsItem.propTypes = {
  comment: PropTypes.object.isRequired, // the current comment
  currentUser: PropTypes.object,
  flash: PropTypes.func,
};

registerComponent({ name: 'CommentsItem', component: CommentsItem, hocs: [withMessages] });