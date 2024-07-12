-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : mer. 10 juil. 2024 à 15:16
-- Version du serveur : 10.6.17-MariaDB-cll-lve
-- Version de PHP : 8.1.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `c1509222c_asmtariste`
--

-- --------------------------------------------------------

--
-- Structure de la table `articles`
--

CREATE TABLE `articles` (
  `id_articles` int(11) NOT NULL,
  `title` varchar(128) DEFAULT NULL,
  `creation_date` date DEFAULT NULL,
  `description` mediumtext DEFAULT NULL,
  `cover` varchar(128) DEFAULT NULL,
  `isDisplay` tinyint(1) DEFAULT NULL,
  `id_categories` int(11) NOT NULL,
  `id_users` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `articles`
--

INSERT INTO `articles` (`id_articles`, `title`, `creation_date`, `description`, `cover`, `isDisplay`, `id_categories`, `id_users`) VALUES
(1, 'ASMtariSTe est ouvert !', '2024-06-27', 'ASMtariste ouvre ses portes pour tout ceux qui souhaitent apprendre la programmation en assembleur 68000 sur Atari ST. ', NULL, 1, 2, 1),
(2, 'À propos du BIOS', '2024-06-27', 'Le BIOS (Basic Input/Output System) représente l\'interface de plus bas niveau entre le système d\'exploitation de l\'Atari et le matériel, et est appelé via le Trap #13 du 680X0. Il est préférable que ces fonctions ne soient pas utilisées par les programmes applicatifs, car des fonctions beaucoup plus puissantes à un niveau supérieur sont disponibles pour fournir de meilleures alternatives.', NULL, 1, 3, 1),
(3, 'Le Système d\'Exploitation TOS', '2024-06-27', 'Le système d\'exploitation TOS (The Operating System) peut être subdivisé en différentes sections. La communication avec les utilisateurs est réalisée via GEM, qui offre une interface utilisateur confortable et se compose des fonctions AES et VDI.', NULL, 1, 3, 1),
(4, 'Savoir configurer les outils de développement', '2024-06-27', 'Avant toute chose, pour commencer à écrire du code, tu auras besoin de plusieurs outils et il te faudra apprendre à les utiliser. Ces outils peuvent être soit sur PC, soit directement sur Atari ST.', NULL, 1, 1, 1);

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

CREATE TABLE `categories` (
  `id_categories` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `categories`
--

INSERT INTO `categories` (`id_categories`, `name`) VALUES
(1, 'coding'),
(2, 'news'),
(3, 'doc');

-- --------------------------------------------------------

--
-- Structure de la table `certificates`
--

CREATE TABLE `certificates` (
  `id_certificates` int(11) NOT NULL,
  `creationDate` date DEFAULT NULL,
  `note` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `certificates`
--

INSERT INTO `certificates` (`id_certificates`, `creationDate`, `note`) VALUES
(1, '2024-06-28', 13);

-- --------------------------------------------------------

--
-- Structure de la table `choices`
--

CREATE TABLE `choices` (
  `id_choices` int(11) NOT NULL,
  `choice_name` varchar(50) DEFAULT NULL,
  `answer` tinyint(1) DEFAULT NULL,
  `id_questions` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `choices`
--

INSERT INTO `choices` (`id_choices`, `choice_name`, `answer`, `id_questions`) VALUES
(1, 'Un logiciel qui imite le fonctionnement d\'un autre', 1, 1),
(2, 'Un programme de traitement de texte', 0, 1),
(3, 'Un outil de gestion de fichiers', 0, 1),
(4, 'Stocker des fichiers dans la RAM', 0, 2),
(5, 'Augmenter la capacité de mémoire', 0, 2),
(6, 'A émuler un disque durs avec des cartes SD', 1, 2),
(7, 'Le langage binaire', 1, 3),
(8, 'L\'assembleur', 0, 3),
(9, 'Le langage C', 0, 3),
(10, 'Le langage Basic', 0, 3),
(11, 'Écrire du code source', 1, 4),
(12, 'Compiler des programmes', 0, 4),
(13, 'Déboguer des applications', 0, 4),
(14, 'Traduire du code assembleur en code machine', 1, 5),
(15, 'Optimiser le code source', 0, 5),
(16, 'Interpréter le code source', 0, 5),
(17, 'Dans la mémoire RAM', 0, 6),
(18, 'Dans un fichier exécutable', 1, 6),
(19, 'Dans un fichier texte', 0, 6),
(20, 'Dans la mémoire RAM', 0, 7),
(21, 'Dans un fichier source', 1, 7),
(22, 'Sur un disque dur externe', 0, 7),
(23, 'Devpac', 0, 8),
(24, 'ASM-One', 0, 8),
(25, 'HiSoft DavePac 3', 1, 8),
(26, 'Le bureau EmuTOS', 0, 9),
(27, 'Le bureau GEM', 1, 9),
(28, 'Le bureau TOS', 0, 9),
(29, 'Le système d\'exploitation de l\'Atari ST', 1, 10),
(30, 'Un type de mémoire', 0, 10),
(31, 'The Original System', 0, 10),
(32, 'Un type de périphérique de stockage', 0, 11),
(33, 'Un protocole de communication', 1, 11),
(34, 'Une carte graphique', 0, 11);

-- --------------------------------------------------------

--
-- Structure de la table `contents`
--

CREATE TABLE `contents` (
  `id_contents` int(11) NOT NULL,
  `title_left` varchar(50) DEFAULT NULL,
  `title_right` varchar(50) DEFAULT NULL,
  `title_center` varchar(50) DEFAULT NULL,
  `text_left` mediumtext DEFAULT NULL,
  `text_right` mediumtext DEFAULT NULL,
  `text_center` mediumtext DEFAULT NULL,
  `image_left` varchar(50) DEFAULT NULL,
  `image_right` varchar(50) DEFAULT NULL,
  `image_center` varchar(50) DEFAULT NULL,
  `attachement_left` varchar(50) DEFAULT NULL,
  `attachement_right` varchar(50) DEFAULT NULL,
  `attachement_center` varchar(50) DEFAULT NULL,
  `page` tinyint(4) DEFAULT NULL,
  `id_templates` int(11) NOT NULL,
  `id_articles` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `contents`
--

INSERT INTO `contents` (`id_contents`, `title_left`, `title_right`, `title_center`, `text_left`, `text_right`, `text_center`, `image_left`, `image_right`, `image_center`, `attachement_left`, `attachement_right`, `attachement_center`, `page`, `id_templates`, `id_articles`) VALUES
(1, 'C\'est de là que je viens !', 'C\'est par-là que je vais :D', '', 'Oui je viens surtout du monde de l\' <span class=\"hashtag\">Amstrad</span>, une communauté qui partage énormément et qui reste ultra dynamique encore en 2024. <span class=\"bold\">Plus d\'une centaine de production chaque année</span> (france, espagne, angleterre, allemagne ...) des outils de développement sont également crées comme <span class=\"color-red\">Arkos Tracker</span> pour la musique (merci Julien) ou <span class=\"color-red\">IMPDraw 2</span> qui est carrément une suite d\'outils graphiques ultra complète (Merci AST !).<br>\n<br>\nEt comme si ce n\'était pas suffisant certain comme BDCIron on carrément créé <span class=\"bold\">un site complet pour l\'apprentissage de l\'assembleur sur Zilog 80</span> (zilog.fr). <br>\nBref çà rigole pas.', 'J\'ai pu participer à mon premier event il \'y a deux années de celà, c\'était au <span class=\"hashtag\">GemTOS</span>. Une convention en béton armé qui montre qu\'il y\'a beaucoup de monde chez les ataristes et tous très créatif ! A cette époque je découvrais tout juste l\'assembleur 68000 et j\'ai fait de superbe rencontre et appris beaucoup de chose ce week-end là !<br>\nC\'est bien mais question <span class=\"italic\">\"je trouve les informations facilement ET  en français\"</span> ... c\'est pas trop çà sur cette bécane.<br>\nFranchement chez les ataristes c\'est un peu moue de la chique question transmission du savoir en comparaison avec les amstradiens.<br>\nDonc quand un truc me plaît pas et bien je prends ma cervelle et mes petits doigts et je me met au boulot !', '', NULL, NULL, NULL, '', '', '', 1, 3, 1),
(2, 'Mais je compte faire quoi ?', '', '', 'Et bien pour commencer je souhaite proposer quelque chose<span class=\"bold\"> qui permette à n\'importe quel débutant de se mettre à la programmation en assembleur.</span> <br>\n<br>\nEn simplifiant, en donnant des exemples, en schématisant, en proposant de la documentation, en rassemblant un maximum de source, et en faisant !', '', '', NULL, '1719517602886.png', NULL, '', '', '', 1, 1, 1),
(3, '', '', '', '', '', 'Le screen, là haut à droite, c\'est mon premier <span class=\"italic\">\"Zelda like\"</span> que j\'ai pu coder sur mon 1040 STe, et toi, <span class=\"bold\">OUI TOI !!!!</span> Tu es CAPABLE de coder en assembleur, sauf que sans aucune information où avec seulement des bouts de ficelles c\'est compliqué, puis au bout d\'un moment t\'en a marre et donc tu finis par laisser tomber.<br>\n<br>\nJe te parlerai aussi des sources  d\'informations qui m\'ont aidé à comprendre des trucs, notamment les vidéos de la chaîne <a class=\"link\" href=\"https://www.youtube.com/@Vretrocomputing\" target=\"blank\">VRetroComputing</a>, pédagogue, carré, clair net et précis ! Y\'en a .... mais c\'est le seul à fournir un support réellement pédagogique.<br>\n', NULL, NULL, NULL, '', '', '', 1, 4, 1),
(4, '', '', '', '', '', '', '1719517980320.png', '1719517980322.png', NULL, '', '', '', 1, 2, 1),
(5, '', '', 'Il va se passer quoi maintenant ?', '', '', 'Et bien c\'est simple tu vas se poser tranquille dans ton canapé, une bière à la main à mater une série sur <span class=\"bold\"><span class=\"color-blue\">Prime vidéo</span></span>. Et moi pendant ce temps je me donne <span class=\"bold\">jusqu\'à la fin du mois de juin</span>, pour re-factoriser mon code, et faire çà plus proprement, me donner aussi un peu plus de confort quant à l’ergonomie de mon back-office (qui représente tout de même 80% du site. La partie visible (donc public) ne représente finalement pas grand chose). A l\'heure où je met ce site en ligne je suis ce que l\'on appelle un \"développeur junior\" (suite à ma reconversion professionnelle qui date d\'il y\'a un an à peine).<br>\nCe projet de site, assembleur mis à part, va me servir d\'expérience et d\'expertise. Cela signifie aussi qu\'une multitude de détails ne vont pas aller et je devrais donc améliorer toutes ces petites choses au fils des mois durant.<br>\n<br>\nRevenez y de temps en temps vous y verrez certainement des ajouts, des articles et des fichiers dans les unités de disque, qui serviront de tiroirs à fichiers en tout genre. Mais ce sera classé et bien rangé, à l\'inverse du contenu facebook ou même discord, qui finira par se perdre !<br>\nIci ce n\'est pas perdu <span class=\"color-red\"><span class=\"bold\">et ce sera rangé !</span></span> <br>\nQuand au site en lui même il ne va pas disparaître du jour au lendemain, car c\'est mon métier à présent, donc je saurais m\'en occuper :).<br>\n<br>\nA l\'occasion de ce site web, j\'ai créé un groupe <span class=\"hashtag\">facebook</span> qui s\'appelle tout simplement <span class=\"bold\"><span class=\"color-blue\">\"L\'assembleur 68000 sur Atari ST\"</span></span>.<br>\nIl y\'a à l\'heure actuelle, une cinquantaine de personnes, ce groupe a été ouvert il y\'a à peine 2 semaines.<br>\n<br>\nIl existe aussi un <span class=\"hashtag\">Discord</span> dont voici le lien d\'invitation (qu\'il faut copier coller car j\'ai pas encore mis de fonctionnalité de lien) :<br>\n<a class=\"link\" href=\"https://discord.gg/WPAsfrng5n\" target=\"blank\">https://discord.gg/WPAsfrng5n</a><br>\n<br>\n<br>\nVoilà voilà, je crois que j\'ai tout dis !<br>\n@pluche !', NULL, NULL, NULL, '', '', '', 1, 4, 1),
(6, '', '', '', '', '', '- <span class=\"bold\">Bconin</span> : Lire un caractère depuis un périphérique.<br>\n- <span class=\"bold\">Bconout</span> : Envoyer un caractère à une unité périphérique.<br>\n- <span class=\"bold\">Bconstat</span> : Obtenir le statut d\'entrée d\'une unité périphérique.<br>\n- <span class=\"bold\">Bcostat</span> : Obtenir le statut d\'un périphérique de sortie standard.<br>\n- <span class=\"bold\">Drvmap</span> : Obtenir des informations sur les périphériques attachés.<br>\n- <span class=\"bold\">Getbpb</span> : Obtenir l\'adresse du bloc de paramètres BIOS d\'une unité.<br>\n- <span class=\"bold\">Getmpb</span> : Déterminer le bloc de paramètres de mémoire.<br>\n- <span class=\"bold\">Kbshift</span> : Récupérer/mettre à jour le statut des touches de modification.<br>\n- <span class=\"bold\">Mediach</span> : Demander si le média a été changé.<br>\n- <span class=\"bold\">Rwabs</span> : Opération de lecture/écriture directe sur une unité.<br>\n- <span class=\"bold\">Setexc</span> : Définir et obtenir le vecteur d\'interruption.<br>\n- <span class=\"bold\">Tickcal</span> : Obtenir la différence de temps entre deux appels de minuterie.<br>\n<br>\nLe <span class=\"bold\">BIOS</span> est \"ré-entrant\" sous <span class=\"bold\">MagiC</span>. Cela signifie que ces fonctions <span class=\"underline\">peuvent également être appelées de manière répétée depuis des interruptions</span> <span class=\"italic\">(tant que la pile du superviseur concerné ne déborde pas...)</span>.<br>\n<br>\n<div class=\"border-yellow\"><p> - La zone <span class=\"bold\"><saveptr_area></span> du BIOS est toujours présente<span class=\"italic\"> (pour des raisons de compatibilité)</span>, mais elle n\'est pas utilisée par le système.<br>\n<br>\n - Les vérifications de pile de Turbo C/Pure-C échoueront pour les routines exécutées en mode superviseur <span class=\"italic\">(sous TOS, cela pouvait se produire uniquement pour les routines USERDEF dans l\'AES, qui sont également exécutées en mode superviseur)</span>.</p></div><br>\n<br>\nSi vous insérez vos propres routines dans le BIOS, assurez-vous qu\'elles soient entièrement ré-entrantes. Ne faites aucune supposition sur le contenu de la zone <span class=\"bold\"><saveptr_area></span> !<br>\n<br>\nLe <span class=\"bold\">BIOS</span> reçoit ses paramètres de la pile ; pour cela, le dernier argument de la liste de paramètres est stocké en premier sur la pile.<br>\n<div class=\"border-yellow\"><p>Les résultats des fonctions sont renvoyés dans le registre du processeur d0.<br>\nSeuls les registres d3-d7 et a3-a7 sont sauvegardés, tous les autres peuvent être modifiés par l\'appel.</p></div>', NULL, NULL, NULL, '', '', '', 1, 4, 2),
(7, 'Bconin', '', '', '<span class=\"bold\">Nom :</span> Entrée console BIOS<br>\n<span class=\"bold\">Opcode :</span> 2<br>\n<span class=\"bold\">Syntaxe :</span> int32_t Bconin ( int16_t dev );<br>\n<span class=\"bold\">Description :</span> La routine BIOS Bconin lit un caractère depuis un périphérique. Les périphériques suivants peuvent être spécifiés pour dev (dev = le numéros de la colonne de gauche) :<br>\n<br>\n0	prn: (Imprimante/Port parallèle)<br>\n1	aux: (périphérique auxiliaire, le port RS-232)<br>\n2	con: (Console)<br>\n3	Port MIDI<br>\n4	Port clavier<br>\n5	Écran<br>\n6	Port RS232 compatible ST (Modem 1)<br>\n7	Canal SCC B (Modem 2)<br>\n8	Port série TTMFP (Modem 3)<br>\n9	Canal SCC A (Modem 4)', '<div class=\"border-red\"><p>Notez que les numéros de périphérique à partir de 6 ne sont disponibles qu\'à partir du TOS030 de l\'Atari-TT. Une déclaration incorrecte pour dev peut entraîner un plantage du système.</p></div><br>\n<br>\n<span class=\"bold\">Valeur de retour :</span> La fonction renvoie le caractère lu comme une valeur ASCII dans les bits 0..7. Lors de la lecture depuis la console, <span class=\"underline\">les bits 16 à 23 contiennent le scan-code de la touche correspondante</span>. Si, en plus, le bit correspondant de la variable système <span class=\"italic\">conterm</span> est défini, alors les bits 24 à 31 contiennent la valeur actuelle de <span class=\"italic\">Kbshift</span>.<br>\n<br>\n<span class=\"bold\">Disponibilité :</span> Toutes les versions TOS.<br>\n<br>\n<span class=\"code\">move.w    dev,-(sp)    ; Offset 2<br>\nmove.w    #2,-(sp)     ; Offset 0<br>\ntrap      #13          ; Call BIOS<br>\naddq.l    #4,sp        ; Correct stack</span>', '', NULL, NULL, NULL, '', '', '', 1, 3, 2),
(8, 'Bconout', '', '', '<span class=\"bold\">Nom :</span> Sortie console BIOS<br>\n<span class=\"bold\">Opcode :</span> 3<br>\n<span class=\"bold\">Syntaxe :</span> VOID Bconout ( int16_t dev, int16_t c );<br>\n<span class=\"bold\">Description :</span> La routine BIOS Bconout écrit le caractère c sur le périphérique dev. Les périphériques suivants peuvent être spécifiés pour dev :<br>\n<br>\n0	prn: (Imprimante/Port parallèle)<br>\n1	aux: (périphérique auxiliaire, le port RS-232)<br>\n2	con: (Console, terminal VT-52)<br>\n3	Port MIDI<br>\n4	Port clavier<br>\n5	Écran<br>\n6	Port RS-232 compatible ST (Modem 1)<br>\n7	Canal SCC B (Modem 2)<br>\n8	Port série TTMFP (Modem 3)<br>\n9	Canal SCC A (Modem 4)', '<div class=\"border-red\"><p>Notez que les numéros de périphérique à partir de 6 ne sont disponibles qu\'à partir du TOS030 de l\'Atari-TT.</p></div><br>\n<br>\n<div class=\"border-red\"><p>La fonction ne retourne que lorsque le caractère a effectivement été sorti par le périphérique concerné. Une déclaration incorrecte pour dev peut entraîner un plantage du système. </p></div><br>\n<br>\n<div class=\"border-red\"><p>Tous les codes de 0x00 à 0xFF pour le caractère c sont interprétés comme des caractères imprimables. La sortie via (5) est, incidemment, plus rapide que via (2), car les séquences VT-52 n\'ont pas besoin d\'être évaluées.</p></div><br>\n<br>\n<span class=\"bold\">Valeur de retour :</span> La fonction ne renvoie pas de résultat.<br>\n<br>\n<span class=\"bold\">Disponibilité :</span> Toutes les versions TOS.<br>\n<br>\n<span class=\"code\">move.w    c,-(sp)      ; Offset 4<br>\nmove.w    dev,-(sp)    ; Offset 2<br>\nmove.w    #3,-(sp)     ; Offset 0<br>\ntrap      #13          ; Call BIOS<br>\naddq.l    #6,sp        ; Correct stack</span>', '', NULL, NULL, NULL, '', '', '', 1, 3, 2),
(9, 'Bconstat', '', '', '<span class=\"bold\">Nom :</span> Statut console BIOS<br>\n<span class=\"bold\">Opcode :</span> 1<br>\n<span class=\"bold\">Syntaxe :</span> int16_t Bconstat ( int16_t dev );<br>\n<span class=\"bold\">Description :</span> La routine BIOS Bconstat établit le statut d\'entrée d\'un périphérique standard dev. Les périphériques suivants peuvent être spécifiés pour dev :<br>\n<br>\n0	prn: (Imprimante/Port parallèle)<br>\n1	aux: (périphérique auxiliaire, le port RS-232)<br>\n2	con: (Console)<br>\n3	Port MIDI<br>\n4	Port clavier<br>\n5	Écran<br>\n6	Port RS-232 compatible ST (Modem 1)<br>\n7	Canal SCC B (Modem 2)<br>\n8	Port série TTMFP (Modem 3)<br>\n9	Canal SCC A (Modem 4)', '<div class=\"border-red\"><p>Notez que les numéros de périphérique à partir de 6 ne sont disponibles qu\'à partir du TOS030 de l\'Atari-TT. Une déclaration incorrecte pour dev peut entraîner un plantage du système.</p></div><br>\n<br>\n<span class=\"bold\">Valeur de retour :</span> La fonction renvoie -1 lorsqu\'il y a des caractères en attente dans le tampon, et 0 si ce n\'est pas le cas.<br>\n<br>\n<span class=\"bold\">Disponibilité :</span> Toutes les versions TOS.<br>\n<br>\n<span class=\"code\">move.w    dev,-(sp)    ; Offset 2<br>\nmove.w    #1,-(sp)     ; Offset 0<br>\ntrap      #13          ; Call BIOS<br>\naddq.l    #4,sp        ; Correct stack</span>', '', NULL, NULL, NULL, '', '', '', 1, 3, 2),
(10, 'Bcostat', '', '', '<span class=\"bold\">Nom :</span> Statut périphérique de sortie BIOS<br>\n<span class=\"bold\">Opcode :</span> 8<br>\n<span class=\"bold\">Syntaxe :</span> int16_t Bcostat ( int16_t dev );<br>\n<span class=\"bold\">Description :</span> La routine BIOS Bcostat établit le statut d\'un périphérique de sortie standard dev. Les périphériques suivants peuvent être spécifiés pour dev :<br>\n<br>\n0	prn: (Imprimante/Port parallèle)<br>\n1	aux: (périphérique auxiliaire, le port RS-232)<br>\n2	con: (Console)<br>\n3	Port MIDI<br>\n4	Port clavier<br>\n5	Écran<br>\n6	Port RS-232 compatible ST (Modem 1)<br>\n7	Canal SCC B (Modem 2)<br>\n8	Port série TTMFP (Modem 3)<br>\n9	Canal SCC A (Modem 4)', '<div class=\"border-red\"><p>Notez que les numéros de périphérique à partir de 6 ne sont disponibles qu\'à partir du TOS030 de l\'Atari-TT. Une déclaration incorrecte pour dev peut entraîner un plantage du système.</p></div><br>\n<br>\n<span class=\"bold\">Valeur de retour :</span> La fonction renvoie -1 si le périphérique de sortie est prêt, et 0 si ce n\'est pas le cas.<br>\n<br>\n<span class=\"bold\">Disponibilité :</span> Toutes les versions TOS.<br>\n<br>\n<span class=\"code\">move.w    dev,-(sp)    ; Offset 2<br>\nmove.w    #8,-(sp)     ; Offset 0<br>\ntrap      #13          ; Call BIOS<br>\naddq.l    #4,sp        ; Correct stack</span><br>\n', '', NULL, NULL, NULL, '', '', '', 1, 3, 2),
(11, '', '', '', '', '', 'En plus de cela, de nombreuses autres routines sont disponibles, lesquelles peuvent être réparties dans l\'une des catégories suivantes :<br>\n<br>\n - <span class=\"bold\">GEMDOS</span><br>\n-  <span class=\"bold\">BIOS</span><br>\n-  <span class=\"bold\">XBIOS</span><br>\n<br>\nLe <span class=\"bold\">TOS</span> remonte à l\'année 1985. Au fil du temps, il a été développé davantage par <span class=\"bold\">Atari</span> et est disponible pour divers modèles d\'ordinateurs (ST, STE, Mega-ST, TT, Falcon, ...). De plus, il existe un certain nombre de systèmes compatibles TOS proposés par des tiers.<br>\n<br>\nIl convient de mentionner à cet égard, surtout, <a class=\"link\" href=\"https://www.atariuptodate.de/en/6/magic#\" target=\"blank\">MagiC</a> et <a class=\"link\" href=\"https://www.atariuptodate.de/en/5/geneva\" target=\"blank\">Geneva</a>. Alors que <span class=\"bold\">MagiC</span> est devenu particulièrement important en Allemagne (et au Royaume-Uni), <span class=\"bold\">Geneva</span> semble avoir rencontré un certain succès aux États-Unis.<br>\n<br>\nGrâce à <a class=\"link\" href=\"https://gitlab.com/AndreasK/AtariX\" target=\"blank\">MagiC Mac</a>, une implémentation de <span class=\"bold\">MagiC</span> sur le matériel Apple (Power) Macintosh, les programmes TOS fonctionnent désormais également sur les ordinateurs Apple.<br>\nUne variante ultérieure, <a class=\"link\" href=\"https://magicpc.atari-users.com/\" target=\"blank\">MagiC PC</a>, a également étendu cette compatibilité à de nombreuses machines Windows.<br>\n', NULL, NULL, NULL, '', '', '', 1, 4, 3),
(12, '', '', 'GEM (Graphics Environment Manager) ', '', '', 'Il fait partie du système d\'exploitation et représente l\'interface (graphique) entre l\'ordinateur et l\'utilisateur. <br>\n<span class=\"bold\">GEM</span> a été développé par l\'entreprise <a class=\"link\" href=\"https://fr.wikipedia.org/wiki/Digital_Research\" target=\"blank\">Digital Research</a> en 1984 pour les PC avec processeurs Intel. Le système est devenu bien connu surtout lorsque l\'Atari ST a été commercialisé, offrant une alternative puissante et abordable aux machines PC et Macintosh coûteuses de l\'époque.<br>\n<br>\nAu fil du temps, GEM a été adapté à divers systèmes d\'exploitation et plateformes matérielles, y compris :<br>\n<br>\n- PC GEM<br>\n- Atari GEM<br>\n- GEM sur X <span class=\"italic\">(version pour systèmes Unix)</span><br>\n- X/GEM <span class=\"italic\">(pour le système d\'exploitation FlexOS)</span><br>\n<br>\nGEM peut être divisé en deux sous-ensembles :<br>\n<br>\n- AES, Application Environment Services<br>\n- VDI, Virtual Device Interface<br>\n<br>\nL\'<span class=\"bold\">AES</span> se charge de l\'organisation de l\'environnement utilisateur, tandis que le <span class=\"bold\">VDI</span> s\'occupe de l\'affichage graphique uniforme de l\'interface utilisateur.<br>\nLors du développement de programmes <span class=\"bold\">GEM</span>, il est impératif de respecter les lignes directrices en vigueur et de ne jamais tenter d\'imposer à l\'utilisateur une interface qui ne respecte aucune norme.', NULL, NULL, NULL, '', '', '', 2, 4, 3),
(13, '', '', 'Les différentes versions de GEM', '', '', 'Pour connaître le numéro de version de <span class=\"bold\">GEM</span>, on utilise généralement <span class=\"underline\">l\'ID renvoyé dans le champ global par l\'appel appl_init</span>. Le <span class=\"bold\">VDI</span>, en revanche, <span class=\"underline\">n\'a en réalité pas de numéro de version propre</span>, d\'autant plus que le comportement des fonctions <span class=\"bold\">VDI</span> individuelles est principalement <span class=\"underline\">déterminé par les pilotes de périphériques utilisés</span>, qui sont, après tout, remplaçables.<br>\n<br>\nOn peut globalement différencier les versions de <span class=\"bold\">GEM</span> suivantes :', NULL, NULL, NULL, '', '', '', 2, 4, 3),
(14, 'GEM 1.x', '', '', 'Cette première version de l\'<span class=\"bold\">AES (1.x)</span> avait, non par hasard, <span class=\"underline\">de grandes similitudes avec le système d\'exploitation du Macintosh d\'Apple</span>.<br>\n<br>\nCela se manifestait non seulement dans la conception des éléments de fenêtre, mais aussi dans de nombreuses fonctionnalités du bureau et d\'autres programmes d\'application. <br>\n<br>\nÀ l\'époque, <span class=\"bold\">GEM</span> était présenté principalement en connexion avec des versions d\'essai de <span class=\"bold\">GEM-Draw</span>, <span class=\"bold\">GEM-Paint</span> et <span class=\"bold\">GEM-Write</span>, qui correspondaient en de nombreux détails aux prototypes Macintosh bien connus <span class=\"bold\">MacDraw</span>, <span class=\"bold\">MacPaint</span> et <span class=\"bold\">MacWrite</span>.', '', '', NULL, '1719520729587.png', NULL, '', '', '', 2, 1, 3),
(15, '', '', '', '', '', 'C\'est également la version adoptée par Atari et livrée dans le ST ; toutes les versions plus récentes de l\'Atari-GEM sont également basées sur cette version.<br>\nEn effet, la société Atari a acquis tous les droits sur la version existante et a continué à la développer elle-même. Cela explique également les différences de plus en plus grandes entre <span class=\"bold\">PC-GEM</span> et <span class=\"bold\">Atari-GEM</span>. <br>\n<br>\nLe plus grand défaut de la version Atari était certainement l\'absence du <span class=\"bold\">Graphics Device Operating System (GDOS)</span> ; celui-ci contient des fonctions graphiques indépendantes du périphérique, qui n\'étaient implémentées sur l\'Atari que pour l\'écran, et devaient donc être chargées séparément pour les imprimantes, traceurs, caméras, etc. <br>\nEn conséquence <span class=\"italic\">(surtout dans les premiers jours de l\'Atari)</span>, chaque programme utilisait ses propres pilotes et formats, rendant ainsi l\'échange de données entre applications presque impossible.', NULL, NULL, NULL, '', '', '', 2, 4, 3),
(16, 'GEM 2.x', '', '', 'En raison d\'un différend juridique entre <span class=\"bold\">Apple</span> et <span class=\"bold\">Digital Research</span> <span class=\"italic\">(concernant principalement l\'apparence des programmes d\'application et du bureau)</span>, la version PC de GEM a dû être modifiée.<br>\n<br>\nLe règlement, qui n\'affectait pas la version GEM d\'Atari, ressemblait à ceci :<br>\n<br>\n- <span class=\"color-blue\">Certains éléments de fenêtre</span> ont été modifiés de telle sorte qu\'ils ne ressemblaient plus aux fenêtres du Macintosh <span class=\"italic\">(surtout la barre de titre)</span><br>\n<br>\n- <span class=\"color-blue\">Le menu Accessory</span> a été déplacé dans le coin opposé (droit) de l\'écran<br>\n<br>\n- <span class=\"color-blue\">Les fonctions <span class=\"bold\">graf_growbox</span> et <span class=\"bold\">graf_shrinkbox</span> </span>ont été éliminées<br>\n<br>\n- <span class=\"color-blue\">Le bureau</span> a été entièrement reprogrammé et limité à deux fenêtres fixes.', '', '', NULL, '1719520816205.png', NULL, '', '', '', 2, 1, 3),
(17, '', '', '', '', '', 'Contrairement aux idées reçues, il ne s\'agissait cependant <span class=\"underline\">que d\'une modification du bureau</span>, et non de l\'<span class=\"bold\">AES</span>, qui continuait à permettre jusqu\'à huit fenêtres superposées.<br>\nCependant, il n\'y avait pas que des restrictions, mais aussi des améliorations. L\'exemple le plus important à mentionner est que les accessoires pouvaient installer leur propre barre de menu.<br>\n<br>\nCette version a reçu le numéro de <span class=\"bold\">version 2.0</span> et a été fournie <span class=\"underline\">à partir de 1987</span> ; peu de temps après, elle a été portée par la société de logiciels néerlandaise <span class=\"bold\">ABC</span> avec <span class=\"bold\">GEM-Draw</span>, <span class=\"bold\">GEM-Paint</span>, <span class=\"bold\">GEM-Graph</span> et bien sûr le bureau GEM sur l\'Atari.<br>\nCependant, cette version n\'a jamais vraiment pris de l\'importance et n\'est plus disponible aujourd\'hui.', NULL, NULL, NULL, '', '', '', 2, 4, 3),
(18, 'PC-GEM 3.x', 'GEM Desktop 3.13', '', 'Cette version contenait quelques améliorations mineures. Ainsi, le comportement du menu pouvait être commuté de déroulant à dépliant, par exemple.<br>\n<br>\nÀ partir de la version <span class=\"bold\">GEM/3 3.11</span>, il existe des fonctions <span class=\"bold\">VDI</span> supplémentaires, qui concernent <span class=\"color-blue\">les fonctions Bézier</span> et <span class=\"color-blue\">les imprimantes Postscript</span>.<br>\n<br>\nLe programme <span class=\"bold\">ARTLINE</span> utilise ces nouvelles fonctions avec ses polices vectorielles.<br>\n<br>\nEn raison de la domination de <span class=\"bold\">MS-Windows</span>, cette version a pratiquement disparu du marché des PC.', 'La dernière version standard vendue.<br>\n<br>\nPartie du <span class=\"bold\">GEM PTK/SDK 3.13</span> qui a finalement été réécrite pour prendre en charge les compilateurs <span class=\"bold\">ANSI C</span>.', '', NULL, NULL, '1719520929760.png', '', '', '', 2, 9, 3),
(19, 'GEM/4 ', 'GEM/5', '', 'N\'a atteint le marché qu\'en tant que support d\'exécution pour <span class=\"bold\">Artline/2</span>, <span class=\"bold\">PresTeam/2</span>, <span class=\"bold\">Publish it/3</span>, etc. Le <span class=\"bold\">VDI</span> utilisera <span class=\"bold\">EMS</span>, si disponible.<br>\n<br>\nLe bureau <span class=\"bold\">GEM/3</span> ne fonctionne pas correctement et une commande shell fournie pour lancer des applications <span class=\"bold\">GEM/4</span> à partir du bureau <span class=\"bold\">GEM/3</span> peut planter après une utilisation répétée.', 'N\'a atteint le marché qu\'en tant que support d\'exécution pour <span class=\"bold\">Timeworks Publisher 2.1</span>. Il avait un support de police évolutive utilisant la mémoire <span class=\"bold\">XMS</span> et ajoute un aspect 3D aux objets <span class=\"bold\">AES</span>.<br>\n<br>\n<span class=\"bold\">GEM/4 </span>et <span class=\"bold\">GEM/5</span> ont ajouté de nouveaux appels <span class=\"bold\">VDI</span> et <span class=\"bold\">AES</span>, mais leurs liaisons sont inconnues. <br>\n<br>\nCet <span class=\"bold\">AES 4.0</span> propriétaire prend en charge un nouveau message MU_HELP et certains appels prennent un paramètre supplémentaire pour une aide contextuelle.<br>\nCe que ces fonctionnalités font réellement n\'est pas connu.', '', NULL, NULL, NULL, '', '', '', 3, 3, 3),
(20, '', 'GEM/XM', '', '', 'Probablement le modèle pour le <span class=\"bold\">X/GEM</span> de <span class=\"bold\">DRI</span> pour <span class=\"bold\">FlexOS</span><span class=\"italic\"> (un système multitâche en mode protégé 32 bits)</span>.<br>\n<br>\n<span class=\"bold\">GEM/XM</span> prévoyait d\'apporter un support multitâche sous <span class=\"bold\">DOS</span>, mais est resté inachevé. La dernière version est FreeGEM/XM 3.0beta5-je1.', '', '1719521060733.png', NULL, NULL, '', '', '', 3, 6, 3),
(21, 'ViewMAX/1 (DR-DOS 5.0)', 'ViewMAX/3 (DR-DOS 7.0)', 'ViewMAX/2 (DR-DOS 6.0)', 'C\'est un noyau <span class=\"bold\">GEM/4</span> \"limité\" et ne peut être utilisé que comme un shell pour appeler des applications <span class=\"bold\">GEM</span>. <br>\nBien que conçu pour <span class=\"bold\">DR DOS</span>, il fonctionnera sous <span class=\"bold\">MS-DOS 3.x</span> et versions ultérieures <span class=\"italic\">(moins les mots de passe)</span>. <br>\nPour l\'utiliser avec des applications <span class=\"bold\">GEM</span>, vous devez avoir une installation<span class=\"bold\"> GEM/3</span> ainsi qu\'une installation <span class=\"bold\">ViewMAX</span>. Cette version a été écrite en <span class=\"bold\">Lattice C 3.x</span>.', 'Il n\'a jamais été publié, mais du code bêta est disponible.', 'C\' était une version améliorée de la précédente, mais avec les mêmes limitations de noyau que ci-dessus. Cette version a été réécrite en <span class=\"bold\">Turbo C2.0</span> et permet une configuration via un fichier *.ini.', NULL, NULL, NULL, '', '', '', 3, 7, 3),
(22, '', '', '', '', '', '', NULL, NULL, '1719521179677.png', '', '', '', 3, 5, 3),
(23, 'X/GEM', 'Atari-GEM 1.4', '', 'Cette version de <span class=\"bold\">GEM</span> a été développée par <a class=\"link\" href=\"https://fr.wikipedia.org/wiki/Digital_Research\" target=\"blank\">Digital Research</a> sur un système d\'exploitation multitâche multi-utilisateurs <span class=\"italic\">(FlexOS)</span>, et permet la gestion simultanée de plusieurs applications au premier plan.', 'Des modifications majeures ont été apportées par Atari uniquement dans <span class=\"bold\">GEM 1.4</span> de <span class=\"bold\">TOS 1.04</span> ; la fonctionnalité la plus connue est le sélecteur de fichiers grandement amélioré.', '', NULL, NULL, NULL, '', '', '', 3, 3, 3),
(24, 'Drvmap', '', '', '<span class=\"bold\">Nom :</span> Carte des lecteurs<br>\n<span class=\"bold\">Opcode :</span> 10<br>\n<span class=\"bold\">Syntaxe :</span> int16_t Drvmap ( VOID );<br>\n<br>\n<span class=\"bold\">Description :</span> La routine BIOS Drvmap établit la carte des lecteurs montés. Pour chaque lecteur monté, un bit est défini. Les bits valides sont :<br>\nBit 0 : Lecteur A<br>\nBit 1 : Lecteur B, etc. (32 périphériques maximum possibles)<br>\n<br>\n<span class=\"bold\">Note :</span> La fonction retourne le contenu de la variable système _drvbits. Pour déterminer quels lecteurs sont reconnus par GEMDOS, il faut utiliser la fonction Dsetdrv.<br>\n<br>\n', '<span class=\"bold\">Valeur de retour :</span> La fonction renvoie un WORD (int16_t) dont les bits 0 à 15 représentent les périphériques de bloc installés. Par exemple, si le bit 2 (2^2) est défini, le disque dur logique \'C\' est disponible.<br>\n<br>\n<span class=\"bold\">Disponibilité :</span> Toutes les versions TOS.<br>\n<br>\n<span class=\"code\">move.w    #$A,-(sp)     ; Offset 0<br>\ntrap      #13           ; Appel au BIOS<br>\naddq.l    #2,sp         ; Correction de la pile</span>', '', NULL, NULL, NULL, '', '', '', 2, 3, 2),
(25, 'Getbpb', '', '', '<span class=\"bold\">Nom :</span> Obtenir le BPB (Bloc de Paramètres du BIOS)<br>\n<span class=\"bold\">Opcode :</span> 7<br>\n<span class=\"bold\">Syntaxe :</span> BPB *Getbpb ( int16_t dev );<br>\n<br>\n<span class=\"bold\">Description :</span> La routine BIOS Getbpb établit le bloc de paramètres du BIOS (BPB) du périphérique dev, qui est codé comme suit :<br>\ndev	Signification<br>\n0	Lecteur A<br>\n1	Lecteur B<br>\n2	Lecteur C<br>\n<br>\nLes lecteurs suivants sont codés de manière similaire. En appelant cette fonction, l\'état de changement de média dans le BIOS est réinitialisé.', '<span class=\"bold\">Valeur de retour :</span> La fonction retourne l\'adresse du BPB<br>\n<br>\n<span class=\"bold\">Disponibilité :</span> Toutes les versions de TOS.<br>\n<br>\n<span class=\"code\">move.w    dev,-(sp)    ; Offset 2<br>\nmove.w    #7,-(sp)     ; Offset 0<br>\ntrap      #13          ; Appel au BIOS<br>\naddq.l    #4,sp        ; Correction de la pile</span><br>\n', '', NULL, NULL, NULL, '', '', '', 2, 3, 2),
(26, 'Getmpb', '', '', '<span class=\"bold\">Nom :</span> Obtenir le BPB de la mémoire (Bloc de Paramètres de la Mémoire)<br>\n<span class=\"bold\">Opcode :</span> 0<br>\n<span class=\"bold\">Syntaxe :</span> VOID Getmpb ( MPB *ptr );<br>\n<br>\n<span class=\"bold\">Description :</span> La routine BIOS Getmpb sert à initialiser la gestion de la mémoire et est appelée au démarrage par GEMDOS pour créer le TPA (Transient Program Area) initial. Après cela, Getmpb ne doit plus être utilisé.<br>\n<br>\n<span class=\"bold\">Valeur de retour :</span> La fonction ne retourne pas de résultat.', '<span class=\"bold\">Disponibilité :</span> Toutes les versions de TOS.<br>\n<br>\n<span class=\"code\">pea       ptr          ; Offset 2<br>\nmove.w    #0,-(sp)     ; Offset 0<br>\ntrap      #13          ; Appel au BIOS<br>\naddq.l    #6,sp        ; Correction de la pile</span><br>\n', '', NULL, NULL, NULL, '', '', '', 2, 3, 2),
(27, 'Kbshift', '', '', '<span class=\"bold\">Nom :</span> État des touches spéciales du clavier<br>\n<span class=\"bold\">Opcode :</span> 11<br>\n<span class=\"bold\">Syntaxe :</span> int16_t Kbshift ( int16_t mode );<br>\n<br>\n<span class=\"bold\">Description :</span> La routine BIOS Kbshift établit ou modifie l\'état actuel des touches spéciales du clavier. Si mode est négatif, l\'état est simplement établi. Si mode est 0 ou supérieur à 0, l\'état correspondant sera défini. Les bits individuels sont définis comme suit :<br>\n<br>\nBit	Signification<br>\n0	Touche <span class=\"keyboard-key\">Maj</span> droite<br>\n1	Touche <span class=\"keyboard-key\">Maj</span> gauche<br>\n2	Touche <span class=\"keyboard-key\">Ctrl</span><br>\n3	Touche <span class=\"keyboard-key\">Alt</span><br>\n4	Verrouillage des majuscules<br>\n5	Bouton droit de la souris<br>\n6	Bouton gauche de la souris<br>\n7	<span class=\"keyboard-key\">Alt Gr</span> depuis TOS 4.06 (Milan)', '<div class=\"border-yellow\"><p>Note : La fonction interroge simplement une variable système interne du BIOS, dont l\'adresse peut être calculée via _sysbase si nécessaire. Pour TOS 1.0, cette variable système se trouve à l\'adresse 0xE1B.</p></div><br>\n<br>\n<span class=\"bold\">Valeur de retour :</span> La fonction retourne l\'état des touches de modification.<br>\n<br>\n<span class=\"bold\">Disponibilité :</span> Toutes les versions de TOS.<br>\n<br>\n<span class=\"code\">move.w    mode,-(sp)   ; Offset 2<br>\nmove.w    #$B,-(sp)    ; Offset 0<br>\ntrap      #13          ; Appel au BIOS<br>\naddq.l    #4,sp        ; Correction de la pile</span><br>\n', '', NULL, NULL, NULL, '', '', '', 2, 3, 2),
(28, 'Mediach', '', '', '<span class=\"bold\">Nom :</span> Vérification de changement de média<br>\n<span class=\"bold\">Opcode :</span> 9<br>\n<span class=\"bold\">Syntaxe :</span> int16_t Mediach ( int16_t dev );<br>\n<br>\n<span class=\"bold\">Description :</span> La routine BIOS Mediach établit si le média du périphérique dev a été changé depuis la dernière opération de disque du lecteur en question. Les valeurs valides pour dev sont :<br>\ndev	Signification<br>\n0	Lecteur A<br>\n1	Lecteur B<br>\n2	Lecteur C (similairement pour les autres lecteurs)<br>\n<br>\n<div class=\"border-red\"><p>Note : Il ne faut jamais supposer que le média d\'un périphérique ne peut pas être échangé (cartouche de disque amovible, CD-ROM, lecteur de disquette, disque Floptical, etc.). La reconnaissance d\'un changement de disquette fonctionne généralement de manière fiable seulement si la disquette n\'est pas protégée en écriture. Il est également important de noter que lors du formatage d\'une disquette, différents numéros de série seront attribués.</p></div><br>\n', '<span class=\"bold\">Valeur de retour :</span> La fonction retourne une valeur entière avec la signification suivante :<br>\n<br>\nValeur	Signification<br>\n0	Le média n\'a définitivement pas changé.<br>\n1	Le média pourrait avoir changé.<br>\n2	Le média a définitivement changé.<br>\n<br>\n<span class=\"bold\">Disponibilité :</span> Toutes les versions de TOS.<br>\n<br>\n<span class=\"code\">move.w    dev,-(sp)    ; Offset 2<br>\nmove.w    #9,-(sp)     ; Offset 0<br>\ntrap      #13          ; Appel au BIOS<br>\naddq.l    #4,sp        ; Correction de la pile</span><br>\n', '', NULL, NULL, NULL, '', '', '', 3, 3, 2),
(29, 'Rwabs', '', '', '<span class=\"bold\">Nom :</span> Lecture/Écriture absolue<br>\n<span class=\"bold\">Opcode :</span> 4<br>\n<span class=\"bold\">Syntaxe :</span> int32_t Rwabs ( int16_t rwflag, VOID *buff, int16_t cnt, int16_t recnr, int16_t dev, int32_t lrecno );;<br>\n<br>\n<span class=\"bold\">Description :</span> Description : La routine BIOS Rwabs lit ou écrit des données directement depuis ou vers le lecteur spécifié par dev. Le paramètre rwflag est un vecteur de bits qui spécifie le type d\'opération. Les valeurs valides sont :<br>\n<br>\nBit du rwflag	Signification<br>\n0	0 = Lecture, 1 = Écriture<br>\n1	0 = Prendre en compte le changement de média, 1 = Ne pas lire ou affecter l\'état de changement de média<br>\n2	0 = En cas d\'erreur, redémarrer une tentative, 1 = Ne pas redémarrer une tentative<br>\n3	0 = Mode normal, 1 = Mode physique (1)<br>\n<br>\nPour cela, un pilote de disque dur compatible avec AHDI 3.0 est requis.<br>\n', 'cnt secteurs depuis le tampon buff seront transférés. Dans recnr, le secteur de départ sur le lecteur sera spécifié. lrecno ne sera utilisé que si recnr a la valeur -1, et un pilote de disque dur compatible avec AHDI 3.0 est disponible.<br>\n<br>\n<span class=\"bold\">Valeur de retour :</span> La fonction retourne 0 en cas de succès, ou un code d\'erreur en cas d\'échec.<br>\n<br>\n<span class=\"bold\">Disponibilité :</span> Toutes les versions de TOS.<br>\n<br>\n<span class=\"code\">move.l    lrecno,-(sp)  ; Offset 14<br>\nmove.w    dev,-(sp)     ; Offset 12<br>\nmove.w    recnr,-(sp)   ; Offset 10<br>\nmove.w    cnt,-(sp)     ; Offset  8<br>\npea       buff          ; Offset  4<br>\nmove.w    rwflag,-(sp)  ; Offset  2<br>\nmove.w    #4,-(sp)      ; Offset  0<br>\ntrap      #13           ; Appel au BIOS<br>\nlea       $12(sp),sp    ; Correction de la pile</span><br>\n<br>\nGFA-Basic : <span class=\"code\">Fehler%=Bios(4,W:rwflag%,L:buff%,W:cnt%,W:recnr%,W:dev%,L:lrecno%)</span><br>\n', '', NULL, NULL, NULL, '', '', '', 3, 3, 2),
(30, 'Setexc', '', '', '<span class=\"bold\">Nom :</span> Définir le vecteur d\'exception<br>\n<span class=\"bold\"><span class=\"bold\">Opcode :</span> 5<br>\nSyntaxe : </span>int32_t Setexc ( int16_t number, VOID (*vec)() );<br>\n<br>\n<span class=\"bold\">Description :</span> La routine BIOS Setexc définit ou lit le contenu des vecteurs d\'exception. Les valeurs valides sont :<br>\n<br>\nParamètre	Signification<br>\nnumber	Numéro du vecteur<br>\nvec	Nouvelle adresse (ou -1)<br>\n<br>\n<div class=\"border-yellow\"><p>Note : Si vec est -1L, alors la valeur précédente du vecteur est retournée.<br>\nLe numéro du vecteur d\'exception à définir est, par ailleurs, identique à l\'adresse à définir divisée par 4.</p></div>', '<span class=\"bold\">Valeur de retour :</span> La fonction retourne la valeur précédente (ou actuelle) du vecteur.<br>\n<br>\n<span class=\"bold\">Disponibilité :</span> Toutes les versions de TOS.<br>\n<br>\n<span class=\"code\">pea       exchdlr      ; Offset 4<br>\nmove.w    number,-(sp) ; Offset 2<br>\nmove.w    #5,-(sp)     ; Offset 0<br>\ntrap      #13          ; Appel au BIOS<br>\naddq.l    #8,sp        ; Correction de la pile</span><br>\n', '', NULL, NULL, NULL, '', '', '', 3, 3, 2),
(31, 'Tickcal', '', '', '<span class=\"bold\">Nom :</span> Calcul de tick<br>\n<span class=\"bold\">Opcode :</span> 6<br>\n<span class=\"bold\">Syntaxe :</span> int32_t Tickcal ( VOID );<br>\n<br>\n<span class=\"bold\">Description :</span> La routine BIOS Tickcal retourne le nombre de millisecondes écoulées entre deux appels du temporisateur système.', '<span class=\"bold\">Note :</span> Pour cela, la fonction accède à la variable système _timr_ms.<br>\n<br>\n<span class=\"bold\">Valeur de retour :</span> Nombre de millisecondes correspondantes.<br>\n<br>\n<span class=\"bold\">Disponibilité :</span> Toutes les versions de TOS.<br>\n<br>\n<span class=\"code\">move.w    #6,-(sp)     ; Offset 0<br>\ntrap      #13          ; Appel au BIOS<br>\naddq.l    #2,sp        ; Correction de la pile</span><br>\n', '', NULL, NULL, NULL, '', '', '', 3, 3, 2),
(32, 'I. Émulateur ou Atari ST ?', '', '', 'Le premier outil, c’est bien évidemment la machine sur laquelle ce code est destiné. Il y a deux écoles, tu choisis la méthode que tu souhaites.<br>\n<br>\nSi tu as un Atari 520ST, c’est bien, mais tu seras vite bloqué dès que les choses deviendront sérieuses. <span class=\"bold\">Idéalement, je te conseille un 1040STe</span> pour sa compatibilité avec un périphérique appelé <span class=\"italic\">« Ultra Satan »</span>, qui permet de simuler un disque dur de l’époque.<br>\n<br>\nVoici sur la photo de droite à quoi çà ressemble : 2 lecteur de carte SD.<br>\n<br>\n<div class=\"border-red\"><p>Par contre vérifie que ton Atari est bien compatible avec ce périphérique, il va falloir lui ouvrir le ventre et vérifier la version de la puce DMA.</p></div><br>\n<br>\nJe ferai un petit article sur le sujet, ayant plusieurs machine en ma possession, mais ce n’est pas le sujet de cet article.', '', '', NULL, '1719525834993.png', NULL, '', '', '', 1, 1, 4),
(33, '', '', '', '', '', 'Si tu n’as pas de vraie machine chez toi, ce n’est pas très grave car il existe ce que l’on appelle des émulateurs, ce sont des  logiciels qui reproduisent l’interface et le comportement de l’Atari. <br>\n<br>\nIl en existe plusieurs, mais seuls deux sont réellement efficaces : <span class=\"hashtag\">Hatari 2.5</span> et <span class=\"hashtag\">Steem SSE</span> <span class=\"italic\">(personnellement, je ne suis pas à l’aise avec Steem SSE, je préfère Hatari, mais tu es libre de choisir celui qui te semble le plus adapté pour toi).</span><br>\nVoici où tu peux télécharger ces 2 émulateurs : <br>\n<a class=\"link\" href=\"https://hatari.tuxfamily.org/download.html\" target=\"blank\">Hatari download page</a><br>\n<a class=\"link\" href=\"https://sourceforge.net/projects/steemsse/\" target=\"blank\">Steven Seagal Emulator</a><br>\n<br>\n', NULL, NULL, NULL, '', '', '', 1, 4, 4),
(34, '', '', '', '', '', '', '1719525898053.png', '1719525898054.png', NULL, '', '', '', 1, 2, 4),
(35, 'II.L’éditeur / assembleur / débugger', '', '', '<span class=\"underline\">1 – L’assembleur</span><br>\n<br>\nLe premier outil est l\'assembleur lui-même. Il sert à prendre le code que tu as tapé et à le transformer <span class=\"bold\">dans le seul langage compréhensible par un ordinateur : le langage machine</span> <span class=\"italic\">(un langage composé uniquement de 0 et de 1, également appelé langage binaire, mais nous y reviendrons plus tard).</span><br>\n<br>\n<span class=\"underline\">2 – L’éditeur</span><br>\n<br>\nCet outil est muni d\'un éditeur de texte qui te permet de taper du code. C\'est précisément ce code qui est destiné à être assemblé pour être ensuite stocké dans un fichier source. Ce fichier une fois exécuté est envoyé  dans la mémoire de l\'ordinateur (la RAM), où il sera lu. Voici un schéma à droite qui représente les différentes étapes.<br>\n', '', '', NULL, '1719525934558.png', NULL, '', '', '', 2, 1, 4),
(36, '', '3 – Le débugger', '', '', 'Cet assembleur est souvent accompagné d’un débugger, qui peut être utilisé pour voir ce qui se passe dans la mémoire de l’ordinateur. <br>\nPar exemple, ton programme, une fois assemblé puis envoyé dans la RAM, peut tout à fait être visible par ce débugger ; il permet notamment de suivre pas à pas le comportement de ton programme.<br>\n<br>\nSur <span class=\"italic\">Atari ST</span>, l’assembleur le plus populaire est <span class=\"hashtag\">DevPac v3</span> de chez Hisoft<span class=\"italic\"> (jette un œil dans le menu de l’unité C du site)</span>. Sur PC, plusieurs solutions sont possibles pour les éditeurs, par exemple le tout simple mais efficace <span class=\"hashtag\">Notepad++</span> ou carrément des IDE comme <span class=\"hashtag\">VS Code</span>.', '', '1719526112267.png', NULL, NULL, '', '', '', 2, 6, 4),
(37, '', '', '', '', '', 'Cette introduction est terminée, mais il va falloir encore patienter un tout petit peu avant de commencer à coder quelque chose. Il faut configurer ton émulateur et pour débuter je te propose l’utilisation de <span class=\"hashtag\">Hatari</span> et de l’assembleur <span class=\"hashtag\">DevPac v3</span>.', NULL, NULL, NULL, '', '', '', 2, 4, 4),
(38, '', '', 'III. Configuration de l’émulateur Hatari', '', '', '<span class=\"underline\">1 – Le TOS</span><br>\n<br>\nLa première fois que tu vas lancer <span class=\"bold\">Hatari</span>, tu n’auras pas le bureau de GEM traditionnel que tu connais, mais un autre, c’est <span class=\"hashtag\">EmuTOS</span> ! Pour faire court, c’est un TOS plus évolué que l’original avec des options supplémentaires dans les menus entre autres choses. Pour vulgariser, le TOS c\'est le programme qui fait tourner ton Atari ST, tout comme Microsoft avait le DOS pour faire tourner Windows. Le GEM c\'est le nom de l\'interface toute verte qui sert de bureau.', NULL, NULL, NULL, '', '', '', 3, 4, 4),
(39, '', '', '', '', '', '', NULL, NULL, '1719526300168.png', '', '', '', 3, 5, 4),
(40, '', '', '', '', '', '<div class=\"border-green\"><p>Si tu préfères un TOS original, je te propose le <span class=\"hashtag\">TOS 1.62</span> qui correspond à la gamme des <span class=\"italic\">Atari 1040 STe</span>. Tu trouveras ton bonheur dans l’unité C du site (je n’ai mis que les TOS ‘french’).</p></div><br>\n<br>\nSi tu souhaites en revanche garder <span class=\"hashtag\">EmuTOS</span>, pas de souci mais on va en choisir un qui est en français, c’est quand même mieux. Bref, choisis ton TOS du moment qu’il est compatible avec un STE (bah oui, qui peut le plus peut le moins).', NULL, NULL, NULL, '', '', '', 3, 4, 4),
(41, '', '', '', 'Tu copies le fichier à la racine du répertoire de <span class=\"bold\">HATARI</span> ou, si tu préfères, tu te fais un dossier. Dans <span class=\"bold\">HATARI</span>, tu fais :<br>\n<br>\n<span class=\"keyboard-key\">F12</span> ? <span class=\"color-green\">ROM</span> et dans la zone <span class=\"color-green\">TOS Setup</span> tu peux voir qu’actuellement c’est le fichier <span class=\"italic\">tos.img</span> qui est mis par défaut.<br>\nDonc tu cliques sur le bouton <span class=\"color-green\">Browse</span> pour choisir le TOS que tu as téléchargé.<br>\n<br>\nPuis <span class=\"color-green\">OK</span> ? <span class=\"color-green\">Back to main menu</span> ? <span class=\"color-green\">Save config</span> ? <span class=\"color-green\">OK</span> ? <span class=\"color-green\">Reset machine</span> ? <span class=\"color-green\">OK</span> … et là PAF ! <br>\nUn nouveau TOS ! Ou pas … si <span class=\"bold\">HATARI</span> détecte un nouveau TOS, il va configurer tout seul le reste pour être en adéquation avec le TOS que tu lui as mis.<br>\n<br>\nEn général, tu as le message suivant :', '', '', NULL, '1719526423932.png', NULL, '', '', '', 3, 1, 4),
(42, '', '', '', '', '', '', NULL, NULL, '1719526461590.png', '', '', '', 3, 5, 4),
(43, '', '', '', '', '', 'Et voilà ta machine est prête !<br>\n<br>\nEnfin … presque, il y a deux trois petites choses à savoir. Quand tu vas commencer à coder, tu vas devoir enregistrer tes programmes ainsi que tes nombreux fichiers de sprites sur des disquettes … <div class=\"border-red\"><p>mais là je te déconseille de miser sur ce support d’autant plus qu’à l’époque on pouvait brancher un disque dur au cul de l’Atari !</p></div> Et donc c’est ce que l’on va faire … au moins virtuellement !', NULL, NULL, NULL, '', '', '', 3, 4, 4),
(44, '', '', '', '', '', '', NULL, NULL, '1719526592996.png', '', '', '', 3, 5, 4),
(45, '', '2 – Hard Drive Disk', '', '', 'Les disques durs ACSI (Atari Computer System Interface) étaient des périphériques de stockage utilisés avec les micro-ordinateurs Atari ST. <br>\n<br>\nL\'<span class=\"hashtag\">ACSI</span> est une interface propriétaire développée par Atari, basée sur une version simplifiée de l\'interface <span class=\"hashtag\">SCSI</span> <span class=\"italic\">(Small Computer System Interface)</span>.', '', '1719526666443.png', NULL, NULL, '', '', '', 3, 6, 4),
(46, '', '', '', '', '', 'Il te faut une image vierge de ce support pour l’utiliser avec l’émulateur <span class=\"bold\">HATARI</span>, en voici une <a class=\"file\" href=\"assets/files/ACSI_harddrive_image.80.zip\" target=\"blank\">ACSI_harddrive_image.80</a> qui fait 80 Mb. Colles-moi ça à la racine de ton dossier Hatari.<br>\n<br>\nUn petit <span class=\"keyboard-key\">F12</span> ? <span class=\"color-green\">Hard Disks</span> et on va dans <span class=\"color-green\">ACSI HD</span> ? <span class=\"color-green\">Browse</span> et choisis le fichier que tu viens de copier.<br>\nEnsuite, coche la case <span class=\"color-green\">Boot from hard disk</span>, puis la même chose que d’habitude : <br>\n<span class=\"color-green\">Back to main menu</span> ? <span class=\"color-green\">Save config</span> ? <span class=\"color-green\">OK</span> ? <span class=\"color-green\">Reset machine</span> ? <span class=\"color-green\">OK</span>.<br>\n<br>\nLà tu devrais voir ceci. : ', NULL, NULL, NULL, '', '', '', 3, 4, 4),
(47, '', '', '', '', '', '', NULL, NULL, '1719526785197.png', '', '', '', 3, 5, 4),
(48, '', '', '', '', '', 'Si tu ouvres le disque C, tu verras qu’il n’y a rien mis à part un fichier nommé <span class=\"bold\">SHDRIVER.SYS</span>.<br>\n<br>\n<div class=\"border-red\"><p> NE L’EFFACE JAMAIS SINON TU PEUX DIRE ADIEU À CE QUE CONTIENT TON DISQUE DUR !</p></div><br>\n<br>\nBref, dans ce disque dur tu pourras y mettre par exemple <span class=\"bold\">DevPac</span>, tes sources (c’est comme ça qu’on appelle le code que tu vas taper) et tous les outils qui ont besoin à l’origine de lire des disquettes : gros gain de temps et d’ergonomie !<br>\n<br>\n<br>\nMais ce n’est pas encore suffisant, il y a mieux. <br>\nJe t’explique, une fois tes sources enregistrées dans ce disque dur de type <span class=\"bold\">ACSI</span>, c’est mort pour que tu puisses y avoir accès une fois l’émulateur fermé. Imagine le scénario : ton pote a un <span class=\"bold\">Ultra Satan</span> et il veut tester ton code sur sa machine, pas pratique sans accès direct aux fichiers depuis ton PC. Donc je te montre une solution magique, tu vas créer un dossier à la racine de ton répertoire où se trouve ton émulateur. <br>\n', NULL, NULL, NULL, '', '', '', 3, 4, 4),
(49, '', '', '', '', 'Tu vas l’appeler « Hard Drive » ou ce que tu veux, on s’en fout. Et dans ce même répertoire, tu vas créer plusieurs sous-dossiers genre D, E, F, G, H, I, J … etc.<br>\n<br>\nDans ton émulateur : <span class=\"keyboard-key\">F12</span> ? <span class=\"color-green\">Hard disk</span> ? <span class=\"color-green\">GEMDOS Drive</span>, tu choisis le dossier hard_drive que tu as créé, puis n’oublie pas de cocher la case <span class=\"color-green\">Add GEMDOS HD after</span> blablabl …<br>\n<span class=\"color-green\">Back to main menu</span> ? <span class=\"color-green\">Save config</span> ? <span class=\"color-green\">OK</span> ? <span class=\"color-green\">Reset machine</span> ? <span class=\"color-green\">OK</span>.<br>\n<br>\nAlors là tu te dis « mais il a craqué <span class=\"bold\">HATARI</span>, pourquoi il marque que c’est une cartouche ? » … et bien j’en sais rien, je me suis dit la même chose que toi, on va le virer : <br>\n<br>\nTu sélectionnes C : Cartouche et dans le menu du GEM tu vas dans <span class=\"color-green\">Options</span> ? <span class=\"color-green\">Installer une unité de disque</span> ? <span class=\"color-green\">Enlever</span>.', '', '1719526928842.png', NULL, NULL, '', '', '', 3, 6, 4),
(50, '', '', '', '', '', 'Ensuite tu refais la même manipulation en sélectionnant C : Disque. Mais cette fois-ci tu mets « installer » au lieu d’enlever comme ceci :', NULL, NULL, NULL, '', '', '', 3, 4, 4),
(51, '', '', '', '', '', '', NULL, NULL, '1719527007777.png', '', '', '', 3, 5, 4);
INSERT INTO `contents` (`id_contents`, `title_left`, `title_right`, `title_center`, `text_left`, `text_right`, `text_center`, `image_left`, `image_right`, `image_center`, `attachement_left`, `attachement_right`, `attachement_center`, `page`, `id_templates`, `id_articles`) VALUES
(52, '', '', '', '', '', 'À partir de maintenant, tous les fichiers que tu copieras dans le dossier <span class=\"bold\">hard_drive/D</span> de ton PC seront visibles également dans le GEM de ton émulateur ! À toi d’en créer le nombre que tu veux du moment que ça te permette d’être organisé pour la suite !<br>\n<br>\n<br>\n<span class=\"underline\">3 – Le clavier</span><br>\n<br>\nPour finir, la configuration du clavier dans l’émulateur doit être réglée sur  <span class=\"color-green\">Scancode</span>. Cela te simplifiera l’écriture du code en utilisant les touches réelles de ton clavier PC.<br>\nVoilà, c’est terminé ! À partir de maintenant, tu possèdes un <span class=\"bold\">Atari 1040 ST</span> dans ton PC ! Nous allons pouvoir passer à la suite !', NULL, NULL, NULL, '', '', '', 3, 4, 4),
(53, '', '', '', '', '', '', NULL, NULL, '1719527081890.png', '', '', '', 3, 5, 4);

-- --------------------------------------------------------

--
-- Structure de la table `disk_units`
--

CREATE TABLE `disk_units` (
  `id_disk_units` int(11) NOT NULL,
  `label` varchar(50) DEFAULT NULL,
  `letter` varchar(50) DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `isDisplay` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `disk_units`
--

INSERT INTO `disk_units` (`id_disk_units`, `label`, `letter`, `icon`, `isDisplay`) VALUES
(1, 'Coding', 'C', NULL, 1),
(2, 'System', 'A', NULL, 1),
(3, 'Graphismes', 'B', NULL, 1),
(4, 'PAO', 'D', NULL, 1);

-- --------------------------------------------------------

--
-- Structure de la table `files`
--

CREATE TABLE `files` (
  `id_files` int(11) NOT NULL,
  `name` varchar(128) DEFAULT NULL,
  `isDisplay` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `files`
--

INSERT INTO `files` (`id_files`, `name`, `isDisplay`) VALUES
(1, 'TOS v1.00 (1986)(Atari Corp)(ST)(Fr).zip', 1),
(2, 'TOS v1.06 (1989)(Atari Corp)(STE)(Fr).zip', 1),
(3, 'TOS v1.62 (1990)(Atari Corp)(STE)(Fr).zip', 1),
(4, 'TOS 1.00_1.06_1.62_EMUTOS_Atrai [Fr].zip', 1),
(5, 'ACSI_harddrive_image.80.zip', 1),
(6, 'Devpac v3.10 (1992)(HiSoft).zip', 1),
(7, 'GFA Basic v3.6 (GFA Systemtechnik).zip', 1),
(8, 'Lattice C ST v5.60 (HiSoft)(Disk1a7).zip', 1),
(9, 'Pure C (Application Systems Heidelberg)(Disk1a3).zip', 1),
(10, 'Advanced OCP Art Studio.zip', 1),
(11, 'Advanced OCP Art Studio (manual).zip', 1),
(12, 'Quantum Paint v2.00.zip', 1),
(13, 'NEOchrome Master v2.28.zip', 1),
(14, 'Deluxe Paint ST Viewer v1.0.zip', 1),
(15, 'Degas Elite v1.1.zip', 1),
(16, '1st Word Plus v3.20.zip', 1),
(17, 'Redacteur v4.0beta24 (Disk1 Ã  9).zip', 1);

-- --------------------------------------------------------

--
-- Structure de la table `menu`
--

CREATE TABLE `menu` (
  `id_menu` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `link` varchar(50) DEFAULT NULL,
  `place` tinyint(4) DEFAULT NULL,
  `isDisplay` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `menu`
--

INSERT INTO `menu` (`id_menu`, `name`, `link`, `place`, `isDisplay`) VALUES
(1, 'accueil', '/accueil', 1, NULL),
(2, 'news', '/news', 2, NULL),
(3, 'coding', '/coding', 3, NULL),
(4, 'documentation', '/documentation', 4, NULL),
(5, 'certificates', '/certificates', 5, NULL),
(6, 'informations', '/informations', 6, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `questions`
--

CREATE TABLE `questions` (
  `id_questions` int(11) NOT NULL,
  `text` varchar(256) DEFAULT NULL,
  `id_articles` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `questions`
--

INSERT INTO `questions` (`id_questions`, `text`, `id_articles`) VALUES
(1, 'Qu\'est-ce qu\'un émulateur ?', 4),
(2, 'À quoi sert un Ultra Satan ?', 4),
(3, 'Quel est le seul langage que l\'ordinateur comprend ?', 4),
(4, 'À quoi sert un éditeur de texte ?', 4),
(5, 'Quel est le rôle principal d\'un assembleur ?', 4),
(6, 'Où est stocké le code saisi dans l\'éditeur après l\'assemblage ?', 4),
(7, 'Où est stocké le code source saisi dans l\'éditeur ?', 4),
(8, 'Comment s\'appelle l\'assembleur édité par Hisoft ?', 4),
(9, 'Comment se nomme ce bureau tout vert lorsque l\'on allume un Atari ST ?', 4),
(10, 'Que désigne le TOS ?', 4),
(11, 'Que désigne ASCI pour l\'Atari ST ?', 4);

-- --------------------------------------------------------

--
-- Structure de la table `role`
--

CREATE TABLE `role` (
  `id_role` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `role`
--

INSERT INTO `role` (`id_role`, `name`) VALUES
(0, 'ghost'),
(1, 'administrateur'),
(2, 'utilisateur');

-- --------------------------------------------------------

--
-- Structure de la table `tags`
--

CREATE TABLE `tags` (
  `id_tags` int(11) NOT NULL,
  `color` varchar(10) DEFAULT NULL,
  `label` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `tags`
--

INSERT INTO `tags` (`id_tags`, `color`, `label`) VALUES
(1, '#FF5733', 'Basic'),
(2, '#FF6F61', 'ASM'),
(3, '#FFD700', '68000'),
(4, '#00FF7F', 'Atari'),
(5, '#00FFFF', 'Sprite'),
(6, '#1E90FF', 'XBIOS'),
(7, '#FF1493', 'BIOS'),
(8, '#ADFF2F', 'GEMDOS'),
(9, '#FF4500', 'Line-A'),
(10, '#32CD32', 'VDI'),
(11, '#8A2BE2', 'AES'),
(12, '#00BFFF', 'X CONTROL'),
(13, '#FF6347', 'Emulateurs'),
(14, '#FF69B4', 'Scrolling'),
(15, '#FFDAB9', 'Blitter'),
(16, '#4B0082', 'Interruptions'),
(17, '#FF1493', 'TOS');

-- --------------------------------------------------------

--
-- Structure de la table `templates`
--

CREATE TABLE `templates` (
  `id_templates` int(11) NOT NULL,
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
  `isAttachementCenter` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `templates`
--

INSERT INTO `templates` (`id_templates`, `isTitleLeft`, `isTitleRight`, `isTitleCenter`, `isTextLeft`, `isTextRight`, `isTextCenter`, `isImageLeft`, `isImageRight`, `isImageCenter`, `isAttachementLeft`, `isAttachementRight`, `isAttachementCenter`) VALUES
(1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0),
(2, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0),
(3, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0),
(4, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0),
(5, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0),
(6, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0),
(7, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0),
(8, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0),
(9, 1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `to_contain`
--

CREATE TABLE `to_contain` (
  `id_disk_units` int(11) NOT NULL,
  `id_files` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `to_contain`
--

INSERT INTO `to_contain` (`id_disk_units`, `id_files`) VALUES
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(2, 1),
(2, 2),
(2, 3),
(2, 4),
(2, 5),
(3, 10),
(3, 11),
(3, 12),
(3, 13),
(3, 14),
(3, 15),
(4, 16),
(4, 17);

-- --------------------------------------------------------

--
-- Structure de la table `to_graduate`
--

CREATE TABLE `to_graduate` (
  `id_articles` int(11) NOT NULL,
  `id_users` int(11) NOT NULL,
  `id_certificates` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `to_graduate`
--

INSERT INTO `to_graduate` (`id_articles`, `id_users`, `id_certificates`) VALUES
(4, 1, 1);

-- --------------------------------------------------------

--
-- Structure de la table `to_have`
--

CREATE TABLE `to_have` (
  `id_articles` int(11) NOT NULL,
  `id_tags` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `to_have`
--

INSERT INTO `to_have` (`id_articles`, `id_tags`) VALUES
(1, 4),
(2, 7),
(3, 17),
(4, 13);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id_users` int(11) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `hashpassword` varchar(265) DEFAULT NULL,
  `isActivated` tinyint(1) DEFAULT NULL,
  `firstname` varchar(50) DEFAULT NULL,
  `lastname` varchar(50) DEFAULT NULL,
  `registrationDate` date DEFAULT NULL,
  `id_role` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id_users`, `username`, `email`, `hashpassword`, `isActivated`, `firstname`, `lastname`, `registrationDate`, `id_role`) VALUES
(1, 'zisquier', 'tbressel.dev@gmail.com', '$2a$10$8WECOsML1uyIZPxqdKphaeg3kvM7kZmm/xysUcGAW6S4r5nA2LIrW', 1, 'null', 'null', '2024-06-27', 1),
(3, 'Shaoth', 'edamain@gmail.com', '$2a$10$DByJyQypaeg5r9hu1P2hweWmuY.lnteBIzZsidsEiJLw.pEVAdPvi', 1, 'null', 'null', '2024-07-05', 2),
(5, 'Darian', 'jm.piamiat@gmail.com', '$2a$10$1obq.WkC2Rng9DKJvnEn1.2qJx83kFmlABAIMRT2knAIxSC0h4AU2', 1, 'null', 'null', '2024-07-10', 2),
(6, 'duruti', 'duruti43@gmail.com', '$2a$10$VxkPQdGv0k30EdiPJOocH.CHpg/HwahHxIc/cT1V2E5zdkgpCoA7i', 1, 'null', 'null', '2024-07-10', 2),
(7, 'Mokona', 'mokona@zaclys.net', '$2a$10$LXsMkkqAfUBpIPyH9aIuRehFbdr8f8w4zCOM/PrymUBIG77.1Bo0.', 1, 'null', 'null', '2024-07-10', 2),
(8, 'caviar56', 'nprou1@free.fr', '$2a$10$Zi.mbB2zriA/TiKqDuhlzON8zGNe4DGkSa/QtLbkSO4tfqV9RtR.y', 1, 'null', 'null', '2024-07-10', 2);

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
  MODIFY `id_articles` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `categories`
--
ALTER TABLE `categories`
  MODIFY `id_categories` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `certificates`
--
ALTER TABLE `certificates`
  MODIFY `id_certificates` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `choices`
--
ALTER TABLE `choices`
  MODIFY `id_choices` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT pour la table `contents`
--
ALTER TABLE `contents`
  MODIFY `id_contents` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT pour la table `disk_units`
--
ALTER TABLE `disk_units`
  MODIFY `id_disk_units` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `files`
--
ALTER TABLE `files`
  MODIFY `id_files` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT pour la table `menu`
--
ALTER TABLE `menu`
  MODIFY `id_menu` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `questions`
--
ALTER TABLE `questions`
  MODIFY `id_questions` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `role`
--
ALTER TABLE `role`
  MODIFY `id_role` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `tags`
--
ALTER TABLE `tags`
  MODIFY `id_tags` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT pour la table `templates`
--
ALTER TABLE `templates`
  MODIFY `id_templates` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id_users` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

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
