-- AlterTable
ALTER TABLE "recipe" ADD COLUMN     "evaluation_average" DOUBLE PRECISION DEFAULT 0;

-- CreateTable
CREATE TABLE "recipe_evaluation" (
    "id" TEXT NOT NULL,
    "stars" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "recipe_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recipe_evaluation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recipe_evaluation" ADD CONSTRAINT "recipe_evaluation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_evaluation" ADD CONSTRAINT "recipe_evaluation_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
