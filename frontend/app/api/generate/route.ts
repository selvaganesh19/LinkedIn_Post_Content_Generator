import { azure } from "@ai-sdk/azure"
import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { topic, tone } = await req.json()

    const prompt = `Write a ${tone.toLowerCase()} LinkedIn post about: ${topic}`

    const { text } = await generateText({
      model: azure(process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4"),
      messages: [
        {
          role: "system",
          content:
            "You are a professional LinkedIn post writer. Create engaging, well-structured posts that are appropriate for professional networking.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.9,
      maxTokens: 500,
    })

    return Response.json({ post: text })
  } catch (error) {
    console.error("Error generating post:", error)
    return Response.json({ error: "Failed to generate post" }, { status: 500 })
  }
}
