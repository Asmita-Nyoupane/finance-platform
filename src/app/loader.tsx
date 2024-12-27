import React from 'react'
import { RingLoader } from 'react-spinners'

const Loader = () => {
    return (
        <div className='flex-center h-screen'>

            <RingLoader
                color={'brand-foreground'}

                size={150}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
    )
}

export default Loader
