import React, { useState, useEffect, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import { useParams } from 'react-router-dom';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import { AuthContext } from '../../shared/context/auth-context';
import { VALIDATOR_MINLENGTH } from '../../shared/util/validators';
// import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './PlaceDetails.css';
import { MdWc } from 'react-icons/md';
import { GiSpikedFence } from 'react-icons/all'
import Input from '../../shared/components/FormElements/Input';
import { useForm } from '../../shared/hooks/form-hook';
import UserComments from '../../shared/components/FormElements/UserComments';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';


const PlaceDetails = props => {
const {isLoading, sendRequest} = useHttpClient();
const auth = useContext(AuthContext);
const [loadedPlace, setLoadedPlace] = useState();
const [showComments, setShowComments] = useState(false);
const [ratePlace, setRatePlace] = useState(true);
const placeId = useParams().id;
const [showMap, setShowMap] = useState(false);
    useEffect(() => {
        fetchPlaces();
      }, [sendRequest, setLoadedPlace, placeId]);
      const fetchPlaces = async () => {
        try {
          const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`);
          setLoadedPlace(responseData.place)
        } catch (err) {
            console.log(err)
        }
      };

      const commentDeletedHandler = () => {
        setShowComments(prevComments => prevComments? prevComments: !prevComments)
      };

    let commentsList;
    if (loadedPlace) {
    if (loadedPlace.comments) {
        commentsList = <UserComments data={loadedPlace.comments} placeId={placeId} onDeleteComment={commentDeletedHandler}/>
    } else {
        commentsList = <h5>No comments yet</h5>
    }
    }

    const openMapHandler = () => setShowMap(true);

    const closeMapHandler = () => setShowMap(false);

    const onRatePlace = async (event) => {
        try {
            await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/rate/${placeId}`, 'PATCH', JSON.stringify({
                rating: event.target.value,
                userId: auth.userId
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                });
                setRatePlace(false);
        } catch (err) {
            console.log(err);
        }
    }

    let rate;
    if (ratePlace) {
        rate = (
            <React.Fragment>
                <p>Rate this place!</p>
                <div className="rate">
                    <input type="radio" id="star5" name="rate" value="5" onChange={onRatePlace}/>
                    <label htmlFor="star5" title="text">5 stars</label>
                    <input type="radio" id="star4" name="rate" value="4" onChange={onRatePlace}/>
                    <label htmlFor="star4" title="text">4 stars</label>
                    <input type="radio" id="star3" name="rate" value="3" onChange={onRatePlace}/>
                    <label htmlFor="star3" title="text">3 stars</label>
                    <input type="radio" id="star2" name="rate" value="2" onChange={onRatePlace}/>
                    <label htmlFor="star2" title="text">2 stars</label>
                    <input type="radio" id="star1" name="rate" value="1" onChange={onRatePlace}/>
                    <label htmlFor="star1" title="text">1 star</label>
                </div> 
            </React.Fragment>  
            )
    } else {
        rate = <h5>Your vote has been counted</h5>
    }

    const [formState, inputHandler] = useForm({
        comment: {
          value: '',
          isValid: false
        },
    })

    const reviewSumbitHandler = async (event) => {
        event.preventDefault();
        const comments = {
            comment: formState.inputs.comment.value,
            userId: auth.userId
        };
        await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/comment/${placeId}`, 'PATCH', JSON.stringify(
            comments),
            {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + auth.token
            });
            fetchPlaces();
    };

    const [imageState, uploadHandler] = useForm({
        image: {
          value: '',
          isValid: null
        }
    });

    let commentsText = (
        <form className='place-form comment-input' onSubmit={reviewSumbitHandler}>
        <Input
        id='comment' 
        element='textarea' 
        label='ADD YOUR REVIEW' 
        validators={[VALIDATOR_MINLENGTH(5)]}
        onInput={inputHandler} 
        errorText='Please enter a valid description (min 5 characters)'/>
        <Button disabled={!formState.isValid}>ADD YOUR COMMENT</Button>
    </form>
    );

    const onShowComments = () => {
        showComments? setShowComments(false): setShowComments(true);
    }

    const onAddImage = async event => {
        event.preventDefault();
            try {
                const formData = new FormData();
                formData.append('image', imageState.inputs.image.value);
                await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/pictures/${placeId}`, 'POST', formData, {
                    Authorization: 'Bearer ' + auth.token
                  });
            } catch (err) {
                console.log(err);
                }
            }
            
    
    return ( 
        <React.Fragment>
            {loadedPlace && (
                <Card className='place-item__content'> 
                    <Modal 
                        show={showMap} 
                        onCancel={closeMapHandler} 
                        header={loadedPlace.address}
                        contentClass='place-item__modal-content'
                        footerClass='place-item__modal-actions'
                        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}>
                        <div className='map-container'>
                            <Map center={loadedPlace.location} zoom={16}/>
                        </div> 
                    </Modal> 
                        {isLoading && <LoadingSpinner asOverlay/>}
                        <div className='place-item__image'>
                            <img id='image' src={`${process.env.REACT_APP_ASSET_URL}/${loadedPlace.image[0]}`} alt={loadedPlace.title}/>
                        </div>
                        <div>
                            <div className='place-item__info item-details'>
                                <h2 style={{'display': 'inline-block'}}>{loadedPlace.address}</h2>     
                                <Button float inverse onClick={openMapHandler}>VIEW ON MAP</Button>
                                <p>Description: {loadedPlace.description}</p>
                                    <p>Safety Level: {loadedPlace.safety}.</p>
                                    {loadedPlace.publicWC && <MdWc title='WC' className='icon'/> }
                                    {loadedPlace.fence && < GiSpikedFence title="Has Fence around it" className='icon'/> }
                                    {rate}
                            </div>
                            <div className='image-form'>
                                <form onSubmit={onAddImage}>
                                    <ImageUpload center id="image" onInput={uploadHandler} errorText='Please provide an image'/>
                                    <Button type='submit' disabled={!imageState.isValid}>ADD IMAGE</Button>
                                </form>
                            </div>
                        </div>
                        {auth.isLoggedIn && commentsText}
                        <h2>Users Reviews</h2>
                        <Button className='margin' onClick={onShowComments}>Show Reviews</Button>
                        {showComments && commentsList}
                </Card>
            )}
        </React.Fragment>
    ) 
}

export default PlaceDetails;