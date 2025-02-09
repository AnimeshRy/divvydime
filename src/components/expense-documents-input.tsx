'use client'

import { randomId } from '@/lib/api'
import { ExpenseFormValues } from '@/lib/schema'
import { formatFileSize } from '@/lib/utils'
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Image as NextUIImage,
} from '@nextui-org/react'
import { Loader2, Plus, Trash, X } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'
import { useEffect, useState, useRef } from 'react'

type Props = {
  documents: ExpenseFormValues['documents']
  updateDocuments: (documents: ExpenseFormValues['documents']) => void
}

const MAX_FILE_SIZE = 5 * 1024 ** 2

export function ExpenseDocumentsInput({ documents, updateDocuments }: Props) {
  const [pending, setPending] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > MAX_FILE_SIZE) {
      alert(
        `The maximum file size you can upload is ${formatFileSize(
          MAX_FILE_SIZE,
        )}. Yours is ${formatFileSize(file.size)}.`,
      )
      return
    }

    const upload = async () => {
      try {
        setPending(true)
        const url = URL.createObjectURL(file)
        const img = document.createElement('img')
        img.src = url
        await new Promise<void>((resolve) => {
          img.onload = () => resolve()
        })
        updateDocuments([
          ...documents,
          { id: randomId(), url, width: img.width, height: img.height },
        ])
      } catch (err) {
        console.error(err)
        alert('Error while uploading document. Please try again.')
      } finally {
        setPending(false)
      }
    }
    upload()
  }

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png"
        className="hidden"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 [&_*]:aspect-square">
        {documents.map((doc) => (
          <DocumentThumbnail
            key={doc.id}
            document={doc}
            documents={documents}
            deleteDocument={(document) => {
              updateDocuments(documents.filter((d) => d.id !== document.id))
            }}
          />
        ))}

        <div>
          <Button
            variant="flat"
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-full min-h-[120px]"
            isDisabled={pending}
            startContent={
              pending ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                <Plus className="w-8 h-8" />
              )
            }
          />
        </div>
      </div>
    </div>
  )
}

function DocumentThumbnail({
  document,
  documents,
  deleteDocument,
}: {
  document: ExpenseFormValues['documents'][number]
  documents: ExpenseFormValues['documents']
  deleteDocument: (document: ExpenseFormValues['documents'][number]) => void
}) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [currentIndex, setCurrentIndex] = useState(documents.indexOf(document))
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })

  useEffect(() => {
    if (emblaApi) {
      emblaApi.scrollTo(documents.indexOf(document))
      const onSelect = () => {
        const selectedIndex = emblaApi.selectedScrollSnap()
        setCurrentIndex(selectedIndex)
      }
      emblaApi.on('select', onSelect)
      return () => {
        emblaApi.off('select', onSelect)
      }
    }
  }, [emblaApi, document, documents])

  return (
    <>
      <Button
        variant="flat"
        className="w-full h-full min-h-[120px] p-0 overflow-hidden"
        onClick={onOpen}
      >
        <NextUIImage
          width={300}
          height={300}
          className="object-contain"
          src={document.url}
          alt=""
        />
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="full"
        scrollBehavior="inside"
        classNames={{
          base: "p-4",
          body: "p-0",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex justify-end gap-2">
            <Button
              color="danger"
              variant="light"
              startContent={<Trash className="w-4 h-4" />}
              onClick={() => {
                deleteDocument(documents[currentIndex])
                onClose()
              }}
            >
              Delete document
            </Button>
            <Button
              variant="light"
              startContent={<X className="w-4 h-4" />}
              onClick={onClose}
            >
              Close
            </Button>
          </ModalHeader>

          <ModalBody>
            <div className="w-full max-h-[calc(100vh-200px)]" ref={emblaRef}>
              <div className="flex">
                {documents.map((doc, index) => (
                  <div key={index} className="flex-[0_0_100%]">
                    <NextUIImage
                      src={doc.url}
                      width={doc.width}
                      height={doc.height}
                      alt=""
                      className="object-contain w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
