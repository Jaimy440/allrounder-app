/* Lehrplan „Elektroniker/-in für Geräte und Systeme“ – Hessen
 * Grundlage: Handreichung zum Rahmenlehrplan Berufsschule des Hessischen Kultusministeriums (2024),
 * die den KMK-Rahmenlehrplan (16.05.2003 i. d. F. vom 23.02.2018) umsetzt: 13 Lernfelder, 1020 Std.
 * Inhalte, Lernzettel und Karteikarten sind Lernhilfen und ersetzen nicht Fachbuch, Tabellenbuch und Normen.
 */
const EGS = {
  name: 'Elektroniker/-in für Geräte und Systeme',
  state: 'Hessen',
  source: 'Handreichung Rahmenlehrplan Berufsschule, Hessisches Kultusministerium (2024)',
  subjects: [
    /* ======================= 1. Ausbildungsjahr ======================= */
    {
      key: 'egs-lf1', lf: 1, year: 1, hours: 80, color: 'blue',
      name: 'LF 1 – Elektrotechnische Systeme analysieren und Funktionen prüfen',
      goal: 'Elektrotechnische Systeme und deren Funktionsweise anhand von Unterlagen (Schaltpläne, Datenblätter) analysieren, elektrische Größen berechnen und messen sowie Funktionen prüfen und dokumentieren.',
      topics: [
        'Elektrische Grundgrößen: Ladung, Spannung, Strom, Widerstand',
        'Ohmsches Gesetz, Leistung, Arbeit, Wirkungsgrad',
        'Reihen-, Parallel- und gemischte Schaltungen',
        'Kirchhoffsche Regeln (Knoten- und Maschenregel)',
        'Spannungsteiler – unbelastet und belastet',
        'Leitungswiderstand und Temperaturabhängigkeit',
        'Widerstands-Farbcode und E-Reihen',
        'Temperatur- und lichtabhängige Widerstände (NTC, PTC, LDR)',
        'Kondensator: Kapazität, Laden/Entladen, Zeitkonstante',
        'Spule/Induktivität, Magnetfeld, Induktion',
        'Messen mit dem Multimeter (U, I, R), Messfehler',
        'Gefahren des elektrischen Stroms, Wirkung auf den Menschen',
        'Schaltpläne und Dokumentation lesen und erstellen'
      ],
      formulas: [
        'U = R · I',
        'P = U · I = I² · R = U² / R',
        'W = P · t      (1 kWh = 3,6 MJ)',
        'η = P_ab / P_zu',
        'Reihe: R_ges = R1 + R2 + …',
        'Parallel: 1/R_ges = 1/R1 + 1/R2 + …   (2 Widerstände: R1·R2/(R1+R2))',
        'Spannungsteiler (unbelastet): U2 = U · R2 / (R1 + R2)',
        'Leitungswiderstand: R = l / (κ · A)   κ_Cu ≈ 56 m/(Ω·mm²)',
        'R_ϑ = R_20 · (1 + α · Δϑ)   α_Cu ≈ 0,0039 1/K',
        'Q = C · U     τ = R · C     (nach 5τ ≈ voll geladen)'
      ],
      cards: [
        ['Ohmsches Gesetz', 'U = R · I\nR = U / I\nI = U / R'],
        ['Formeln für die elektrische Leistung (Gleichstrom)', 'P = U · I\nP = I² · R\nP = U² / R'],
        ['Elektrische Arbeit – Formel und Einheit', 'W = P · t\nEinheit: Ws bzw. kWh\n1 kWh = 3 600 000 Ws'],
        ['Was gibt der Wirkungsgrad an?', 'Verhältnis von abgegebener zu zugeführter Leistung:\nη = P_ab / P_zu  (immer < 1 bzw. < 100 %)\nDie Differenz sind die Verluste (meist Wärme).'],
        ['Kirchhoffsche Knotenregel', 'In jedem Knotenpunkt ist die Summe der zufließenden Ströme gleich der Summe der abfließenden Ströme.\nΣ I_zu = Σ I_ab'],
        ['Kirchhoffsche Maschenregel', 'In jeder geschlossenen Masche ist die Summe aller Spannungen null.\nΣ U = 0'],
        ['Eigenschaften der Reihenschaltung', '• Strom ist überall gleich\n• Spannungen teilen sich im Verhältnis der Widerstände auf\n• R_ges = R1 + R2 + …\n• R_ges ist größer als der größte Einzelwiderstand'],
        ['Eigenschaften der Parallelschaltung', '• Spannung ist an allen Widerständen gleich\n• Ströme teilen sich auf (kleiner Widerstand → großer Strom)\n• 1/R_ges = 1/R1 + 1/R2 + …\n• R_ges ist kleiner als der kleinste Einzelwiderstand'],
        ['Unbelasteter Spannungsteiler – Formel', 'U2 = U · R2 / (R1 + R2)'],
        ['Was passiert beim belasteten Spannungsteiler?', 'Der Lastwiderstand R_L liegt parallel zu R2. Dadurch wird der untere Teilwiderstand kleiner und die Ausgangsspannung U2 sinkt. Faustregel: Querstrom ≥ 10 × Laststrom für eine „steife“ Spannung.'],
        ['Formel Leitungswiderstand', 'R = l / (κ · A) = ρ · l / A\nl = Länge, A = Querschnitt, κ = Leitfähigkeit\nKupfer: κ ≈ 56 m/(Ω·mm²)\nBei Hin- und Rückleiter: doppelte Länge!'],
        ['Wie ändert sich der Widerstand von Kupfer mit der Temperatur?', 'Er steigt (Kaltleiter-Verhalten).\nR_ϑ = R_20 · (1 + α · Δϑ),  α_Cu ≈ 0,0039 1/K'],
        ['NTC, PTC, LDR – was ist das?', 'NTC = Heißleiter: Widerstand sinkt bei Erwärmung\nPTC = Kaltleiter: Widerstand steigt bei Erwärmung\nLDR = Fotowiderstand: Widerstand sinkt bei mehr Licht'],
        ['Widerstand mit den Ringen braun – schwarz – rot – gold?', '1 – 0 – ×100 → 1 000 Ω = 1 kΩ, Toleranz ±5 % (gold)'],
        ['Kondensator: Kapazität und Ladung', 'Q = C · U\nC in Farad (F), Q in Coulomb (As)\nKondensatoren sperren Gleichstrom (nach dem Ladevorgang).'],
        ['Zeitkonstante beim RC-Glied', 'τ = R · C\nNach 1τ ≈ 63 % geladen, nach 5τ ≈ 99 % (gilt als vollständig geladen/entladen).'],
        ['Wie wird ein Strommesser angeschlossen?', 'In Reihe zum Verbraucher (Stromkreis auftrennen). Strommesser haben einen sehr kleinen Innenwiderstand → niemals parallel an eine Spannung anschließen (Kurzschluss!).'],
        ['Wie wird ein Spannungsmesser angeschlossen?', 'Parallel zum Bauteil. Spannungsmesser haben einen sehr großen Innenwiderstand, um die Schaltung kaum zu belasten.'],
        ['Relativer Messfehler', 'F = (Anzeigewert − richtiger Wert) / richtiger Wert · 100 %'],
        ['Ab welchen Körperströmen wird es gefährlich?', 'Schon ab ca. 30 mA (Wechselstrom) besteht Lebensgefahr durch Herzkammerflimmern. Deshalb schützen Fehlerstromschutzschalter mit I_Δn = 30 mA.\nZulässige dauernde Berührungsspannung: 50 V AC / 120 V DC.'],
        ['Welche Wirkungen hat der elektrische Strom?', 'Wärmewirkung, magnetische Wirkung, chemische Wirkung, Lichtwirkung, physiologische Wirkung (auf Lebewesen).']
      ]
    },
    {
      key: 'egs-lf2', lf: 2, year: 1, hours: 100, color: 'blue',
      name: 'LF 2 – Elektrische Installationen planen und ausführen',
      goal: 'Elektrische Installationen für einen Kundenauftrag planen, Betriebsmittel und Leitungen auswählen und dimensionieren, Schutzmaßnahmen festlegen, die Installation ausführen, prüfen und übergeben.',
      topics: [
        'Die 5 Sicherheitsregeln, Arbeiten an elektrischen Anlagen',
        'Wechselspannung: Effektivwert, Scheitelwert, Frequenz',
        'Netzsysteme: TN-C, TN-S, TN-C-S, TT, IT',
        'Installationsschaltungen: Aus-, Serien-, Wechsel-, Kreuz-, Stromstoßschaltung',
        'Leitungen und Kabel: Bauarten, Kurzzeichen, Aderfarben',
        'Leitungsdimensionierung: Strombelastbarkeit, Verlegeart, Häufung, Spannungsfall',
        'Überstrom-Schutzeinrichtungen: LS-Schalter (B/C), Schmelzsicherungen',
        'Fehlerstromschutzeinrichtung (RCD)',
        'Schutz gegen elektrischen Schlag: Basisschutz, Fehlerschutz',
        'Schutzklassen und IP-Schutzarten',
        'Schutzpotentialausgleich',
        'Erstprüfung nach DIN VDE 0100-600: Besichtigen, Erproben, Messen',
        'Installationspläne, Schaltzeichen, Materiallisten und Kosten'
      ],
      formulas: [
        'U_eff = Û / √2     (230 V → Û ≈ 325 V)',
        'f = 1 / T     (50 Hz → T = 20 ms)',
        'Spannungsfall Wechselstrom: ΔU = 2 · l · I · cos φ / (κ · A)',
        'Spannungsfall Drehstrom: ΔU = √3 · l · I · cos φ / (κ · A)',
        'Δu = ΔU / U · 100 %',
        'Abschaltbedingung TN-System: Z_s · I_a ≤ U_0'
      ],
      cards: [
        ['Die 5 Sicherheitsregeln (in Reihenfolge)', '1. Freischalten\n2. Gegen Wiedereinschalten sichern\n3. Spannungsfreiheit feststellen (allpolig)\n4. Erden und kurzschließen\n5. Benachbarte, unter Spannung stehende Teile abdecken oder abschranken'],
        ['Effektivwert und Scheitelwert bei 230 V', 'U_eff = Û / √2 → Û = 230 V · √2 ≈ 325 V'],
        ['Aderfarben in der Installation', 'Außenleiter L1/L2/L3: braun, schwarz, grau\nNeutralleiter N: blau\nSchutzleiter PE: grün-gelb'],
        ['Was bedeutet „NYM-J 3×1,5“?', 'N = Normtyp, Y = PVC-Isolierung, M = Mantelleitung, J = mit grün-gelber Schutzleiterader (O = ohne), 3 Adern mit je 1,5 mm² Querschnitt.'],
        ['TN-S-System', 'Sternpunkt direkt geerdet, Neutralleiter (N) und Schutzleiter (PE) sind im gesamten Netz getrennt geführt.'],
        ['TN-C-S-System', 'Im vorderen Teil kombinierter PEN-Leiter (TN-C), ab einem Aufteilungspunkt getrennte N- und PE-Leiter (TN-S). Nach der Aufteilung dürfen N und PE nicht mehr verbunden werden.'],
        ['TT-System', 'Sternpunkt am Transformator geerdet, die Körper der Verbraucheranlage haben einen eigenen Anlagenerder. Fehlerschutz in der Regel über RCD.'],
        ['IT-System', 'Kein direkt geerdeter Sternpunkt (isoliert oder hochohmig). Beim ersten Fehler keine Abschaltung nötig → hohe Verfügbarkeit (z. B. OP-Säle). Isolationsüberwachung erforderlich.'],
        ['Wechselschaltung', 'Eine Leuchte wird von zwei Stellen geschaltet. Benötigt: 2 Wechselschalter.'],
        ['Kreuzschaltung', 'Eine Leuchte wird von drei oder mehr Stellen geschaltet. Benötigt: 2 Wechselschalter + (n − 2) Kreuzschalter.'],
        ['Stromstoßschaltung', 'Beliebig viele Taster (parallel) steuern einen Stromstoßschalter; jeder Impuls wechselt den Schaltzustand. Vorteil: viele Schaltstellen, wenig Leitungsaufwand.'],
        ['LS-Schalter Charakteristik B und C', 'Magnetische (unverzögerte) Auslösung:\nB: 3–5 × I_n (Leitungsschutz, Haushalt)\nC: 5–10 × I_n (Verbraucher mit hohem Einschaltstrom, z. B. Motoren)\nÜberlast: thermischer Auslöser (Bimetall).'],
        ['Wie funktioniert ein RCD (FI-Schalter)?', 'Ein Summenstromwandler vergleicht hin- und zurückfließenden Strom. Fließt ein Fehlerstrom über Erde ab (Differenz ≥ I_Δn), wird abgeschaltet. Für zusätzlichen Personenschutz: I_Δn ≤ 30 mA.'],
        ['Schutzklassen I, II, III', 'I: Schutzleiteranschluss (PE) → Symbol Erdungszeichen\nII: Schutzisolierung (doppeltes Quadrat), kein PE\nIII: Betrieb mit Schutzkleinspannung SELV/PELV (Raute mit III)'],
        ['Was bedeutet IP44?', '1. Ziffer 4: Schutz gegen Fremdkörper ≥ 1 mm\n2. Ziffer 4: Schutz gegen Spritzwasser aus allen Richtungen'],
        ['Basisschutz und Fehlerschutz', 'Basisschutz: Schutz gegen direktes Berühren aktiver Teile (Isolierung, Abdeckung, Gehäuse).\nFehlerschutz: Schutz bei indirektem Berühren im Fehlerfall (z. B. automatische Abschaltung, Schutzisolierung).'],
        ['Abschaltzeit im TN-System (Endstromkreise ≤ 32 A, 230 V)', 'Max. 0,4 s. Bedingung: Z_s · I_a ≤ U_0'],
        ['Reihenfolge der Erstprüfung (DIN VDE 0100-600)', '1. Besichtigen\n2. Erproben und Messen: Durchgängigkeit der Schutzleiter, Isolationswiderstand, Schleifenimpedanz/Abschaltbedingungen, RCD-Prüfung, Drehfeld, Funktionsprüfung\n3. Dokumentation (Prüfprotokoll)'],
        ['Mindest-Isolationswiderstand bei Anlagen bis 500 V', '≥ 1 MΩ bei 500 V DC Messspannung (Anlagen bis 500 V Nennspannung).'],
        ['Welche Faktoren beeinflussen die Strombelastbarkeit einer Leitung?', 'Querschnitt, Leitermaterial, Verlegeart, Umgebungstemperatur, Häufung (mehrere Leitungen gebündelt), Anzahl belasteter Adern.'],
        ['Wozu dient der Schutzpotentialausgleich?', 'Er verbindet leitfähige Teile (Wasser-, Gas-, Heizungsrohre, Fundamenterder, PE) über die Haupterdungsschiene, damit keine gefährlichen Spannungsunterschiede entstehen.']
      ]
    },
    {
      key: 'egs-lf3', lf: 3, year: 1, hours: 80, color: 'blue',
      name: 'LF 3 – Steuerungen analysieren und anpassen',
      goal: 'Steuerungen (verbindungs- und speicherprogrammiert) analysieren, logische Zusammenhänge darstellen, Sensoren und Aktoren auswählen und Steuerungen an geänderte Anforderungen anpassen und in Betrieb nehmen.',
      topics: [
        'Steuern und Regeln, EVA-Prinzip',
        'Zahlensysteme: dual, hexadezimal, BCD',
        'Logische Grundverknüpfungen: UND, ODER, NICHT, NAND, NOR, XOR',
        'Wahrheitstabellen, Funktionsgleichungen, Schaltalgebra, De Morgan',
        'KV-Diagramm zur Vereinfachung',
        'Schützsteuerungen: Selbsthaltung, Verriegelung, Wendeschaltung',
        'Drahtbruchsicherheit',
        'Speicherfunktionen (RS-Flipflop), Zeitfunktionen',
        'SPS: Aufbau, Zyklus, Adressierung, Programmiersprachen (IEC 61131-3)',
        'Sensoren: mechanisch, induktiv, kapazitiv, optisch; PNP/NPN',
        'Aktoren: Relais, Schütze, Ventile, Motoren',
        'Steuerungen dokumentieren: Zuordnungsliste, Funktionsplan'
      ],
      formulas: [
        'UND: Q = A ∧ B          ODER: Q = A ∨ B',
        'NICHT: Q = ¬A',
        'XOR: Q = (A ∧ ¬B) ∨ (¬A ∧ B)',
        'De Morgan: ¬(A ∧ B) = ¬A ∨ ¬B ;  ¬(A ∨ B) = ¬A ∧ ¬B',
        'n Eingänge → 2ⁿ Kombinationen in der Wahrheitstabelle'
      ],
      cards: [
        ['Unterschied Steuern und Regeln', 'Steuern: offene Wirkungskette, keine Rückmeldung des Ergebnisses.\nRegeln: geschlossener Regelkreis – Istwert wird gemessen, mit dem Sollwert verglichen und die Abweichung ausgeregelt.'],
        ['EVA-Prinzip', 'Eingabe (Sensoren, Taster) → Verarbeitung (Logik, SPS) → Ausgabe (Aktoren, Leuchten)'],
        ['Wahrheitstabelle UND', 'A B | Q\n0 0 | 0\n0 1 | 0\n1 0 | 0\n1 1 | 1'],
        ['Wahrheitstabelle ODER', 'A B | Q\n0 0 | 0\n0 1 | 1\n1 0 | 1\n1 1 | 1'],
        ['Wahrheitstabelle XOR (Exklusiv-ODER)', 'A B | Q\n0 0 | 0\n0 1 | 1\n1 0 | 1\n1 1 | 0\nAusgang = 1, wenn die Eingänge ungleich sind.'],
        ['NAND und NOR', 'NAND = negiertes UND (nur bei 1/1 ist Q = 0)\nNOR = negiertes ODER (nur bei 0/0 ist Q = 1)\nMit NAND bzw. NOR lässt sich jede Logik aufbauen.'],
        ['Gesetze von De Morgan', '¬(A ∧ B) = ¬A ∨ ¬B\n¬(A ∨ B) = ¬A ∧ ¬B'],
        ['Wie viele Zeilen hat eine Wahrheitstabelle mit 4 Eingängen?', '2⁴ = 16 Zeilen'],
        ['Was ist Drahtbruchsicherheit?', 'Stopp-/Aus-Funktionen werden mit Öffnern realisiert. Reißt ein Draht, wird der Stromkreis unterbrochen und die Anlage schaltet sicher ab (in der SPS: Aus-Taster als Öffner → Signal 1 im Normalzustand).'],
        ['Selbsthaltung', 'Ein Schließer des Schützes liegt parallel zum Ein-Taster. Nach Loslassen hält sich das Schütz selbst, bis der Aus-Taster (Öffner) unterbricht. → Im Simulator ausprobieren!'],
        ['Verriegelung bei der Wendeschützschaltung', 'Schützverriegelung: Öffner von K2 im Strompfad von K1 und umgekehrt → beide Schütze können nie gleichzeitig anziehen (sonst Kurzschluss zwischen zwei Außenleitern). Zusätzlich oft Tasterverriegelung.'],
        ['RS-Speicher: dominant rücksetzen', 'Liegen Setzen und Rücksetzen gleichzeitig an, ist der Ausgang 0. Aus Sicherheitsgründen meist bevorzugt (Aus hat Vorrang).'],
        ['SPS-Zyklus', '1. Eingänge lesen → Prozessabbild der Eingänge (PAE)\n2. Programm abarbeiten\n3. Prozessabbild der Ausgänge (PAA) an die Ausgänge schreiben\n→ zyklische Wiederholung, Zykluszeit wird überwacht.'],
        ['Programmiersprachen nach IEC 61131-3', 'KOP (Kontaktplan), FUP (Funktionsplan), AWL/IL (Anweisungsliste, auslaufend), ST (Strukturierter Text), AS (Ablaufsprache)'],
        ['Zeitfunktionen TON, TOF, TP', 'TON: Einschaltverzögerung\nTOF: Ausschaltverzögerung\nTP: Impuls fester Länge'],
        ['Induktiver vs. kapazitiver Näherungsschalter', 'Induktiv: erkennt nur Metalle (Wirbelstromprinzip).\nKapazitiv: erkennt fast alle Materialien (auch Kunststoff, Flüssigkeiten).'],
        ['PNP- und NPN-Sensor', 'PNP: schaltet +24 V an den Eingang (plusschaltend, in Europa üblich).\nNPN: schaltet nach Masse/0 V (minusschaltend).'],
        ['Dualzahl 1011 in dezimal?', '1·8 + 0·4 + 1·2 + 1·1 = 11'],
        ['Hexadezimal FF in dezimal?', '15·16 + 15 = 255'],
        ['Kennbuchstaben nach DIN EN 81346-2 (Beispiele)', 'K = Relais/Schütz (verarbeiten)\nQ = Leistungsschütz/Schalten von Energie\nS = Taster/Schalter (manuelle Eingabe)\nB = Sensor\nF = Schutzeinrichtung\nP/H = Meldeleuchte\nM = Motor']
      ]
    },
    {
      key: 'egs-lf4', lf: 4, year: 1, hours: 60, color: 'blue',
      name: 'LF 4 – Informationstechnische Systeme bereitstellen',
      goal: 'IT-Systeme kundengerecht auswählen, konfigurieren, in ein Netzwerk einbinden, in Betrieb nehmen und Maßnahmen zu Datensicherheit und Datenschutz umsetzen.',
      topics: [
        'Aufbau eines PCs: CPU, RAM, Mainboard, Massenspeicher, Schnittstellen',
        'Einheiten: Bit, Byte, kB/KiB, Übertragungsraten',
        'Betriebssysteme installieren und konfigurieren, Dateisysteme',
        'Netzwerkgrundlagen: OSI- und TCP/IP-Modell',
        'IPv4/IPv6-Adressierung, Subnetzmaske, Gateway',
        'DHCP, DNS',
        'Netzwerkkomponenten: Switch, Router, Access Point',
        'Strukturierte Verkabelung: Twisted Pair, Kategorien, RJ45, LWL',
        'Datensicherung: Backup-Arten und -Strategien',
        'Datenschutz (DSGVO) und Informationssicherheit',
        'Kundenberatung, Angebotsvergleich'
      ],
      formulas: [
        '1 Byte = 8 Bit',
        '1 kB = 1000 Byte;  1 KiB = 1024 Byte',
        'Anzahl Hosts im Subnetz = 2^(Hostbits) − 2',
        '/24 = 255.255.255.0 → 254 Hosts',
        'Übertragungszeit t = Datenmenge / Datenrate (Bit/s!)'
      ],
      cards: [
        ['Die 7 Schichten des OSI-Modells (unten nach oben)', '1 Bitübertragung\n2 Sicherung\n3 Vermittlung\n4 Transport\n5 Sitzung\n6 Darstellung\n7 Anwendung'],
        ['Unterschied Switch und Router', 'Switch: verbindet Geräte im selben Netz, arbeitet mit MAC-Adressen (Schicht 2).\nRouter: verbindet verschiedene Netze, arbeitet mit IP-Adressen (Schicht 3).'],
        ['Wie lang ist eine IPv4- bzw. IPv6-Adresse?', 'IPv4: 32 Bit (4 Oktette, z. B. 192.168.1.10)\nIPv6: 128 Bit (hexadezimal, z. B. 2001:db8::1)'],
        ['Private IPv4-Adressbereiche', '10.0.0.0/8\n172.16.0.0/12\n192.168.0.0/16'],
        ['Wie viele Hosts passen in ein /24-Netz?', '2⁸ − 2 = 254 (Netzadresse und Broadcast fallen weg)'],
        ['Wofür steht DHCP?', 'Dynamic Host Configuration Protocol – vergibt automatisch IP-Adresse, Subnetzmaske, Gateway und DNS-Server an Clients.'],
        ['Wofür steht DNS?', 'Domain Name System – übersetzt Namen (z. B. example.com) in IP-Adressen.'],
        ['Wie lang ist eine MAC-Adresse?', '48 Bit, meist hexadezimal geschrieben (z. B. 00:1A:2B:3C:4D:5E). Weltweit eindeutige Hardware-Adresse.'],
        ['TCP vs. UDP', 'TCP: verbindungsorientiert, gesichert (Bestätigungen, Reihenfolge).\nUDP: verbindungslos, schneller, ohne Garantie (z. B. Streaming, VoIP).'],
        ['kB vs. KiB', '1 kB = 1000 Byte (Dezimalpräfix)\n1 KiB = 1024 Byte (Binärpräfix)'],
        ['Schutzziele der Informationssicherheit', 'Vertraulichkeit, Integrität, Verfügbarkeit'],
        ['Datenschutz vs. Datensicherheit', 'Datenschutz: Schutz personenbezogener Daten / der Privatsphäre (DSGVO).\nDatensicherheit: technischer Schutz aller Daten vor Verlust, Manipulation, unbefugtem Zugriff.'],
        ['Backup-Arten', 'Vollsicherung: alles\nInkrementell: Änderungen seit der letzten Sicherung (egal welcher Art)\nDifferenziell: Änderungen seit der letzten Vollsicherung'],
        ['3-2-1-Backup-Regel', '3 Kopien der Daten, auf 2 verschiedenen Medien, 1 Kopie außer Haus (offline/extern).'],
        ['RAM vs. SSD', 'RAM: flüchtiger Arbeitsspeicher, sehr schnell, Daten gehen beim Ausschalten verloren.\nSSD: nicht flüchtiger Massenspeicher (Flash), dauerhaft.']
      ]
    },

    /* ======================= 2. Ausbildungsjahr ======================= */
    {
      key: 'egs-lf5', lf: 5, year: 2, hours: 80, color: 'green',
      name: 'LF 5 – Elektroenergieversorgung und Sicherheit von Betriebsmitteln gewährleisten',
      goal: 'Die Energieversorgung von Geräten und Anlagen analysieren (Wechsel- und Drehstrom, Transformatoren, Netzteile), Schutzmaßnahmen auswählen und die Sicherheit elektrischer Betriebsmittel prüfen und dokumentieren.',
      topics: [
        'Wechselstromtechnik: R, L, C im Wechselstromkreis, Phasenverschiebung',
        'Wirk-, Blind- und Scheinleistung, Leistungsfaktor cos φ',
        'Blindleistungskompensation',
        'Drehstromsystem: Leiter- und Strangspannungen',
        'Stern- und Dreieckschaltung, Leistung im Drehstromnetz',
        'Transformator: Aufbau, Übersetzung, Verluste, Kurzschlussspannung',
        'Sicherheits- und Trenntransformator, SELV/PELV',
        'Netzteile: Gleichrichtung (M1, B2), Glättung, Stabilisierung',
        'Schaltnetzteile – Prinzip und Vorteile',
        'Schutzmaßnahmen an Geräten, Schutzklassen',
        'Prüfung elektrischer Geräte nach DIN VDE 0701-0702 und DGUV V3',
        'EMV – elektromagnetische Verträglichkeit'
      ],
      formulas: [
        'X_L = 2π · f · L        X_C = 1 / (2π · f · C)',
        'Z = √(R² + X²)',
        'S = U · I    P = S · cos φ    Q = S · sin φ    S² = P² + Q²',
        'Stern: U = √3 · U_Str ; I = I_Str',
        'Dreieck: U = U_Str ; I = √3 · I_Str',
        'Drehstrom: P = √3 · U · I · cos φ',
        'Trafo: ü = U1/U2 = N1/N2 = I2/I1',
        'B2-Brücke: U_d ≈ Û − 2 · 0,7 V (mit Glättung, ohne Last)'
      ],
      cards: [
        ['Induktiver und kapazitiver Blindwiderstand', 'X_L = 2π·f·L  (steigt mit der Frequenz)\nX_C = 1/(2π·f·C)  (sinkt mit der Frequenz)'],
        ['Phasenlage bei Spule und Kondensator', 'Spule: Strom eilt der Spannung um 90° nach.\nKondensator: Strom eilt der Spannung um 90° vor.\nMerksatz: „Beim Kondensator eilt der Strom vor, bei Induktivitäten kommt er zu spät.“'],
        ['Leistungsdreieck – Größen und Einheiten', 'Wirkleistung P in W\nBlindleistung Q in var\nScheinleistung S in VA\nS² = P² + Q²;  cos φ = P / S'],
        ['Was ist Blindleistungskompensation?', 'Parallel geschaltete Kondensatoren liefern die von induktiven Verbrauchern (Motoren) benötigte Blindleistung vor Ort. Dadurch sinken Strom, Leitungsverluste und Blindleistungskosten; cos φ nähert sich 1.'],
        ['Leiterspannung und Strangspannung im 400-V-Netz', 'Leiterspannung (zwischen zwei Außenleitern): 400 V\nStrangspannung (Außenleiter – N): 230 V\n400 V = √3 · 230 V'],
        ['Ströme bei Stern- und Dreieckschaltung', 'Stern: Leiterstrom = Strangstrom\nDreieck: Leiterstrom = √3 · Strangstrom'],
        ['Leistungsverhältnis Dreieck zu Stern (gleiche Widerstände)', 'Im Dreieck ist die Leistung 3-mal so groß wie im Stern.'],
        ['Wirkleistung im Drehstromnetz', 'P = √3 · U · I · cos φ  (U = Leiterspannung, I = Leiterstrom)'],
        ['Übersetzungsverhältnis beim Transformator', 'ü = U1/U2 = N1/N2 = I2/I1\nHohe Spannung → kleiner Strom.'],
        ['Verluste im Transformator', 'Eisenverluste (Hysterese, Wirbelströme): spannungsabhängig, im Leerlaufversuch ermittelt.\nKupferverluste (Wicklungswiderstand): lastabhängig, im Kurzschlussversuch ermittelt.'],
        ['Was gibt die relative Kurzschlussspannung u_k an?', 'Die Spannung in % von U_N, bei der im Kurzschlussversuch der Nennstrom fließt. Kleines u_k → spannungssteif, aber hoher Kurzschlussstrom; großes u_k → kurzschlussfest.'],
        ['Sicherheitstransformator', 'Primär- und Sekundärwicklung sind sicher galvanisch getrennt (verstärkte Isolierung). Ausgangsspannung ≤ 50 V AC → Schutzkleinspannung SELV/PELV.'],
        ['Brückengleichrichter (B2U)', '4 Dioden, beide Halbwellen werden genutzt → Pulsfrequenz 100 Hz bei 50 Hz Netz. Ausgangsspannung (geglättet, leerlaufend) ≈ Û − 2 · 0,7 V.'],
        ['Aufgabe des Ladekondensators', 'Glättet die pulsierende Gleichspannung. Je größer C und je kleiner der Laststrom, desto geringer die Restwelligkeit.'],
        ['Vorteile eines Schaltnetzteils', 'Hoher Wirkungsgrad, klein und leicht (hohe Schaltfrequenz → kleiner Trafo). Nachteil: EMV-Störungen, komplexer.'],
        ['Prüfschritte nach DIN VDE 0701-0702', '1. Sichtprüfung\n2. Schutzleiterwiderstand (SK I)\n3. Isolationswiderstand\n4. Schutzleiterstrom bzw. Berührungsstrom\n5. Funktionsprüfung\n6. Dokumentation / Prüfplakette'],
        ['Grenzwerte VDE 0701-0702 (Auswahl)', 'Schutzleiterwiderstand: ≤ 0,3 Ω (bis 5 m Leitung, +0,1 Ω je weitere 7,5 m, max. 1 Ω)\nIsolationswiderstand: SK I ≥ 1 MΩ, SK II ≥ 2 MΩ, SK III ≥ 0,25 MΩ\nSchutzleiterstrom: ≤ 3,5 mA\nBerührungsstrom: ≤ 0,5 mA'],
        ['Was regelt die DGUV Vorschrift 3?', 'Unfallverhütungsvorschrift „Elektrische Anlagen und Betriebsmittel“: Der Unternehmer muss Anlagen und Betriebsmittel regelmäßig von einer Elektrofachkraft prüfen lassen.'],
        ['Was bedeutet EMV?', 'Elektromagnetische Verträglichkeit: Ein Gerät darf andere nicht unzulässig stören (Störaussendung) und muss selbst ausreichend störfest sein (Störfestigkeit).']
      ]
    },
    {
      key: 'egs-lf6', lf: 6, year: 2, hours: 60, color: 'green',
      name: 'LF 6 – Elektronische Baugruppen von Geräten konzipieren, herstellen und prüfen',
      goal: 'Elektronische Baugruppen nach Anforderungen konzipieren, Bauelemente anhand von Datenblättern auswählen, Schaltungen simulieren, Leiterplatten entwerfen, Baugruppen fertigen und prüfen.',
      topics: [
        'Halbleiter-Grundlagen, Diode, Z-Diode, LED',
        'Bipolartransistor und MOSFET als Schalter',
        'Freilaufdiode bei induktiven Lasten',
        'Operationsverstärker: Komparator, invertierender/nichtinvertierender Verstärker, Impedanzwandler',
        'Spannungsregler (Linearregler, LDO)',
        'Datenblätter lesen: Grenz- und Kennwerte',
        'Schaltungssimulation',
        'Leiterplattenentwurf (Schaltplan → Layout), Leiterbahnbreite, Masseführung',
        'Bauformen THT und SMD',
        'Löten: Lote, Temperaturen, Lötfehler',
        'ESD-Schutz',
        'Prüfen mit Oszilloskop und Funktionsgenerator'
      ],
      formulas: [
        'LED-Vorwiderstand: R_V = (U_B − U_F) / I_F',
        'Transistor: I_B = I_C / B · ü   (Übersteuerungsfaktor ü ≈ 2…5)',
        'R_B = (U_St − U_BE) / I_B     U_BE ≈ 0,7 V',
        'OPV invertierend: V = −R2 / R1',
        'OPV nichtinvertierend: V = 1 + R2 / R1',
        'Verlustleistung Linearregler: P = (U_e − U_a) · I'
      ],
      cards: [
        ['Vorwiderstand für eine rote LED an 5 V (U_F = 2 V, I_F = 20 mA)?', 'R_V = (5 V − 2 V) / 0,02 A = 150 Ω'],
        ['Durchlassspannung von Dioden', 'Silizium ≈ 0,7 V\nSchottky ≈ 0,2–0,4 V\nLEDs je nach Farbe ca. 1,8–3,5 V'],
        ['Wie wird eine Z-Diode betrieben?', 'In Sperrrichtung mit Vorwiderstand. Ab der Z-Spannung leitet sie und hält die Spannung nahezu konstant → einfache Spannungsstabilisierung.'],
        ['Transistor als Schalter – Basiswiderstand berechnen', 'I_B = I_C / B · ü (ü = Übersteuerung 2…5)\nR_B = (U_St − 0,7 V) / I_B'],
        ['Unterschied Bipolartransistor und MOSFET', 'Bipolar: stromgesteuert (Basisstrom nötig).\nMOSFET: spannungsgesteuert, statisch kein Gatestrom, sehr kleiner R_DS(on) → geringe Verluste. Für µC: Logic-Level-MOSFET verwenden.'],
        ['Wozu dient eine Freilaufdiode?', 'Beim Abschalten einer Induktivität (Relaisspule, Motor) entsteht eine hohe Induktionsspannung. Die antiparallel geschaltete Diode baut sie ab und schützt den Transistor.'],
        ['Eigenschaften des idealen OPV', 'Leerlaufverstärkung unendlich, Eingangswiderstand unendlich (keine Eingangsströme), Ausgangswiderstand null. Mit Gegenkopplung: Differenzspannung U_D ≈ 0.'],
        ['Verstärkung invertierender Verstärker', 'V = −R2 / R1 (Ausgang um 180° phasengedreht)'],
        ['Verstärkung nichtinvertierender Verstärker', 'V = 1 + R2 / R1'],
        ['Was ist ein Impedanzwandler (Spannungsfolger)?', 'Nichtinvertierender OPV mit V = 1 (Ausgang direkt auf −Eingang). Hoher Eingangswiderstand, niedriger Ausgangswiderstand → entkoppelt Quelle und Last.'],
        ['Komparator', 'OPV ohne Gegenkopplung: vergleicht zwei Spannungen, Ausgang springt an die positive oder negative Aussteuergrenze. Mit Mitkopplung → Schmitt-Trigger (Hysterese).'],
        ['Verlustleistung eines 7805 bei 12 V Eingang und 0,5 A?', 'P = (12 V − 5 V) · 0,5 A = 3,5 W → Kühlkörper nötig!'],
        ['THT vs. SMD', 'THT (Through Hole): bedrahtete Bauteile durch Bohrungen, robust, einfach von Hand lötbar.\nSMD (Surface Mounted): auf der Oberfläche, klein, automatisch bestückbar, günstiger in Serie.'],
        ['Was ist ESD und wie schützt man sich?', 'Elektrostatische Entladung – kann Halbleiter zerstören oder vorschädigen. Schutz: EPA-Arbeitsplatz, Erdungsarmband, ableitfähige Unterlagen, ESD-Verpackung.'],
        ['Woran erkennt man eine kalte Lötstelle?', 'Matt, rau, kugelförmig, schlechte Benetzung (Lot fließt nicht auf Pad und Anschluss). Ursache: zu wenig Wärme oder Bewegung beim Erstarren.'],
        ['Schmelztemperatur bleifreies Lot (SAC305)?', 'Ca. 217–220 °C. Lötspitze typischerweise 320–380 °C.'],
        ['Wovon hängt die nötige Leiterbahnbreite ab?', 'Vom Strom, der zulässigen Erwärmung und der Kupferdicke (z. B. 35 µm). Außerdem Abstände (Luft- und Kriechstrecken) je nach Spannung beachten.']
      ]
    },
    {
      key: 'egs-lf7', lf: 7, year: 2, hours: 80, color: 'green',
      name: 'LF 7 – Baugruppen hard- und softwareseitig konfigurieren',
      goal: 'Programmierbare Baugruppen (Mikrocontroller) analysieren, Software anpassen und übertragen, Hardware konfigurieren, Schnittstellen und Bussysteme einbinden und Geräte in Betrieb nehmen.',
      topics: [
        'Aufbau von Mikrocontrollern: CPU, Flash, RAM, EEPROM, Peripherie',
        'Digitale Ein- und Ausgänge, Pull-up/Pull-down',
        'Programmierung in C: Datentypen, Operatoren, Kontrollstrukturen, Funktionen',
        'Bitoperationen und Registerzugriffe',
        'Programmablaufplan (PAP) und Struktogramm',
        'Timer, Interrupts, Polling',
        'Analog-Digital-Umsetzer (ADC), Auflösung',
        'Pulsweitenmodulation (PWM)',
        'Serielle Schnittstellen: UART, SPI, I²C',
        'Feldbusse: CAN, (USB, Ethernet)',
        'Entwicklungsumgebung, Debugging, Software übertragen (Flashen)',
        'Konfiguration und Dokumentation, Versionsverwaltung'
      ],
      formulas: [
        'ADC-Auflösung: LSB = U_ref / 2ⁿ',
        'ADC-Wert = U_ein / U_ref · (2ⁿ − 1)',
        'PWM-Tastgrad: g = t_ein / T',
        'Mittelwert PWM: U_m = g · U_max',
        'Bit setzen: x |= (1<<n)   löschen: x &= ~(1<<n)   toggeln: x ^= (1<<n)'
      ],
      cards: [
        ['Flash, RAM und EEPROM im Mikrocontroller', 'Flash: Programmspeicher, nicht flüchtig.\nRAM: Variablen zur Laufzeit, flüchtig.\nEEPROM: kleine Datenmengen dauerhaft speichern (Parameter), nicht flüchtig.'],
        ['Auflösung eines 10-Bit-ADC bei 5 V Referenz?', 'LSB = 5 V / 1024 ≈ 4,88 mV'],
        ['Was ist PWM?', 'Pulsweitenmodulation: Rechtecksignal mit fester Frequenz, dessen Einschaltdauer variiert wird. Der Mittelwert steuert z. B. LED-Helligkeit oder Motordrehzahl.\nTastgrad g = t_ein / T'],
        ['I²C – Eigenschaften', '2 Leitungen: SDA (Daten), SCL (Takt); Busteilnehmer mit Adressen; Open-Drain mit Pull-up-Widerständen; halbduplex.'],
        ['SPI – Eigenschaften', '4 Leitungen: MOSI, MISO, SCK, CS/SS; Master-Slave, vollduplex, schnell; je Slave eine Chip-Select-Leitung.'],
        ['UART – Eigenschaften', 'Asynchron (kein Takt), TX/RX gekreuzt; beide Seiten brauchen gleiche Baudrate; Rahmen: Startbit, Datenbits, ggf. Parität, Stoppbit(s).'],
        ['CAN-Bus', 'Differenzielle Übertragung über CAN_H/CAN_L, störsicher, Multi-Master, nachrichtenorientiert (Identifier = Priorität). Abschluss mit je 120 Ω an beiden Enden.'],
        ['Polling vs. Interrupt', 'Polling: Programm fragt zyklisch ab (einfach, aber verschwendet Rechenzeit).\nInterrupt: Ereignis unterbricht das Hauptprogramm und startet eine Interrupt-Service-Routine (schnelle Reaktion).'],
        ['Wozu dient ein Pull-up-Widerstand?', 'Er zieht einen offenen Eingang definiert auf High, damit er nicht „floatet“. Ein Taster nach Masse erzeugt dann beim Drücken Low.'],
        ['Bit 3 in einem Register setzen, löschen, umschalten (C)', 'Setzen: REG |= (1<<3);\nLöschen: REG &= ~(1<<3);\nUmschalten: REG ^= (1<<3);'],
        ['Wertebereich uint8_t und int16_t', 'uint8_t: 0 … 255\nint16_t: −32 768 … 32 767'],
        ['Was ist ein Watchdog?', 'Ein Timer, der regelmäßig vom Programm zurückgesetzt werden muss. Hängt sich das Programm auf, läuft er ab und löst einen Reset aus.'],
        ['PAP vs. Struktogramm', 'Beide stellen Programmabläufe grafisch dar. PAP (DIN 66001) nutzt Symbole und Pfeile; Struktogramm (Nassi-Shneiderman) nutzt verschachtelte Blöcke und erzwingt strukturierte Programmierung.'],
        ['Was ist Entprellen?', 'Mechanische Taster prellen (mehrere kurze Ein/Aus-Wechsel). Entprellen per Software (Wartezeit/mehrfaches Abfragen) oder Hardware (RC-Glied + Schmitt-Trigger).']
      ]
    },
    {
      key: 'egs-lf8', lf: 8, year: 2, hours: 60, color: 'green',
      name: 'LF 8 – Geräte herstellen und prüfen',
      goal: 'Den Aufbau von Geräten planen, Komponenten auswählen, Fertigungsunterlagen erstellen, Geräte unter Beachtung von Normen und Qualitätsanforderungen herstellen, prüfen und dokumentieren.',
      topics: [
        'Fertigungsunterlagen: Stückliste, Bestückungsplan, Verdrahtungsplan, Arbeitsplan',
        'Gehäuse, Mechanik, Wärmeabfuhr',
        'Fertigungsverfahren: Bestücken, Reflow- und Wellenlöten, Crimpen',
        'Normen und Richtlinien: CE-Kennzeichnung, Niederspannungs- und EMV-Richtlinie, RoHS',
        'Qualitätsmanagement: DIN EN ISO 9001, PDCA-Zyklus',
        'Prüfverfahren: Sichtprüfung, AOI, ICT, Funktionstest, Hochspannungsprüfung',
        'Prüfanweisungen und Prüfprotokolle',
        'Typenschild und Gerätekennzeichnung',
        'Kostenkalkulation in der Fertigung',
        'Entsorgung und Umweltschutz (ElektroG/WEEE)'
      ],
      formulas: [
        'Ausschussquote = fehlerhafte Teile / gefertigte Teile · 100 %',
        'First Pass Yield = fehlerfrei im 1. Durchlauf / gesamt · 100 %'
      ],
      cards: [
        ['Was enthält eine Stückliste?', 'Positionsnummer, Menge, Benennung, Bauteilbezeichnung/Wert, Sachnummer, ggf. Hersteller, Gehäuse/Bauform.'],
        ['Was bedeutet die CE-Kennzeichnung?', 'Der Hersteller erklärt, dass das Produkt allen zutreffenden EU-Richtlinien entspricht (z. B. Niederspannungs-, EMV-, RoHS-Richtlinie). Es ist kein Prüfzeichen einer unabhängigen Stelle.'],
        ['Was regelt die RoHS-Richtlinie?', 'Beschränkung gefährlicher Stoffe in Elektro- und Elektronikgeräten (z. B. Blei, Quecksilber, Cadmium).'],
        ['Reflowlöten vs. Wellenlöten', 'Reflow: Lotpaste wird aufgedruckt, SMD bestückt und im Ofen aufgeschmolzen.\nWelle: Leiterplatte wird über eine Lotwelle geführt – v. a. für THT-Bauteile.'],
        ['AOI und ICT', 'AOI: automatische optische Inspektion (Kamera prüft Bestückung und Lötstellen).\nICT: In-Circuit-Test – elektrische Prüfung einzelner Bauteile über Prüfnadeln (Nadelbett oder Flying Probe).'],
        ['Der PDCA-Zyklus', 'Plan – Do – Check – Act (Planen, Umsetzen, Überprüfen, Verbessern) → kontinuierlicher Verbesserungsprozess.'],
        ['Worum geht es in DIN EN ISO 9001?', 'Anforderungen an ein Qualitätsmanagementsystem: Prozessorientierung, Kundenorientierung, Dokumentation, kontinuierliche Verbesserung.'],
        ['Welche Angaben gehören auf ein Typenschild?', 'Hersteller, Typ, Seriennummer, Bemessungsspannung/-frequenz, Leistung bzw. Strom, Schutzklasse, IP-Schutzart, CE-Zeichen, ggf. WEEE-Symbol.'],
        ['Worauf kommt es beim Crimpen an?', 'Passende Aderendhülse/Kontakt und passendes Werkzeug, richtige Abisolierlänge – ergibt eine gasdichte, mechanisch feste Verbindung. Prüfung per Zugtest/Schliffbild.'],
        ['Wozu dient die Hochspannungsprüfung (Spannungsfestigkeit)?', 'Sie prüft, ob die Isolierung zwischen aktiven Teilen und berührbaren Teilen einer erhöhten Spannung standhält, ohne durchzuschlagen (Stückprüfung in der Fertigung).'],
        ['Systematische vs. zufällige Fehler in der Fertigung', 'Systematisch: gleiche Ursache, wiederholt sich (falsches Bauteil, falsches Programm) → Ursache abstellen.\nZufällig: einzelne, unvorhersehbare Fehler.'],
        ['Was regelt das ElektroG?', 'Rücknahme und umweltgerechte Entsorgung von Elektroaltgeräten (Umsetzung der WEEE-Richtlinie). Symbol: durchgestrichene Mülltonne.']
      ]
    },

    /* ======================= 3. Ausbildungsjahr ======================= */
    {
      key: 'egs-lf9', lf: 9, year: 3, hours: 100, color: 'orange',
      name: 'LF 9 – Geräte und Systeme instand halten',
      goal: 'Instandhaltungsmaßnahmen planen und durchführen, Fehler an Geräten und Systemen systematisch eingrenzen und beheben, Geräte nach Instandsetzung prüfen und die Arbeiten dokumentieren und mit dem Kunden kommunizieren.',
      topics: [
        'Instandhaltung nach DIN 31051: Wartung, Inspektion, Instandsetzung, Verbesserung',
        'Instandhaltungsstrategien: ausfallbedingt, vorbeugend, zustandsorientiert, vorausschauend',
        'Ausfallverhalten: Badewannenkurve, MTBF, MTTR',
        'Systematische Fehlersuche (Signalverfolgung, Halbierungsmethode)',
        'Fehleranalyse: Ursache-Wirkungs-Diagramm, FMEA',
        'Messen mit Oszilloskop: Triggerung, Tastkopf, Kompensation',
        'Austausch von Bauteilen und Baugruppen, Ersatzteilbeschaffung',
        'Prüfung nach Instandsetzung (DIN VDE 0701-0702)',
        'Dokumentation, Reparaturbericht, Kundengespräch',
        'Kostenvoranschlag, Wirtschaftlichkeit einer Reparatur'
      ],
      formulas: [
        'MTBF = Betriebszeit / Anzahl Ausfälle',
        'Verfügbarkeit V = MTBF / (MTBF + MTTR)',
        'FMEA: RPZ = A · B · E (je 1…10)'
      ],
      cards: [
        ['Die 4 Grundmaßnahmen der Instandhaltung (DIN 31051)', 'Wartung (Abnutzungsvorrat erhalten)\nInspektion (Ist-Zustand feststellen und beurteilen)\nInstandsetzung (Sollzustand wiederherstellen)\nVerbesserung (Zuverlässigkeit/Funktion steigern)'],
        ['Instandhaltungsstrategien', 'Ausfallbedingt (Reparatur nach Ausfall)\nVorbeugend/zeitbasiert (feste Intervalle)\nZustandsorientiert (nach gemessenem Zustand)\nVorausschauend/Predictive (Prognose aus Daten)'],
        ['Die Badewannenkurve', '1. Frühausfälle (hohe, sinkende Ausfallrate)\n2. Zufallsausfälle (niedrige, konstante Rate – Nutzungsphase)\n3. Verschleißausfälle (steigende Rate am Lebensende)'],
        ['MTBF und MTTR', 'MTBF: mittlere Betriebszeit zwischen zwei Ausfällen\nMTTR: mittlere Reparaturdauer\nVerfügbarkeit = MTBF / (MTBF + MTTR)'],
        ['Was ist die Halbierungsmethode?', 'Die Signalkette wird in der Mitte geprüft. Ist das Signal dort in Ordnung, liegt der Fehler dahinter, sonst davor. So wird der Fehlerort schnell eingegrenzt.'],
        ['Ursache-Wirkungs-Diagramm (Ishikawa) – typische Kategorien', 'Mensch, Maschine, Material, Methode, Milieu (Umwelt), Messung – die „6 M“.'],
        ['FMEA und Risikoprioritätszahl', 'Fehlermöglichkeits- und Einflussanalyse: vorbeugende Bewertung möglicher Fehler.\nRPZ = A (Auftreten) · B (Bedeutung) · E (Entdeckung), je 1–10 → hohe RPZ zuerst angehen.'],
        ['Tastkopf 10:1 – was ist zu beachten?', 'Teilt die Spannung 10:1 und belastet die Schaltung weniger. Abgleich (Kompensation) am Rechteck-Kalibriersignal des Oszilloskops, Teilerfaktor am Gerät einstellen.'],
        ['Wozu dient die Triggerung am Oszilloskop?', 'Sie startet die Darstellung immer am gleichen Punkt des Signals (z. B. steigende Flanke bei bestimmtem Pegel) → stehendes Bild.'],
        ['Was muss nach einer Reparatur an einem Elektrogerät erfolgen?', 'Prüfung nach DIN VDE 0701-0702 (Sichtprüfung, Schutzleiter, Isolation, Ableit-/Berührungsstrom, Funktion) und Dokumentation, bevor das Gerät an den Kunden zurückgeht.'],
        ['Inhalte eines Reparaturberichts', 'Kunde/Gerät, Fehlerbeschreibung, Fehlerursache, durchgeführte Arbeiten, Ersatzteile, Arbeitszeit, Prüfergebnisse, Datum/Unterschrift.']
      ]
    },
    {
      key: 'egs-lf10', lf: 10, year: 3, hours: 80, color: 'orange',
      name: 'LF 10 – Fertigungsanlagen einrichten',
      goal: 'Automatisierte Fertigungsanlagen analysieren, Antriebe, Sensoren, Aktoren und Kommunikationssysteme einrichten und parametrieren, Steuerungsprogramme anpassen und Anlagen unter Beachtung der Maschinensicherheit in Betrieb nehmen.',
      topics: [
        'Aufbau automatisierter Fertigungsanlagen (Bestücker, Lötanlagen, Fördertechnik)',
        'Ablaufsteuerungen mit GRAFCET (DIN EN 60848)',
        'SPS-Programme anpassen, Ablaufketten',
        'Drehstrom-Asynchronmotor: Aufbau, Drehzahl, Schlupf, Anlassverfahren',
        'Frequenzumrichter: Aufbau, U/f-Kennlinie, Parametrierung',
        'Servo- und Schrittmotoren',
        'Elektropneumatik: Zylinder, Wegeventile',
        'Industrielle Kommunikation: PROFINET, PROFIBUS, AS-i, IO-Link',
        'Maschinensicherheit: Maschinenrichtlinie, Not-Halt, Sicherheitsrelais, Performance Level',
        'Einrichten, Rüsten, Inbetriebnahme, Kennzahlen (OEE)'
      ],
      formulas: [
        'Synchrondrehzahl: n_s = f · 60 / p   (p = Polpaarzahl)',
        'Schlupf: s = (n_s − n) / n_s · 100 %',
        'U/f = konstant (FU, unterhalb Nennfrequenz)',
        'Schrittmotor: Schritte pro Umdrehung = 360° / Schrittwinkel',
        'OEE = Verfügbarkeit · Leistung · Qualität'
      ],
      cards: [
        ['Synchrondrehzahl eines 4-poligen Motors an 50 Hz?', '4 Pole = 2 Polpaare → n_s = 50 · 60 / 2 = 1500 1/min'],
        ['Was ist Schlupf?', 'Der Läufer eines Asynchronmotors dreht etwas langsamer als das Drehfeld.\ns = (n_s − n) / n_s · 100 %'],
        ['Wie ändert man die Drehrichtung eines Drehstrommotors?', 'Zwei Außenleiter vertauschen (z. B. mit einer Wendeschützschaltung).'],
        ['Wie arbeitet ein Frequenzumrichter?', 'Gleichrichter → Zwischenkreis (Kondensator) → Wechselrichter (IGBTs, PWM). Ausgangsfrequenz und -spannung sind einstellbar → stufenlose Drehzahlregelung, sanfter Anlauf.'],
        ['Warum U/f = konstant beim FU?', 'Damit der magnetische Fluss und damit das Drehmoment konstant bleiben, muss die Spannung proportional zur Frequenz verändert werden.'],
        ['GRAFCET: Schritt und Transition', 'Schritt: Zustand der Ablaufsteuerung (mit Aktionen).\nTransition: Übergangsbedingung zwischen zwei Schritten. Ein Schritt wird aktiv, wenn der vorige aktiv und die Transition erfüllt ist.'],
        ['5/2-Wegeventil', '5 Anschlüsse, 2 Schaltstellungen – steuert einen doppeltwirkenden Pneumatikzylinder (Aus- und Einfahren).'],
        ['Was ist IO-Link?', 'Punkt-zu-Punkt-Kommunikation zwischen Master und Sensor/Aktor über ungeschirmte 3-Leiter-Standardkabel. Ermöglicht Parametrierung und Diagnose.'],
        ['Stoppkategorien nach EN 60204-1', '0: Sofortiges Abschalten der Energie (ungesteuertes Stillsetzen)\n1: Gesteuertes Stillsetzen, danach Energie trennen\n2: Gesteuertes Stillsetzen, Energie bleibt an\nNot-Halt: Kategorie 0 oder 1.'],
        ['Performance Level (PL)', 'Maß für die Zuverlässigkeit von Sicherheitsfunktionen nach DIN EN ISO 13849-1, Stufen a (gering) bis e (hoch). Erforderlicher PL wird per Risikograph ermittelt.'],
        ['Was berechnet die OEE?', 'Gesamtanlageneffektivität = Verfügbarkeit × Leistungsgrad × Qualitätsrate. Typisches Ziel: > 85 % („World Class“).'],
        ['Stern-Dreieck-Anlauf – Zweck', 'Senkt den Anlaufstrom auf ca. 1/3 (Wicklungen zunächst im Stern an U/√3). Nach dem Hochlauf Umschaltung auf Dreieck. → Im Simulator als Vorlage!']
      ]
    },
    {
      key: 'egs-lf11', lf: 11, year: 3, hours: 100, color: 'orange',
      name: 'LF 11 – Prüfsysteme einrichten und anwenden',
      goal: 'Prüfaufgaben analysieren, Prüfpläne erstellen, Prüfmittel und automatisierte Prüfsysteme auswählen, einrichten und anwenden, Messergebnisse statistisch auswerten und dokumentieren.',
      topics: [
        'Prüfplanung: Prüfmerkmale, Prüfmittel, Prüfumfang',
        'Prüfmittelüberwachung: Kalibrieren, Justieren, Eichen',
        'Messgenauigkeit, Auflösung, Messunsicherheit',
        'Systematische und zufällige Messabweichungen',
        'Vierleitermessung, Belastung durch Messgeräte',
        'Automatisierte Prüfsysteme: Messdatenerfassung, Prüfadapter, Prüfsoftware',
        'Messgeräte-Schnittstellen und Fernsteuerung (USB, LAN, SCPI)',
        'Statistik: Mittelwert, Standardabweichung, Normalverteilung',
        'Prozessfähigkeit (c_p, c_pk) und Regelkarten (SPC)',
        'Prüfprotokolle und Rückverfolgbarkeit'
      ],
      formulas: [
        'Mittelwert: x̄ = Σxᵢ / n',
        'Standardabweichung: s = √( Σ(xᵢ − x̄)² / (n − 1) )',
        'c_p = (OGW − UGW) / (6 · σ)',
        'c_pk = min(OGW − x̄ ; x̄ − UGW) / (3 · σ)',
        'Normalverteilung: ±1σ ≈ 68,3 %, ±2σ ≈ 95,4 %, ±3σ ≈ 99,73 %'
      ],
      cards: [
        ['Kalibrieren – Justieren – Eichen', 'Kalibrieren: Abweichung zum Normal feststellen und dokumentieren (ohne Eingriff).\nJustieren: Messgerät einstellen, sodass die Abweichung minimal wird.\nEichen: gesetzlich vorgeschriebene amtliche Prüfung (z. B. Stromzähler).'],
        ['Was bedeutet die Angabe „±(0,5 % v. M. + 3 Digit)“?', 'Fehlergrenze = 0,5 % vom Messwert plus 3 Einheiten der letzten Stelle der Anzeige.'],
        ['Auflösung vs. Genauigkeit', 'Auflösung: kleinste darstellbare Änderung (z. B. 0,001 V).\nGenauigkeit: wie nah der Messwert am wahren Wert liegt. Hohe Auflösung bedeutet nicht automatisch hohe Genauigkeit!'],
        ['Systematische vs. zufällige Messabweichung', 'Systematisch: gleiche Richtung und Größe (z. B. falsche Kalibrierung, Rückwirkung) → korrigierbar.\nZufällig: streuen statistisch → durch Mehrfachmessung und Mittelwert verringerbar.'],
        ['Wann nutzt man die Vierleitermessung?', 'Bei sehr kleinen Widerständen: Getrennte Strom- und Spannungsleitungen eliminieren den Einfluss von Leitungs- und Übergangswiderständen.'],
        ['Was ist c_p?', 'Prozessfähigkeitsindex: c_p = (OGW − UGW) / 6σ. Vergleicht Toleranzbreite mit der Prozessstreuung. Üblicher Mindestwert: 1,33.'],
        ['Unterschied c_p und c_pk', 'c_p betrachtet nur die Streuung. c_pk berücksichtigt zusätzlich die Lage des Mittelwerts (Zentrierung) – ist der Prozess nicht mittig, ist c_pk < c_p.'],
        ['Wie viel Prozent liegen innerhalb ±3σ?', 'Ca. 99,73 % aller Werte (Normalverteilung).'],
        ['Wozu dient eine Regelkarte (SPC)?', 'Messwerte (z. B. Mittelwert, Spannweite) werden fortlaufend eingetragen. Über Eingriffsgrenzen und Trends erkennt man früh, wenn der Prozess aus dem Ruder läuft.'],
        ['Was ist SCPI?', 'Standard Commands for Programmable Instruments: textbasierte Befehle zur Fernsteuerung von Messgeräten (z. B. „MEAS:VOLT:DC?“) über USB, LAN oder GPIB.'],
        ['Was gehört in einen Prüfplan?', 'Prüfmerkmal, Soll-/Grenzwerte, Prüfmittel, Prüfmethode, Prüfumfang/-häufigkeit, Prüfer, Dokumentation, Maßnahmen bei Fehlern.']
      ]
    },

    /* ======================= 4. Ausbildungsjahr ======================= */
    {
      key: 'egs-lf12', lf: 12, year: 4, hours: 80, color: 'purple',
      name: 'LF 12 – Geräte und Systeme planen und realisieren',
      goal: 'Kundenaufträge für Geräte und Systeme analysieren, Projekte planen, Lösungen entwickeln und realisieren, Kosten kalkulieren, Normen und Sicherheit berücksichtigen, Systeme übergeben und Kunden einweisen.',
      topics: [
        'Kundenauftrag analysieren: Lastenheft und Pflichtenheft',
        'Projektmanagement: Phasen, Ziele (SMART), Meilensteine',
        'Zeitplanung: Gantt-Diagramm, Netzplan, kritischer Pfad',
        'Konzeption: Systementwurf, Bauteil- und Komponentenauswahl, Make-or-buy',
        'Prototyp aufbauen, testen, optimieren',
        'Kostenkalkulation und Angebot',
        'Normen, CE-Konformität, Risikobeurteilung',
        'Technische Dokumentation und Betriebsanleitung',
        'Übergabe, Abnahmeprotokoll, Kundeneinweisung',
        'Präsentation von Projektergebnissen',
        'Vorbereitung Abschlussprüfung Teil 2 (Arbeitsauftrag)'
      ],
      formulas: [
        'Zuschlagskalkulation (vereinfacht):',
        '  Materialkosten + Materialgemeinkosten',
        '+ Lohnkosten + Lohngemeinkosten',
        '= Selbstkosten  + Gewinn  = Nettopreis  + USt = Bruttopreis',
        'Puffer im Netzplan = spätester Anfang − frühester Anfang'
      ],
      cards: [
        ['Lastenheft vs. Pflichtenheft', 'Lastenheft: vom Auftraggeber – WAS soll erreicht werden und WOFÜR?\nPflichtenheft: vom Auftragnehmer – WIE und WOMIT werden die Anforderungen umgesetzt?'],
        ['SMART-Ziele', 'Spezifisch, Messbar, Attraktiv/Akzeptiert, Realistisch, Terminiert'],
        ['Typische Projektphasen', 'Initialisierung → Planung → Durchführung → Kontrolle → Abschluss (mit Dokumentation und Übergabe)'],
        ['Was ist der kritische Pfad?', 'Die Folge von Vorgängen ohne Zeitpuffer. Jede Verzögerung auf dem kritischen Pfad verzögert das gesamte Projekt.'],
        ['Das magische Dreieck des Projektmanagements', 'Qualität (Leistung), Kosten und Zeit beeinflussen sich gegenseitig – verbessert man eins, leidet meist ein anderes.'],
        ['Was ist eine Make-or-buy-Entscheidung?', 'Abwägung, ob eine Komponente selbst entwickelt/gefertigt oder zugekauft wird (Kosten, Know-how, Zeit, Stückzahl, Qualität).'],
        ['Was gehört in ein Abnahmeprotokoll?', 'Auftrag/Projekt, Datum, Beteiligte, geprüfter Umfang, Prüfergebnisse, festgestellte Mängel mit Fristen, Erklärung der Abnahme, Unterschriften.'],
        ['Warum ist die Abnahme rechtlich wichtig?', 'Mit der Abnahme geht die Gefahr auf den Kunden über, die Vergütung wird fällig und die Gewährleistungsfrist beginnt.'],
        ['Was enthält eine Betriebsanleitung?', 'Bestimmungsgemäße Verwendung, Sicherheitshinweise, Installation/Inbetriebnahme, Bedienung, Wartung, Störungsbehebung, technische Daten, Entsorgung.'],
        ['Wozu dient eine Risikobeurteilung?', 'Gefährdungen eines Produkts/einer Maschine systematisch erkennen, Risiken bewerten und Schutzmaßnahmen festlegen (Rangfolge: konstruktiv – technisch – hinweisend).'],
        ['Tipps für eine gute Projektpräsentation', 'Klarer roter Faden (Auftrag → Planung → Umsetzung → Ergebnis → Fazit), wenig Text auf Folien, Fachbegriffe erklären, Zeit einhalten, Blickkontakt, Fragen vorbereiten.']
      ]
    },
    {
      key: 'egs-lf13', lf: 13, year: 4, hours: 60, color: 'purple',
      name: 'LF 13 – Fertigungs- und Prüfsysteme instand halten',
      goal: 'Die Instandhaltung von Fertigungs- und Prüfsystemen planen und organisieren, Störungen an vernetzten Anlagen diagnostizieren und beheben, Zustandsüberwachung einsetzen, elektrische Ausrüstung von Maschinen prüfen und Verbesserungen vorschlagen.',
      topics: [
        'Instandhaltungsplanung und Wartungspläne für Anlagen',
        'TPM (Total Productive Maintenance)',
        'Zustandsüberwachung: Condition Monitoring, Schwingungsanalyse, Thermografie',
        'Diagnose an vernetzten Anlagen: SPS-Diagnosepuffer, Busdiagnose, Fernwartung',
        'Störungsanalyse: Ausfallstatistik, Pareto-Analyse',
        'Prüfung der elektrischen Ausrüstung von Maschinen (DIN EN 60204-1)',
        'Wiederkehrende Prüfungen (DGUV V3, BetrSichV), befähigte Person',
        'Sicheres Arbeiten an Anlagen: Freischalten, Lockout-Tagout (LOTO)',
        'Ersatzteilmanagement',
        'Modernisierung und Retrofit',
        'Dokumentation und Kommunikation mit Produktion und Kunden'
      ],
      formulas: [
        'Verfügbarkeit = MTBF / (MTBF + MTTR)',
        'Pareto: ca. 20 % der Ursachen verursachen ca. 80 % der Störungen',
        'Restspannung (EN 60204-1): ≤ 60 V innerhalb von 5 s'
      ],
      cards: [
        ['Was ist TPM?', 'Total Productive Maintenance: Instandhaltung als Aufgabe aller Mitarbeiter – Bediener übernehmen einfache Wartung (autonome Instandhaltung), Ziel: null Ausfälle, null Fehler, null Unfälle.'],
        ['Was versteht man unter Condition Monitoring?', 'Laufende Überwachung des Anlagenzustands über Sensoren (z. B. Schwingung, Temperatur, Strom), um Verschleiß früh zu erkennen und Instandhaltung bedarfsgerecht zu planen.'],
        ['Wofür wird Thermografie genutzt?', 'Wärmebildkamera macht Temperaturunterschiede sichtbar – z. B. lose Klemmstellen, überlastete Bauteile, defekte Lager.'],
        ['Was ist der Diagnosepuffer einer SPS?', 'Ein Speicher, in dem die SPS Ereignisse und Fehler mit Zeitstempel ablegt (z. B. Baugruppenausfall, Zykluszeitüberschreitung) – erste Anlaufstelle bei Störungen.'],
        ['Prüfungen nach DIN EN 60204-1 (Auswahl)', 'Durchgängigkeit des Schutzleitersystems, Isolationswiderstand (≥ 1 MΩ bei 500 V DC), Spannungsprüfung, Schutz gegen Restspannung, Funktionsprüfung (inkl. Not-Halt).'],
        ['Anforderung an die Restspannung (EN 60204-1)', 'Spannungsführende Teile müssen sich nach dem Abschalten innerhalb von 5 s auf ≤ 60 V entladen, sonst Warnhinweis/Entladeeinrichtung.'],
        ['Was ist Lockout-Tagout (LOTO)?', 'Energiequellen werden abgeschaltet, mit persönlichem Schloss gesichert (Lockout) und gekennzeichnet (Tagout), damit niemand die Anlage während der Arbeiten einschaltet.'],
        ['Was ist eine Pareto-Analyse?', 'Störursachen werden nach Häufigkeit oder Kosten sortiert. Meist verursachen wenige Ursachen (≈ 20 %) den Großteil (≈ 80 %) der Probleme → dort zuerst ansetzen.'],
        ['Was ist ein Retrofit?', 'Modernisierung einer bestehenden Anlage durch Austausch veralteter Komponenten (z. B. Steuerung, Antriebe), statt die ganze Anlage neu zu kaufen.'],
        ['Wer darf wiederkehrende Prüfungen durchführen?', 'Eine Elektrofachkraft bzw. eine „befähigte Person“ (TRBS 1203) mit Ausbildung, Erfahrung und aktueller Tätigkeit im Prüfgebiet.']
      ]
    },

    /* ======================= Allgemeinbildende Fächer ======================= */
    {
      key: 'egs-wiso', year: 0, hours: null, color: 'yellow',
      name: 'Politik und Wirtschaft (PoWi)',
      goal: 'In Hessen als Fach „Politik und Wirtschaft“ unterrichtet: Ausbildung, Arbeitsrecht, soziale Sicherung, Betrieb, Wirtschaft und Politik – prüfungsrelevant im Prüfungsbereich „Wirtschafts- und Sozialkunde“ der Abschlussprüfung Teil 2.',
      topics: [
        'Duales Ausbildungssystem, Berufsbildungsgesetz (BBiG)',
        'Ausbildungsvertrag: Rechte und Pflichten, Probezeit, Kündigung',
        'Jugendarbeitsschutzgesetz (JArbSchG)',
        'Arbeitsvertrag, Kündigungsschutz, Arbeitszeitgesetz',
        'Tarifvertrag, Gewerkschaften, Arbeitgeberverbände',
        'Betriebsrat und Jugend- und Auszubildendenvertretung (JAV)',
        'Sozialversicherungen',
        'Lohnabrechnung: Brutto → Netto',
        'Rechtsformen von Unternehmen',
        'Kaufvertrag, Gewährleistung, Verbraucherschutz',
        'Wirtschaftskreislauf, Markt und Preisbildung',
        'Politisches System der Bundesrepublik Deutschland',
        'Land Hessen: Landesverfassung, Landtag, Landesregierung (Wiesbaden)'
      ],
      formulas: [],
      cards: [
        ['Wie lang ist die Probezeit in der Ausbildung?', 'Mindestens 1 Monat, höchstens 4 Monate (§ 20 BBiG). In der Probezeit können beide Seiten jederzeit ohne Frist und ohne Grund kündigen (schriftlich).'],
        ['Kündigung nach der Probezeit (Ausbildung)', 'Auszubildende: mit 4 Wochen Frist, wenn sie die Ausbildung aufgeben oder einen anderen Beruf erlernen wollen.\nBeide Seiten: fristlos aus wichtigem Grund.\nImmer schriftlich, nach der Probezeit mit Angabe der Gründe (§ 22 BBiG).'],
        ['Pflichten des Auszubildenden (Auswahl)', 'Lernpflicht, Berufsschulpflicht, Weisungen befolgen, Ausbildungsnachweis (Berichtsheft) führen, Betriebsordnung beachten, Schweigepflicht, Sorgfaltspflicht.'],
        ['Pflichten des Ausbildenden (Auswahl)', 'Ausbildungspflicht, Vergütung zahlen, Ausbildungsmittel kostenlos stellen, Freistellung für Berufsschule und Prüfungen, Zeugnis ausstellen, Fürsorgepflicht.'],
        ['Ist das Berichtsheft wichtig für die Prüfung?', 'Ja – der ordnungsgemäß geführte Ausbildungsnachweis ist Voraussetzung für die Zulassung zur Abschlussprüfung.'],
        ['Die 5 Säulen der Sozialversicherung', 'Krankenversicherung, Pflegeversicherung, Rentenversicherung, Arbeitslosenversicherung, Unfallversicherung (Berufsgenossenschaft).'],
        ['Wer bezahlt die gesetzliche Unfallversicherung?', 'Allein der Arbeitgeber (Beiträge an die Berufsgenossenschaft). Sie gilt bei Arbeitsunfällen, Wegeunfällen und Berufskrankheiten.'],
        ['Ab wie vielen Beschäftigten kann ein Betriebsrat gewählt werden?', 'Ab 5 ständigen wahlberechtigten Arbeitnehmern (Betriebsverfassungsgesetz).'],
        ['Wer wählt die JAV?', 'Arbeitnehmer unter 18 Jahren sowie Auszubildende unter 25 Jahren; Voraussetzung: mind. 5 solcher Beschäftigten und ein Betriebsrat.'],
        ['Manteltarifvertrag vs. Entgelttarifvertrag', 'Manteltarifvertrag: allgemeine Arbeitsbedingungen (Arbeitszeit, Urlaub, Kündigungsfristen), längere Laufzeit.\nEntgelttarifvertrag: Höhe von Löhnen, Gehältern und Ausbildungsvergütungen, kürzere Laufzeit.'],
        ['Was bedeutet Tarifautonomie?', 'Gewerkschaften und Arbeitgeber(verbände) handeln Tarifverträge ohne Einmischung des Staates aus (Art. 9 GG).'],
        ['GmbH – wichtigste Merkmale', 'Kapitalgesellschaft, Mindest-Stammkapital 25 000 €, Haftung beschränkt auf das Gesellschaftsvermögen, Geschäftsführung durch Geschäftsführer.'],
        ['Wie kommt ein Kaufvertrag zustande?', 'Durch zwei übereinstimmende Willenserklärungen: Antrag (Angebot) und Annahme.'],
        ['Gesetzliche Gewährleistung beim Kauf (Verbraucher)', '2 Jahre ab Übergabe. Rechte: zuerst Nacherfüllung (Reparatur oder Ersatz), danach Rücktritt, Minderung oder Schadensersatz.'],
        ['Brutto → Netto: Was wird abgezogen?', 'Lohnsteuer, ggf. Solidaritätszuschlag und Kirchensteuer sowie die Arbeitnehmeranteile zu Kranken-, Pflege-, Renten- und Arbeitslosenversicherung.']
      ]
    },
    {
      key: 'egs-deutsch', year: 0, hours: null, color: 'red',
      name: 'Deutsch / Kommunikation',
      goal: 'Berufsbezogen kommunizieren, Texte verfassen (Berichte, Protokolle, Geschäftsbriefe) und präsentieren.',
      topics: [
        'Kommunikationsmodelle (Schulz von Thun, Watzlawick)',
        'Gesprächsführung, Kundengespräche, Konflikte',
        'Arbeitsbericht und Fachbericht',
        'Protokolle: Verlaufs- und Ergebnisprotokoll',
        'Geschäftsbriefe und E-Mails nach DIN 5008',
        'Bewerbung und Lebenslauf',
        'Präsentieren und visualisieren',
        'Sachtexte und Diagramme auswerten'
      ],
      formulas: [],
      cards: [
        ['Die vier Seiten einer Nachricht (Schulz von Thun)', 'Sachinhalt, Selbstkundgabe, Beziehung, Appell („Vier-Ohren-Modell“)'],
        ['Was ist eine Ich-Botschaft?', 'Man beschreibt die eigene Wahrnehmung und das eigene Gefühl statt den anderen anzuklagen. Beispiel: „Ich ärgere mich, wenn das Werkzeug nicht zurückgelegt wird“ statt „Du räumst nie auf!“'],
        ['Verlaufsprotokoll vs. Ergebnisprotokoll', 'Verlaufsprotokoll: gibt den Ablauf der Besprechung mit Wortbeiträgen wieder.\nErgebnisprotokoll: hält nur Beschlüsse, Ergebnisse und Aufgaben (wer, was, bis wann) fest.'],
        ['Aufbau eines Arbeitsberichts', 'Kopf (Name, Datum, Auftrag) → Ausgangssituation/Auftrag → Durchführung in zeitlicher Reihenfolge (sachlich, Präteritum) → Ergebnis → ggf. Probleme/Verbesserungen.'],
        ['Was regelt die DIN 5008?', 'Schreib- und Gestaltungsregeln für Geschäftsbriefe und E-Mails (z. B. Anschriftfeld, Datumsformat, Betreffzeile, Gliederung).'],
        ['Tipps für Präsentationsfolien', 'Eine Kernaussage pro Folie, Stichpunkte statt Fließtext, große Schrift, Grafiken statt Tabellen, einheitliches Design, Quellen angeben.']
      ]
    },
    {
      key: 'egs-englisch', year: 0, hours: null, color: 'gray',
      name: 'Englisch (Technical English)',
      goal: 'Englische Fachtexte, Datenblätter und Anleitungen verstehen und einfache technische Kommunikation führen.',
      topics: [
        'Fachvokabular Elektrotechnik/Elektronik',
        'Datenblätter und Manuals lesen',
        'Bauteile und Werkzeuge beschreiben',
        'Funktionsbeschreibungen und Anleitungen (Imperativ, Passiv)',
        'Fehlerbeschreibungen und Troubleshooting',
        'E-Mails und Telefonate mit Kunden/Lieferanten'
      ],
      formulas: [],
      cards: [
        ['resistor / capacitor / inductor', 'Widerstand / Kondensator / Spule (Induktivität)'],
        ['voltage / current / power', 'Spannung / Strom / Leistung'],
        ['circuit breaker / fuse / residual current device (RCD)', 'Leitungsschutzschalter / Sicherung / Fehlerstromschutzschalter'],
        ['ground (US) / earth (UK)', 'Erde, Masse, Schutzleiter (protective earth = PE)'],
        ['printed circuit board (PCB)', 'Leiterplatte / Platine'],
        ['to solder / soldering iron / solder joint', 'löten / Lötkolben / Lötstelle'],
        ['wiring diagram / circuit diagram / block diagram', 'Verdrahtungsplan / Schaltplan (Stromlaufplan) / Blockschaltbild'],
        ['troubleshooting / fault / malfunction', 'Fehlersuche / Fehler / Fehlfunktion'],
        ['maintenance / inspection / repair', 'Wartung, Instandhaltung / Inspektion / Instandsetzung, Reparatur'],
        ['power supply / transformer / rectifier', 'Netzteil, Stromversorgung / Transformator / Gleichrichter'],
        ['switch / push button / relay / contactor', 'Schalter / Taster / Relais / Schütz'],
        ['normally open (NO) / normally closed (NC)', 'Schließer / Öffner'],
        ['terminal / connector / cable / wire', 'Klemme, Anschluss / Steckverbinder / Kabel / Draht, Ader'],
        ['insulation / short circuit / open circuit', 'Isolierung / Kurzschluss / Unterbrechung'],
        ['data sheet / absolute maximum ratings', 'Datenblatt / Grenzwerte (dürfen nie überschritten werden)'],
        ['to measure / multimeter / oscilloscope / probe', 'messen / Multimeter / Oszilloskop / Tastkopf']
      ]
    },
    {
      key: 'egs-pruefung', year: 0, hours: null, color: 'red',
      name: 'Prüfungsvorbereitung (AP Teil 1 & 2)',
      goal: 'Überblick über die gestreckte Abschlussprüfung. Die Prüfung nimmt die zuständige hessische IHK ab (nicht die Berufsschule) – Termine, Gewichtungen und Regeln dort bzw. in der Ausbildungsordnung prüfen!',
      topics: [
        'Ablauf und Termine der Abschlussprüfung Teil 1 bei der zuständigen hessischen IHK erfragen',
        'Prüfungsbereiche Teil 1: Arbeitsaufgabe mit situativen Gesprächsphasen + schriftliche Aufgaben',
        'Inhalte Teil 1 entsprechen v. a. LF 1–6 bzw. den ersten 18 Ausbildungsmonaten',
        'Variante für Teil 2 wählen: betrieblicher Auftrag oder praktische Aufgabe',
        'Prüfungsbereiche Teil 2: Arbeitsauftrag, Systementwurf, Funktions- und Systemanalyse, Wirtschafts- und Sozialkunde',
        'Berichtsheft vollständig und unterschrieben',
        'Alte Prüfungsaufgaben (z. B. PAL/Christiani) durcharbeiten',
        'Tabellenbuch-Umgang trainieren (erlaubtes Hilfsmittel)'
      ],
      formulas: [],
      cards: [
        ['Wie ist die Abschlussprüfung bei Elektronikern für Geräte und Systeme aufgebaut?', 'Als gestreckte Abschlussprüfung in zwei Teilen: Teil 1 (etwa Mitte der Ausbildung) und Teil 2 (am Ende). Beide Teile fließen gemeinsam in das Gesamtergebnis ein.'],
        ['Wie werden Teil 1 und Teil 2 gewichtet?', 'Teil 1: 40 %, Teil 2: 60 % (Angaben gemäß Ausbildungsverordnung der industriellen Elektroberufe – im Zweifel bei der IHK prüfen).'],
        ['Welche Prüfungsbereiche hat Teil 2?', 'Arbeitsauftrag (betrieblicher Auftrag oder praktische Aufgabe mit Fachgespräch), Systementwurf, Funktions- und Systemanalyse, Wirtschafts- und Sozialkunde.'],
        ['Was muss für die Zulassung vorliegen?', 'Zurückgelegte Ausbildungszeit, Teilnahme an Teil 1, ordnungsgemäß geführter Ausbildungsnachweis (Berichtsheft), eingetragenes Ausbildungsverhältnis.']
      ]
    }
  ]
};
