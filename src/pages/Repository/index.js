import '../../css/build.css'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { FaArrowLeft } from 'react-icons/fa'

const Repository = () => {
  const [setErrorMessage] = useState('')
  const [repositories, setRepositories] = useState({})
  const [loading, setLoading] = useState(true)

  const {repository} = useParams()

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/repos/${repository}`)
      .then(response => {
        setRepositories(response.data)
        setLoading(false)
      }).catch(() => {
        setErrorMessage('Hummmm, it seems there is a problem with this repository!')
      })
  }, [repository, setErrorMessage])

  if (loading) {
    return <p className='text-white'>Loading...</p>
  }
 
  return (
    <div className='flex flex-col items-center justify-center mt-4'>
      <img src={repositories.owner.avatar_url} alt={repositories.name} className='w-20 mb-4 rounded-full'/>
      <h1 className='text-white capitalize'><span className='font-bold'>Repository:</span> {repositories.full_name}</h1>
      <p className='text-white text-xs md:text-lg'><span className='font-bold text-lg'>Description:</span> {repositories.description}</p>
      <p className="text-white"><span className="font-bold">Created At:</span> {new Date(repositories.created_at).toLocaleDateString()}</p>
      {repository.name > 0 && 
        <p className='text-white'><span className="font-bold">Lincese Type:</span> {repositories.license.name}</p>
      }
      <Link to={repositories.homepage} className='text-white capitalize underline mt-4' target='_blank'>Visit {repositories.name}'<span className='lowercase'>s</span> Page</Link>
      <Link to={`/repository/${encodeURIComponent(repository)}/issues`} className='capitalize mt-4 text-black border px-1 py-1 rounded bg-white font-bold hover:bg-red-600 hover:text-white transition duration-500'>Go to Issues' Page</Link>
      <div className="flex items-center gap-2">
        <Link to='/' className='text-white underline mt-20'> <FaArrowLeft /> </Link>
        <Link to='/' className='text-white underline mt-20'> Back</Link>
      </div>
    </div> 
  )
}

export default Repository