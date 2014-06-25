TP TERMITATOR
===========

 I4 – Promotion 2015

# Projet d’Intelligence Artificielle
Mise en place d’un système intelligent de récolte de bois par un groupe de termites

GOLFIER Jean-Matthieu
PAYET Emmanuel
SCHMITZ Sophie

## Plan

* Description projet
* Architecture
  * Termite.js: Utilisation d’un system expert
  * Phases (perception, analyze, act)
  * Sépération des tâches (en TDD):
    * WoodInfo: Gestion des informations sur les tas de bois de chaque termite
      * Mis à jour à chaque perception de heap
      * Permet d’avoir à tout moment le tas de bois ayant le moins de bois et le plus
    * GridInfo: Gestion de la grille de chaque termite (+ utilisation astar.js (lib))
      * Se met à jour lors de la rencontre d’un mur, et flag les noeuds autour comme “unwalkable”
      * Permet à tout moment de savoir comment aller à un noeud précis
  * Dans les deux classes, quand une termite perçois une autre, elles s’échangent leurs infos à jour
* Stratégie
  * Conclusions && faits
* Problèmes & Idées d’améliorations
  * Bug: Termites de temps en temps coincées dans les tas de bois
  * Amélio: Grille dynamique (problème: noeuds fixes: murs plus gros que prévu dans le pathfinding)
  * Bug: Tas de bois situé dans un noeud marqué unwalkable par un mur, impossible d’y aller en astar => ne fait rien en particulier (solution: grille dynamique)


## Projet

...Réaliser un système expert permettant à un groupe de termites de récupérer des morceaux de bois et de les réunir en un seul tas. Elles évolueront dans un monde peuplé de murs et de tas de bois.

## Architecture

* termite.js
  * utilisation d’un système expert qui guide les actions des termites (faits et conclusions)
  * phases d’une termite :
    * perception : met les faits à true ou false (ex :  this.expertSystem.setFactValid("has_no_wood", this.hasWood == false)
    * analyse : récupère les conclusions dues aux faits activés
    * action : appelle les méthodes correspondant aux conclusions trouvées 
  * chaque termite possède un wood_info et un grid_info
* Séparation des tâches en TDD avec
  * wood_info.js : contient toutes les infos et méthodes relatives aux tas de bois. Permet la comparaison et la MAJ quand deux termites se rencontrent ou qu’une termite rencontre un tas de bois
    * infos : Pour chaque tas de bois rencontré : nb de bois, position (x, y), date de MAJ, mort (plus de bois)
    * mis à jour à chaque perception de tas de bois
    * permet à tout moment de connaître le tas de bois ayant le plus / le moins de bois
  * grid_info : contient toutes les infos relatives à la grille qui divise la “carte” en noeuds. Utilisation de astar.js
    * infos : taille du monde, d’un noeud, liste des murs rencontrés
    * se met à jour lors de la rencontre d’un mur, et flag les noeuds autour comme “unwalkable”
    * Permet à tout moment de savoir comment aller à un noeud précis
* Dans ces deux classes, quand une termite perçois une autre, elles s’échangent leurs infos à jour

## Stratégie adoptée

### Faits, conclusions et règles

Les actions des termites sont régies par un système de règles :

| Règle        | Prémisses           | Description  |
| ------------- |:-------------:|:----- |
| go_to_least_wood      | has_no_wood, know_least_wood_position | Se dirige vers le tas de bois le plus petit quand elle n'a pas de bois et qu'elle connait sa position |
| go_to_most_wood      | has_wood, know_most_wood_position      |   Se dirige vers le tas de bois le plus grand quand elle a du bois et qu'elle connait sa position |
| random_move | not_enough_info      |    Se dirige vers une direction aléatoire lorsqu'elle n'a pas suffisamment d'infos (moins de 2 tas de bois rencontrés) |
| update_info_from_termite | perceived_termite      |    Met à jour la grille et les infos sur les tas de bois suivant celles de la termite rencontrée |
| update_info_from_heap | perceived_heap     |    Met à jour la wood_info de la termite lorsqu’elle perçoit un tas de bois |
| update_info_from_wall | perceived_wall      |    Met à jour la grid_info de la termite lorsqu’elle perçoit un mur |

## Problèmes et axes d’amélioration

* Bug: Termites de temps en temps coincées dans les tas de bois
* Bug: Tas de bois situé dans un noeud marqué unwalkable par un mur, impossible d’y aller en astar => ne fait rien en particulier (solution: grille dynamique)
* Amélioration possible: Grille dynamique (problème avec les noeuds fixes : murs plus gros que prévu dans le pathfinding si l'on en croit les noeuds affectés)
