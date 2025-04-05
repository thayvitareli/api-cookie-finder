/*
  Warnings:

  - You are about to drop the `favorite_recipes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "favorite_recipes" DROP CONSTRAINT "favorite_recipes_recipe_id_fkey";

-- DropForeignKey
ALTER TABLE "favorite_recipes" DROP CONSTRAINT "favorite_recipes_user_id_fkey";

-- DropTable
DROP TABLE "favorite_recipes";

-- CreateTable
CREATE TABLE "favorite_recipe" (
    "recipe_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "favorite_recipe_pkey" PRIMARY KEY ("recipe_id","user_id")
);

-- AddForeignKey
ALTER TABLE "favorite_recipe" ADD CONSTRAINT "favorite_recipe_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_recipe" ADD CONSTRAINT "favorite_recipe_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
