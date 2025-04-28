import React, { useState } from 'react'
import{ useSelector, useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom';
import {AiFillEyeInvisible, AiFillEye} from 'react-icons/ai'; 
import { Link } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';
import { resetPassword } from '../services/operations/authAPI';

const UpdatePassword = () => {

    const dispatch = useDispatch();
    const location = useLocation();

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setshowConfirmPassword] = useState(false)
    const {loading} = useSelector((state) => state.auth);

    const {password, confirmPassword} = formData;

    const handleOnChange = (e) => {
        setFormData((prevData) => (
            {
                // this ..prevData is used to get the previous data of the formData object
                ...prevData,
                //jis bhi field  ke saath interact karr rahe ho uski value ko update krr dena
                [e.target.name]: e.target.value,

            }
        ) )
    }

    const handleOnSubmit = (e) => {
        e.preventDefault()
        const token = location.pathname.split("/").at(-1);
        dispatch(resetPassword(password, confirmPassword, token));
    }
  return (
    <div>
      {
        loading ? (
            <div>
                Loading...
            </div>
        ) : (
            <div>
                <h1>Choose New Password</h1>
                <p>Almost Done. Enter your new password and youre all set.</p>
                <form onSubmit={handleOnSubmit}>

                    <label>
                        <p>New Password*</p>
                        <input
                            required
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter new password"
                            value={password}
                            onChange= {handleOnChange}
                            className='w-full p-6 bg-richblack-600 text-richblack-5'
                        />
                        <span
                        onClick={() => setShowPassword((prev) => !prev)}
                        >
                            {
                                showPassword ? <AiFillEyeInvisible fontSize={24}/> 
                                : <AiFillEye fontSize={24}/>
                                    
                            }
                        </span>
                    </label>

                    <label>
                        <p> Confirm New Password*</p>
                        <input
                            required
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange= {handleOnChange}
                            className='w-full p-6 bg-richblack-600 text-richblack-5'
                        />
                        <span
                        onClick={() => setshowConfirmPassword((prev) => !prev)}
                        >
                            {
                                showConfirmPassword ? <AiFillEyeInvisible fontSize={24}/> 
                                : <AiFillEye fontSize={24}/>
                                    
                            }
                        </span>
                    </label>
                    <button type='submit'>
                        Reset Password
                    </button>
                </form>
                <div className="mt-6 flex items-center justify-between">
                    <Link to="/login">
                    <p className="flex items-center gap-x-2 text-richblack-5">
                        <BiArrowBack /> Back To Login
                    </p>
                    </Link>
                </div>
            </div>
        )
          
      }
    </div>
  )
}

export default UpdatePassword
