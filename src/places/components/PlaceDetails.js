import React, { useState, useEffect, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import { useParams } from 'react-router-dom';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import { AuthContext } from '../../shared/context/auth-context';
// import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './PlaceDetails.css';
import { MdWc } from 'react-icons/md';
import { GiSpikedFence } from 'react-icons/all'


const PlaceDetails = props => {
const { isLoading, sendRequest} = useHttpClient();
const auth = useContext(AuthContext);
const [loadedPlace, setLoadedPlace] = useState();
const [ratePlace, setRatePlace] = useState(true);
const placeId = useParams().id;
const [showMap, setShowMap] = useState(false);
    useEffect(() => {
        const fetchPlaces = async () => {
          try {
            const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`);
            setLoadedPlace(responseData.place)
          } catch (err) {
              console.log(err)
          }
        };
        fetchPlaces();
      }, [sendRequest, setLoadedPlace, placeId]);
      if (loadedPlace) {
      }

    const openMapHandler = () => setShowMap(true);

    const closeMapHandler = () => setShowMap(false);

    const changeHandler = async (event) => {
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
                    <input type="radio" id="star5" name="rate" value="5" onChange={changeHandler}/>
                    <label htmlFor="star5" title="text">5 stars</label>
                    <input type="radio" id="star4" name="rate" value="4" onChange={changeHandler}/>
                    <label htmlFor="star4" title="text">4 stars</label>
                    <input type="radio" id="star3" name="rate" value="3" onChange={changeHandler}/>
                    <label htmlFor="star3" title="text">3 stars</label>
                    <input type="radio" id="star2" name="rate" value="2" onChange={changeHandler}/>
                    <label htmlFor="star2" title="text">2 stars</label>
                    <input type="radio" id="star1" name="rate" value="1" onChange={changeHandler}/>
                    <label htmlFor="star1" title="text">1 star</label>
                </div> 
            </React.Fragment>  
            )
    } else {
        rate = <h5>Your vote has been counted</h5>
    }

    return ( 
        <React.Fragment>
            {loadedPlace && <Card className='place-item__content'> 
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
                     {isLoading && <LoadingSpinner asOverlay />}
                    <div className='place-item__image'>
                        <img id='image' src={`${process.env.REACT_APP_ASSET_URL}/${loadedPlace.image}`} alt={loadedPlace.title}/>
                    </div> 
                    <div className='place-item__info item-details'>
                        <h2 style={{'display': 'inline-block'}}>{loadedPlace.address}</h2>     
                        <Button float inverse onClick={openMapHandler}>VIEW ON MAP</Button>
                        <p>Description: {loadedPlace.description}</p>
                            <p>Safety Level: {loadedPlace.safety}.</p>
                            {loadedPlace.publicWC && <MdWc title='WC' className='icon'/> }
                            {loadedPlace.fence && < GiSpikedFence title="Has Fence around it" className='icon'/> }
                            {rate}
                    </div> 
                </Card>
                  }
        </React.Fragment>
    ) 
}

export default PlaceDetails;