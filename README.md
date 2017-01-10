# Treasure Hunt

## Prérequis

- Node.js >=4
- git

## Installation

Cloner le dépôt sur votre machine
```console
$ git clone https://github.com:mlcdf/treasure-hunt.git && cd treasure-hunt
```

Installer les dépendances globales
```console
$ npm install --global gulp-cli bower
```

Installer les dépendances locales au projet
```console
$ npm install && bower install
```

## Commandes

Lancer le serveur de dev
```console
$ gulp serve
```

Lancer les tests
```console
$ gulp serve:test
```

Build le project
```console
$ gulp
```

Aperçu du Build
```console
$ gulp serve:dist
```

## Règles de style

- fichier: `lower_case`
- plugin: `CamelCase`
- var/function: `doStuff()`
- constante: `PI`
- string: `"yolo"`
