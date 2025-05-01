import React from 'react'
import { useForm } from 'react-hook-form'

const ContactUsForm = () => {
    const [loading, setLoading] = useState(false);
    const{
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitSuccessful},
    } = useForm();

    return (
    <div>
      
    </div>
  )
}

export default ContactUsForm
