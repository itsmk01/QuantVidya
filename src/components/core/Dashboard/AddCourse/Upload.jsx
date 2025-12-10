import { useEffect, useRef, useState } from "react"
import { UploadCloud, X, FileImage } from "lucide-react"

export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  viewData = null,
  editData = null,
}) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(
    viewData ? viewData : editData ? editData : ""
  )
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const inputRef = useRef(null)

  const previewFile = (file) => {
    setIsProcessing(true)
    setProgress(0)
    
    const reader = new FileReader()
    
    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const percentComplete = (e.loaded / e.total) * 100
        setProgress(percentComplete)
      }
    }
    
    reader.onloadend = () => {
      setPreviewSource(reader.result)
      setProgress(100)
      setTimeout(() => {
        setIsProcessing(false)
      }, 300)
    }
    
    reader.onerror = () => {
      setIsProcessing(false)
      setProgress(0)
    }
    
    reader.readAsDataURL(file)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      previewFile(file)
      setSelectedFile(file)
      setValue(name, file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.classList.add("bg-gray-700")
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.classList.remove("bg-gray-700")
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.classList.remove("bg-gray-700")
    
    const file = e.dataTransfer.files[0]
    if (file) {
      const fileType = file.type.split("/")[0]
      if ((!video && fileType === "image") || (video && fileType === "video")) {
        previewFile(file)
        setSelectedFile(file)
        setValue(name, file)
      }
    }
  }

  const handleBrowseClick = () => {
    inputRef.current?.click()
  }

  const handleCancel = () => {
    setSelectedFile(null)
    setPreviewSource("")
    setProgress(0)
    setIsProcessing(false)
    setValue(name, null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  useEffect(() => {
    register(name, { required: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register])

  useEffect(() => {
    if (viewData) {
      setPreviewSource(viewData)
    } else if (editData) {
      setPreviewSource(editData)
    }
  }, [viewData, editData])

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-gray-100" htmlFor={name}>
        {label} {!viewData && <sup className="text-pink-400">*</sup>}
      </label>
      <div className="flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-gray-500 bg-gray-800">
        {isProcessing ? (
          <div className="flex w-full flex-col items-center justify-center p-6">
            <div className="w-full max-w-md">
              <div className="mb-3 flex items-center justify-center">
                <UploadCloud className="text-4xl text-yellow-400 animate-pulse" />
              </div>
              <p className="mb-4 text-center text-sm text-gray-300">
                Processing {!video ? "image" : "video"}...
              </p>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-700">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-center text-xs text-gray-400">
                {Math.round(progress)}%
              </p>
            </div>
          </div>
        ) : previewSource ? (
          <div className="flex w-full flex-col p-6">
            <div className="relative">
              {!video ? (
                <img
                  src={previewSource}
                  alt="Preview"
                  className="h-full w-full rounded-md object-cover"
                />
              ) : (
                <video
                  src={previewSource}
                  className="h-full w-full rounded-md"
                  controls
                />
              )}
              {!viewData && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-gray-100 hover:bg-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            {!viewData && selectedFile && (
              <div className="mt-3 flex items-center justify-between rounded-md bg-gray-700 p-3">
                <div className="flex items-center space-x-2">
                  <FileImage className="text-yellow-400" size={20} />
                  <p className="text-sm text-gray-100">
                    {selectedFile.name}
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            )}
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleBrowseClick}
            className="flex w-full flex-col items-center p-6 transition-colors"
          >
            <input
              ref={inputRef}
              id={name}
              type="file"
              accept={!video ? "image/*" : "video/*"}
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="grid aspect-square w-14 place-items-center rounded-full bg-gray-700">
              <UploadCloud className="text-2xl text-yellow-400" />
            </div>
            <p className="mt-2 max-w-[200px] text-center text-sm text-gray-300">
              Drag and drop {!video ? "an image" : "a video"}, or click to{" "}
              <span className="font-semibold text-yellow-400">Browse</span> a
              file
            </p>
            <ul className="mt-10 flex list-disc justify-between space-x-12 text-center text-xs text-gray-400">
              <li>Aspect ratio 16:9</li>
              <li>Recommended size 1024x576</li>
            </ul>
          </div>
        )}
      </div>
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-400">
          {label} is required
        </span>
      )}
    </div>
  )
}