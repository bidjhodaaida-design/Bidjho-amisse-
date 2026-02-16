
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSkinAdvice = async (skinType: string, concern: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Você é um especialista em estética natural. O usuário tem pele ${skinType} e está preocupado com ${concern}. 
      Recomende 2 das 20 receitas caseiras clássicas (como mel e aveia, babosa, argila verde, etc) e explique por que elas ajudam. 
      Seja gentil, profissional e use um tom de spa.`
    });
    return response.text;
  } catch (e) {
    console.error("Erro ao obter conselho", e);
    return "Desculpe, não consegui processar seu pedido agora. Tente novamente em breve.";
  }
};

export const generateRecipeVisual = async (recipeName: string, ingredients: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{
          text: `A high-end, professional lifestyle photography of a natural skincare treatment: ${recipeName}. 
          Ingredients visible: ${ingredients}. Minimalist spa setting, soft morning light, wooden textures, organic feel, 4k, hyper-realistic.`
        }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (e) {
    console.error("Erro ao gerar imagem", e);
    return null;
  }
};
