import { useState } from "react";

// eslint-disable-next-line
export const useFetch = <T>(cb: any) => {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [data, setData] = useState(null)
    // eslint-disable-next-line
    const fn = async (...args: any[]) => {

        setLoading(true)
        try {
            const res = await cb(...args)

            setData(res)
            // eslint-disable-next-line
        } catch (error: any) {
            setError(error.message)
        }
        setLoading(false)
    }
    return {
        loading,
        error,
        data, setData
        , fn
    }
}