import React, { useState, useEffect } from 'react'

const App = () => {
  const [tittle, setTittle] = useState("")
  const [details, setDetails] = useState("")
  
  // 1. Initial State from LocalStorage
  const [task, setTask] = useState(() => {
    const savedNotes = localStorage.getItem("my_notes")
    return savedNotes ? JSON.parse(savedNotes) : []
  })

  // 2. Track Edit State
  const [editIndex, setEditIndex] = useState(null)

  // 3. Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem("my_notes", JSON.stringify(task))
  }, [task])

  const SubmitHandler = (e) => {
    e.preventDefault()
    if (!tittle.trim() && !details.trim()) return

    if (editIndex !== null) {
      const copyTask = [...task]
      copyTask[editIndex] = { tittle, details }
      setTask(copyTask)
      setEditIndex(null)
    } else {
      setTask([...task, { tittle, details }])
    }

    setTittle("")
    setDetails("")
  }

  const deleteNotes = (idx) => {
    const copyTask = task.filter((_, index) => index !== idx)
    setTask(copyTask)
    
    if (editIndex === idx) {
      setEditIndex(null)
      setTittle("")
      setDetails("")
    }
  }

  const startEdit = (idx) => {
    setEditIndex(idx)
    setTittle(task[idx].tittle)
    setDetails(task[idx].details)
  }

  const cancelEdit = () => {
    setEditIndex(null)
    setTittle("")
    setDetails("")
  }

  return (
    <div className='w-full min-h-screen lg:h-screen bg-neutral-950 text-white flex flex-col lg:flex-row font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden'>
      
      {/* Left Form Section */}
      <div className='w-full lg:w-1/2 p-6 sm:p-10 lg:p-12 flex flex-col justify-center items-center border-b lg:border-b-0 lg:border-r border-neutral-800 lg:h-full'>
        <div className='w-full max-w-md'>
          <h1 className='text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent'>
            {editIndex !== null ? 'Edit Note' : 'Create Note'}
          </h1>
          <p className='text-neutral-400 text-sm mb-6 sm:mb-8'>
            {editIndex !== null 
              ? 'Update your note details below.' 
              : 'Jot down your important ideas and daily tasks.'}
          </p>

          <form className='flex flex-col gap-4 sm:gap-5' onSubmit={SubmitHandler}>
            <div>
              <label className='block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2'>
                Title
              </label>
              <input
                className='w-full border border-neutral-700 rounded-xl px-4 py-3 bg-neutral-900/80 text-white placeholder:text-neutral-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200'
                type="text"
                placeholder='Note title...'
                value={tittle}
                onChange={(e) => setTittle(e.target.value)}
              />
            </div>

            <div>
              <label className='block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2'>
                Details
              </label>
              <textarea
                className='w-full border border-neutral-700 rounded-xl px-4 py-3 bg-neutral-900/80 text-white placeholder:text-neutral-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 resize-none'
                placeholder='Write description here...'
                rows="4"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              ></textarea>
            </div>

            <div className='flex gap-3 pt-2'>
              <button
                className={`flex-1 text-white font-bold text-base rounded-xl py-3.5 shadow-lg transition-all duration-200 cursor-pointer ${
                  editIndex !== null 
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/20' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-600/25'
                }`}
              >
                {editIndex !== null ? 'Update Note' : 'Add Note'}
              </button>

              {editIndex !== null && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className='bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold px-5 rounded-xl transition-all cursor-pointer'
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Right Notes Display Section */}
      <div className='w-full lg:w-1/2 p-6 sm:p-10 lg:p-12 bg-neutral-900/40 lg:h-full lg:overflow-y-auto flex flex-col justify-between'>
        <div>
          <div className='flex items-center justify-between mb-6 pb-4 border-b border-neutral-800'>
            <h2 className='text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3'>
              Your Notes
            </h2>
            <span className='bg-indigo-500/10 text-indigo-400 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-500/20'>
              {task.length} {task.length === 1 ? 'Note' : 'Notes'}
            </span>
          </div>

          {task.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-16 sm:py-24 text-center text-neutral-500'>
              <div className='w-14 h-14 rounded-full bg-neutral-800/60 flex items-center justify-center mb-4 text-2xl border border-neutral-700/50 shadow-inner'>
                📝
              </div>
              <p className='text-lg font-semibold text-neutral-300'>No notes available</p>
              <p className='text-xs sm:text-sm text-neutral-500 mt-1 max-w-xs'>
                Add a new note from the left panel to get started!
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-4 pb-6'>
              {task.map((elem, idx) => (
                <div 
                  key={idx} 
                  className={`group border p-5 rounded-2xl shadow-md transition-all duration-200 flex flex-col justify-between ${
                    editIndex === idx 
                      ? 'bg-neutral-900 border-indigo-500/50 ring-1 ring-indigo-500/30' 
                      : 'bg-neutral-900/90 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div>
                    <h3 className='font-bold text-lg sm:text-xl text-white mb-2 break-words group-hover:text-indigo-300 transition-colors'>
                      {elem.tittle || "Untitled Note"}
                    </h3>
                    <p className='text-neutral-400 text-sm whitespace-pre-line leading-relaxed break-words'>
                      {elem.details || "No description provided."}
                    </p>
                  </div>

                  <div className='flex justify-end gap-2 pt-4 mt-4 border-t border-neutral-800/60'>
                    <button 
                      onClick={() => startEdit(idx)}
                      className='text-xs font-medium text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 px-3.5 py-1.5 rounded-lg transition-all active:scale-95 cursor-pointer'
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => deleteNotes(idx)}
                      className='text-xs font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-3.5 py-1.5 rounded-lg transition-all active:scale-95 cursor-pointer'
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

export default App 