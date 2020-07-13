import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import { Link } from 'react-router-dom';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import { AuthContext } from '../../shared/context/auth-context';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './PlaceItem.css'
import { FaWater } from 'react-icons/fa';
import { MdWc } from 'react-icons/md';
import { GiSpikedFence, FaPizzaSlice, BsStarFill } from 'react-icons/all'

const PlaceItem = props => {
    const { isLoading, error, sendRequest, clearError} = useHttpClient();
    const auth = useContext(AuthContext);
    const [showMap, setShowMap] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const openMapHandler = () => setShowMap(true);

    const closeMapHandler = () => setShowMap(false);

    const showDeleteWarningHandler = () => {
        setShowConfirmModal(true);
    }

    const cancelDeleteHandler = () => {
        setShowConfirmModal(false);
    }

    const confirmDeleteHandler = async () => {
        setShowConfirmModal(false);
        try {
            await sendRequest(process.env.REACT_APP_BACKEND_URL +`/places/${props.id}`, 'DELETE', null, 
            {
                Authorization: 'Bearer ' + auth.token
              });
            props.onDelete(props.id);
        } catch (err) {}
    }

    let placeDescription;
    const desLength = 90;
    if (props.description.length > desLength) {
        placeDescription = props.description.substring(0, desLength) + '...'; 
    } else {
        placeDescription = props.description;
    }
    let myStars;
    if (props.rating) {
        let length = Math.round(props.rating);
        if (length === 1) {
            myStars = <div className='stars-div'><BsStarFill className='gold'/></div>;
        } else if (length === 2) {
            myStars = <div className='stars-div'><BsStarFill className='gold'/><BsStarFill className='gold'/></div>;
        } else if (length === 3) {
            myStars = <div className='stars-div'><BsStarFill className='gold'/><BsStarFill className='gold'/></div>;
        } else if (length === 4) {
            myStars = <div className='stars-div'><BsStarFill className='gold'/><BsStarFill className='gold'/><BsStarFill className='gold'/><BsStarFill className='gold'/></div>;
        } else {
            myStars = <div className='stars-div'><BsStarFill className='gold'/><BsStarFill className='gold'/><BsStarFill className='gold'/><BsStarFill className='gold'/><BsStarFill className='gold'/></div>;
        }
    }

    let itemClass;
    if (props.width === '65%') {
        itemClass = 'place-item-wide';
    } else {
        itemClass = 'place-item';
    }
    
    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <Modal 
                show={showMap} 
                onCancel={closeMapHandler} 
                header={props.address}
                contentClass='place-item__modal-content'
                footerClass='place-item__modal-actions'
                footer={<Button onClick={closeMapHandler}>CLOSE</Button>}>
                <div className='map-container'>
                    <Map center={props.coordinates} zoom={16}/>
                </div> 
            </Modal>
            <Modal
                show={showConfirmModal}
                onCancel={cancelDeleteHandler} 
                header='Are you sure?' 
                footerClass='place-item__modal-actions' 
                footer={
                <React.Fragment>
                    <Button inverce onClick={cancelDeleteHandler}>CANCEL</Button>
                    <Button danger onClick={confirmDeleteHandler}>DELETE</Button>
                </React.Fragment>
            }>
                <p>Do you want to proceed and delete your place?</p>
            </Modal>
            <li className={itemClass}>
                <Card className='place-item__content'>
                    {isLoading && <LoadingSpinner asOverlay />}
                    <div className='place-item__image'>
                        <Link 
                            to={`/places/details/${props.id}`}
                        ><img src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.title} />
                        </Link>
                      
                    </div>
                    <div className='place-item__info'>
                        <h2 >{props.title}</h2>
                        <div className='black-panel'>
                            {props.publicWC && <MdWc className='icon' />}
                            {props.fence && <GiSpikedFence className='icon'/> }
                            {props.foodDrink && <FaPizzaSlice className='icon'/> }
                            {props.waterSurface && <FaWater className='icon'/> }
                            {myStars}
                        </div>
                        <h3>{props.address}</h3>
                        <p>{placeDescription}</p>
                    </div>
                    <div className='place-item__actions'>
                        <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
                        <Button to={`/places/details/${props.id}`}>DETAILS</Button>
                        {auth.userId === props.creator && props.buttons && <Button to={`/places/${props.id}`}>EDIT</Button> }
                        {auth.userId === props.creator && props.buttons
                         &&  <Button danger onClick={showDeleteWarningHandler}>DELETE</Button>}
                    </div>
                </Card>
            </li>
        </React.Fragment>
    ) 
}

export default PlaceItem;