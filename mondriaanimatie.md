# Mondriaanimatie

## De opbouw van een schilderij

Door naar schilderijen van Mondriaan te kijken hoop ik erachter te komen aan welke regels ze voldoen.

## Elementen

Ik heb deze basis-elementen kunnen ontdekken:

- De rand
- Lijnen
- Vlakken
- Blokjes

### De rand van het schilderij

De lijst is (ongeveer) vierkant. Het vierkant kan rechtop staan, of op een hoek (dan is het een ruit).

### Achtergrondkleur

De achtergrondkleur is meestal wit, maar kan ook een soort van vaal-wit zijn [1]

### Lijnen

De lijnen hebben deze eigenschappen:

* dikte: sommige zijn dunner, andere wat dikker
* kleur: zwart, rood, geel, blauw, wit
* orientatie / richting: horizontaal, vertikaal
* twee punten: begin-punt en eind-punt
* elk punt is open (begint bij de rand) of gesloten (begint op een al bestaande lijn) of bijna gesloten (klein beetje open bij de rand)

Deze restricties bestaan tov de andere elementen:

* Er is altijd tenminste 1 open lijn
* Er is altijd tenminste 1 horizontale en 1 verticale lijn
* Er bestaat een minimale afstand tussen twee lijnen.
* Er bestaat een minimale afstand tussen een lijn en een rand.
* Een lijn kleur kan niet gelijk zijn aan een achtergrondkleur

### Kamer

* Een kamer is een ruimte die begrensd wordt door vier lijnen en/of randen.
* Een simpele kamer is een kamer die niet doorkruisd wordt door lijnen.
* Een rand-kamer wordt aan een kant begrensd door een rand.

### Vlakken

Vlakken hebben deze eigenschappen:

* kleur: zwart, rood, geel, blauw, grijs
* ze vullen een kamer, maar verbergen niet de lijnen die door de kamer lopen

Deze restricties bestaan tov de andere elementen:

* vlakken overlappen elkaar niet

### Blokjes

Blokjes hebben deze eigenschappen:

* het zijn rechthoeken
* kleur: rood, geel, blauw
* bevindt zich in een rand-kamer

Restricties tov andere elementen:

* twee blokjes naast elkaar in een kamer hebben niet dezelfde kleur
* blokjes liggen niet naast elkaar en overlappen elkaar niet
* als een kamer blokjes bevat zijn dat er vaak meerdere
* blokjes mogen in een kamer met een vlak liggen, maar dat is ongebruikelijk

## Schilderij

Er zijn verschillende typen schilderijen:

### Zwarte lijnen

Een schilderij met zwarte lijnen heeft

* vlakken
* blokjes

### Gekleurde lijnen

Een schilderij met zwarte lijnen heeft

* geen vlakken
* geen blokjes

## Compositie-elementen

* De dubbele lijn: twee dunne lijnen die vlak naast elkaar liggen
* Groot vlak: vlak in simple kamer dat het grootste deel van de lijst in beslag neemt
* Ladder: twee parallele lijnen met daartussen een aantal lijnen op ongeveer dezelfde afstand
* Raster: de afstanden tussen alle lijnen zijn evengroot

[1] https://www.kunstkopie.nl/a/mondriaan-piet/newyorkcity-2.html
