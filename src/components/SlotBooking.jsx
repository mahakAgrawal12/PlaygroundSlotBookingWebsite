import React from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { DatePicker } from '@mui/x-date-pickers';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import TextField from '@mui/material/TextField';
import './Slotbooking.css'
import Checkbox from '@mui/material/Checkbox';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { format } from 'date-fns';

const SlotBooking = () => {
const currentDate = new Date();
const maxDate = new Date();
maxDate.setDate(currentDate.getDate() + 30);
const formattedCurrentDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
    console.log(formattedCurrentDate)
    var navigate = useNavigate()
    const[show,setShow]=useState()
    const [selectedDate, setSelectedDate] = useState(null);
    var token = localStorage.getItem(token)
    var ground = useSelector((state) => state.ground)
    // var index = useSelector((state) => state.index)
    var image = useSelector((state) => state.image)
    var username = useSelector((state) => state.username)
    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
    var params = useParams()
    var index = params.index;
    const[status,setStatusinit]=useState(true)
    const [dates, setDate] = useState([])
    const [slots, setSlots] = useState([])
    const [bookedslots, setpostSlots] = useState([])
    const [Time, setTimeArray] = useState([])
    const [bookstatus, setStatus] = useState(true)
    const [postslot, setPost] = useState({
        username: username, name: ground[index], date: "", slot: []
    })
    // var p=false
    const { date, slot } = postslot
    bookedslots?.map((slots)=>{
        if (slots.username==username){
            p=true
        }
    })
    function getvalue(e) {
        // console.log(Time)
        const currentIndex = selectedCheckboxes.indexOf(e.target.value);
        const newCheckboxes = [...selectedCheckboxes];
        // const newCheckboxes = selectedCheckboxes;

        if (currentIndex === -1) {
            newCheckboxes.push(e.target.value);
        } else {
            newCheckboxes.splice(currentIndex, 1);
        }

        setSelectedCheckboxes(newCheckboxes);
        // setPost({ ...postslot, [e.target.name]: e.target.value })
        if(!selectedCheckboxes){
           
            setShow(false)
        }
        // console.log(postslot)
        e.preventDefault()


    }
    function newSlot(d, id, difference,idr) {
        // console.log(slt)
        console.log(idr)
        // console.log(d)
        var obj = {
            name: ground[index],
            date: d,
            slot: difference
        }
        console.log(obj)
        axios({
            method: "put",
            url: `http://localhost:3003/slots/${id}`,
            data: obj
        }).then((res) => {

            navigate(`/bookingdetails/${idr}/${index}`)
        }, (error) => {
            alert("Database not connected")
        })


    }
    var p=1
    function bookSlot(e) {
        postslot.slot = selectedCheckboxes
        e.preventDefault()
        axios({
            method: "post",
            url: ("http://localhost:3003/postslots"),
            data: postslot,
            headers: {
                Authorization: localStorage.token
            }
        }).then((res) => {
            if (localStorage.getItem(token) != null) {
                navigate("/login")
            }
            else {
                {
                    var idr=res.data.id
                    Swal.fire("Welcome", "You booked your slot successfully", "success");
                    var difference = []
                    var id, d

                    slots?.map((slot) => {
                        if (slot.name == postslot?.name && slot.date == postslot?.date) {
                            var arr1=slot.slot
                            var arr2=postslot?.slot
                            difference = arr1.filter(item => !arr2.includes(item));
                            console.log(difference)
                            // console.log(slot.id)
                            id = slot.id
                            d = slot.date
                        }


                    })
                }

            }
            newSlot(d, id, difference,idr)


        }, (error) => {
            navigate("/login")
            alert("Database not connected")
        })

    
}
function viewSlot (e) {
        e.preventDefault()
        // console.log(e.target.value)
        // setDate(e.target.value)
        setPost({ ...postslot, [e.target.name]: e.target.value })
        slots?.map((slot) => {
            if (slot.date == (e.target.value) && slot.name == postslot?.name) {

                setTimeArray(slot.slot)
            }
        })
        
    }
    useEffect(() => {
        axios({
            method: "get",
            url: "http://localhost:3003/slots"

        }).then((res) => {
            setSlots(res.data)
            console.log(res.data)
            
        }, (error) => {
            alert("Database not connected")
        })
    }, [])
    useEffect(() => {
        axios({
            method: "get",
            url: "http://localhost:3003/postslots"

        }).then((res) => {
            const da=format(currentDate, 'yyyy-MM-dd')
                var p = 0;
                slots?.map((slot) => {
                    console.log(slot.date,slot.name,da )
                    if (slot.date === (da) && slot.name === postslot?.name) {
                        p=1
                        setTimeArray(slot.slot)
                    }
                    
                })
                setStatusinit(true)
            setpostSlots(res.data)
            
        }, (error) => {
            alert("Database not connected")
        })
    }, [])



    return (
        <div>
            <form className="main1">
                <div className="main">
                <h4 className="gro">{ground[index]}</h4>
                <img src={image[index]} style={{ height: "50vh", width: "60vh" }} className="image6"></img>
                </div>
          
          <LocalizationProvider dateAdapter={AdapterDateFns}>
          <div className="date">
            <DatePicker 
            maxDate={maxDate}
            defaultValue={currentDate}
            // defaultValue={formattedCurrentDate}
            // label={formattedCurrentDate}
              sx={{
                '& .MuiSvgIcon-root': {
                    color:" #a3712a",
                    fontSize: 40, // Increase the font size of the checkbox icon
                  }
                 
                
              }}
              className="myDatePicker"
            //   value ={selectedDate}
            //   slotProps={{ textField: { fullWidth: true } }}

              renderinput={(params) => <TextField {...params} />} 
              onChange={(newValue) => {
                setStatusinit(true)
                const d=format(newValue, 'yyyy-MM-dd')
                setPost({ ...postslot, 'date': d});
                var p = 0;
                slots?.map((slot) => {
                    console.log(slot.date,slot.name,d )
                    if (slot.date === (d) && slot.name === postslot?.name) {
                        p=1
                        setTimeArray(slot.slot)
                    }
                    
                })
                if (p==0){
                    setStatusinit(false)
                }
              }} disablePast
            />
            <br /><br />
            </div>
          </LocalizationProvider>
          
    
                {/* <button className="btn btn-primary" onClick={viewSlot}>See slots</button> */}
                <div>{
                    ((status)?
                    <>
                    {
                    Time?.map((slot, index) => {
                        // setStatusinit(false)
                        return (
                            <div className="checkb">
                                <FormGroup>
  <FormControlLabel control={<Checkbox type="checkbox" sx={{
    '& .MuiSvgIcon-root': {
        color:" #a3712a",
        fontSize: 40, // Increase the font size of the checkbox icon
      }
  }} value={slot} name="slot" onChange={ getvalue } checked={selectedCheckboxes.includes(slot)} />} label={<p
    sx={{
      color:"black",
      fontSize: 100, // Increase the font size of the label
    }}
  >
    {slot}
  </p>} />
</FormGroup>
                            </div>

                        )
                    })
                    }
                </>

                :<div style={{marginLeft:"580px", marginBottom:"50px"}}>
                    <h4>No slots Available</h4>
                {/* {setStatusinit(true)} */}
                </div>
                )
                    
                }</div>
                {/* <div>
                    

                    {Time?.map((slot, index) => {
                        return (
                            <div className="checkb">
                                <FormGroup>
  <FormControlLabel control={<Checkbox type="checkbox" color='secondary' value={slot} name="slot" onChange={ getvalue } checked={selectedCheckboxes.includes(slot)} />} label={slot} />
</FormGroup>
                            </div>

                        )
                    })
                    }
                

                </div> */}







                {/* <DatePicker label="Controlled picker" 
  value={value}
  onChange={getvalue} /> */}
            <div>
            <button class="btn-2 btn-primary me-2" onClick={bookSlot} disabled={show ? true : false} >Book</button>
            </div>
            </form>
        </div>
    )
}

export default SlotBooking


// import React, { useState } from 'react';

// const CheckboxList = () => {
//   const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

//   const handleCheckboxChange = (value) => {
//     const currentIndex = selectedCheckboxes.indexOf(value);
//     const newCheckboxes = [...selectedCheckboxes];

//     if (currentIndex === -1) {
//       // Checkbox is not currently selected, so add it to the array
//       newCheckboxes.push(value);
//     } else {
//       // Checkbox is already selected, so remove it from the array
//       newCheckboxes.splice(currentIndex, 1);
//     }

//     setSelectedCheckboxes(newCheckboxes);
//   };

//   const fruits = ['apple', 'banana', 'orange'];

//   return (
//     <div>
//       {fruits.map((fruit) => (
//         <div key={fruit}>
//           <input
//             type="checkbox"
//             value={fruit}
//             checked={selectedCheckboxes.includes(fruit)}
//             onChange={() => handleCheckboxChange(fruit)}
//           />
//           {fruit}
//         </div>
//       ))}
//       <p>Selected Fruits: {selectedCheckboxes.join(', ')}</p>
//     </div>
//   );
// };

// export default CheckboxList;

