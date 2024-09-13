import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const systemPrompt = `
You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly 10 flashcards.
Both front and back should be one sentence long.
You should return in the following JSON format:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`

export async function POST(req: Request) {
  const openai = new OpenAI(
    // process.env.OPENAI_API_KEY,
  )
  const data = await req.text()

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: data },
      ],
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
    })

    // Parse the JSON response from the OpenAI API
    const flashcards = JSON.parse(completion.choices[0].message.content || '')

    // Return the flashcards as a JSON response
    return NextResponse.json(flashcards.flashcards)
  }
  catch (error: unknown) {
    console.error('Server: Error generating flashcards:', error)
    if (error instanceof Error) {
      // TypeScript now knows `error` is an `Error`
      console.error('Server: Error generating flashcards:', error.message);
      return new NextResponse(JSON.stringify({ error: { message: error.message } }), {
        status: 500,
      });
    } else {
      // Handle cases where `error` is not an `Error`
      console.error('Server: Unexpected error:', error);
      return new NextResponse(JSON.stringify({ error: { message: 'An unexpected error occurred' } }), {
        status: 500,
      });
    }
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Hello, World!',
  })
}