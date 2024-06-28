-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : jeu. 27 juin 2024 à 23:21
-- Version du serveur : 8.0.37-0ubuntu0.22.04.3
-- Version de PHP : 8.3.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `asmtariste`
--

-- --------------------------------------------------------

--
-- Structure de la table `articles`
--

CREATE TABLE `articles` (
  `id_articles` int NOT NULL,
  `title` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `creation_date` date DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `cover` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isDisplay` tinyint(1) DEFAULT NULL,
  `id_categories` int NOT NULL,
  `id_users` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `articles`
--

INSERT INTO `articles` (`id_articles`, `title`, `creation_date`, `description`, `cover`, `isDisplay`, `id_categories`, `id_users`) VALUES
(1, 'ASMtariSTe est ouvert !', '2024-06-13', 'En ce 13 juin 2024 à exactement 20h21, le site est prêt et ce premier article aussi ! \nIl s\'agit d\'un projet à double utilité pour moi-même et je vais vous expliquer de quoi il s\'agit ;)', '1718303556585.webp', 1, 2, 1),
(7, 'Savoir configurer les outils de développement', '2024-06-18', 'Avant toute chose, pour commencer à écrire du code, tu auras besoin de plusieurs outils et il te faudra apprendre à les utiliser. Ces outils peuvent être soit sur PC, soit directement sur Atari ST.', '1718716596236.jpg', 1, 1, 1),
(9, 'Le Système d\'Exploitation TOS', '2024-06-19', 'Le système d\'exploitation TOS (The Operating System) peut être subdivisé en différentes sections. La communication avec les utilisateurs est réalisée via GEM, qui offre une interface utilisateur confortable et se compose des fonctions AES et VDI.', '1718794316194.webp', 1, 3, 1),
(10, 'À propos du BIOS', '2024-06-19', 'Le BIOS (Basic Input/Output System) représente l\'interface de plus bas niveau entre le système d\'exploitation de l\'Atari et le matériel, et est appelé via le Trap #13 du 680X0. Il est préférable que ces fonctions ne soient pas utilisées par les programmes applicatifs, car des fonctions beaucoup plus puissantes à un niveau supérieur sont disponibles pour fournir de meilleures alternatives', NULL, 1, 3, 1);

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

CREATE TABLE `categories` (
  `id_categories` int NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `categories`
--

INSERT INTO `categories` (`id_categories`, `name`) VALUES
(1, 'Coding'),
(2, 'News'),
(3, 'Doc');

-- --------------------------------------------------------

--
-- Structure de la table `certificates`
--

CREATE TABLE `certificates` (
  `id_certificates` int NOT NULL,
  `creationDate` date DEFAULT NULL,
  `note` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `certificates`
--

INSERT INTO `certificates` (`id_certificates`, `creationDate`, `note`) VALUES
(16, '2024-06-24', 16);

-- --------------------------------------------------------

--
-- Structure de la table `choices`
--

CREATE TABLE `choices` (
  `id_choices` int NOT NULL,
  `choice_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `answer` tinyint(1) DEFAULT NULL,
  `id_questions` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `choices`
--

INSERT INTO `choices` (`id_choices`, `choice_name`, `answer`, `id_questions`) VALUES
(1, 'réponse 1', 1, 1),
(2, 'réponse 2', 0, 1),
(3, 'réponse 3', 0, 1),
(4, 'réponse 1', 0, 2),
(5, 'réponse 2', 1, 2),
(6, 'réponse 3', 0, 2),
(7, 'réponse 1', 0, 3),
(8, 'réponse 2', 0, 3),
(9, 'réponse 3', 1, 3);

-- --------------------------------------------------------

--
-- Structure de la table `contents`
--

CREATE TABLE `contents` (
  `id_contents` int NOT NULL,
  `title_left` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title_right` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title_center` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `text_left` text COLLATE utf8mb4_unicode_ci,
  `text_right` text COLLATE utf8mb4_unicode_ci,
  `text_center` text COLLATE utf8mb4_unicode_ci,
  `image_left` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_right` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_center` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attachement_left` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attachement_right` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attachement_center` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `page` tinyint DEFAULT NULL,
  `id_templates` int NOT NULL,
  `id_articles` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `contents`
--

INSERT INTO `contents` (`id_contents`, `title_left`, `title_right`, `title_center`, `text_left`, `text_right`, `text_center`, `image_left`, `image_right`, `image_center`, `attachement_left`, `attachement_right`, `attachement_center`, `page`, `id_templates`, `id_articles`) VALUES
(1, 'C\'est de là que je viens !', 'C\'est par-là que je vais :D', '', 'Oui je viens surtout du monde de l\' <span class=\"hashtag\">Amstrad</span>, une communauté qui partage énormément et qui reste ultra dynamique encore en 2024. <span class=\"bold\">Plus d\'une centaine de production chaque année</span> (france, espagne, angleterre, allemagne ...) des outils de développement sont également crées comme <span class=\"color-red\">Arkos Tracker</span> pour la musique (merci Julien) ou <span class=\"color-red\">IMPDraw 2</span> qui est carrément une suite d\'outils graphiques ultra complète (Merci AST !).<br><br>\nEt comme si ce n\'était pas suffisant certain comme BDCIron on carrément créé <span class=\"bold\">un site complet pour l\'apprentissage de l\'assembleur sur Zilog 80</span> (zilog.fr). <br>\nBref çà rigole pas.', 'J\'ai pu participer à mon premier event il \'y a deux années de celà, c\'était au <span class=\"hashtag\">GemTOS</span>. Une convention en béton armé qui montre qu\'il y\'a beaucoup de monde chez les ataristes et tous très créatif ! A cette époque je découvrais tout juste l\'assembleur 68000 et j\'ai fait de superbe rencontre et appris beaucoup de chose ce week-end là !\nC\'est bien mais question <span class=\"italic\">\"je trouve les informations facilement ET  en français\"</span> ... c\'est pas trop çà sur cette bécane.<br>\nFranchement chez les ataristes c\'est un peu moue de la chique question transmission du savoir en comparaison avec les amstradiens.<br>\nDonc quand un truc me plaît pas et bien je prends ma cervelle et mes petits doigts et je me met au boulot !', '', NULL, NULL, NULL, '', '', '', 1, 3, 1),
(2, 'Mais je compte faire quoi ?', '', '', 'Et bien pour commencer je souhaite proposer quelque chose<span class=\"bold\"> qui permette à n\'importe quel débutant de se mettre à la programmation en assembleur.</span> <br>\n<br>\nEn simplifiant, en donnant des exemples, en schématisant, en proposant de la documentation, en rassemblant un maximum de source, et en faisant !', '', '', NULL, NULL, NULL, '', '', '', 1, 1, 1),
(3, '', '', '', '', '', 'Le screen, là haut à droite, c\'est mon premier <span class=\"italic\">\"Zelda like\"</span> que j\'ai pu coder sur mon 1040 Ste, et toi, <span class=\"bold\">OUI TOI !!!!</span> Tu es CAPABLE de coder en assembleur, sauf que sans aucune information où avec seulement des bouts de ficelles c\'est compliqué, puis au bout d\'un moment t\'en a marre et donc tu finis par laisser tomber.\r\n\r\nJe te parlerai aussi des sources  d\'informations qui m\'ont aidé à comprendre des trucs, notamment les vidéos de la chaine <span class=\"color-red\">VRetroComputing</span>, pédagogue, carré, clair net et précis ! Y\'en a .... mais c\'est le seul à fournir un support réellement pédagogique.\r\n', NULL, NULL, NULL, '', '', '', 1, 4, 1),
(4, '', '', '', '', '', '', '1718305823149.png', '1718305823175.png', NULL, '', '', '', 1, 2, 1),
(5, '', '', 'Il va se passer quoi maintenant ?', '', '', 'Et bien c\'est simple tu vas se poser tranquille dans ton canapé, une bière à la main à mater une série sur <span class=\"bold\"><span class=\"color-blue\">Prime vidéo</span></span>. Et moi pendant ce temps je me donne <span class=\"bold\">jusqu\'à la fin du mois de juin</span>, pour re factoriser mon code, et faire çà plus proprement, me donner aussi un peu plus de confort quant à l’ergonomie de mon back-office (qui représente tout de même 80% du site. La partie visible (donc public) ne représente finalement pas grand chose).<br>\n<br>\n<br>\nRevenez y de temps en temps vous y verrez certainement des ajouts, notamment les unités de disque, qui serviront de tiroirs à fichiers en tout genre. Mais ce sera classé et bien rangé !<br>\n<br>\nA l\'occasion de ce site web, j\'ai créé un groupe <span class=\"hashtag\">facebook</span> qui s\'appelle tout simplement <span class=\"bold\"><span class=\"color-blue\">\"L\'assembleur 68000 sur Atari ST\"</span></span>.<br>\nIl y\'a à l\'heure actuelle, une cinquantaine de personnes, ce groupe a été ouvert il y\'a à peine 2 semaines.<br>\n<br>\nIl existe aussi un <span class=\"hashtag\">Discord</span> dont voici le lien d\'invitation (qu\'il faut copier coller car j\'ai pas encore mis de fonctionnalité de lien) :<br>\n<a class=\"link\" href=\"https://discord.gg/WPAsfrng5n\" target=\"blank\">https://discord.gg/WPAsfrng5n</a><br>\n<br>\n<br>\nVoilà voilà, je crois que j\'ai tout dis !<br>\n@pluche !', NULL, NULL, NULL, '', '', '', 1, 4, 1),
(82, '', '', '', '', '', 'Si tu n’as pas de vraie machine chez toi, ce n’est pas très grave car il existe ce que l’on appelle des émulateurs, ce sont des  logiciels qui reproduisent l’interface et le comportement de l’Atari. <br>\n<br>\nIl en existe plusieurs, mais seuls deux sont réellement efficaces : <span class=\"hashtag\">Hatari 2.5</span> et <span class=\"hashtag\">Steem SSE</span> <span class=\"italic\">(personnellement, je ne suis pas à l’aise avec Steem SSE, je préfère Hatari, mais tu es libre de choisir celui qui te semble le plus adapté pour toi).</span><br>\nVoici où tu peux télécharger ces 2 émulateurs : <br>\n<a class=\"link\" href=\"https://hatari.tuxfamily.org/download.html\" target=\"blank\">Hatari download page</a><br>\n<a class=\"link\" href=\"https://sourceforge.net/projects/steemsse/\" target=\"blank\">Steven Seagal Emulator</a><br>\n<br>\n', NULL, NULL, NULL, '', '', '', 1, 4, 7),
(83, '', '', '', '', '', '', '1718723460905.png', '1718723460906.png', NULL, '', '', '', 1, 2, 7),
(84, 'II.L’éditeur / assembleur / débugger', '', '', '<span class=\"underline\">1 – L’assembleur</span><br>\n<br>\nLe premier outil est l\'assembleur lui-même. Il sert à prendre le code que tu as tapé et à le transformer <span class=\"bold\">dans le seul langage compréhensible par un ordinateur : le langage machine</span> <span class=\"italic\">(un langage composé uniquement de 0 et de 1, également appelé binaire, mais nous y reviendrons plus tard).</span><br>\n<br>\n<span class=\"underline\">2 – L’éditeur</span><br>\n<br>\nCet outil est muni d\'un éditeur de texte qui te permet de taper du code. C\'est précisément ce code qui est destiné à être assemblé pour être ensuite envoyé ou copié dans la mémoire de l\'ordinateur (la RAM), où il sera lu. Voici un schéma à droite qui représente les différentes étapes.<br>\n', '', '', NULL, '1718723623682.png', NULL, '', '', '', 2, 1, 7),
(85, '', '3 – Le débugger', '', '', 'Cet assembleur est souvent accompagné d’un débugger, qui peut être utilisé pour voir ce qui se passe dans la mémoire de l’ordinateur. <br>\nPar exemple, ton programme, une fois assemblé puis envoyé dans la RAM, peut tout à fait être visible par ce débugger ; il permet notamment de suivre pas à pas le comportement de ton programme.<br>\n<br>\nSur <span class=\"italic\">Atari ST</span>, l’assembleur le plus populaire est <span class=\"hashtag\">DevPac v3</span> de chez Hisoft<span class=\"italic\"> (jette un œil dans le menu de l’unité C du site)</span>. Sur PC, plusieurs solutions sont possibles pour les éditeurs, par exemple le tout simple mais efficace <span class=\"hashtag\">Notepad++</span> ou carrément des IDE comme <span class=\"hashtag\">VS Code</span>.', '', '1718723761781.png', NULL, NULL, '', '', '', 2, 6, 7),
(86, '', '', '', '', '', 'Cette introduction est terminée, mais il va falloir encore patienter un tout petit peu avant de commencer à coder quelque chose. Il faut configurer ton émulateur et pour débuter je te propose l’utilisation de <span class=\"hashtag\">Hatari</span> et de l’assembleur <span class=\"hashtag\">DevPac v3</span>.', NULL, NULL, NULL, '', '', '', 2, 4, 7),
(87, '', '', 'III. Configuration de l’émulateur Hatari', '', '', '<span class=\"underline\">1 – Le TOS</span><br>\n<br>\nLa première fois que tu vas lancer <span class=\"bold\">Hatari</span>, tu n’auras pas le bureau de GEM traditionnel que tu connais, mais un autre, c’est <span class=\"hashtag\">EmuTOS</span> ! Pour faire court, c’est un TOS plus évolué que l’original avec des options supplémentaires dans les menus entre autres choses.', NULL, NULL, NULL, '', '', '', 3, 4, 7),
(88, '', '', '', '', '', '', NULL, NULL, '1718723968823.png', '', '', '', 3, 5, 7),
(89, '', '', '', '', '', '<div class=\"border-green\"><p>Si tu préfères un TOS original, je te propose le <span class=\"hashtag\">TOS 1.62</span> qui correspond à la gamme des <span class=\"italic\">Atari 1040 STe</span>. Tu trouveras ton bonheur dans l’unité C du site (je n’ai mis que les TOS ‘french’).</p></div><br>\n<br>\nSi tu souhaites en revanche garder <span class=\"hashtag\">EmuTOS</span>, pas de souci mais on va en choisir un qui est en français, c’est quand même mieux. Bref, choisis ton TOS du moment qu’il est compatible avec un STE (bah oui, qui peut le plus peut le moins).', NULL, NULL, NULL, '', '', '', 3, 4, 7),
(91, '', '', '', 'Tu copies le fichier à la racine du répertoire de <span class=\"bold\">HATARI</span> ou, si tu préfères, tu te fais un dossier. Dans <span class=\"bold\">HATARI</span>, tu fais :<br>\n<br>\n<span class=\"keyboard-key\">F12</span> → <span class=\"color-green\">ROM</span> et dans la zone <span class=\"color-green\">TOS Setup</span> tu peux voir qu’actuellement c’est le fichier <span class=\"italic\">tos.img</span> qui est mis par défaut.<br>\nDonc tu cliques sur le bouton <span class=\"color-green\">Browse</span> pour choisir le TOS que tu as téléchargé.<br>\n<br>\nPuis <span class=\"color-green\">OK</span> → <span class=\"color-green\">Back to main menu</span> → <span class=\"color-green\">Save config</span> → <span class=\"color-green\">OK</span> → <span class=\"color-green\">Reset machine</span> → <span class=\"color-green\">OK</span> … et là PAF ! <br>\nUn nouveau TOS ! Ou pas … si <span class=\"bold\">HATARI</span> détecte un nouveau TOS, il va configurer tout seul le reste pour être en adéquation avec le TOS que tu lui as mis.<br>\n<br>\nEn général, tu as le message suivant :', '', '', NULL, '1718724488738.png', NULL, '', '', '', 3, 1, 7),
(92, '', '', '', '', '', '', NULL, NULL, '1718724506694.png', '', '', '', 3, 5, 7),
(93, '', '', '', '', '', 'Et voilà ta machine est prête !<br>\n<br>\nEnfin … presque, il y a deux trois petites choses à savoir. Quand tu vas commencer à coder, tu vas devoir enregistrer tes programmes ainsi que tes nombreux fichiers de sprites sur des disquettes … <div class=\"border-red\"><p>mais là je te déconseille de miser sur ce support d’autant plus qu’à l’époque on pouvait brancher un disque dur au cul de l’Atari !</p></div> Et donc c’est ce que l’on va faire … au moins virtuellement !', NULL, NULL, NULL, '', '', '', 3, 4, 7),
(94, '', '', '', '', '', '', NULL, NULL, '1718724600539.png', '', '', '', 3, 5, 7),
(95, '', '2 – Hard Drive Disk', '', '', 'Les disques durs ACSI (Atari Computer System Interface) étaient des périphériques de stockage utilisés avec les micro-ordinateurs Atari ST. <br>\n<br>\nL\'<span class=\"hashtag\">ACSI</span> est une interface propriétaire développée par Atari, basée sur une version simplifiée de l\'interface <span class=\"hashtag\">SCSI</span> <span class=\"italic\">(Small Computer System Interface)</span>.<br>\n<br>\n', '', '1718724731410.png', NULL, NULL, '', '', '', 3, 6, 7),
(96, '', '', '', '', '', 'Il te faut une image vierge de ce support pour l’utiliser avec l’émulateur <span class=\"bold\">HATARI</span>, en voici une <a class=\"file\" href=\"assets/files/ACSI_harddrive_image.80.zip\" target=\"blank\">ACSI_harddrive_image.80</a> qui fait 80 Mb. Colles-moi ça à la racine de ton dossier Hatari.<br>\n<br>\nUn petit <span class=\"keyboard-key\">F12</span> → <span class=\"color-green\">Hard Disks</span> et on va dans <span class=\"color-green\">ACSI HD</span> → <span class=\"color-green\">Browse</span> et choisis le fichier que tu viens de copier.<br>\nEnsuite, coche la case <span class=\"color-green\">Boot from hard disk</span>, puis la même chose que d’habitude : <br>\n<span class=\"color-green\">Back to main menu</span> → <span class=\"color-green\">Save config</span> → <span class=\"color-green\">OK</span> → <span class=\"color-green\">Reset machine</span> → <span class=\"color-green\">OK</span>.<br>\n<br>\nLà tu devrais voir ceci. : ', NULL, NULL, NULL, '', '', '', 3, 4, 7),
(97, '', '', '', '', '', '', NULL, NULL, '1718726150563.png', '', '', '', 3, 5, 7),
(98, '', '', '', '', '', 'Si tu ouvres le disque C, tu verras qu’il n’y a rien mis à part un fichier nommé <span class=\"bold\">SHDRIVER.SYS</span>.<br>\n<br>\n<div class=\"border-red\"><p> NE L’EFFACE JAMAIS SINON TU PEUX DIRE ADIEU À CE QUE CONTIENT TON DISQUE DUR !</p></div><br>\n<br>\nBref, dans ce disque dur tu pourras y mettre par exemple <span class=\"bold\">DevPac</span>, tes sources (c’est comme ça qu’on appelle le code que tu vas taper) et tous les outils qui ont besoin à l’origine de lire des disquettes : gros gain de temps et d’ergonomie !<br>\n<br>\n<br>\nMais ce n’est pas encore suffisant, il y a mieux. <br>\nJe t’explique, une fois tes sources enregistrées dans ce disque dur de type <span class=\"bold\">ACSI</span>, c’est mort pour que tu puisses y avoir accès une fois l’émulateur fermé. Imagine le scénario : ton pote a un <span class=\"bold\">Ultra Satan</span> et il veut tester ton code sur sa machine, pas pratique sans accès direct aux fichiers depuis ton PC. Donc je te montre une solution magique, tu vas créer un dossier à la racine de ton répertoire où se trouve ton émulateur. <br>\n', NULL, NULL, NULL, '', '', '', 3, 4, 7),
(99, '', '', '', '', 'Tu vas l’appeler « Hard Drive » ou ce que tu veux, on s’en fout. Et dans ce même répertoire, tu vas créer plusieurs sous-dossiers genre D, E, F, G, H, I, J … etc.<br>\n<br>\nDans ton émulateur : <span class=\"keyboard-key\">F12</span> → <span class=\"color-green\">Hard disk</span> → <span class=\"color-green\">GEMDOS Drive</span>, tu choisis le dossier hard_drive que tu as créé, puis n’oublie pas de cocher la case <span class=\"color-green\">Add GEMDOS HD after</span> blablabl …<br>\n<span class=\"color-green\">Back to main menu</span> → <span class=\"color-green\">Save config</span> → <span class=\"color-green\">OK</span> → <span class=\"color-green\">Reset machine</span> → <span class=\"color-green\">OK</span>.<br>\n<br>\nAlors là tu te dis « mais il a craqué <span class=\"bold\">HATARI</span>, pourquoi il marque que c’est une cartouche ? » … et bien j’en sais rien, je me suis dit la même chose que toi, on va le virer : <br>\n<br>\nTu sélectionnes C : Cartouche et dans le menu du GEM tu vas dans <span class=\"color-green\">Options</span> → <span class=\"color-green\">Installer une unité de disque</span> → <span class=\"color-green\">Enlever</span>.', '', '1718726980204.png', NULL, NULL, '', '', '', 3, 6, 7),
(100, '', '', '', '', '', 'Ensuite tu refais la même manipulation en sélectionnant C : Disque. Mais cette fois-ci tu mets « installer » au lieu d’enlever comme ceci :', NULL, NULL, NULL, '', '', '', 3, 4, 7),
(101, '', '', '', '', '', '', NULL, NULL, '1718727038543.png', '', '', '', 3, 5, 7),
(102, '', '', '', '', '', 'À partir de maintenant, tous les fichiers que tu copieras dans le dossier <span class=\"bold\">hard_drive/D</span> de ton PC seront visibles également dans le GEM de ton émulateur ! À toi d’en créer le nombre que tu veux du moment que ça te permette d’être organisé pour la suite !<br>\n<br>\n<br>\n<span class=\"underline\">3 – Le clavier</span><br>\n<br>\nPour finir, la configuration du clavier dans l’émulateur doit être réglée sur  <span class=\"color-green\">Scancode</span>. Cela te simplifiera l’écriture du code en utilisant les touches réelles de ton clavier PC.<br>\nVoilà, c’est terminé ! À partir de maintenant, tu possèdes un <span class=\"bold\">Atari 1040 ST</span> dans ton PC ! Nous allons pouvoir passer à la suite !', NULL, NULL, NULL, '', '', '', 3, 4, 7),
(103, '', '', '', '', '', '', NULL, NULL, '1718727132423.png', '', '', '', 3, 5, 7),
(104, '', '', '', '', '', 'En plus de cela, de nombreuses autres routines sont disponibles, lesquelles peuvent être réparties dans l\'une des catégories suivantes :<br>\n<br>\n - <span class=\"bold\">GEMDOS</span><br>\n-  <span class=\"bold\">BIOS</span><br>\n-  <span class=\"bold\">XBIOS</span><br>\n<br>\nLe <span class=\"bold\">TOS</span> remonte à l\'année 1985. Au fil du temps, il a été développé davantage par <span class=\"bold\">Atari</span> et est disponible pour divers modèles d\'ordinateurs (ST, STE, Mega-ST, TT, Falcon, ...). De plus, il existe un certain nombre de systèmes compatibles TOS proposés par des tiers.<br>\n<br>\nIl convient de mentionner à cet égard, surtout, <a class=\"link\" href=\"https://www.atariuptodate.de/en/6/magic#\" target=\"blank\">MagiC</a> et <a class=\"link\" href=\"https://www.atariuptodate.de/en/5/geneva\" target=\"blank\">Geneva</a>. Alors que <span class=\"bold\">MagiC</span> est devenu particulièrement important en Allemagne (et au Royaume-Uni), <span class=\"bold\">Geneva</span> semble avoir rencontré un certain succès aux États-Unis.<br>\n<br>\nGrâce à <a class=\"link\" href=\"https://gitlab.com/AndreasK/AtariX\" target=\"blank\">MagiC Mac</a>, une implémentation de <span class=\"bold\">MagiC</span> sur le matériel Apple (Power) Macintosh, les programmes TOS fonctionnent désormais également sur les ordinateurs Apple.<br>\nUne variante ultérieure, <a class=\"link\" href=\"https://magicpc.atari-users.com/\" target=\"blank\">MagiC PC</a>, a également étendu cette compatibilité à de nombreuses machines Windows.\n', NULL, NULL, NULL, '', '', '', 1, 4, 9),
(105, 'GEM (Graphics Environment Manager) ', '', '', 'Il fait partie du système d\'exploitation et représente l\'interface (graphique) entre l\'ordinateur et l\'utilisateur. <br>\n<span class=\"bold\">GEM</span> a été développé par l\'entreprise <a class=\"link\" href=\"https://fr.wikipedia.org/wiki/Digital_Research\" target=\"blank\">Digital Research</a> en 1984 pour les PC avec processeurs Intel. Le système est devenu bien connu surtout lorsque l\'Atari ST a été commercialisé, offrant une alternative puissante et abordable aux machines PC et Macintosh coûteuses de l\'époque.<br>\n<br>\nAu fil du temps, GEM a été adapté à divers systèmes d\'exploitation et plateformes matérielles, y compris :<br>\n<br>\n- PC GEM<br>\n- Atari GEM<br>\n- GEM sur X <span class=\"italic\">(version pour systèmes Unix)</span><br>\n- X/GEM <span class=\"italic\">(pour le système d\'exploitation FlexOS)</span><br>\n<br>\nGEM peut être divisé en deux sous-ensembles :<br>\n<br>\n- AES, Application Environment Services<br>\n- VDI, Virtual Device Interface<br>\n<br>\nL\'<span class=\"bold\">AES</span> se charge de l\'organisation de l\'environnement utilisateur, tandis que le <span class=\"bold\">VDI</span> s\'occupe de l\'affichage graphique uniforme de l\'interface utilisateur.<br>\nLors du développement de programmes <span class=\"bold\">GEM</span>, il est impératif de respecter les lignes directrices en vigueur et de ne jamais tenter d\'imposer à l\'utilisateur une interface qui ne respecte aucune norme.<br>\n<br>\n', '', '', NULL, NULL, NULL, '', '', '', 2, 1, 9),
(107, '', '', 'Les différentes versions de GEM', '', '', 'Pour connaître le numéro de version de <span class=\"bold\">GEM</span>, on utilise généralement <span class=\"underline\">l\'ID renvoyé dans le champ global par l\'appel appl_init</span>. Le <span class=\"bold\">VDI</span>, en revanche, <span class=\"underline\">n\'a en réalité pas de numéro de version propre</span>, d\'autant plus que le comportement des fonctions <span class=\"bold\">VDI</span> individuelles est principalement <span class=\"underline\">déterminé par les pilotes de périphériques utilisés</span>, qui sont, après tout, remplaçables.<br>\n<br>\nOn peut globalement différencier les versions de <span class=\"bold\">GEM</span> suivantes :', NULL, NULL, NULL, '', '', '', 2, 4, 9),
(108, 'GEM 1.x', '', '', 'Cette première version de l\'<span class=\"bold\">AES (1.x)</span> avait, non par hasard, <span class=\"underline\">de grandes similitudes avec le système d\'exploitation du Macintosh d\'Apple</span>.<br>\n<br>\nCela se manifestait non seulement dans la conception des éléments de fenêtre, mais aussi dans de nombreuses fonctionnalités du bureau et d\'autres programmes d\'application. <br>\n<br>\nÀ l\'époque, <span class=\"bold\">GEM</span> était présenté principalement en connexion avec des versions d\'essai de <span class=\"bold\">GEM-Draw</span>, <span class=\"bold\">GEM-Paint</span> et <span class=\"bold\">GEM-Write</span>, qui correspondaient en de nombreux détails aux prototypes Macintosh bien connus <span class=\"bold\">MacDraw</span>, <span class=\"bold\">MacPaint</span> et <span class=\"bold\">MacWrite</span>.<br>\n<br>\n', '', '', NULL, '1718797580661.png', NULL, '', '', '', 2, 1, 9),
(109, '', '', '', '', '', 'C\'est également la version adoptée par Atari et livrée dans le ST ; toutes les versions plus récentes de l\'Atari-GEM sont également basées sur cette version.<br>\nEn effet, la société Atari a acquis tous les droits sur la version existante et a continué à la développer elle-même. Cela explique également les différences de plus en plus grandes entre <span class=\"bold\">PC-GEM</span> et <span class=\"bold\">Atari-GEM</span>. <br>\n<br>\nLe plus grand défaut de la version Atari était certainement l\'absence du <span class=\"bold\">Graphics Device Operating System (GDOS)</span> ; celui-ci contient des fonctions graphiques indépendantes du périphérique, qui n\'étaient implémentées sur l\'Atari que pour l\'écran, et devaient donc être chargées séparément pour les imprimantes, traceurs, caméras, etc. <br>\nEn conséquence <span class=\"italic\">(surtout dans les premiers jours de l\'Atari)</span>, chaque programme utilisait ses propres pilotes et formats, rendant ainsi l\'échange de données entre applications presque impossible.', NULL, NULL, NULL, '', '', '', 2, 4, 9),
(110, 'GEM 2.x', '', '', 'En raison d\'un différend juridique entre <span class=\"bold\">Apple</span> et <span class=\"bold\">Digital Research</span> <span class=\"italic\">(concernant principalement l\'apparence des programmes d\'application et du bureau)</span>, la version PC de GEM a dû être modifiée.<br>\n<br>\nLe règlement, qui n\'affectait pas la version GEM d\'Atari, ressemblait à ceci :<br>\n<br>\n- <span class=\"color-blue\">Certains éléments de fenêtre</span> ont été modifiés de telle sorte qu\'ils ne ressemblaient plus aux fenêtres du Macintosh <span class=\"italic\">(surtout la barre de titre)</span><br>\n<br>\n- <span class=\"color-blue\">Le menu Accessory</span> a été déplacé dans le coin opposé (droit) de l\'écran<br>\n<br>\n- <span class=\"color-blue\">Les fonctions <span class=\"bold\">graf_growbox</span> et <span class=\"bold\">graf_shrinkbox</span> </span>ont été éliminées<br>\n<br>\n- <span class=\"color-blue\">Le bureau</span> a été entièrement reprogrammé et limité à deux fenêtres fixes.', '', '', NULL, '1718797918001.png', NULL, '', '', '', 2, 1, 9),
(111, '', '', '', '', '', 'Contrairement aux idées reçues, il ne s\'agissait cependant <span class=\"underline\">que d\'une modification du bureau</span>, et non de l\'<span class=\"bold\">AES</span>, qui continuait à permettre jusqu\'à huit fenêtres superposées.<br>\nCependant, il n\'y avait pas que des restrictions, mais aussi des améliorations. L\'exemple le plus important à mentionner est que les accessoires pouvaient installer leur propre barre de menu.<br>\n<br>\nCette version a reçu le numéro de <span class=\"bold\">version 2.0</span> et a été fournie <span class=\"underline\">à partir de 1987</span> ; peu de temps après, elle a été portée par la société de logiciels néerlandaise <span class=\"bold\">ABC</span> avec <span class=\"bold\">GEM-Draw</span>, <span class=\"bold\">GEM-Paint</span>, <span class=\"bold\">GEM-Graph</span> et bien sûr le bureau GEM sur l\'Atari.<br>\nCependant, cette version n\'a jamais vraiment pris de l\'importance et n\'est plus disponible aujourd\'hui.', NULL, NULL, NULL, '', '', '', 2, 4, 9),
(112, 'PC-GEM 3.x', 'GEM Desktop 3.13', '', 'Cette version contenait quelques améliorations mineures. Ainsi, le comportement du menu pouvait être commuté de déroulant à dépliant, par exemple.<br>\n<br>\nÀ partir de la version <span class=\"bold\">GEM/3 3.11</span>, il existe des fonctions <span class=\"bold\">VDI</span> supplémentaires, qui concernent <span class=\"color-blue\">les fonctions Bézier</span> et <span class=\"color-blue\">les imprimantes Postscript</span>.<br>\n<br>\nLe programme <span class=\"bold\">ARTLINE</span> utilise ces nouvelles fonctions avec ses polices vectorielles.<br>\n<br>\nEn raison de la domination de <span class=\"bold\">MS-Windows</span>, cette version a pratiquement disparu du marché des PC.', 'La dernière version standard vendue.<br>\n<br>\nPartie du <span class=\"bold\">GEM PTK/SDK 3.13</span> qui a finalement été réécrite pour prendre en charge les compilateurs <span class=\"bold\">ANSI C</span>.', '', NULL, NULL, '1718798259096.png', '', '', '', 2, 9, 9),
(113, 'GEM/4 ', 'GEM/5', '', 'N\'a atteint le marché qu\'en tant que support d\'exécution pour <span class=\"bold\">Artline/2</span>, <span class=\"bold\">PresTeam/2</span>, <span class=\"bold\">Publish it/3</span>, etc. Le <span class=\"bold\">VDI</span> utilisera <span class=\"bold\">EMS</span>, si disponible.<br>\n<br>\nLe bureau <span class=\"bold\">GEM/3</span> ne fonctionne pas correctement et une commande shell fournie pour lancer des applications <span class=\"bold\">GEM/4</span> à partir du bureau <span class=\"bold\">GEM/3</span> peut planter après une utilisation répétée.', 'N\'a atteint le marché qu\'en tant que support d\'exécution pour <span class=\"bold\">Timeworks Publisher 2.1</span>. Il avait un support de police évolutive utilisant la mémoire <span class=\"bold\">XMS</span> et ajoute un aspect 3D aux objets <span class=\"bold\">AES</span>.<br>\n<br>\n<span class=\"bold\">GEM/4 </span>et <span class=\"bold\">GEM/5</span> ont ajouté de nouveaux appels <span class=\"bold\">VDI</span> et <span class=\"bold\">AES</span>, mais leurs liaisons sont inconnues. <br>\n<br>\nCet <span class=\"bold\">AES 4.0</span> propriétaire prend en charge un nouveau message MU_HELP et certains appels prennent un paramètre supplémentaire pour une aide contextuelle.<br>\nCe que ces fonctionnalités font réellement n\'est pas connu.', '', NULL, NULL, NULL, '', '', '', 2, 3, 9),
(114, '', 'GEM/XM', '', '', 'Probablement le modèle pour le <span class=\"bold\">X/GEM</span> de <span class=\"bold\">DRI</span> pour <span class=\"bold\">FlexOS</span><span class=\"italic\"> (un système multitâche en mode protégé 32 bits)</span>.<br>\n<br>\n<span class=\"bold\">GEM/XM</span> prévoyait d\'apporter un support multitâche sous <span class=\"bold\">DOS</span>, mais est resté inachevé. La dernière version est FreeGEM/XM 3.0beta5-je1.', '', '1718799486380.png', NULL, NULL, '', '', '', 2, 6, 9),
(115, 'ViewMAX/1 (DR-DOS 5.0)', 'ViewMAX/3 (DR-DOS 7.0)', 'ViewMAX/2 (DR-DOS 6.0)', 'C\'est un noyau <span class=\"bold\">GEM/4</span> \"limité\" et ne peut être utilisé que comme un shell pour appeler des applications <span class=\"bold\">GEM</span>. <br>\nBien que conçu pour <span class=\"bold\">DR DOS</span>, il fonctionnera sous <span class=\"bold\">MS-DOS 3.x</span> et versions ultérieures <span class=\"italic\">(moins les mots de passe)</span>. <br>\nPour l\'utiliser avec des applications <span class=\"bold\">GEM</span>, vous devez avoir une installation<span class=\"bold\"> GEM/3</span> ainsi qu\'une installation <span class=\"bold\">ViewMAX</span>. Cette version a été écrite en <span class=\"bold\">Lattice C 3.x</span>.', 'Il n\'a jamais été publié, mais du code bêta est disponible.', 'C\' était une version améliorée de la précédente, mais avec les mêmes limitations de noyau que ci-dessus. Cette version a été réécrite en <span class=\"bold\">Turbo C2.0</span> et permet une configuration via un fichier *.ini.', NULL, NULL, NULL, '', '', '', 2, 7, 9),
(116, '', '', '', '', '', '', NULL, NULL, '1718799729572.png', '', '', '', 2, 5, 9),
(117, 'X/GEM', 'Atari-GEM 1.4', '', 'Cette version de <span class=\"bold\">GEM</span> a été développée par <a class=\"link\" href=\"https://fr.wikipedia.org/wiki/Digital_Research\" target=\"blank\">Digital Research</a> sur un système d\'exploitation multitâche multi-utilisateurs <span class=\"italic\">(FlexOS)</span>, et permet la gestion simultanée de plusieurs applications au premier plan.', 'Des modifications majeures ont été apportées par Atari uniquement dans <span class=\"bold\">GEM 1.4</span> de <span class=\"bold\">TOS 1.04</span> ; la fonctionnalité la plus connue est le sélecteur de fichiers grandement amélioré.', '', NULL, NULL, NULL, '', '', '', 2, 3, 9),
(118, '', '', '', '', '', '- <span class=\"bold\">Bconin</span> : Lire un caractère depuis un périphérique.<br>\n- <span class=\"bold\">Bconout</span> : Envoyer un caractère à une unité périphérique.<br>\n- <span class=\"bold\">Bconstat</span> : Obtenir le statut d\'entrée d\'une unité périphérique.<br>\n- <span class=\"bold\">Bcostat</span> : Obtenir le statut d\'un périphérique de sortie standard.<br>\n- <span class=\"bold\">Drvmap</span> : Obtenir des informations sur les périphériques attachés.<br>\n- <span class=\"bold\">Getbpb</span> : Obtenir l\'adresse du bloc de paramètres BIOS d\'une unité.<br>\n- <span class=\"bold\">Getmpb</span> : Déterminer le bloc de paramètres de mémoire.<br>\n- <span class=\"bold\">Kbshift</span> : Récupérer/mettre à jour le statut des touches de modification.<br>\n- <span class=\"bold\">Mediach</span> : Demander si le média a été changé.<br>\n- <span class=\"bold\">Rwabs</span> : Opération de lecture/écriture directe sur une unité.<br>\n- <span class=\"bold\">Setexc</span> : Définir et obtenir le vecteur d\'interruption.<br>\n- <span class=\"bold\">Tickcal</span> : Obtenir la différence de temps entre deux appels de minuterie.<br>\n<br>\nLe <span class=\"bold\">BIOS</span> est \"ré-entrant\" sous <span class=\"bold\">MagiC</span>. Cela signifie que ces fonctions <span class=\"underline\">peuvent également être appelées de manière répétée depuis des interruptions</span> <span class=\"italic\">(tant que la pile du superviseur concerné ne déborde pas...)</span>.<br>\n<br>\n<div class=\"border-yellow\"><p> - La zone <span class=\"bold\"><saveptr_area></span> du BIOS est toujours présente<span class=\"italic\"> (pour des raisons de compatibilité)</span>, mais elle n\'est pas utilisée par le système.<br>\n<br>\n - Les vérifications de pile de Turbo C/Pure-C échoueront pour les routines exécutées en mode superviseur <span class=\"italic\">(sous TOS, cela pouvait se produire uniquement pour les routines USERDEF dans l\'AES, qui sont également exécutées en mode superviseur)</span>.</p></div><br>\n<br>\nSi vous insérez vos propres routines dans le BIOS, assurez-vous qu\'elles soient entièrement ré-entrantes. Ne faites aucune supposition sur le contenu de la zone <span class=\"bold\"><saveptr_area></span> !<br>\n<br>\nLe <span class=\"bold\">BIOS</span> reçoit ses paramètres de la pile ; pour cela, le dernier argument de la liste de paramètres est stocké en premier sur la pile.<br>\n<div class=\"border-yellow\"><p>Les résultats des fonctions sont renvoyés dans le registre du processeur d0.<br>\nSeuls les registres d3-d7 et a3-a7 sont sauvegardés, tous les autres peuvent être modifiés par l\'appel.</p></div>', NULL, NULL, NULL, '', '', '', 1, 4, 10),
(119, 'Bconin', '', '', '<span class=\"bold\">Nom :</span> Entrée console BIOS<br>\n<span class=\"bold\">Opcode :</span> 2<br>\n<span class=\"bold\">Syntaxe :</span> int32_t Bconin ( int16_t dev );<br>\n<span class=\"bold\">Description :</span> La routine BIOS Bconin lit un caractère depuis un périphérique. Les périphériques suivants peuvent être spécifiés pour dev :<br>\n<br>\n0	prn: (Imprimante/Port parallèle)<br>\n1	aux: (périphérique auxiliaire, le port RS-232)<br>\n2	con: (Console)<br>\n3	Port MIDI<br>\n4	Port clavier<br>\n5	Écran<br>\n6	Port RS232 compatible ST (Modem 1)<br>\n7	Canal SCC B (Modem 2)<br>\n8	Port série TTMFP (Modem 3)<br>\n9	Canal SCC A (Modem 4)', '<div class=\"border-red\"><p>Notez que les numéros de périphérique à partir de 6 ne sont disponibles qu\'à partir du TOS030 de l\'Atari-TT. Une déclaration incorrecte pour dev peut entraîner un plantage du système.</p></div><br>\n<br>\n<span class=\"bold\">Valeur de retour :</span> La fonction renvoie le caractère lu comme une valeur ASCII dans les bits 0..7. Lors de la lecture depuis la console, <span class=\"underline\">les bits 16 à 23 contiennent le scan-code de la touche correspondante</span>. Si, en plus, le bit correspondant de la variable système <span class=\"italic\">conterm</span> est défini, alors les bits 24 à 31 contiennent la valeur actuelle de <span class=\"italic\">Kbshift</span>.<br>\n<br>\n<span class=\"bold\">Disponibilité :</span> Toutes les versions TOS.<br>\n<br>\n<span class=\"code\">move.w    dev,-(sp)    ; Offset 2\nmove.w    #2,-(sp)     ; Offset 0\ntrap      #13          ; Call BIOS\naddq.l    #4,sp        ; Correct stack</span>', '', NULL, NULL, NULL, '', '', '', 1, 3, 10),
(120, 'Bconout', '', '', '<span class=\"bold\">Nom :</span> Sortie console BIOS<br>\n<span class=\"bold\">Opcode :</span> 3<br>\n<span class=\"bold\">Syntaxe :</span> VOID Bconout ( int16_t dev, int16_t c );<br>\n<span class=\"bold\">Description :</span> La routine BIOS Bconout écrit le caractère c sur le périphérique dev. Les périphériques suivants peuvent être spécifiés pour dev :<br>\n<br>\n0	prn: (Imprimante/Port parallèle)<br>\n1	aux: (périphérique auxiliaire, le port RS-232)<br>\n2	con: (Console, terminal VT-52)<br>\n3	Port MIDI<br>\n4	Port clavier<br>\n5	Écran<br>\n6	Port RS-232 compatible ST (Modem 1)<br>\n7	Canal SCC B (Modem 2)<br>\n8	Port série TTMFP (Modem 3)<br>\n9	Canal SCC A (Modem 4)', '<div class=\"border-red\"><p>Notez que les numéros de périphérique à partir de 6 ne sont disponibles qu\'à partir du TOS030 de l\'Atari-TT.</p></div><br>\n\n<div class=\"border-red\"><p>La fonction ne retourne que lorsque le caractère a effectivement été sorti par le périphérique concerné. Une déclaration incorrecte pour dev peut entraîner un plantage du système. </p></div><br>\n\n<div class=\"border-red\"><p>Tous les codes de 0x00 à 0xFF pour le caractère c sont interprétés comme des caractères imprimables. La sortie via (5) est, incidemment, plus rapide que via (2), car les séquences VT-52 n\'ont pas besoin d\'être évaluées.</p></div><br>\n\n<span class=\"bold\">Valeur de retour :</span> La fonction ne renvoie pas de résultat.<br>\n<br>\n<span class=\"bold\">Disponibilité :</span> Toutes les versions TOS.<br>\n<br>\n<span class=\"code\">move.w    c,-(sp)      ; Offset 4\nmove.w    dev,-(sp)    ; Offset 2\nmove.w    #3,-(sp)     ; Offset 0\ntrap      #13          ; Call BIOS\naddq.l    #6,sp        ; Correct stack</span>', '', NULL, NULL, NULL, '', '', '', 1, 3, 10),
(121, 'Bconstat', '', '', '<span class=\"bold\">Nom :</span> Statut console BIOS<br>\n<span class=\"bold\">Opcode :</span> 1<br>\n<span class=\"bold\">Syntaxe :</span> int16_t Bconstat ( int16_t dev );<br>\n<span class=\"bold\">Description :</span> La routine BIOS Bconstat établit le statut d\'entrée d\'un périphérique standard dev. Les périphériques suivants peuvent être spécifiés pour dev :<br>\n<br>\n0	prn: (Imprimante/Port parallèle)<br>\n1	aux: (périphérique auxiliaire, le port RS-232)<br>\n2	con: (Console)<br>\n3	Port MIDI<br>\n4	Port clavier<br>\n5	Écran<br>\n6	Port RS-232 compatible ST (Modem 1)<br>\n7	Canal SCC B (Modem 2)<br>\n8	Port série TTMFP (Modem 3)<br>\n9	Canal SCC A (Modem 4)', '<div class=\"border-red\"><p>Notez que les numéros de périphérique à partir de 6 ne sont disponibles qu\'à partir du TOS030 de l\'Atari-TT. Une déclaration incorrecte pour dev peut entraîner un plantage du système.</p></div><br>\n<br>\n<span class=\"bold\">Valeur de retour :</span> La fonction renvoie -1 lorsqu\'il y a des caractères en attente dans le tampon, et 0 si ce n\'est pas le cas.<br>\n<br>\n<span class=\"bold\">Disponibilité :</span> Toutes les versions TOS.<br>\n<br>\n<span class=\"code\">move.w    dev,-(sp)    ; Offset 2\nmove.w    #1,-(sp)     ; Offset 0\ntrap      #13          ; Call BIOS\naddq.l    #4,sp        ; Correct stack</span>', '', NULL, NULL, NULL, '', '', '', 1, 3, 10),
(122, 'Bcostat', '', '', '<span class=\"bold\">Nom :</span> Statut périphérique de sortie BIOS<br>\n<span class=\"bold\">Opcode :</span> 8<br>\n<span class=\"bold\">Syntaxe :</span> int16_t Bcostat ( int16_t dev );<br>\n<span class=\"bold\">Description :</span> La routine BIOS Bcostat établit le statut d\'un périphérique de sortie standard dev. Les périphériques suivants peuvent être spécifiés pour dev :<br>\n<br>\n0	prn: (Imprimante/Port parallèle)<br>\n1	aux: (périphérique auxiliaire, le port RS-232)<br>\n2	con: (Console)<br>\n3	Port MIDI<br>\n4	Port clavier<br>\n5	Écran<br>\n6	Port RS-232 compatible ST (Modem 1)<br>\n7	Canal SCC B (Modem 2)<br>\n8	Port série TTMFP (Modem 3)<br>\n9	Canal SCC A (Modem 4)', '<div class=\"border-red\"><p>Notez que les numéros de périphérique à partir de 6 ne sont disponibles qu\'à partir du TOS030 de l\'Atari-TT. Une déclaration incorrecte pour dev peut entraîner un plantage du système.</p></div><br>\n<br>\n<span class=\"bold\">Valeur de retour :</span> La fonction renvoie -1 si le périphérique de sortie est prêt, et 0 si ce n\'est pas le cas.<br>\n<br>\n<span class=\"bold\">Disponibilité :</span> Toutes les versions TOS.<br>\n<br>\n<span class=\"code\">move.w    dev,-(sp)    ; Offset 2\nmove.w    #8,-(sp)     ; Offset 0\ntrap      #13          ; Call BIOS\naddq.l    #4,sp        ; Correct stack</span>\n', '', NULL, NULL, NULL, '', '', '', 1, 3, 10);

-- --------------------------------------------------------

--
-- Structure de la table `disk_units`
--

CREATE TABLE `disk_units` (
  `id_disk_units` int NOT NULL,
  `label` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `letter` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isDisplay` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `disk_units`
--

INSERT INTO `disk_units` (`id_disk_units`, `label`, `letter`, `icon`, `isDisplay`) VALUES
(9, 'PAO', 'A', NULL, 1),
(10, 'Coding', 'B', NULL, 1),
(11, 'Magazines', 'D', NULL, 1),
(12, 'PAO', 'C', NULL, 1);

-- --------------------------------------------------------

--
-- Structure de la table `files`
--

CREATE TABLE `files` (
  `id_files` int NOT NULL,
  `name` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isDisplay` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `files`
--

INSERT INTO `files` (`id_files`, `name`, `isDisplay`) VALUES
(1, 'TOS v1.00 (1986)(Atari Corp)(ST)(Fr).zip', 1),
(2, 'TOS v1.06 (1989)(Atari Corp)(STE)(Fr).zip', 1),
(3, 'TOS v1.62 (1990)(Atari Corp)(STE)(Fr).zip', 1),
(5, 'TOS v1.00 (1986)(Atari Corp)(ST)(Fr).zip', 1),
(6, 'TOS v1.62 (1990)(Atari Corp)(STE)(Fr).zip', 0),
(7, 'TOS v1.06 (1989)(Atari Corp)(STE)(Fr).zip', 0),
(12, 'drive-download-20240618T094856Z-001.zip', 1),
(14, 'TOS v1.06 (1989)(Atari Corp)(STE)(Fr).zip', 1),
(15, 'Inter.zip', 1),
(16, 'Roboto.zip', 1);

-- --------------------------------------------------------

--
-- Structure de la table `menu`
--

CREATE TABLE `menu` (
  `id_menu` int NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `place` tinyint DEFAULT NULL,
  `isDisplay` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `menu`
--

INSERT INTO `menu` (`id_menu`, `name`, `link`, `place`, `isDisplay`) VALUES
(1, 'Accueil', '/accueil', 1, NULL),
(2, 'news', '/news', 2, NULL),
(3, 'coding', '/coding', 3, NULL),
(7, 'documentation', '/documentation', 4, NULL),
(14, 'informations', '/informations', 8, NULL),
(15, 'certificats', '/certificats', 7, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `questions`
--

CREATE TABLE `questions` (
  `id_questions` int NOT NULL,
  `text` varchar(127) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_articles` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `questions`
--

INSERT INTO `questions` (`id_questions`, `text`, `id_articles`) VALUES
(1, 'Qu\'est ce qu\'un assembleur fait au moment de l\'assemblage du code ?', 7),
(2, 'Qu\'est ce qu\'un emulateur ?', 7),
(3, 'Le language que comprends l\'ordinateur est :', 7);

-- --------------------------------------------------------

--
-- Structure de la table `role`
--

CREATE TABLE `role` (
  `id_role` int NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `role`
--

INSERT INTO `role` (`id_role`, `name`) VALUES
(0, 'compte supprimé'),
(1, 'administrateur'),
(2, 'utilisateur');

-- --------------------------------------------------------

--
-- Structure de la table `tags`
--

CREATE TABLE `tags` (
  `id_tags` int NOT NULL,
  `color` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `label` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `tags`
--

INSERT INTO `tags` (`id_tags`, `color`, `label`) VALUES
(1, '#DDDDDD', 'BASIC'),
(2, '#666666', 'ASM'),
(3, '#AAAAAA', '68000'),
(4, '#BBCCDE', 'ATARI'),
(5, '#912AAA', 'SPRITE'),
(6, '#659874', 'XBIOS'),
(7, '#5DFD64', 'TOS'),
(8, '#5DFD64', 'GEM'),
(9, '#5DFD64', 'BIOS');

-- --------------------------------------------------------

--
-- Structure de la table `templates`
--

CREATE TABLE `templates` (
  `id_templates` int NOT NULL,
  `isTitleLeft` tinyint(1) DEFAULT NULL,
  `isTitleRight` tinyint(1) DEFAULT NULL,
  `isTitleCenter` tinyint(1) DEFAULT NULL,
  `isTextLeft` tinyint(1) DEFAULT NULL,
  `isTextRight` tinyint(1) DEFAULT NULL,
  `isTextCenter` tinyint(1) DEFAULT NULL,
  `isImageLeft` tinyint(1) DEFAULT NULL,
  `isImageRight` tinyint(1) DEFAULT NULL,
  `isImageCenter` tinyint(1) DEFAULT NULL,
  `isAttachementLeft` tinyint(1) DEFAULT NULL,
  `isAttachementRight` tinyint(1) DEFAULT NULL,
  `isAttachementCenter` tinyint(1) DEFAULT NULL,
  `cover` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `templates`
--

INSERT INTO `templates` (`id_templates`, `isTitleLeft`, `isTitleRight`, `isTitleCenter`, `isTextLeft`, `isTextRight`, `isTextCenter`, `isImageLeft`, `isImageRight`, `isImageCenter`, `isAttachementLeft`, `isAttachementRight`, `isAttachementCenter`, `cover`, `description`) VALUES
(1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 'template-header-type1.png', 'description du template'),
(2, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 'template-content-type2.png', 'description du template'),
(3, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 'template-content-type3.png', 'description du template'),
(4, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 'template-content-type5.png', 'description du template'),
(5, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 'template-header-type1.png', 'description du template'),
(6, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 'template-content-type2.png', 'description du template'),
(7, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 'template-content-type3.png', 'description du template'),
(8, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 'template-content-type5.png', 'description du template'),
(9, 1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 'template-content-type5.png', 'description du template');

-- --------------------------------------------------------

--
-- Structure de la table `to_contain`
--

CREATE TABLE `to_contain` (
  `id_disk_units` int NOT NULL,
  `id_files` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `to_contain`
--

INSERT INTO `to_contain` (`id_disk_units`, `id_files`) VALUES
(10, 14),
(12, 16);

-- --------------------------------------------------------

--
-- Structure de la table `to_graduate`
--

CREATE TABLE `to_graduate` (
  `id_articles` int NOT NULL,
  `id_users` int NOT NULL,
  `id_certificates` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `to_graduate`
--

INSERT INTO `to_graduate` (`id_articles`, `id_users`, `id_certificates`) VALUES
(7, 1, 16);

-- --------------------------------------------------------

--
-- Structure de la table `to_have`
--

CREATE TABLE `to_have` (
  `id_articles` int NOT NULL,
  `id_tags` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `to_have`
--

INSERT INTO `to_have` (`id_articles`, `id_tags`) VALUES
(1, 2),
(1, 3),
(1, 4),
(7, 4),
(9, 4),
(9, 7),
(9, 8),
(10, 9);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id_users` int NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hashpassword` varchar(265) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActivated` tinyint(1) DEFAULT NULL,
  `id_role` int NOT NULL,
  `lastname` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `firstname` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `registrationDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id_users`, `username`, `email`, `hashpassword`, `isActivated`, `id_role`, `lastname`, `firstname`, `registrationDate`) VALUES
(1, 'zisquier', 'contact.thomasbressel@gmail.com', '$2a$10$Lmpd1HQ6mWA4EwKxiYXSkOt2DTtB1hO.CCLsRk7RYqk2ASv8KQ3Mq', 1, 1, 'Bressel', 'Thomas', '2024-06-24'),
(27, 'toto14', 'tbressel.dev@gmail.com', '$2a$10$bQsHeqHV38PlOkwCCXxYI.14pYluKl1TEZvJZbLkONlp1TIeDOxki', 0, 2, 'null', 'null', '2024-06-27');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`id_articles`),
  ADD KEY `id_categories` (`id_categories`),
  ADD KEY `id_users` (`id_users`);

--
-- Index pour la table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id_categories`);

--
-- Index pour la table `certificates`
--
ALTER TABLE `certificates`
  ADD PRIMARY KEY (`id_certificates`);

--
-- Index pour la table `choices`
--
ALTER TABLE `choices`
  ADD PRIMARY KEY (`id_choices`),
  ADD KEY `id_questions` (`id_questions`);

--
-- Index pour la table `contents`
--
ALTER TABLE `contents`
  ADD PRIMARY KEY (`id_contents`),
  ADD KEY `id_templates` (`id_templates`),
  ADD KEY `id_articles` (`id_articles`);

--
-- Index pour la table `disk_units`
--
ALTER TABLE `disk_units`
  ADD PRIMARY KEY (`id_disk_units`);

--
-- Index pour la table `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`id_files`);

--
-- Index pour la table `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`id_menu`);

--
-- Index pour la table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id_questions`),
  ADD KEY `id_articles` (`id_articles`);

--
-- Index pour la table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id_role`);

--
-- Index pour la table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id_tags`);

--
-- Index pour la table `templates`
--
ALTER TABLE `templates`
  ADD PRIMARY KEY (`id_templates`);

--
-- Index pour la table `to_contain`
--
ALTER TABLE `to_contain`
  ADD PRIMARY KEY (`id_disk_units`,`id_files`),
  ADD KEY `id_files` (`id_files`);

--
-- Index pour la table `to_graduate`
--
ALTER TABLE `to_graduate`
  ADD PRIMARY KEY (`id_articles`,`id_users`,`id_certificates`),
  ADD KEY `id_users` (`id_users`),
  ADD KEY `id_certificates` (`id_certificates`);

--
-- Index pour la table `to_have`
--
ALTER TABLE `to_have`
  ADD PRIMARY KEY (`id_articles`,`id_tags`),
  ADD KEY `id_tags` (`id_tags`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_users`),
  ADD KEY `id_role` (`id_role`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `articles`
--
ALTER TABLE `articles`
  MODIFY `id_articles` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT pour la table `categories`
--
ALTER TABLE `categories`
  MODIFY `id_categories` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `certificates`
--
ALTER TABLE `certificates`
  MODIFY `id_certificates` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT pour la table `choices`
--
ALTER TABLE `choices`
  MODIFY `id_choices` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `contents`
--
ALTER TABLE `contents`
  MODIFY `id_contents` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=148;

--
-- AUTO_INCREMENT pour la table `disk_units`
--
ALTER TABLE `disk_units`
  MODIFY `id_disk_units` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `files`
--
ALTER TABLE `files`
  MODIFY `id_files` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT pour la table `menu`
--
ALTER TABLE `menu`
  MODIFY `id_menu` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT pour la table `questions`
--
ALTER TABLE `questions`
  MODIFY `id_questions` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `role`
--
ALTER TABLE `role`
  MODIFY `id_role` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `tags`
--
ALTER TABLE `tags`
  MODIFY `id_tags` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `templates`
--
ALTER TABLE `templates`
  MODIFY `id_templates` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id_users` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `articles`
--
ALTER TABLE `articles`
  ADD CONSTRAINT `articles_ibfk_1` FOREIGN KEY (`id_categories`) REFERENCES `categories` (`id_categories`),
  ADD CONSTRAINT `articles_ibfk_2` FOREIGN KEY (`id_users`) REFERENCES `users` (`id_users`);

--
-- Contraintes pour la table `choices`
--
ALTER TABLE `choices`
  ADD CONSTRAINT `choices_ibfk_1` FOREIGN KEY (`id_questions`) REFERENCES `questions` (`id_questions`);

--
-- Contraintes pour la table `contents`
--
ALTER TABLE `contents`
  ADD CONSTRAINT `contents_ibfk_1` FOREIGN KEY (`id_templates`) REFERENCES `templates` (`id_templates`),
  ADD CONSTRAINT `contents_ibfk_2` FOREIGN KEY (`id_articles`) REFERENCES `articles` (`id_articles`);

--
-- Contraintes pour la table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`id_articles`) REFERENCES `articles` (`id_articles`);

--
-- Contraintes pour la table `to_contain`
--
ALTER TABLE `to_contain`
  ADD CONSTRAINT `to_contain_ibfk_1` FOREIGN KEY (`id_disk_units`) REFERENCES `disk_units` (`id_disk_units`),
  ADD CONSTRAINT `to_contain_ibfk_2` FOREIGN KEY (`id_files`) REFERENCES `files` (`id_files`);

--
-- Contraintes pour la table `to_graduate`
--
ALTER TABLE `to_graduate`
  ADD CONSTRAINT `to_graduate_ibfk_1` FOREIGN KEY (`id_articles`) REFERENCES `articles` (`id_articles`),
  ADD CONSTRAINT `to_graduate_ibfk_2` FOREIGN KEY (`id_users`) REFERENCES `users` (`id_users`),
  ADD CONSTRAINT `to_graduate_ibfk_3` FOREIGN KEY (`id_certificates`) REFERENCES `certificates` (`id_certificates`);

--
-- Contraintes pour la table `to_have`
--
ALTER TABLE `to_have`
  ADD CONSTRAINT `to_have_ibfk_1` FOREIGN KEY (`id_articles`) REFERENCES `articles` (`id_articles`),
  ADD CONSTRAINT `to_have_ibfk_2` FOREIGN KEY (`id_tags`) REFERENCES `tags` (`id_tags`);

--
-- Contraintes pour la table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`id_role`) REFERENCES `role` (`id_role`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
