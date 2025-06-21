import { db } from "../server/db";
import { countries, dishes } from "../shared/schema";

async function populateMenu() {
  console.log("🚀 Starting FENUI menu population...");

  try {
    // Create countries first
    const countryData = [
      { name: "Suíça", flagEmoji: "🇨🇭", flagImage: "https://hatscripts.github.io/circle-flags/flags/ch.svg", order: 1 },
      { name: "Alemanha", flagEmoji: "🇩🇪", flagImage: "https://hatscripts.github.io/circle-flags/flags/de.svg", order: 2 },
      { name: "Japão", flagEmoji: "🇯🇵", flagImage: "https://hatscripts.github.io/circle-flags/flags/jp.svg", order: 3 },
      { name: "África do Sul (Afro-Brasileira)", flagEmoji: "🇿🇦", flagImage: "https://hatscripts.github.io/circle-flags/flags/za.svg", order: 4 },
      { name: "Brasil", flagEmoji: "🇧🇷", flagImage: "https://hatscripts.github.io/circle-flags/flags/br.svg", order: 5 },
      { name: "Rússia", flagEmoji: "🇷🇺", flagImage: "https://hatscripts.github.io/circle-flags/flags/ru.svg", order: 6 },
      { name: "China", flagEmoji: "🇨🇳", flagImage: "https://hatscripts.github.io/circle-flags/flags/cn.svg", order: 7 },
      { name: "Espanha", flagEmoji: "🇪🇸", flagImage: "https://hatscripts.github.io/circle-flags/flags/es.svg", order: 8 },
      { name: "Estados Unidos", flagEmoji: "🇺🇸", flagImage: "https://hatscripts.github.io/circle-flags/flags/us.svg", order: 9 },
      { name: "Síria", flagEmoji: "🇸🇾", flagImage: "https://hatscripts.github.io/circle-flags/flags/sy.svg", order: 10 },
      { name: "França", flagEmoji: "🇫🇷", flagImage: "https://hatscripts.github.io/circle-flags/flags/fr.svg", order: 11 },
      { name: "Itália", flagEmoji: "🇮🇹", flagImage: "https://hatscripts.github.io/circle-flags/flags/it.svg", order: 12 },
    ];

    console.log("📍 Creating countries...");
    const createdCountries = await db.insert(countries).values(countryData).returning();
    console.log(`✅ Created ${createdCountries.length} countries`);

    // Create a mapping of country names to IDs
    const countryMap = createdCountries.reduce((acc, country) => {
      acc[country.name] = country.id;
      return acc;
    }, {} as Record<string, number>);

    // Now create all dishes
    const dishesData = [
      // SUÍÇA (Colônia Helvetia)
      {
        name: "Torta de Queijo",
        description: "Uma deliciosa massa com recheio de queijo. Quentinha e salgada, o gostinho que faz voltar pra mais um pedaço.",
        price: "18.00",
        countryId: countryMap["Suíça"],
        category: "salgados",
        tags: ["vegetariano"],
        allergens: ["glúten", "lactose"],
        isFeatured: true,
        isAvailable: true,
        order: 1
      },
      {
        name: "Torta de Maçã",
        description: "Torta gelada, feita com uma massa delicada, recheada de creme de baunilha e com cobertura de suculentos pedaços de doce de maçã. Um toque de chantilly para deixar essa sobremesa ainda mais irresistível!",
        price: "18.00",
        countryId: countryMap["Suíça"],
        category: "doces",
        tags: ["vegetariano"],
        allergens: ["glúten", "lactose", "ovos"],
        isFeatured: false,
        isAvailable: true,
        order: 2
      },
      {
        name: "Cervelat com Salada de Batata",
        description: "O típico salsichão suíço cozido, um blend de carne bovina e suína, e servido com uma salada de batata cremosa e cheia de sabor.",
        price: "30.00",
        countryId: countryMap["Suíça"],
        category: "salgados",
        tags: [],
        allergens: [],
        isFeatured: false,
        isAvailable: true,
        order: 3
      },
      {
        name: "Cervelat no Espeto",
        description: "Salsichão vermelho, de carne bovina e suína, grelhado no espeto. Prático, gostoso e sem frescura.",
        price: "18.00",
        countryId: countryMap["Suíça"],
        category: "salgados",
        tags: [],
        allergens: [],
        isFeatured: false,
        isAvailable: true,
        order: 4
      },
      {
        name: "Kalbsbratwurst no Espeto",
        description: "A versão branca do clássico suíço, feito com carnes bovina e suína, grelhado até ficar dourado e suculento.",
        price: "18.00",
        countryId: countryMap["Suíça"],
        category: "salgados",
        tags: [],
        allergens: [],
        isFeatured: false,
        isAvailable: true,
        order: 5
      },
      {
        name: "Rösti com Kalbsbratwurst",
        description: "Batata crocante por fora, macia por dentro, acompanhada de um salsichão grelhado no ponto certo. Um clássico que agrada a todos os paladares!",
        price: "36.00",
        countryId: countryMap["Suíça"],
        category: "salgados",
        tags: [],
        allergens: [],
        isFeatured: false,
        isAvailable: true,
        order: 6
      },
      {
        name: "Raclete",
        description: "Batatas cozidas cobertas por um delicioso queijo derretido na hora! Esse típico prato suíço também acompanha pepino agridoce e cebolinhas em conserva. Não deixe de provar essa maravilha de nossa gastronomia!",
        price: "36.00",
        countryId: countryMap["Suíça"],
        category: "salgados",
        tags: ["vegetariano"],
        allergens: ["lactose"],
        isFeatured: true,
        isAvailable: true,
        order: 7
      },

      // ALEMANHA (Colônia Alemã de Friburgo)
      {
        name: "Eisbein Petisco",
        description: "Joelho traseiro grelhado petisco (500gr.)",
        price: "90.00",
        countryId: countryMap["Alemanha"],
        category: "salgados",
        tags: [],
        allergens: [],
        isFeatured: false,
        isAvailable: true,
        order: 1
      },
      {
        name: "Eisbein Prato",
        description: "Joelho picado grelhado (200gr.) + chucrute + batata rústica",
        price: "60.00",
        countryId: countryMap["Alemanha"],
        category: "salgados",
        tags: [],
        allergens: [],
        isFeatured: false,
        isAvailable: true,
        order: 2
      },
      {
        name: "Salsichão com Chucrute",
        description: "Salsichão (Cervela) com chucrute",
        price: "30.00",
        countryId: countryMap["Alemanha"],
        category: "salgados",
        tags: [],
        allergens: [],
        isFeatured: false,
        isAvailable: true,
        order: 3
      },
      {
        name: "Salsichão no Palito",
        description: "Salsichão (Cervela) no palito",
        price: "18.00",
        countryId: countryMap["Alemanha"],
        category: "salgados",
        tags: [],
        allergens: [],
        isFeatured: false,
        isAvailable: true,
        order: 4
      },
      {
        name: "Mix de Salsichão",
        description: "Porção (Cervela + Weisswurst + Schublig) (200gr)",
        price: "25.00",
        countryId: countryMap["Alemanha"],
        category: "salgados",
        tags: [],
        allergens: [],
        isFeatured: false,
        isAvailable: true,
        order: 5
      },
      {
        name: "Lanche Alemão",
        description: "Pão Artesanal + Salsichão Cervela + Cebola Roxa + Chucrute + Pepino em Conserva + Tomate + Maionese Especial",
        price: "30.00",
        countryId: countryMap["Alemanha"],
        category: "salgados",
        tags: [],
        allergens: ["glúten", "ovos"],
        isFeatured: false,
        isAvailable: true,
        order: 6
      },
      {
        name: "Apfelstrudell",
        description: "Torta de maçã com massa folhada com creme de baunilha",
        price: "18.00",
        countryId: countryMap["Alemanha"],
        category: "doces",
        tags: ["vegetariano"],
        allergens: ["glúten", "lactose", "ovos"],
        isFeatured: false,
        isAvailable: true,
        order: 7
      },

      // JAPÃO
      {
        name: "Yakisoba",
        description: "Macarrão japonês refogado com legumes e molho especial",
        price: "50.00",
        countryId: countryMap["Japão"],
        category: "salgados",
        tags: [],
        allergens: ["glúten", "soja"],
        isFeatured: true,
        isAvailable: true,
        order: 1
      },
      {
        name: "Tempurá",
        description: "Legumes empanados em massa leve e crocante",
        price: "25.00",
        countryId: countryMap["Japão"],
        category: "salgados",
        tags: ["vegetariano"],
        allergens: ["glúten", "ovos"],
        isFeatured: false,
        isAvailable: true,
        order: 2
      },
      {
        name: "Oniguiri",
        description: "Gohan com Salmão cru, Salmão grelhado, Atum grelhado",
        price: "20.00",
        countryId: countryMap["Japão"],
        category: "salgados",
        tags: [],
        allergens: ["peixes"],
        isFeatured: false,
        isAvailable: true,
        order: 3
      },
      {
        name: "Inarizushi",
        description: "Sushi tradicional japonês",
        price: "30.00",
        countryId: countryMap["Japão"],
        category: "salgados",
        tags: [],
        allergens: ["soja"],
        isFeatured: false,
        isAvailable: true,
        order: 4
      },
      {
        name: "Futomaki",
        description: "Sushi roll grande com diversos ingredientes",
        price: "40.00",
        countryId: countryMap["Japão"],
        category: "salgados",
        tags: [],
        allergens: ["peixes", "soja"],
        isFeatured: false,
        isAvailable: true,
        order: 5
      },
      {
        name: "Hosomaki Salmão",
        description: "Sushi roll pequeno com salmão",
        price: "33.00",
        countryId: countryMap["Japão"],
        category: "salgados",
        tags: [],
        allergens: ["peixes", "soja"],
        isFeatured: false,
        isAvailable: true,
        order: 6
      },
      {
        name: "Hosomaki Pepino",
        description: "Sushi roll pequeno com pepino",
        price: "24.00",
        countryId: countryMap["Japão"],
        category: "salgados",
        tags: ["vegetariano"],
        allergens: ["soja"],
        isFeatured: false,
        isAvailable: true,
        order: 7
      },
      {
        name: "Poke Salmão",
        description: "Cru/cream cheese, grelhado, furai - empanado",
        price: "55.00",
        countryId: countryMap["Japão"],
        category: "salgados",
        tags: [],
        allergens: ["peixes", "lactose"],
        isFeatured: false,
        isAvailable: true,
        order: 8
      },
      {
        name: "Combinado Salmão",
        description: "Sashimi, uramaki, hosomaki",
        price: "55.00",
        countryId: countryMap["Japão"],
        category: "salgados",
        tags: [],
        allergens: ["peixes", "soja"],
        isFeatured: false,
        isAvailable: true,
        order: 9
      },

      // ÁFRICA DO SUL (AFRO-BRASILEIRA) (Comunidade Coni)
      {
        name: "Fufu",
        description: "Prato típico da África Ocidental, é uma massa feita de mandioca, inhame ou plátano, acompanhada de diversos molhos e carnes. Tradicionalmente comido com as mãos.",
        price: "15.99",
        countryId: countryMap["África do Sul (Afro-Brasileira)"],
        category: "salgados",
        tags: [],
        allergens: [],
        isFeatured: false,
        isAvailable: true,
        order: 1
      },
      {
        name: "Acarajé",
        description: "Bolinho de feijão-fradinho frito no dendê, recheado com vatapá, caruru e camarão seco. Patrimônio cultural brasileiro com raízes africanas.",
        price: "12.50",
        countryId: countryMap["África do Sul (Afro-Brasileira)"],
        category: "salgados",
        tags: [],
        allergens: [],
        isFeatured: false,
        isAvailable: true,
        order: 2
      },
      {
        name: "Bobotie",
        description: "Prato nacional da África do Sul, um refogado de carne moída temperada com especiarias e coberto com ovo batido.",
        price: "18.90",
        countryId: countryMap["África do Sul (Afro-Brasileira)"],
        category: "salgados",
        tags: [],
        allergens: [],
        isFeatured: false,
        isAvailable: true,
        order: 3
      },
      {
        name: "Biltong",
        description: "Carne seca temperada, especialidade sul-africana. Ideal como petisco ou acompanhamento.",
        price: "14.50",
        countryId: countryMap["África do Sul (Afro-Brasileira)"],
        category: "salgados",
        tags: [],
        allergens: [],
        isFeatured: false,
        isAvailable: true,
        order: 4
      },
      {
        name: "Rooibos Tea",
        description: "Chá vermelho sul-africano, naturalmente sem cafeína, com sabor suave e adocicado.",
        price: "8.50",
        countryId: countryMap["África do Sul (Afro-Brasileira)"],
        category: "bebidas",
        tags: [],
        allergens: [],
        isFeatured: false,
        isAvailable: true,
        order: 5
      },

      // BRASIL - Sucos
      {
        name: "Suco Natural - 1 Litro",
        description: "Suco natural de diversos sabores",
        price: "35.00",
        countryId: countryMap["Brasil"],
        category: "bebidas",
        tags: ["vegetariano", "vegano"],
        allergens: [],
        isFeatured: false,
        isAvailable: true,
        order: 1
      },
      {
        name: "Suco Natural - 500ml",
        description: "Suco natural de diversos sabores",
        price: "20.00",
        countryId: countryMap["Brasil"],
        category: "bebidas",
        tags: ["vegetariano", "vegano"],
        allergens: [],
        isFeatured: false,
        isAvailable: true,
        order: 2
      },
      {
        name: "Suco Natural - 300ml",
        description: "Suco natural de diversos sabores",
        price: "15.00",
        countryId: countryMap["Brasil"],
        category: "bebidas",
        tags: ["vegetariano", "vegano"],
        allergens: [],
        isFeatured: false,
        isAvailable: true,
        order: 3
      },
      {
        name: "Água de Coco",
        description: "Água de coco natural e refrescante",
        price: "15.00",
        countryId: countryMap["Brasil"],
        category: "bebidas",
        tags: ["vegetariano", "vegano"],
        allergens: [],
        isFeatured: false,
        isAvailable: true,
        order: 4
      },
      {
        name: "Salada de Frutas P",
        description: "Pote pequeno 250ml de salada de frutas",
        price: "15.00",
        countryId: countryMap["Brasil"],
        category: "doces",
        tags: ["vegetariano", "vegano"],
        allergens: [],
        isFeatured: false,
        isAvailable: true,
        order: 5
      },
      {
        name: "Salada de Frutas G",
        description: "Pote grande 400ml de salada de frutas",
        price: "20.00",
        countryId: countryMap["Brasil"],
        category: "doces",
        tags: ["vegetariano", "vegano"],
        allergens: [],
        isFeatured: false,
        isAvailable: true,
        order: 6
      },

      // BRASIL - Espetinhos
      {
        name: "Espetinho de Carne",
        description: "Espetinho de carne bovina",
        price: "15.00",
        countryId: countryMap["Brasil"],
        category: "salgados",
        tags: [],
        allergens: [],
        isFeatured: false,
        isAvailable: true,
        order: 7
      },
      {
        name: "Espetinho de Frango",
        description: "Espetinho de frango temperado",
        price: "15.00",
        countryId: countryMap["Brasil"],
        category: "salgados",
        tags: [],
        allergens: [],
        isFeatured: false,
        isAvailable: true,
        order: 8
      },
      {
        name: "Espetinho de Linguiça",
        description: "Espetinho de linguiça artesanal",
        price: "15.00",
        countryId: countryMap["Brasil"],
        category: "salgados",
        tags: [],
        allergens: [],
        isFeatured: false,
        isAvailable: true,
        order: 9
      },
      {
        name: "Espetinho de Coração",
        description: "Espetinho de coração temperado",
        price: "15.00",
        countryId: countryMap["Brasil"],
        category: "salgados",
        tags: [],
        allergens: [],
        isFeatured: false,
        isAvailable: true,
        order: 10
      },
      {
        name: "Espetinho de Queijo",
        description: "Espetinho de queijo grelhado",
        price: "15.00",
        countryId: countryMap["Brasil"],
        category: "salgados",
        tags: ["vegetariano"],
        allergens: ["lactose"],
        isFeatured: false,
        isAvailable: true,
        order: 11
      },
      {
        name: "Pão de Alho",
        description: "Espetinho de pão de alho",
        price: "15.00",
        countryId: countryMap["Brasil"],
        category: "salgados",
        tags: ["vegetariano"],
        allergens: ["glúten"],
        isFeatured: false,
        isAvailable: true,
        order: 12
      },

      // BRASIL - Palhoça
      {
        name: "Lanche Pernil",
        description: "Lanche com pernil suculento",
        price: "34.00",
        countryId: countryMap["Brasil"],
        category: "salgados",
        tags: [],
        allergens: ["glúten"],
        isFeatured: false,
        isAvailable: true,
        order: 13
      },
      {
        name: "Lanche Pernil Palhoça",
        description: "Lanche pernil especial da casa",
        price: "38.00",
        countryId: countryMap["Brasil"],
        category: "salgados",
        tags: [],
        allergens: ["glúten"],
        isFeatured: false,
        isAvailable: true,
        order: 14
      },
      {
        name: "Lanche Linguiça",
        description: "Lanche com linguiça artesanal",
        price: "34.00",
        countryId: countryMap["Brasil"],
        category: "salgados",
        tags: [],
        allergens: ["glúten"],
        isFeatured: false,
        isAvailable: true,
        order: 15
      },
      {
        name: "Lanche Linguiça Palhoça",
        description: "Lanche linguiça especial da casa",
        price: "38.00",
        countryId: countryMap["Brasil"],
        category: "salgados",
        tags: [],
        allergens: ["glúten"],
        isFeatured: false,
        isAvailable: true,
        order: 16
      },
      {
        name: "Lanche Costela",
        description: "Lanche com costela defumada",
        price: "37.00",
        countryId: countryMap["Brasil"],
        category: "salgados",
        tags: [],
        allergens: ["glúten"],
        isFeatured: false,
        isAvailable: true,
        order: 17
      },
      {
        name: "Lanche Costela Palhoça",
        description: "Lanche costela especial da casa",
        price: "41.00",
        countryId: countryMap["Brasil"],
        category: "salgados",
        tags: [],
        allergens: ["glúten"],
        isFeatured: false,
        isAvailable: true,
        order: 18
      },
      {
        name: "Lanche Cupim",
        description: "Lanche com cupim defumado",
        price: "38.00",
        countryId: countryMap["Brasil"],
        category: "salgados",
        tags: [],
        allergens: ["glúten"],
        isFeatured: false,
        isAvailable: true,
        order: 19
      },
      {
        name: "Lanche Cupim Palhoça",
        description: "Lanche cupim especial da casa",
        price: "42.00",
        countryId: countryMap["Brasil"],
        category: "salgados",
        tags: [],
        allergens: ["glúten"],
        isFeatured: false,
        isAvailable: true,
        order: 20
      },
      {
        name: "Frangorresmo",
        description: "Frango com torresmo no cone",
        price: "35.00",
        countryId: countryMap["Brasil"],
        category: "salgados",
        tags: [],
        allergens: [],
        isFeatured: false,
        isAvailable: true,
        order: 21
      },
      {
        name: "Porção Pernil",
        description: "Porção generosa de pernil",
        price: "84.00",
        countryId: countryMap["Brasil"],
        category: "salgados",
        tags: [],
        allergens: [],
        isFeatured: false,
        isAvailable: true,
        order: 22
      },
      {
        name: "Porção Cupim",
        description: "Porção generosa de cupim",
        price: "94.00",
        countryId: countryMap["Brasil"],
        category: "salgados",
        tags: [],
        allergens: [],
        isFeatured: false,
        isAvailable: true,
        order: 23
      },
      {
        name: "Porção Mista",
        description: "Porção mista: pernil, cupim, linguiça",
        price: "98.00",
        countryId: countryMap["Brasil"],
        category: "salgados",
        tags: [],
        allergens: [],
        isFeatured: true,
        isAvailable: true,
        order: 24
      },

      // RÚSSIA
      {
        name: "Crepe Frango com Catupiry",
        description: "Crepe no espeto com frango e catupiry",
        price: "18.00",
        countryId: countryMap["Rússia"],
        category: "salgados",
        tags: [],
        allergens: ["glúten", "lactose", "ovos"],
        isFeatured: false,
        isAvailable: true,
        order: 1
      },
      {
        name: "Crepe Queijo",
        description: "Crepe no espeto com queijo",
        price: "18.00",
        countryId: countryMap["Rússia"],
        category: "salgados",
        tags: ["vegetariano"],
        allergens: ["glúten", "lactose", "ovos"],
        isFeatured: false,
        isAvailable: true,
        order: 2
      },
      {
        name: "Crepe Presunto e Queijo",
        description: "Crepe no espeto com presunto e queijo",
        price: "18.00",
        countryId: countryMap["Rússia"],
        category: "salgados",
        tags: [],
        allergens: ["glúten", "lactose", "ovos"],
        isFeatured: false,
        isAvailable: true,
        order: 3
      },
      {
        name: "Crepe de Chocolate",
        description: "Crepe doce no espeto com chocolate",
        price: "18.00",
        countryId: countryMap["Rússia"],
        category: "doces",
        tags: ["vegetariano"],
        allergens: ["glúten", "lactose", "ovos"],
        isFeatured: false,
        isAvailable: true,
        order: 4
      },

      // CHINA
      {
        name: "Pastel de Carne",
        description: "Pastel crocante com recheio de carne",
        price: "15.00",
        countryId: countryMap["China"],
        category: "salgados",
        tags: [],
        allergens: ["glúten"],
        isFeatured: false,
        isAvailable: true,
        order: 1
      },
      {
        name: "Pastel de Queijo",
        description: "Pastel crocante com recheio de queijo",
        price: "15.00",
        countryId: countryMap["China"],
        category: "salgados",
        tags: ["vegetariano"],
        allergens: ["glúten", "lactose"],
        isFeatured: false,
        isAvailable: true,
        order: 2
      },
      {
        name: "Pastel Presunto e Queijo",
        description: "Pastel crocante com presunto e queijo",
        price: "15.00",
        countryId: countryMap["China"],
        category: "salgados",
        tags: [],
        allergens: ["glúten", "lactose"],
        isFeatured: false,
        isAvailable: true,
        order: 3
      },
      {
        name: "Pastel Frango com Catupiry",
        description: "Pastel crocante com frango e catupiry",
        price: "15.00",
        countryId: countryMap["China"],
        category: "salgados",
        tags: [],
        allergens: ["glúten", "lactose"],
        isFeatured: false,
        isAvailable: true,
        order: 4
      },

      // ESPANHA
      {
        name: "Churros Tradicional",
        description: "Churros tradicional espanhol",
        price: "12.00",
        countryId: countryMap["Espanha"],
        category: "doces",
        tags: ["vegetariano"],
        allergens: ["glúten"],
        isFeatured: false,
        isAvailable: true,
        order: 1
      },
      {
        name: "Churros com Cobertura",
        description: "Churros com cobertura doce",
        price: "15.00",
        countryId: countryMap["Espanha"],
        category: "doces",
        tags: ["vegetariano"],
        allergens: ["glúten"],
        isFeatured: false,
        isAvailable: true,
        order: 2
      },
      {
        name: "Churros com Nutella",
        description: "Churros com deliciosa Nutella",
        price: "18.00",
        countryId: countryMap["Espanha"],
        category: "doces",
        tags: ["vegetariano"],
        allergens: ["glúten", "castanhas"],
        isFeatured: false,
        isAvailable: true,
        order: 3
      },

      // ESTADOS UNIDOS - D'skina
      {
        name: "Porção de Batata",
        description: "Porção crocante de batata frita",
        price: "26.00",
        countryId: countryMap["Estados Unidos"],
        category: "salgados",
        tags: ["vegetariano"],
        allergens: [],
        isFeatured: false,
        isAvailable: true,
        order: 1
      },
      {
        name: "X Burger",
        description: "Hambúrguer clássico americano",
        price: "34.00",
        countryId: countryMap["Estados Unidos"],
        category: "salgados",
        tags: [],
        allergens: ["glúten", "lactose"],
        isFeatured: false,
        isAvailable: true,
        order: 2
      },
      {
        name: "X Salada",
        description: "Hambúrguer com salada fresca",
        price: "36.00",
        countryId: countryMap["Estados Unidos"],
        category: "salgados",
        tags: [],
        allergens: ["glúten", "lactose"],
        isFeatured: false,
        isAvailable: true,
        order: 3
      },
      {
        name: "Vegetariano",
        description: "Hambúrguer vegetariano",
        price: "38.00",
        countryId: countryMap["Estados Unidos"],
        category: "salgados",
        tags: ["vegetariano"],
        allergens: ["glúten", "lactose"],
        isFeatured: false,
        isAvailable: true,
        order: 4
      },
      {
        name: "Bacon Burger",
        description: "Hambúrguer com bacon crocante",
        price: "38.00",
        countryId: countryMap["Estados Unidos"],
        category: "salgados",
        tags: [],
        allergens: ["glúten", "lactose"],
        isFeatured: false,
        isAvailable: true,
        order: 5
      },

      // ESTADOS UNIDOS - Hot Dogs
      {
        name: "Hot Dog New York",
        description: "Hot dog estilo nova iorquino",
        price: "25.00",
        countryId: countryMap["Estados Unidos"],
        category: "salgados",
        tags: [],
        allergens: ["glúten"],
        isFeatured: false,
        isAvailable: true,
        order: 6
      },
      {
        name: "Hot Dog Chicago",
        description: "Hot dog estilo Chicago",
        price: "28.00",
        countryId: countryMap["Estados Unidos"],
        category: "salgados",
        tags: [],
        allergens: ["glúten"],
        isFeatured: false,
        isAvailable: true,
        order: 7
      },
      {
        name: "Hot Dog Texas",
        description: "Hot dog estilo texano",
        price: "32.00",
        countryId: countryMap["Estados Unidos"],
        category: "salgados",
        tags: [],
        allergens: ["glúten"],
        isFeatured: false,
        isAvailable: true,
        order: 8
      },

      // SÍRIA
      {
        name: "Shawarma de Carne",
        description: "Pão Sírio, carne bovina, molho de alho especial, cebola temperada e tomate",
        price: "45.00",
        countryId: countryMap["Síria"],
        category: "salgados",
        tags: [],
        allergens: ["glúten"],
        isFeatured: true,
        isAvailable: true,
        order: 1
      },
      {
        name: "Falafel Vegetariano",
        description: "Pão Sírio, pasta de alho, cebola roxa, pepino, tomate e hortelã",
        price: "45.00",
        countryId: countryMap["Síria"],
        category: "salgados",
        tags: ["vegetariano"],
        allergens: ["glúten"],
        isFeatured: false,
        isAvailable: true,
        order: 2
      },
      {
        name: "Kibe",
        description: "Kibe tradicional sírio",
        price: "20.00",
        countryId: countryMap["Síria"],
        category: "salgados",
        tags: [],
        allergens: ["glúten"],
        isFeatured: false,
        isAvailable: true,
        order: 3
      },
      {
        name: "Esfiha de Carne",
        description: "Esfiha tradicional com carne",
        price: "18.00",
        countryId: countryMap["Síria"],
        category: "salgados",
        tags: [],
        allergens: ["glúten"],
        isFeatured: false,
        isAvailable: true,
        order: 4
      },
      {
        name: "Esfiha de Queijo",
        description: "Esfiha tradicional com queijo",
        price: "18.00",
        countryId: countryMap["Síria"],
        category: "salgados",
        tags: ["vegetariano"],
        allergens: ["glúten", "lactose"],
        isFeatured: false,
        isAvailable: true,
        order: 5
      },
      {
        name: "Doce Ninho",
        description: "Doce sírio tradicional",
        price: "35.00",
        countryId: countryMap["Síria"],
        category: "doces",
        tags: ["vegetariano"],
        allergens: ["lactose"],
        isFeatured: false,
        isAvailable: true,
        order: 6
      },
      {
        name: "Caixa Pequena de Doces",
        description: "Caixa pequena com doces sírios variados",
        price: "30.00",
        countryId: countryMap["Síria"],
        category: "doces",
        tags: ["vegetariano"],
        allergens: ["lactose"],
        isFeatured: false,
        isAvailable: true,
        order: 7
      },
      {
        name: "Caixa Grande de Doces",
        description: "Caixa grande com doces sírios variados",
        price: "50.00",
        countryId: countryMap["Síria"],
        category: "doces",
        tags: ["vegetariano"],
        allergens: ["lactose"],
        isFeatured: false,
        isAvailable: true,
        order: 8
      },

      // FRANÇA - Crepes Salgados
      {
        name: "Crepe de Calabresa",
        description: "Crepe francês com calabresa",
        price: "32.00",
        countryId: countryMap["França"],
        category: "salgados",
        tags: [],
        allergens: ["glúten", "lactose", "ovos"],
        isFeatured: false,
        isAvailable: true,
        order: 1
      },
      {
        name: "Crepe de Camarão",
        description: "Crepe francês com camarão",
        price: "38.00",
        countryId: countryMap["França"],
        category: "salgados",
        tags: [],
        allergens: ["glúten", "lactose", "ovos", "crustáceos"],
        isFeatured: false,
        isAvailable: true,
        order: 2
      },
      {
        name: "Crepe de Carne Seca",
        description: "Crepe francês com carne seca",
        price: "38.00",
        countryId: countryMap["França"],
        category: "salgados",
        tags: [],
        allergens: ["glúten", "lactose", "ovos"],
        isFeatured: false,
        isAvailable: true,
        order: 3
      },
      {
        name: "Crepe de Frango",
        description: "Crepe francês com frango",
        price: "35.00",
        countryId: countryMap["França"],
        category: "salgados",
        tags: [],
        allergens: ["glúten", "lactose", "ovos"],
        isFeatured: false,
        isAvailable: true,
        order: 4
      },
      {
        name: "Crepe Pizza",
        description: "Crepe francês sabor pizza",
        price: "32.00",
        countryId: countryMap["França"],
        category: "salgados",
        tags: [],
        allergens: ["glúten", "lactose", "ovos"],
        isFeatured: false,
        isAvailable: true,
        order: 5
      },
      {
        name: "Crepe Misto-Bauru",
        description: "Crepe francês misto bauru",
        price: "35.00",
        countryId: countryMap["França"],
        category: "salgados",
        tags: [],
        allergens: ["glúten", "lactose", "ovos"],
        isFeatured: false,
        isAvailable: true,
        order: 6
      },
      {
        name: "Crepe de Bacon",
        description: "Crepe francês com bacon",
        price: "38.00",
        countryId: countryMap["França"],
        category: "salgados",
        tags: [],
        allergens: ["glúten", "lactose", "ovos"],
        isFeatured: false,
        isAvailable: true,
        order: 7
      },
      {
        name: "Crepe Três Queijos",
        description: "Crepe francês com três queijos",
        price: "38.00",
        countryId: countryMap["França"],
        category: "salgados",
        tags: ["vegetariano"],
        allergens: ["glúten", "lactose", "ovos"],
        isFeatured: false,
        isAvailable: true,
        order: 8
      },
      {
        name: "Crepe Brócolis I",
        description: "Crepe francês com brócolis",
        price: "35.00",
        countryId: countryMap["França"],
        category: "salgados",
        tags: ["vegetariano"],
        allergens: ["glúten", "lactose", "ovos"],
        isFeatured: false,
        isAvailable: true,
        order: 9
      },
      {
        name: "Crepe Brócolis II",
        description: "Crepe francês com brócolis especial",
        price: "38.00",
        countryId: countryMap["França"],
        category: "salgados",
        tags: ["vegetariano"],
        allergens: ["glúten", "lactose", "ovos"],
        isFeatured: false,
        isAvailable: true,
        order: 10
      },
      {
        name: "Crepe Super Capricho",
        description: "Crepe francês super especial",
        price: "45.00",
        countryId: countryMap["França"],
        category: "salgados",
        tags: [],
        allergens: ["glúten", "lactose", "ovos"],
        isFeatured: false,
        isAvailable: true,
        order: 11
      },

      // FRANÇA - Crepes Doces
      {
        name: "Crepe Sensação",
        description: "Crepe doce sensação",
        price: "35.00",
        countryId: countryMap["França"],
        category: "doces",
        tags: ["vegetariano"],
        allergens: ["glúten", "lactose", "ovos"],
        isFeatured: false,
        isAvailable: true,
        order: 12
      },
      {
        name: "Crepe de Banana",
        description: "Crepe doce com banana",
        price: "32.00",
        countryId: countryMap["França"],
        category: "doces",
        tags: ["vegetariano"],
        allergens: ["glúten", "lactose", "ovos"],
        isFeatured: false,
        isAvailable: true,
        order: 13
      },
      {
        name: "Crepe Romeu e Julieta",
        description: "Crepe doce romeu e julieta",
        price: "32.00",
        countryId: countryMap["França"],
        category: "doces",
        tags: ["vegetariano"],
        allergens: ["glúten", "lactose", "ovos"],
        isFeatured: false,
        isAvailable: true,
        order: 14
      },
      {
        name: "Crepe Mineirinho",
        description: "Crepe doce mineirinho",
        price: "35.00",
        countryId: countryMap["França"],
        category: "doces",
        tags: ["vegetariano"],
        allergens: ["glúten", "lactose", "ovos"],
        isFeatured: false,
        isAvailable: true,
        order: 15
      },
      {
        name: "Crepe Nutella I",
        description: "Crepe com Nutella",
        price: "38.00",
        countryId: countryMap["França"],
        category: "doces",
        tags: ["vegetariano"],
        allergens: ["glúten", "lactose", "ovos", "castanhas"],
        isFeatured: false,
        isAvailable: true,
        order: 16
      },
      {
        name: "Crepe Nutella II",
        description: "Crepe com Nutella especial",
        price: "38.00",
        countryId: countryMap["França"],
        category: "doces",
        tags: ["vegetariano"],
        allergens: ["glúten", "lactose", "ovos", "castanhas"],
        isFeatured: false,
        isAvailable: true,
        order: 17
      },
      {
        name: "Crepe Nutella III",
        description: "Crepe com Nutella premium",
        price: "38.00",
        countryId: countryMap["França"],
        category: "doces",
        tags: ["vegetariano"],
        allergens: ["glúten", "lactose", "ovos", "castanhas"],
        isFeatured: false,
        isAvailable: true,
        order: 18
      },
      {
        name: "Crepe Super Nutella",
        description: "Crepe super especial com Nutella",
        price: "45.00",
        countryId: countryMap["França"],
        category: "doces",
        tags: ["vegetariano"],
        allergens: ["glúten", "lactose", "ovos", "castanhas"],
        isFeatured: false,
        isAvailable: true,
        order: 19
      },

      // ITÁLIA - Porções
      {
        name: "Frango Frito",
        description: "Porção de frango frito italiano",
        price: "45.00",
        countryId: countryMap["Itália"],
        category: "salgados",
        tags: [],
        allergens: ["glúten"],
        isFeatured: false,
        isAvailable: true,
        order: 1
      },
      {
        name: "Polenta Frita",
        description: "Porção de polenta frita crocante",
        price: "35.00",
        countryId: countryMap["Itália"],
        category: "salgados",
        tags: ["vegetariano"],
        allergens: [],
        isFeatured: false,
        isAvailable: true,
        order: 2
      },

      // ITÁLIA - Massas Tradicionais
      {
        name: "Nhoque de Batata",
        description: "Nhoque tradicional de batata",
        price: "48.00",
        countryId: countryMap["Itália"],
        category: "salgados",
        tags: ["vegetariano"],
        allergens: ["glúten", "ovos"],
        isFeatured: false,
        isAvailable: true,
        order: 3
      },
      {
        name: "Nhoque de Mandioquinha",
        description: "Nhoque especial de mandioquinha",
        price: "48.00",
        countryId: countryMap["Itália"],
        category: "salgados",
        tags: ["vegetariano"],
        allergens: ["glúten", "ovos"],
        isFeatured: false,
        isAvailable: true,
        order: 4
      },
      {
        name: "Nhoque de Batata com Espinafre e Parmesão",
        description: "Nhoque de batata com espinafre e parmesão",
        price: "48.00",
        countryId: countryMap["Itália"],
        category: "salgados",
        tags: ["vegetariano"],
        allergens: ["glúten", "ovos", "lactose"],
        isFeatured: false,
        isAvailable: true,
        order: 5
      },
      {
        name: "Nhoque de Abóbora",
        description: "Nhoque especial de abóbora",
        price: "48.00",
        countryId: countryMap["Itália"],
        category: "salgados",
        tags: ["vegetariano"],
        allergens: ["glúten", "ovos"],
        isFeatured: false,
        isAvailable: true,
        order: 6
      },
      {
        name: "Nhoque de Batata com Queijo",
        description: "Nhoque de batata com queijo derretido",
        price: "48.00",
        countryId: countryMap["Itália"],
        category: "salgados",
        tags: ["vegetariano"],
        allergens: ["glúten", "ovos", "lactose"],
        isFeatured: false,
        isAvailable: true,
        order: 7
      },
      {
        name: "Spaguetti",
        description: "Spaguetti tradicional italiano",
        price: "48.00",
        countryId: countryMap["Itália"],
        category: "salgados",
        tags: ["vegetariano"],
        allergens: ["glúten"],
        isFeatured: false,
        isAvailable: true,
        order: 8
      },
      {
        name: "Talharin",
        description: "Talharin italiano artesanal",
        price: "48.00",
        countryId: countryMap["Itália"],
        category: "salgados",
        tags: ["vegetariano"],
        allergens: ["glúten", "ovos"],
        isFeatured: false,
        isAvailable: true,
        order: 9
      },
      {
        name: "Penne",
        description: "Penne italiano tradicional",
        price: "48.00",
        countryId: countryMap["Itália"],
        category: "salgados",
        tags: ["vegetariano"],
        allergens: ["glúten"],
        isFeatured: false,
        isAvailable: true,
        order: 10
      },
      {
        name: "Lasanha à Bolonhesa",
        description: "Lasanha pequena à bolonhesa",
        price: "48.00",
        countryId: countryMap["Itália"],
        category: "salgados",
        tags: [],
        allergens: ["glúten", "lactose", "ovos"],
        isFeatured: false,
        isAvailable: true,
        order: 11
      },

      // ITÁLIA - Massas Especiais
      {
        name: "Ravióli de Brie, Pera e Mel",
        description: "Ravióli especial com brie, pera e mel",
        price: "58.00",
        countryId: countryMap["Itália"],
        category: "salgados",
        tags: ["vegetariano"],
        allergens: ["glúten", "lactose", "ovos"],
        isFeatured: true,
        isAvailable: true,
        order: 12
      },
      {
        name: "Ravióli de Figo com Queijo",
        description: "Ravióli especial de figo com queijo",
        price: "58.00",
        countryId: countryMap["Itália"],
        category: "salgados",
        tags: ["vegetariano"],
        allergens: ["glúten", "lactose", "ovos"],
        isFeatured: false,
        isAvailable: true,
        order: 13
      },
      {
        name: "Ravióli de Parma com Queijo",
        description: "Ravióli especial de parma com queijo",
        price: "58.00",
        countryId: countryMap["Itália"],
        category: "salgados",
        tags: [],
        allergens: ["glúten", "lactose", "ovos"],
        isFeatured: false,
        isAvailable: true,
        order: 14
      },
      {
        name: "Ravióli de Carne",
        description: "Ravióli tradicional de carne",
        price: "58.00",
        countryId: countryMap["Itália"],
        category: "salgados",
        tags: [],
        allergens: ["glúten", "lactose", "ovos"],
        isFeatured: false,
        isAvailable: true,
        order: 15
      }
    ];

    console.log("🍽️ Creating dishes...");
    const createdDishes = await db.insert(dishes).values(dishesData).returning();
    console.log(`✅ Created ${createdDishes.length} dishes`);

    console.log("🎉 FENUI menu populated successfully!");
    console.log(`📊 Summary:`);
    console.log(`   🌍 Countries: ${createdCountries.length}`);
    console.log(`   🍽️ Dishes: ${createdDishes.length}`);
    console.log(`   🥘 Salgados: ${createdDishes.filter(d => d.category === 'salgados').length}`);
    console.log(`   🍰 Doces: ${createdDishes.filter(d => d.category === 'doces').length}`);
    console.log(`   🥤 Bebidas: ${createdDishes.filter(d => d.category === 'bebidas').length}`);
    console.log(`   ⭐ Featured: ${createdDishes.filter(d => d.isFeatured).length}`);

  } catch (error) {
    console.error("❌ Error populating menu:", error);
    throw error;
  }
}

// Run the script
populateMenu()
  .then(() => {
    console.log("✅ Menu population completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Menu population failed:", error);
    process.exit(1);
  });