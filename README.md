TP TERMITATOR
===========

## Stratégie :

* Chaque termite a des infos sur les tas de bois rencontrés (WoodInfo)
* Les termites communiquent entre elles quand elles se rencontrent et mettent à jour leur infos
* IN PROGRESS : Chaque termite a un cadrillage de la grille et le met à jour au fur et à mesure (rencontre d'une autre termite ou d'un tas de bois)
* IN PROGRESS : Le cadrillage permet le pathFinding (A*). Librairie qui va sûrement être utilisée [lien](https://github.com/bgrins/javascript-astar) (voir dossier lib)
* Si une termite manque d'infos, elle bouge aléatoirement

## Récupération du projet et tests

* Récupérer le projet (git clone)
* Installer karma : `npm install -g karma-cli`
* Installer les dépendances de dev : `npm install`
* Lancer le runner de test karma : `karma start karma.conf.js` ou avec WebStorms (Edit configuration et add Karma)

## TODO

* Finir les tests de WoodInfo
* Refaire méthode update WoodInfo : Quand 2 termites se rencontrent, comparer les infos plutôt que d'écraser l'un ou l'autre : perte d'infos
* GridInfo a été écrit avant les tests => écrire les tests et peut-être refacto
* Look le mail du prof, le système multi agent a apparemment été mis à jour
* Refaire la branche gh-pages => into merge branche