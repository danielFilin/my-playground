import React, { useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useHttpClient } from '../../shared/hooks/http-hook';

const UserPlaces = () => {
    const { isLoading, error, sendRequest, clearError} = useHttpClient();
    const [loadedPlaces, setLoadedPlaces] = useState();
    const userId = useParams().userId;
    useEffect(() => {
        const fetchPlaces = async () => {
          try {
            const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`);
            setLoadedPlaces(responseData.places)
          } catch (err) {
              console.log(err)
          }
        };
        fetchPlaces();
      }, [sendRequest, userId]);

    const placeDeletedHandler = (deletedPlaceId) => {
      setLoadedPlaces(prevPlaces => prevPlaces.filter(place => place.id !== deletedPlaceId))
    };
 
    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            {isLoading && (
                <div className='center'>
                    <LoadingSpinner />
                </div>
            )}
           {!isLoading && loadedPlaces && <PlaceList width={'65%'} buttons={true} items={loadedPlaces} onDeletePlace={placeDeletedHandler}/> }
        </React.Fragment> 
    ) 
};

export default UserPlaces;