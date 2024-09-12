
export interface FlashcardSet {
  name: string
  id: string
}

export interface FlashcardType {
  back: string
  front: string
  id?: string
  createdAt?: Date
}