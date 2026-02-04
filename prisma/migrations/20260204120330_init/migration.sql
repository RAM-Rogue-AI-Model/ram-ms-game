-- DropForeignKey
ALTER TABLE `Game_Step` DROP FOREIGN KEY `Game_Step_game_id_fkey`;

-- DropIndex
DROP INDEX `Game_Step_game_id_fkey` ON `Game_Step`;

-- AddForeignKey
ALTER TABLE `Game_Step` ADD CONSTRAINT `Game_Step_game_id_fkey` FOREIGN KEY (`game_id`) REFERENCES `Game`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
