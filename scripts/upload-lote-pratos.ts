import { db } from "../server/db";
import { dishes } from "../shared/schema";
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function uploadLotePratos() {
  console.log("🚀 Iniciando upload em lote de pratos...");

  try {
    // Ler o arquivo JSON com os pratos
    const filePath = path.join(__dirname, '..', 'pratos-lote.json');
    
    if (!fs.existsSync(filePath)) {
      console.log("❌ Arquivo 'pratos-lote.json' não encontrado!");
      console.log("📝 Crie o arquivo baseado no template: template-upload-pratos.json");
      return;
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const pratosData = JSON.parse(fileContent);

    console.log(`📊 Encontrados ${pratosData.length} pratos para upload...`);

    // Validar estrutura básica
    for (let i = 0; i < pratosData.length; i++) {
      const prato = pratosData[i];
      if (!prato.name || !prato.description || !prato.price || !prato.countryId || !prato.category) {
        console.log(`❌ Prato ${i + 1} está com dados incompletos:`, prato);
        return;
      }
    }

    console.log("✅ Validação inicial passou!");

    // Inserir pratos no banco
    let sucessos = 0;
    let erros = 0;

    for (const prato of pratosData) {
      try {
        const [novoPrato] = await db.insert(dishes).values({
          name: prato.name,
          description: prato.description,
          price: prato.price,
          image: prato.image || null,
          countryId: prato.countryId,
          category: prato.category,
          tags: prato.tags || [],
          allergens: prato.allergens || [],
          rating: prato.rating || "0.00",
          reviewCount: prato.reviewCount || 0,
          isFeatured: prato.isFeatured || false,
          isAvailable: prato.isAvailable !== false, // default true
          order: prato.order || 0
        }).returning();

        console.log(`✅ ${sucessos + 1}. "${novoPrato.name}" adicionado com sucesso!`);
        sucessos++;
      } catch (error) {
        console.log(`❌ Erro ao adicionar "${prato.name}":`, error);
        erros++;
      }
    }

    console.log("\n🎉 UPLOAD CONCLUÍDO!");
    console.log(`✅ Sucessos: ${sucessos}`);
    console.log(`❌ Erros: ${erros}`);
    console.log(`📊 Total processado: ${sucessos + erros}`);

  } catch (error) {
    console.error("❌ Erro crítico no upload:", error);
  }

  process.exit(0);
}

// Executar automaticamente
uploadLotePratos(); 