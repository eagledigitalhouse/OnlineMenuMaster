import { db } from "../server/db";
import { countries } from "../shared/schema";
import { eq } from "drizzle-orm";

async function updateCountryName() {
  try {
    console.log("Atualizando nome do país...");
    
    const result = await db
      .update(countries)
      .set({ 
        name: "África do Sul (Afro-Brasileira)",
        flagImage: "https://hatscripts.github.io/circle-flags/flags/za.svg"
      })
      .where(eq(countries.name, "África"))
      .returning();

    console.log("País atualizado:", result);
    
    if (result.length === 0) {
      console.log("Nenhum país chamado 'África' encontrado.");
    } else {
      console.log("✅ Nome do país atualizado com sucesso!");
    }
    
  } catch (error) {
    console.error("❌ Erro ao atualizar país:", error);
  } finally {
    process.exit(0);
  }
}

updateCountryName(); 