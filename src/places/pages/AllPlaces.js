import React, { useEffect, useState } from 'react';

import PlaceList from '../components/PlaceList';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useHttpClient } from '../../shared/hooks/http-hook';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';

const AllPlaces = () => {

    const { isLoading, error, sendRequest, clearError} = useHttpClient();
    const [loadedPlaces, setLoadedPlaces] = useState();

    useEffect(() => {
        const fetchPlaces = async () => {
          try {
            const responseData = await sendRequest( `${process.env.REACT_APP_BACKEND_URL}/places`);
            setLoadedPlaces(responseData.places);
          } catch (err) {
              console.log(err)
          }
        };
        fetchPlaces();
      }, [sendRequest]);

    const placeDeletedHandler = (deletedPlaceId) => {
      setLoadedPlaces(prevPlaces => prevPlaces.filter(place => place.id !== deletedPlaceId))
    };


    return (
        <React.Fragment>
            {/* <ErrorModal error={error} onClear={clearError}/> */}
            {isLoading && (
                <div className='center'>
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && !loadedPlaces && ( 
              <div className='place-list center'>
                <Card>
                 <h2>No places found.</h2>
                 <Button to='/places/new'>Share Place</Button>
                </Card>
              </div>)}
           {!isLoading && loadedPlaces && <PlaceList buttons={false} items={loadedPlaces} onDeletePlace={placeDeletedHandler}/> }
        </React.Fragment> 
    ) 
};

export default AllPlaces;