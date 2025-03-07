import { Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Injectable()
export class RecipesService {
  create(createRecipeDto: CreateRecipeDto) {
    return 'This action adds a new recipe';
  }

  findAll() {
    return [
      {
        "id": 1,
        "name": "Macarrão ao Alho e Óleo",
        "ingredients": [
          "500g de macarrão",
          "4 dentes de alho picados",
          "4 colheres de sopa de azeite",
          "Sal a gosto",
          "Salsa picada para decorar (opcional)"
        ],
        "image": "https://www.tudogostoso.com.br/noticias/receitas-com-poucos-ingredientes-a5313.htm",
        "video": "https://www.youtube.com/watch?v=example1"
      },
      {
        "id": 2,
        "name": "Frango Assado com Creme de Cebola e Maionese",
        "ingredients": [
          "1 kg de coxas e sobrecoxas de frango",
          "1 pacote de creme de cebola",
          "200g de maionese",
          "Sal e pimenta a gosto"
        ],
        "image": "https://www.tudogostoso.com.br/noticias/receitas-com-poucos-ingredientes-a5313.htm",
        "video": "https://www.youtube.com/watch?v=example2"
      },
      {
        "id": 3,
        "name": "Omelete Rápido",
        "ingredients": [
          "3 ovos",
          "Sal e pimenta a gosto",
          "50g de queijo ralado",
          "50g de presunto picado",
          "Salsa picada para decorar"
        ],
        "image": "https://www.tudogostoso.com.br/noticias/receitas-com-poucos-ingredientes-a5313.htm",
        "video": "https://www.youtube.com/watch?v=example3"
      },
      {
        "id": 4,
        "name": "Bolo de Pão de Queijo",
        "ingredients": [
          "500g de polvilho doce",
          "3 ovos",
          "200ml de leite",
          "100ml de óleo",
          "200g de queijo ralado",
          "Sal a gosto"
        ],
        "image": "https://www.tudogostoso.com.br/noticias/receitas-com-poucos-ingredientes-a5313.htm",
        "video": "https://www.youtube.com/watch?v=example4"
      },
      {
        "id": 5,
        "name": "Brigadeiro",
        "ingredients": [
          "1 lata de leite condensado",
          "2 colheres de sopa de cacau em pó",
          "1 colher de sopa de manteiga",
          "Chocolate granulado para enrolar"
        ],
        "image": "https://elpais.com/us/projeto-cocina/2024-11-28/brigadeiros.html",
        "video": "https://www.youtube.com/watch?v=example5"
      }
    ]
    
  }

  findOne(id: number) {
    return `This action returns a #${id} recipe`;
  }

  update(id: number, updateRecipeDto: UpdateRecipeDto) {
    return `This action updates a #${id} recipe`;
  }

  remove(id: number) {
    return `This action removes a #${id} recipe`;
  }
}
