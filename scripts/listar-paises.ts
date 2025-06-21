import { db } from "../server/db";
import { countries } from "../shared/schema";

async function listarPaises() {
  console.log("🏳️ BUSCANDO PAÍSES DISPONÍVEIS...\n");

  try {
    const paises = await db.select().from(countries).orderBy(countries.order);
    
    console.log("📋 LISTA DE PAÍSES E IDs:");
    console.log("=" .repeat(50));
    
    paises.forEach(pais => {
      console.log(`ID: ${pais.id.toString().padStart(2, ' ')} | ${pais.flagEmoji} ${pais.name}`);
    });
    
    console.log("=" .repeat(50));
    console.log(`\n✅ Total: ${paises.length} países encontrados`);
    
  } catch (error) {
    console.error("❌ Erro ao buscar países:", error);
  }

  process.exit(0);
}

listarPaises(); 