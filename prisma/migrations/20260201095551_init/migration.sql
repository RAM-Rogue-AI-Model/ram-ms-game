-- CreateTable
CREATE TABLE `Game` (
    `id` VARCHAR(191) NOT NULL,
    `pv` INTEGER NOT NULL,
    `consumables` JSON NOT NULL,
    `money` INTEGER NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `ended` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Game_Step` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('DUNGEON', 'SHOP', 'DATACENTER') NOT NULL,
    `completed` BOOLEAN NOT NULL DEFAULT false,
    `date_add` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `game_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Game_Step` ADD CONSTRAINT `Game_Step_game_id_fkey` FOREIGN KEY (`game_id`) REFERENCES `Game`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
