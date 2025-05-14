export const callOpenAI = async (prompt: string, options?: { maxTokens?: number }): Promise<string | null> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    console.error("❌ OpenAI API key is missing. Did you set VITE_OPENAI_API_KEY in .env?");
    return null;
  }

  try {
    console.log("🔹 Sending prompt to OpenAI:", prompt);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: options?.maxTokens || 50,
        temperature: 0.7,
      }),
    });

    console.log("🔹 Response status:", response.status);

    if (!response.ok) {
      console.error("❌ OpenAI API call failed:", response.statusText);
      const errorData = await response.json();
      console.error("❌ Error details:", errorData);
      return null;
    }

    const data = await response.json();
    console.log("✅ OpenAI API raw response:", data);

    const reply = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      console.warn("⚠️ OpenAI returned no reply. Check prompt or API usage.");
      return null;
    }

    console.log("✅ AI Suggested Reply:", reply);

    return reply;

  } catch (error) {
    console.error("❌ Exception while calling OpenAI API:", error);
    return null;
  }
};
