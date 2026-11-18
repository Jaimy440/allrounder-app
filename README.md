# Allrounder

Persönliche All-in-one-Web-App – läuft komplett im Browser, ohne Server und ohne Installation.

## Bereiche

| Bereich | Funktionen |
|---|---|
| **Start** | Übersicht: Termine heute & nächste 7 Tage, Training des Tages, fällige Karteikarten, nächste Prüfung, dringende Aufgaben, letzte Notizen |
| **Notizen** | Notizen anlegen, durchsuchen, anheften; Autospeichern |
| **Kalender** | Monatsansicht, Termine mit Uhrzeit, Farbe und Wiederholung; zeigt auch Prüfungen und fällige Board-Karten |
| **Training** | Wochenplan (Mo–So) mit Übungen, Sätzen, Wiederholungen, Gewicht; Abhaken, Training abschließen, Verlauf & Statistik |
| **Board** | Kanban wie Trello: mehrere Boards, Spalten, Karten per Drag & Drop, Labels, Fälligkeitsdatum |
| **Berufsschule** | Komplett eingerichtet für *Elektroniker/-in für Geräte und Systeme* nach dem **hessischen Lehrplan** (Handreichung des Hessischen Kultusministeriums): alle 13 Lernfelder (nach Ausbildungsjahr, mit Stunden), je mit Ziel, Themen-Checkliste, Lernzettel mit Formeln und Karteikarten (Leitner-System); dazu Politik und Wirtschaft, Deutsch, Technical English und Prüfungsvorbereitung. Prüfungs-/Klassenarbeitstermine. Inhalte in `js/egs-data.js` |
| **Steuerkreis** | Simulator für Schützsteuerungen: Stromlaufplan zeichnen (Schließer, Öffner, Parallelzweige, Schütze, Zeitrelais an-/abfallverzögert, Meldeleuchten) und live simulieren. Vorlagen: Tippbetrieb, Selbsthaltung, Wendeschütz, Stern-Dreieck, Folgeschaltung, Treppenlicht |
| **Einstellungen** | Hell/Dunkel, Sicherung als JSON herunterladen/einspielen, alles zurücksetzen |

## Starten

`index.html` im Browser öffnen – fertig. Alternativ über GitHub Pages veröffentlichen
(Settings → Pages → Branch auswählen), dann ist die App auch auf dem Handy erreichbar.

## Daten

Alle Daten liegen im `localStorage` des jeweiligen Browsers. Sie werden **nicht** zwischen Geräten
synchronisiert – dafür unter *Einstellungen* eine Sicherung exportieren und auf dem anderen Gerät einspielen.

## Aufbau

```
index.html
css/style.css
js/core.js       Speicher, Dialoge, Router, Hilfsfunktionen
js/home.js       Startseite
js/notes.js      Notizen
js/calendar.js   Kalender
js/training.js   Trainingsplan
js/board.js      Kanban-Board
js/learn.js      Lernbereich Berufsschule
js/circuit.js    Steuerkreis-Simulator
js/settings.js   Einstellungen
```
