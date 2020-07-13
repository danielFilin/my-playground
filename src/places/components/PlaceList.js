import React from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button'
import PlaceItem from './PlaceItem';
import './PlaceList.css'

const PlaceList = props => {

    if (props.items.length === 0) {
        return <div className='place-list center'>
            <Card>
                <h2>No places found.</h2>
                <Button to='/places/new'>Share Place</Button>
            </Card>
        </div>
    }

    return (
        <div>
               <h1 style={{color: 'yellow', border: '2px solid red', margin: '2rem'}}>Current Heroku deployment deletes all images if the app is inactive for 30 mintues</h1>
            {props.items.map(place => (
                <PlaceItem
                    buttons={props.buttons} 
                    width={props.width}
                    to={place.id}
                    key={place.id} 
                    id={place.id} 
                    image={place.image[0]} 
                    title={place.title} 
                    description={place.description} 
                    address={place.address} 
                    creator={place.creator}
                    publicWC={place.publicWC}
                    fence={place.fence}
                    foodDrink={place.foodDrink}
                    waterSurface={place.waterSurface} 
                    coordinates={place.location}
                    rating={place.avgStars}
                    comments={place.comments}
                    onDelete={props.onDeletePlace}/>
                )
            )} 
        </div>
    )   
}


export default PlaceList;