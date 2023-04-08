import '../../css/build.css'
import axios from 'axios'
import { FaGithub, FaPlus, FaBars, FaTrash } from 'react-icons/fa'
import { useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Main = () => {
  const [newRepo, setNewRepo] = useState('')
  const [repositories, setRepositories] = useState([])
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const repoStorage = localStorage.getItem('repos')

    if(repoStorage) {
      setRepositories(JSON.parse(repoStorage))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('repos', JSON.stringify(repositories))
  }, [repositories])

  const handleDelete = useCallback((repo) => {
    const find = repositories.filter(r => r.name !== repo)
    setRepositories(find)
  }, [repositories])

  const handleSubmit = e => {
    e.preventDefault()

    if(!newRepo) {
      setErrorMessage("You need type a repository")
      return
    }

    axios.get(`${process.env.REACT_APP_API_URL}/repos/${newRepo}`)
      .then(response => {
        const { full_name } = response.data

        const addRepo = {
          name: full_name
        }

        const repoExists = repositories.some(repos => repos.name === addRepo.name)

        if(repoExists) {
          return setErrorMessage(`Repository is already added!`)
        }

        setNewRepo(response.data)
        setRepositories([...repositories, addRepo])
        setNewRepo('')
        setErrorMessage('')
      }).catch(() => {
        setErrorMessage("You need type a repository's name")
      })
  }

  if(!repositories) {
    return <p>Loading...</p>
  }

  return (
    <div className='md:w-2/3 flex flex-col justify-center items-start p-4 mt-20 border rounded m-auto bg-white'>
      <h1
        className='text-black font-bold text-xs md:text-3xl flex gap-2 items-center '>
        <FaGithub />
        My Repositories
      </h1>
      <form onSubmit={ handleSubmit } className='mt-2 flex items-start'>
        <div className="flex flex-col">
          <input
            type="text"
            placeholder='Add repositories'
            className='border border-gray-300 rounded pl-2 w-48 md:w-96'
            value={newRepo}
            onChange={e => setNewRepo(e.target.value)}
          />
          <span className='text-red-500 font-bold text-xs'>{errorMessage}</span>
        </div>
        <button 
          type='submit'
          className='border p-1 rounded bg-black text-white hover:bg-gray-300 hover:text-black transition duration-500'>
          <FaPlus />
        </button>
       
      </form>
      <div className=''>
        <ul className='text-black mt-2'>
          {repositories.length > 0 && repositories.map(repository => (
            <li key={repository.name} className='flex items-center justify-start gap-2 md:justify-between md:gap-0 border-b rounded-xl md:px-1 py-0.5 my-4'>
              <span 
                className='text-xs w-48 md:w-96 flex items-center'
              >
                <button 
                  onClick={() => handleDelete(repository.name)} 
                  className='text-red-500 px-2'> 
                  <FaTrash /> 
                </button>
                { repository.name }
              </span>
              <Link to={`/repository/${ encodeURIComponent(repository.name)}`} className='text-blue-700 mr-2'> <FaBars /> </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Main