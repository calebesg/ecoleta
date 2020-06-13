import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload, FiSmile } from 'react-icons/fi'
 
import './styles.css'

interface Props {
  onFileUploaded: (file: File) => void
}

const Dropzone: React.FC<Props> = ({ onFileUploaded }) => {
  const [selectedFile, setSelectedFile] = useState<string>('')

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0]

    const fileUrl = URL.createObjectURL(file)

    setSelectedFile(fileUrl)

    onFileUploaded(file)
  }, [onFileUploaded])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*'
  })

  function renderMessage() {
    if (isDragActive) {
      return (
        <p>
          <FiSmile />
          Solte a imagem ...
        </p>
      )
    } else {
      return (
        <p>
          <FiUpload />
          Arraste a imagem, ou clique aqui para buscar
        </p>
      )
    }
  }

  return (
    <div className="dropzone" { ...getRootProps() }>
      <input { ...getInputProps() } accept="image/*" />

      { selectedFile
        ? <img src={selectedFile} alt="Point thumbnail" />
        : false
      }

      { selectedFile === '' && renderMessage()}
    </div>
  )
}

export default Dropzone
