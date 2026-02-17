/*
  Warnings:

  - You are about to drop the column `image` on the `recipe` table. All the data in the column will be lost.
  - You are about to drop the column `video` on the `recipe` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `recipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "recipe" DROP COLUMN "image",
DROP COLUMN "video",
ADD COLUMN     "image_uri" TEXT,
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD COLUMN     "video_uri" TEXT;

-- AddForeignKey
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
