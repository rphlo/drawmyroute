import React from "react";
import { capitalizeFirstLetter } from "../utils";

const CommentsModal = (props) => {
  const comments = props.comments.reverse();
  return (
    <div
      className="modal"
      role="dialog"
      style={{ display: "block", zIndex: 1e19 }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header" style={{ padding: "35px 50px" }}>
            <h4>
              <i className="fa fa-comment"></i> Comments
            </h4>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={props.onClose}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body" style={{ padding: "40px 50px" }}>
            {props.comments.length === 0 && (<div><b>No Comments</b><hr/></div>)}
            {props.comments.reverse().map((comment) => (
              <div key={comment.creation_date}>
                <span style={{fontWeight: 'bold'}}>{comment.user.username === props.username ? "You" : (comment.user.first_name && comment.user.last_name ?
        capitalizeFirstLetter(comment.user.first_name) +
        " " +
        capitalizeFirstLetter(comment.user.last_name)
        : comment.user.username)}</span>
                <p>{comment.message}</p>
                <hr/>
              </div>
            ))}
            {props.canComment ? (<form onSubmit={props.onComment}>
              <textarea className="form-control mb-3" name="message"></textarea>
              <button className="btn btn-primary">Submit</button>
            </form>) : (<div>Login to comment</div>)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;
