
// export interface FlashcardSet {
//   name: string
//   id: string
// }

export interface FlashcardType {
  cardId?: string
  front: string
  back: string
  createdAt: Date
}

export interface PublicFlashcardType {
  back: string
  front: string
  id: string
  createdAt: Date
}

export interface PublicFlashcardSetType {
  id: string
  setId: string
  flashcards: PublicFlashcardType[]
  createdAt: Date
  authorId: string
}

export interface FlashcardSetType {
  setId: string
  flashcards: FlashcardType[]
  createdAt: Date
  isPublic: boolean
  publicId?: string
}