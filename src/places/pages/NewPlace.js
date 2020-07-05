import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import './PlaceForm.css';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext} from '../../shared/context/auth-context';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';


const NewPlace = () => {

  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError} = useHttpClient();
  const [addressType, setAddressType] = useState(false);
  const [formState, inputHandler] = useForm({
    title: {
      value: '',
      isValid: false
    },
    description: {
      value: '',
      isValid: false
    },
    address: {
      value: '',
      isValid: false
    },
    fence: {
      value: false,
      isValid: true
    },
    foodDrink: {
      value: false,
      isValid: true
    },
    waterSurface: {
      value: false,
      isValid: true
    },
    safety: {
      value: 'safe',
      isValid: false
    },
    image: {
      value: null,
      isValid: false
  }
  }, false);
  const history = useHistory();

  const placeSumbitHandler = async event => {
    event.preventDefault();
    try {
      // console.log(formState.inputs.image.value)
      // const images = formState.inputs.image.value.map(el => {
      //   return el.pickedFile;
      // });
      let publicWC = formState.inputs.publicWC.value? true: false;
      let fence = formState.inputs.fence.value? true: false;
      let waterSurface = formState.inputs.waterSurface.value? true: false;
      let foodDrink = formState.inputs.foodDrink.value? true: false;
      
      const formData = new FormData();
      formData.append('title', formState.inputs.title.value);
      formData.append('description', formState.inputs.description.value);
      formData.append('address', formState.inputs.address.value);
      formData.append('safety', formState.inputs.safety.value || 'safe');
      formData.append('fence', fence);
      formData.append('waterSurface', waterSurface);
      formData.append('foodDrink', foodDrink);
      formData.append('publicWC', publicWC);
      formData.append('image', formState.inputs.image.value);
      //formData.append('image', images[0]);
      await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places`, 'POST', formData, {
        Authorization: 'Bearer ' + auth.token
      }
      );
      history.push('/');
    } catch (err) {}
   
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}/>
      <form className='place-form' onSubmit={placeSumbitHandler}>
        {isLoading && <LoadingSpinner asOverlay /> }
        <Input
          id='title' 
          element='input' 
          type='text' 
          label='Title' 
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler} 
          errorText='Please enter a valid title'/>
        <Input
          id='description' 
          element='textarea' 
          label='Description' 
          validators={[VALIDATOR_MINLENGTH(5)]}
          onInput={inputHandler} 
          errorText='Please enter a valid description (min 5 characters)'/>
         <h4>Additional information</h4> 
        <Input
          id='fence' 
          element='checkbox' 
          label='HAS FENCE' 
          validators={[]}
          onInput={inputHandler} />
        <Input
          id='publicWC' 
          element='checkbox' 
          label='public WC nearby' 
          validators={[]}
          onInput={inputHandler} />
        <Input
          id='waterSurface' 
          element='checkbox' 
          label='Water surface' 
          validators={[]}
          onInput={inputHandler} />
          <br/><br/>
        <Input
          id='foodDrink' 
          element='checkbox' 
          label='Food and drinks availible' 
          validators={[]}
          onInput={inputHandler} />
        <Input
          id='safety' 
          element='select' 
          label='Safety' 
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler}/>
        <Input
          id='address' 
          element='input' 
          label='Insert address, or simply share your location' 
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler} 
          errorText='Please enter a valid address'/>
        {/* <Input
          id='location' 
          element='radio' 
          label='Share Location' 
          validators={[]}
          onInput={inputHandler} /> */}
          <ImageUpload center id="image" onInput={inputHandler} errorText='Please provide an image'/>
          <Button type='submit' disabled={!formState.isValid}>ADD PLACE</Button>
    </form>
    </React.Fragment>
  )
};

export default NewPlace;