import axios from 'axios';

export const generateContent = async (prompt, systemInstruction = "") => {
  try {
    const response = await axios.post("/api/gemini/generate", {
      prompt,
      systemInstruction
    });
    return response.data.text;
  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
};

export const generateProductDescription = async (productName, category) => {
  const prompt = `Generate a professional and catchy e-commerce description for a product named "${productName}" in the category "${category}". Focus on its benefits and features.`;
  return await generateContent(prompt, "You are a professional e-commerce product copywriter.");
};

export const getProductRecommendations = async (category, currentProductName) => {
  const prompt = `Based on the product "${currentProductName}" in category "${category}", suggest 5 related product types that customers might like. Return as a comma-separated list.`;
  return await generateContent(prompt);
};

export const smartProductSearch = async (query, products) => {
  const productList = products.map(p => p.name).join(", ");
  const prompt = `From this list of products: [${productList}], which ones best match the user query: "${query}"? Return only the matching product names as a comma-separated list.`;
  return await generateContent(prompt);
};

export const generateReviewSummary = async (reviews) => {
  const reviewTexts = reviews.map(r => r.comment).join("\n");
  const prompt = `Summarize these customer reviews concisely into a short paragraph: \n${reviewTexts}`;
  return await generateContent(prompt);
};

export const chatbotResponse = async (userMessage) => {
  return await generateContent(userMessage, "You are the SmartShop BD AI Assistant. Help customers with product info, ordering, and general inquiries in both English and Bangla.");
};
