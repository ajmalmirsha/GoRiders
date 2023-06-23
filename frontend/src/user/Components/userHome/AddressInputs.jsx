
import './addressInput.css'
import img from '../../../images/address-input/car-bg-remove.png'
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.min.css";

import { useEffect, useState } from 'react';
import { userApi } from '../../../utils/Apis';
export default function AddressInputs ({ handleSubmit }) {
    const [ pickDate, setPickDate] = useState(null)
    const [ dropDate, setDropDate] = useState(null)
    const [ pickDatePlaceHolder, setpickDatePlaceHolder ] = useState(null)
    const [ dropDatePlaceHolder, setdropDatePlaceHolder ] = useState(null)
    const [ placeOptions, setPlaceOption] = useState([])
    const [ place, setPlace ] = useState({})
    useEffect(()=> {
        userApi.get('/available-places').then( ({data:{data}}) => {
           setPlaceOption(data)
        })
    },[])
    // const placeOptions = [
    //         { value: 'chocolate', label: 'Chocolate' },
    //         { value: 'strawberry', label: 'Strawberry' },
    //         { value: 'vanilla', label: 'Vanilla' }
    // ]
    function handleStartDateChange (dateStr) {
        const date = new Date(dateStr);
        console.log(new Date(),new Date(pickDate).setHours(18, 0),'sdjg');
        const options = { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
        const formattedDateTime = date.toLocaleString('en-US', options);
        
        console.log(formattedDateTime);
        setpickDatePlaceHolder(formattedDateTime)
        setPickDate(dateStr);
    }
    function handleDropDateChange (dateStr) {
        const date = new Date(dateStr);
        
        const options = { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
        const formattedDateTime = date.toLocaleString('en-US', options);
        
        console.log(formattedDateTime);
        setdropDatePlaceHolder(formattedDateTime)
        setDropDate(dateStr);
    }
    const CustomPlaceholder = (props) => (
        <div className='text-secondary'>
         <FontAwesomeIcon className='me-2' icon={faLocationDot} /> 
          <span  >Choose a location</span> 
        </div>
      );
    // handle place change
    const handlePlaceChange = (data) => {
        setPlace(data)
    }

    // handle user vehicle search 
  
    return (
      <div className="address-input-secssion gap-0 row">
         <div className="col-md-9 d-flex px-5   align-items-center">
            <div className="bg-light main-input-wrapper w-100 h-25 shadow row d-flex align-items-center">
             <div className="col-md-4">  
              <Select
                className="basic-single "
                classNamePrefix="select"
                isClearable={true}
                isSearchable={true}
                onChange={handlePlaceChange}
                name="place"
                components={{ Placeholder: CustomPlaceholder }}
                options={placeOptions}
                styles={{
                    menu: (provided) => ({
                      ...provided,
                      maxHeight: '200px',
                      overflow: 'auto',
                      zIndex: 9999,
                    }),
                  }}
              />
             </div>
             <div className="col-md-3">  
             <DatePicker
                 onChange={handleStartDateChange}
                 showTimeSelect
                 minDate={new Date()}
                 maxDate={ dropDate && dropDate }
                 minTime={new Date().setHours(0, 0, 0, 0)}
                 maxTime={ dropDate ? new Date(dropDate).setHours(18, 0) : new Date().setHours(18, 0)}
                 placeholderText={  pickDatePlaceHolder ? pickDatePlaceHolder : 'Pick-up date'}
                 calendarClassName="bg-white shadow-lg rounded-lg py-4 px-2 "
                 className="form-control  text-xl bg-slate-200 h-100 d-block"
                 popperClassName="custom-datepicker"
             />
             </div>
             <div className="col-md-3">  
             <DatePicker
                 onChange={handleDropDateChange}
                 showTimeSelect
                 minDate={ pickDate ? pickDate : new Date()}
                 minTime={ pickDate ? new Date(pickDate).setHours(18, 0) : new Date().setHours(18, 0)}
                 maxTime={new Date().setHours(23, 59, 59, 999)}
                 placeholderText={  dropDatePlaceHolder ? dropDatePlaceHolder : 'Drop-off date'}
                 calendarClassName="bg-white shadow-lg rounded-lg py-4 px-2 "
                 className="form-control  text-xl bg-slate-200 h-100 d-block"
                 popperClassName="custom-datepicker"
             />
             </div>
             <div className="col-md-2">
                <button onClick={()=> {handleSubmit(place.value,pickDate,dropDate)}} className='search-btn w-100 text-white' >Search</button>
             </div>
            </div>
         </div>
         <div className="col-md-3 d-flex justify-content-start p-0 m-0 align-items-center">
            <img className='w-100' src={img} alt="" />
         </div>
      </div>
    )
}