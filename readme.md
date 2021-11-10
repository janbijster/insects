# Insects

## DNA

Het dna bestaat uit een reeks willekeurige booleans.
Dit vormt niet zozeer een configuratie (bv 3e getal == true => aantal poten = 6), maar een script voor het genereren.
Dus bv: 
* 3e getal == true => herhaal vorige actie
* 4e getal == true => splits huidige cel
* 5e getal == true => maak huidige cel groter.

## scripttaal

Op elk moment heeft een cel twee cursors, 1 voor de actie en 1 voor de waarde.
Met de cursor leest de cel de volgende actie en waarde uit het dna.

De waarde is ook afhankelijk van de buren van de cel.

Het begint met een cel. 

Deze heeft als staat de volgende getallen:
* grootte
* teller (begint bij een getal, telt af)
* groeiwaarde

Deze voert de volgende acties uit tot de teller op is:

* Wordt iets groter of kleiner
* Splits (start een nieuwe cel, meestal onder, soms 2 symmetrisch aan de zijkanten)
* verander groeiwaarde

Bij het splitsen geldt voor de volgende cel:
- waar komt de nieuwe cel (splitspunt)
- hoe groot wordt de nieuwe cel
- waar krijgt de nieuwe cel de actiecursor
- waar krijgt de nieuwe cel de waardecursor

## gewenste eigenschappen

* Het moet niet vastlopen. Dus na een aantal herhalingen moet altijd een cursor veranderen op een bepaald moment.
* Een volgende cel moet vaak bijna hetzelfde worden. Maar net niet. En soms helemaal anders
* Nadat een cel gesplitst is wordt de kans op stop veel groter
* Het splitsen is meestal onderaan, tegenover waar parent van de cel zit
* grotere cellen hebben meer kans om ook in een ortagonale richting te splitsen. of een hoek. Maar dan wel symmetrisch, dus tegelijk tweemaal
* de child cellen van een cel moeten samen meestal niet groter worden dan de parent
