-- CreateTable
CREATE TABLE "favorite_recipes" (
    "recipe_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "favorite_recipes_pkey" PRIMARY KEY ("recipe_id","user_id")
);

-- AddForeignKey
ALTER TABLE "favorite_recipes" ADD CONSTRAINT "favorite_recipes_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_recipes" ADD CONSTRAINT "favorite_recipes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
