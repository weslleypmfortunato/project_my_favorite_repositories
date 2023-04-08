import '../../css/build.css'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { FaArrowRight } from 'react-icons/fa'

const Repository = () => {
  const [setErrorMessage] = useState('')
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [filters] = useState([
    {state: 'open', label: 'Open', active: true},
    {state: 'closed', label: 'Closed', active: false},
    {state: 'all', label: 'All', active: false},
  ])
  const [filterIndex, setFilterIndex] = useState(0)

  const {repository} = useParams()

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/repos/${repository}/issues`, {
      params:  {
        state: filters.find(selectTrue => selectTrue.active).state,
        per_page: 5
      }
    })
      .then(response => {
        setIssues(response.data)
        setLoading(false)
      }).catch(() => {
        setErrorMessage("Hummmm, it seems something went wrong...")
      })
  }, [filters, repository, setErrorMessage])

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/repos/${repository}/issues`, {
      params: {
        state: filters[filterIndex].state,
        page,
        per_page: 5
      }
    })
    .then(response => {
      setIssues(response.data)
    }).catch(error => console.log(error))
  }, [page, filterIndex, filters, repository])

  const handlePage = (action) => {
    setPage(action === 'previous' ? page - 1 : page + 1)
  }

  const handleFilter = (index) => {
    setFilterIndex(index)
  }

  if (loading) {
    return <p className='text-white'>Loading...</p>
  }

  return (
    <div className='flex flex-col items-center justify-center mt-4'>
      <h1 className='text-white font-bold text-2xl mb-4 uppercase'>Issues List</h1>
      <div active={filterIndex}>
        {filters.length !== 0 && filters.map((filter, index) => (
          <button 
            key={filter.label} 
            onClick={() => handleFilter(index)}
            className={`bg-gray-200 text-black font-bold w-20 rounded border border-transparent hover:text-white hover:bg-gray-700 hover:border hover:border-gray-200 m-2 ${filterIndex === index && 'text-white bg-gray-400 border border-white'}`}>
            {filter.label}
          </button> 
        ))}
      </div>
      <ul>
      {issues.length !== 0 ? issues.map(issue => (
        <li key={issue.id} className='border border-gray-400 p-2 md:m-4 flex flex-col md:flex-row m-1 md:gap-4 md:items-center rounded text-xs md:text-lg'>
          <img src={issue.user.avatar_url} alt={issue.user.login} className='w-16 h-16 md:w-32 md:h-32 rounded-full mb-2 md:mb-0'/>
          <div className='overflow-hidden max-w-xs md:max-w-4xl'>
            <a href={issue.html_url} className='text-white gap-1'><span className="font-bold no-underline">Issue:</span> <span className="underline">{issue.title}</span></a>
            <p className='text-white mt-2 md:mt-0'><span className="font-bold">Created At:</span> {new Date(issue.created_at).toLocaleDateString()}</p>
            <ul>
            {issue.labels.map(label => (
              <li key={label.id} className='flex items-center gap-2'>
                <span className='text-white font-bold'> Issue</span>
                <span className='text-blue-300'><FaArrowRight /></span>
                <span className='text-white'> {label.name}</span>
              </li>
            ))}
            </ul>
            <p className='text-white'><span className="font-bold">Open by:</span> <span className="capitalize">{issue.user.login}</span></p>
          </div>
        </li>
      )) : <h1 className='text-white my-36'>No issues created yet!</h1>}
      </ul>
      <div className="flex gap-6 mt-3">
        <button
          onClick={() => handlePage('previous')} 
          disabled={page <=1}
          className={`text-black font-bold w-20 rounded border border-transparent hover:text-white hover:bg-gray-700 hover:border hover:border-gray-200 ${page <= 1 ? 'bg-gray-600 text-gray-200 cursor-not-allowed border-red-400' : 'bg-gray-200'}`}
          >
          Previous
        </button>
        <button
          onClick={() => handlePage('next')} 
          className='bg-gray-200 text-black font-bold w-20 rounded border border-transparent hover:text-white hover:bg-gray-700 hover:border hover:border-gray-200'>
          Next
        </button>
      </div>
      <Link to={`/repository/${encodeURIComponent(repository)}`} className='text-white underline my-4'>Back</Link>
    </div> 
  )
}

export default Repository