
import { useState } from "react"

export const useFetch = <T>(cb: any) => {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [data, setData] = useState(null)
    const fn = async (...args: any[]) => {

        setLoading(true)
        try {
            const res = await cb(...args)

            setData(res)
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