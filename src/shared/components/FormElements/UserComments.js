import React, { useContext, useEffect, useState } from 'react';

import './UserComments.css'
import { AuthContext } from '../../context/auth-context';
import { useHttpClient } from '../../hooks/http-hook';
import Modal from '../UIElements/Modal';
import Button from './Button';


const UserComments = (props) => {
    const auth = useContext(AuthContext);
    const {sendRequest} = useHttpClient();
    const [loadedComments, setLoadedComment] = useState();
    const [commentId, setCommentId] = useState();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    
  useEffect(() => {
      fetchComments();
    }, [sendRequest]);

    const fetchComments = async () => {
      try {
        const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${props.placeId}`);
        setLoadedComment(responseData.place.comments);
      } catch (err) {
          console.log(err)
      }
    };

  const deleteItem = async () => {
      console.log(commentId);
      try {
          await sendRequest(process.env.REACT_APP_BACKEND_URL +`/places/comments/${props.placeId}/${commentId}`, 'DELETE', null, 
          {
              Authorization: 'Bearer ' + auth.token
            });
          setLoadedComment(prevComments => prevComments.filter(comment => comment.id !== commentId));
          props.onDeleteComment();
          setShowConfirmModal(false);
      } catch (err) {}     
  }

  const showDeleteWarningHandler = (event) => {
    const el = event.currentTarget;
    const elementId = el.getAttribute('id');
    setCommentId(elementId);
    setShowConfirmModal(true);
  }

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  }
    
  return (
      <React.Fragment>
            <Modal
                show={showConfirmModal}
                onCancel={cancelDeleteHandler} 
                header='Are you sure?' 
                footerClass='place-item__modal-actions' 
                footer={
                <React.Fragment>
                    <Button inverce onClick={cancelDeleteHandler}>CANCEL</Button>
                    <Button danger onClick={deleteItem}>DELETE</Button>
                </React.Fragment>
            }>
                <p>Do you want to proceed and delete your place?</p>
            </Modal>
          {loadedComments && loadedComments.length === 0 && <h3>No comments added yet</h3>}
          {loadedComments && loadedComments.map(prop => (
          <div className='comment-box' key={prop.id}>
              <span>User name: {prop.userName}</span>
              <span className='delete' id={prop.id} onClick={showDeleteWarningHandler}>X</span>
              <p>content: {prop.comment}</p>
          </div>
    ))}
      </React.Fragment>
  )
};

export default UserComments;