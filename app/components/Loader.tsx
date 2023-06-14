import React from 'react'
import ReactLoading from 'react-loading';

interface InputProps {
  height: string
  width: string
}
const Loader: React.FC<InputProps> = ({ height, width }) => {
  return (
    <ReactLoading type={'spin'} color="#6d94c6" height={height} width={width} />
  )
}

export default Loader