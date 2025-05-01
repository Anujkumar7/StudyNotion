import React from 'react'
import HighlightText from '../Homepage/HighlightText'

const Quote = () => {
  return (
    <div>
      We are passionate about revolutionzing the way we learn. Our innovative platform
      <HighlightText text={"combines technology"}/>

        <span className='text-brown-500'>
            {" "}
            expertise
        </span>
        , and community to create an
        <span className='text-brown-500'>
            {" "}
            unparalledled educational experience.
        </span>

    </div>
  )
}

export default Quote
