/* Deutungs-Texte: alle Textbausteine der Legung an einem Ort.
   Hier kannst du Texte ändern oder ergänzen, ohne die Logik anzufassen.

   So geht's:
   - Jede Liste ("Pool") enthält Varianten. Die Seite zieht daraus zufällig und meidet dabei,
     was zuletzt gezeigt wurde. Je mehr Varianten, desto seltener wiederholt sich etwas.
   - Neue Variante = ein weiterer Text in Anführungszeichen, durch Komma getrennt.
   - Platzhalter: {A} {B} {C} = Kartennamen (Gestern, Heute, Morgen), {kA} {kB} {kC} = deren
     Schlüsselwörter, {w} = Kraftwort, {n} = Zahl oder Kartenname, {k} = Schlüsselwörter der Karte.
   - <b>…</b> macht Text fett. Typografische Anführungszeichen „so“ verwenden.
   - Reihenfolge innerhalb der Kern-Pools CORE1/CORE2/ADV/MANTRA/KW:
     0 Aufbruch, 1 Gegensteuern, 2 Wendepunkt, 3 Höhepunkt, 4 Rückenwind, 5 Geduld, 6 Klarheit.
   - Nach jeder Änderung die Seite neu laden (und die Cache-Version in sw.js erhöhen). */
const DeutungTexte = (function () {
  "use strict";
  /* ------------------------------------------------------------------ Kern der Deutung */
  const KW = [
    ["Aufbruch", "Sprung", "Frühlicht", "Anlauf", "Morgenröte"],
    ["Gegensteuern", "Kurswechsel", "Umkehr", "Richtungswechsel", "Umlenken"],
    ["Wendepunkt", "Kehrtwende", "Dämmerung", "Umschwung", "Wendezeit"],
    ["Höhepunkt", "Gipfelstunde", "Zenit", "Glanzmoment", "Sonnenhöhe"],
    ["Rückenwind", "Tragkraft", "Aufwind", "Fahrtwind", "Segelzeit"],
    ["Geduld", "Stille Kraft", "Wurzelzeit", "Langer Atem", "Winterruhe"],
    ["Klarheit", "Durchblick", "Zwischenlicht", "Sortieren", "Klärung"]
  ];
  const CORE1 = [
    ["Deine Legung erzählt eine Bewegung nach oben: Aus Schwere wird Weite, aus Ungewissheit ein erster klarer Streifen Licht.",
     "Wie ein Fluss, der aus dem Gebirge in die Ebene tritt: Von {A} bis {C} wird dein Weg breiter und ruhiger.",
     "Etwas in dir hat schon umgeparkt: Von „{kA}“ im Gestern führt dich die Legung zu „{kC}“ im Morgen, und das ist ein Aufstieg.",
     "Die Karten bauen dir eine Treppe: Unten liegt {A}, oben wartet {C}, und die Stufen dazwischen tragen bereits.",
     "Es zieht dich nach oben, leise und stetig, so wie Pflanzen zum Licht wachsen, ohne darüber nachzudenken.",
     "Der Verlauf dieser Legung ist ein Sonnenaufgang in drei Bildern: erst Dämmerung, dann Farbe, dann Tag."],
    ["Die Spannung wächst: Was dich früher trug, trägt nicht mehr. Die Legung bittet dich, bewusst gegenzusteuern, bevor es enger wird.",
     "Wie ein Segel, das den Wind verliert: Zwischen {A} und {C} wird es stiller, als du dir wünschst.",
     "Das Gefälle von „{kA}“ hin zu „{kC}“ ist deutlich. Die Karten sehen eine Strömung, die dich vom Ufer wegzieht.",
     "Ein Riss ist sichtbar geworden, noch dünn wie ein Haar. Jetzt ist die Zeit, ihn zu bemerken, statt ihn zu übermalen.",
     "Die Karten läuten leise eine Glocke: Was du seit Längerem trägst, wird schwerer, nicht leichter.",
     "Die Linie deiner Legung fällt ab. Das ist keine Strafe, sondern eine Einladung, früher zu handeln als das Schicksal."],
    ["Heute ist dein Tiefpunkt, nicht das Ende. Die Karten zeigen, dass es danach wieder aufwärts geht.",
     "{B} liegt wie ein Talgrund in der Mitte deiner Legung: der tiefste Punkt, von dem aus jeder Schritt nach oben führt.",
     "Jede Welle holt zuerst Schwung, indem sie zurückweicht. Dein Heute ist dieses Zurückweichen.",
     "Mitten in der Nacht ist die Dunkelheit am dichtesten, und genau dort beginnt die Wende, noch unsichtbar.",
     "Das Heute drückt, aber es ist der Boden, von dem du dich abstoßen kannst.",
     "Die Karten zeichnen eine Mulde, kein Loch: Du sinkst nicht, du sammelst Anlauf."],
    ["Heute ist dein Höhepunkt. Nutze die Kraft jetzt, damit sie dich auch in die Zukunft trägt.",
     "{B} steht wie ein Gipfel in deiner Legung: die Stelle, an der die Sicht am weitesten reicht.",
     "Deine Karten brennen in der Mitte am hellsten. Das Heute ist dein Leuchtturm.",
     "Alles läuft auf diesen Moment zu: Das Gestern hat angeschoben, das Morgen wird davon zehren.",
     "Wie im Zenit steht die Sonne deiner Legung jetzt am höchsten, und die Schatten sind kurz.",
     "Die Energie in deiner Mitte ist selten so gebündelt. Das ist ein Fenster, kein Dauerzustand."],
    ["Eine stabile, günstige Grundenergie: Du bist auf einem guten Weg.",
     "Deine drei Karten ziehen an einem Strang, wie ein Chor, der sich gefunden hat.",
     "Von „{kA}“ über „{kB}“ bis „{kC}“: Es fügt sich, und das ist kein Zufall.",
     "Der Wind steht gut und stetig. Kein Sturm, kein Rausch, sondern verlässlicher Auftrieb.",
     "Die Legung gleicht einem gepflegten Weg: Du siehst, wohin er führt, und er trägt.",
     "Das Fundament ist sicher, und das Licht fällt freundlich darauf."],
    ["Eine fordernde Phase: Die Karten raten zu Geduld und kleinen Schritten statt großen Sprüngen.",
     "Deine Legung gleicht einem Winterwald: kahl, still, und doch voller Leben unter dem Boden.",
     "Von „{kA}“ bis „{kC}“ liegt ein zäher Abschnitt, aber kein endloser.",
     "Die Karten ziehen den Vorhang nicht ganz auf: Du sollst jetzt nicht rennen, sondern tragen lernen.",
     "Das Gewicht ist real, und die Karten nehmen es ernst. Sie sagen aber auch: Du hast schon Schwereres getragen.",
     "Dies ist eine Zeit für Wurzeln, nicht für Blüten."],
    ["Gemischte Signale: Es gibt Licht und Schatten. Die Details unten schaffen Klarheit.",
     "Deine Legung ist ein Mosaik: Manche Steine glänzen, manche sind matt, und erst im Ganzen entsteht ein Bild.",
     "{A}, {B} und {C} sprechen nicht mit einer Stimme, sondern in einem Dreiklang mit Spannung. Genau das macht ihn interessant.",
     "Die Karten halten die Waage: weder Aufstieg noch Abstieg, sondern ein Prüfen von beiden Seiten.",
     "Zwischen „{kA}“ und „{kC}“ liegt Spielraum, und den füllst du.",
     "Wie ein Himmel mit wandernden Wolken: mal hell, mal bedeckt, und nichts davon bleibt."]
  ];
  const CORE2 = [
    ["Der Weg trägt dich, auch wenn du ihn noch nicht ganz überblickst.", "Was dich früher beschwert hat, wird zur Anlaufstrecke.",
     "Du musst nichts erzwingen, die Richtung stimmt schon.", "Das Gestern bleibt dein Fundament, aber es ist nicht mehr dein Dach.",
     "Wer so gelegt wird, steht kurz davor, sich selbst zu überraschen.", "Jeder Schritt, den du jetzt gehst, fällt leichter als der davor."],
    ["Ein kleiner Kurswechsel jetzt ist mächtiger als ein großer später.", "Du hast mehr Spielraum, als sich anfühlt.",
     "Wer die Strömung erkennt, kann schwimmen, statt zu treiben.", "Handle dort, wo es sich noch leicht anfühlt.",
     "Das Morgen ist noch nicht geschrieben, nur der Ton ist angestimmt.", "Beachte das erste leise Unbehagen, es ist dein verlässlichster Wegweiser."],
    ["Dass du das hier liest, zeigt, dass du schon wieder hinaufschaust.", "Die Wende ist in den Karten längst angelegt.",
     "Aus dieser Tiefe wirst du später sagen: Hier hat es gedreht.", "Du musst jetzt nichts beweisen, nur nicht aufgeben.",
     "Auf „{kB}“ folgt in deiner Legung „{kC}“, und das ist ein Hinweis, kein Zufall.", "Dieser Moment ist schwerer, als er ist, und kürzer, als er scheint."],
    ["Wer jetzt entscheidet, entscheidet mit voller Kraft.", "Sag das Ja, das du schon lange im Mund trägst.",
     "Nutze das Licht, solange es so steht.", "Das, was du heute säst, trägt dich noch im Morgen.",
     "Du musst nicht alles tun, aber das Eine, das zählt, solltest du tun.", "Genieße es: Auch Gipfel dürfen Freude sein, nicht nur Aufgabe."],
    ["Bleib bei dem, was funktioniert, und vertraue ihm.", "Du darfst dich auf Rückenwind verlassen.",
     "Kleine Verbesserungen bringen jetzt mehr als große Umwälzungen.", "Diese Ruhe ist verdient.",
     "Pflege, was gerade wächst.", "Gutes darf einfach gut sein, ohne dass du es erklären musst."],
    ["Mach es klein, mach es machbar.", "Ruhe ist jetzt dein produktivstes Werkzeug.",
     "Wer langsam geht, kommt auch an, und oft heiler.", "Du darfst um Hilfe bitten, ohne dass es etwas über dich aussagt.",
     "Beginne mit dem Leichtesten und lass Dankbarkeit die Brücke sein.", "Die Zeit arbeitet für dich, auch wenn sie sich zäh anfühlt."],
    ["Ordne, was du selbst lenkst und was nicht.", "In dieser Mischung liegt deine Freiheit.",
     "Entscheidend ist, auf welche Stimme du hörst.", "Du musst jetzt nicht alles deuten, nur das Nächstliegende.",
     "Gemischt heißt: Es ist noch beweglich.", "Gerade das Unklare enthält Möglichkeiten, die Klarheit nie hätte."]
  ];
  const ADV = [
    ["Vertraue dem Verlauf und gehe die nächsten Schritte, ohne zu zögern.", "Sag heute Ja zu dem einen Schritt, der sich leicht anfühlt.",
     "Beginne, bevor du bereit bist. Die Karten gehen mit.", "Folge eine Stunde lang der Richtung, in die es dich zieht.", "Tu heute etwas, wofür dein Morgen-Ich dir danken wird."],
    ["Ändere früh etwas Kleines, statt auf besseres Wetter zu warten.", "Benenne laut, was nicht mehr trägt, und tausche genau eine Gewohnheit aus.",
     "Frag dich einmal: Was würde ich ändern, wenn ich keine Angst hätte? Und tu das Kleinste davon.", "Leg deinen Kurs heute neu fest: ein Satz, ein Schritt, eine Entscheidung.", "Sprich das Unbequeme an, solange es noch klein ist."],
    ["Halte durch: Die Wende ist in den Karten schon sichtbar.", "Tu heute nur das Nötigste, aber tu es gut. Mehr verlangt dieser Tag nicht.",
     "Suche dir einen Menschen oder einen Ort, der dich trägt, und geh dorthin.", "Schreibe drei Dinge auf, die trotz allem noch da sind.", "Gib dir die Erlaubnis, nicht stark sein zu müssen, und bleib trotzdem in Bewegung."],
    ["Triff jetzt deine Entscheidungen, solange du Rückenwind hast.", "Beginne heute das, was du verschoben hast. Die Kraft ist da.",
     "Zeige dich, bitte, bewege: Heute öffnet sich mehr, als du fragst.", "Nutze die Stunde, in der alles leichter geht, für das Schwierigste.", "Halte das Gute fest, indem du es teilst."],
    ["Bleib bei dem, was funktioniert.", "Mach das Gute zur Gewohnheit: Wiederhole heute, was dir zuletzt gelungen ist.",
     "Danke jemandem, der dich getragen hat.", "Vertraue dem Tempo, das du gerade hast.", "Pflege bewusst eine Sache, die gut läuft, statt nach der nächsten zu suchen."],
    ["Verkleinere deine Aufgaben und sorge für Ruhe.", "Streiche heute eine Sache von deiner Liste, ohne dich zu rechtfertigen.",
     "Trinke, iss, schlafe: Das Fundament ist die Strategie.", "Sprich mit einem Menschen, bei dem du nicht funktionieren musst.", "Erlaube dir eine Pause, bevor sie dich erzwingt."],
    ["Trenne, was du beeinflussen kannst, von dem, was nicht.", "Schreibe zwei Spalten: „Das liegt bei mir“ und „Das liegt nicht bei mir“. Handle nur in der ersten.",
     "Entscheide heute nichts Großes, sondern sortiere.", "Höre auf den Satz, der dir beim Lesen am meisten nachklingt.", "Wähle die Karte, die dich am meisten berührt hat, und folge ihr zuerst."]
  ];
  const MANTRA = [
    ["Ich gehe, und der Weg entsteht unter meinen Füßen.", "Was hinter mir liegt, gibt mir Anlauf.", "Ich bin schon unterwegs, auch wenn ich es noch nicht sehe.", "Jeder Schritt macht den nächsten leichter.", "Ich folge dem Licht, das ich selbst entzündet habe."],
    ["Ich ändere heute eine Kleinigkeit, und alles beginnt sich zu drehen.", "Ich lenke, bevor ich getrieben werde.", "Ich wähle den Kurs, nicht die Strömung.", "Ein ehrlicher Satz kann alles wenden.", "Ich höre auf das erste Flüstern."],
    ["Mein Tiefpunkt ist mein Absprung.", "Ich sinke nicht, ich sammle Anlauf.", "Auch die Nacht gehört zum Tag, und ich gehe durch sie hindurch.", "Was mich trägt, ist stärker als das, was mich drückt.", "Ich darf müde sein und trotzdem weitergehen."],
    ["Ich nutze meine Kraft, solange sie brennt.", "Ich stehe im Licht und scheue es nicht.", "Jetzt ist meine Stunde, und ich bin bereit.", "Ich sage Ja zu dem, was mir gelingen will.", "Mein Gipfel ist ein Anfang, kein Ende."],
    ["Ich vertraue dem, was bereits trägt.", "Es darf mir gut gehen, ohne Bedingung.", "Ich gehe weiter, so wie der Wind mich führt.", "Ich bin dankbar für das, was gewachsen ist.", "Ich ruhe in dem, was stimmt."],
    ["Ein kleiner Schritt genügt, und ich bin nicht allein.", "Ich bin geduldig wie die Wurzel im Winter.", "Ich muss nicht schnell sein, nur treu.", "Auch das hier geht vorüber, und ich werde klüger sein.", "Ich trage nur, was heute zu tragen ist."],
    ["Ich sortiere, ich atme, ich wähle.", "Ich muss nicht alles wissen, um richtig zu gehen.", "In mir ist Platz für Licht und Schatten.", "Ich höre die leise Stimme unter dem Lärm.", "Ich entscheide, worauf ich meine Aufmerksamkeit richte."]
  ];

  /* ------------------------------------------------------------------ Zusammenspiel */
  const MAJ_N = [
    ["Alltag: Du kannst vieles selbst steuern, denn keine Große Arkana setzt den Ton.",
     "Keine Große Arkana in Sicht: Dein Leben liegt gerade in deinen eigenen Händen, nicht in denen des Schicksals.",
     "Die Legung besteht aus Alltagskarten. Das ist eine gute Nachricht: Du kannst vieles direkt beeinflussen."],
    ["<b>{n}</b> setzt als Große Arkana den Ton: Dieses Lebensthema überstrahlt die anderen.",
     "Nur eine Große Arkana ist dabei, <b>{n}</b>. Sie ist der Grundakkord, auf den die anderen Karten gestimmt sind.",
     "<b>{n}</b> ragt heraus wie ein Leuchtturm: Alles andere in der Legung gruppiert sich um dieses eine Thema."],
    ["Zwei Große Arkana: Du stehst an einem Wendepunkt, der größer ist als der Alltag.",
     "Gleich zwei Große Arkana melden sich: Das Leben spricht jetzt in großen Worten zu dir.",
     "Zwei Stimmen aus dem großen Arkanum in einer Legung gelten als Zeichen, dass etwas Bedeutsames in Bewegung ist."],
    ["Drei Große Arkana: Eine bedeutende Lebensphase, die dich im Kern berührt.",
     "Alle drei Karten sind Große Arkana. Das ist selten und bedeutet: Hier geht es nicht um Kleinigkeiten, sondern um dich.",
     "Dreimal große Bilder: Du stehst mitten in einem Kapitel, das du später beim Namen nennen wirst."]
  ];
  const ELT = [
    ["Feuer dominiert: Es geht um Antrieb, Mut und Tatkraft.", "Das Feuer führt: Funken, Wille und der Wunsch, etwas in Bewegung zu setzen.", "Viel Feuer in der Legung: Was dich erwärmt, zeigt dir den Weg."],
    ["Wasser dominiert: Gefühle und Beziehungen stehen im Vordergrund.", "Das Wasser führt: Gefühle, Träume und das, was zwischen den Zeilen liegt.", "Viel Wasser in der Legung: Hör auf deine Strömungen, nicht nur auf deine Gedanken."],
    ["Luft dominiert: Gedanken, Gespräche und Klarheit sind das Thema.", "Die Luft führt: Worte, Pläne und ein klarer Blick.", "Viel Luft in der Legung: Sprich es aus, schreib es auf, ordne es."],
    ["Erde dominiert: Es geht um Alltag, Arbeit, Geld und Körper.", "Die Erde führt: Handfestes, Verlässliches und das, was du anfassen kannst.", "Viel Erde in der Legung: Was Wurzeln hat, trägt dich jetzt."]
  ];
  const PR = {
    "01": ["Feuer und Wasser: Tatkraft und Gefühl ziehen in verschiedene Richtungen. Erst fühlen, dann handeln.", "Feuer trifft Wasser: Es dampft. Spannung und Energie, wenn du beides bewusst führst.", "Feuer und Wasser in einer Legung: Dein Herz will Wärme, dein Mut will Tempo. Lass sie sich abwechseln."],
    "02": ["Feuer und Luft verstärken sich: Ideen und Antrieb fließen zusammen.", "Feuer und Luft: Der Wind facht die Flamme an. Gute Zeit für Pläne mit Schwung.", "Luft nährt das Feuer: Was du denkst, willst du sofort tun. Wähle nur klug, was du entfachst."],
    "03": ["Feuer und Erde: Antrieb trifft auf Ausdauer, ideal, um Pläne wirklich umzusetzen.", "Feuer und Erde: Die Glut hat einen festen Herd. Damit lässt sich etwas bauen, das bleibt.", "Das Feuer gibt dir Mut, die Erde den langen Atem. Zusammen ergibt das Verwirklichung."],
    "12": ["Wasser und Luft: Herz und Verstand suchen noch ihre gemeinsame Sprache.", "Wasser und Luft: Fühlen und Denken reden aneinander vorbei, aber sie wollen sich verstehen.", "Zwischen Wasser und Luft liegt Nebel. Wenn du ihn benennst, lichtet er sich."],
    "13": ["Wasser und Erde nähren einander: Gefühl und Alltag tragen sich gegenseitig.", "Wasser und Erde: Fruchtbares Land. Was du fühlst, darf im Alltag wachsen.", "Das Wasser macht die Erde weich, die Erde gibt dem Wasser ein Bett. Eine tragfähige Verbindung."],
    "23": ["Luft und Erde: Gedanken und Wirklichkeit passen noch nicht ganz zusammen. Prüfe Pläne an der Praxis.", "Luft und Erde: Kopf und Boden. Prüfe, ob deine Ideen auch auf festem Grund stehen können.", "Zwischen Luft und Erde fehlt noch die Landebahn. Bring Gedanken in kleine, greifbare Schritte."]
  };
  const RANKS = [
    "Die <b>{r}</b> erscheint mehrfach: {m} zieht sich durch deine ganze Legung.",
    "Die <b>{r}</b> taucht gleich mehrfach auf. Das Thema „{m}“ lässt dich nicht los, und das hat einen Grund.",
    "Zweimal die <b>{r}</b>: Ein Echo, das sagt: {m} ist der rote Faden dieser Karten.",
    "Mehrfach die <b>{r}</b>: Das Leben wiederholt sich hier wie ein Refrain, und der Refrain heißt {m}."
  ];
  const ASC = ["Aufsteigende Zahlen: Ein Prozess entfaltet sich Schritt für Schritt.", "Die Zahlen steigen: Es wächst, geordnet und in der richtigen Reihenfolge.", "Von klein nach groß: Eine Entwicklung, die sich nicht abkürzen, aber beschleunigen lässt."];
  const DESC = ["Absteigende Zahlen: Etwas kommt zum Abschluss oder löst sich auf.", "Die Zahlen fallen: Ein Kapitel schließt sich, und das darf es auch.", "Von groß nach klein: Ein Zyklus läuft aus. Lass ihn auslaufen."];
  const COURT = [
    "Hofkarte ({n}): Hier geht es um Menschen oder Rollen, die du einnimmst oder die dir begegnen.",
    "Mit {n} tritt eine Person oder Rolle auf die Bühne: jemand, der dir begegnet, oder ein Teil von dir.",
    "{n} ist eine Hofkarte. Frag dich, wer in deinem Leben diese Eigenschaft trägt und wann du sie selbst brauchst."
  ];
  const REV = [
    ["Alle Karten stehen aufrecht: Die Energie fließt ungehindert nach außen.", "Keine Karte steht auf dem Kopf: Was in dir ist, darf ungehindert nach außen.", "Alles aufrecht: Die Kräfte zeigen sich offen, ohne Umweg."],
    ["<b>{n}</b> steht umgekehrt: An dieser Stelle ist dein innerer Anteil gefragt.", "<b>{n}</b> liegt umgekehrt: Dort wirkt die Kraft nach innen. Hör hin, bevor du handelst.", "Umgekehrt zeigt sich <b>{n}</b>: Ein Thema, das erst in dir ankommen will, bevor es nach außen kann."],
    ["Zwei Karten stehen umgekehrt: Innere Widerstände bremsen dich spürbar.", "Zweimal umgekehrt: Du trägst gerade mehr nach innen, als du zeigst.", "Zwei Karten sind umgedreht: Es gibt Stimmen in dir, die erst gehört werden wollen."],
    ["Alle drei Karten stehen umgekehrt: Dies ist eine Zeit der Innenschau, nicht des Handelns nach außen.", "Dreimal umgekehrt: Die Antworten liegen jetzt in dir, nicht draußen.", "Die ganze Legung ist nach innen gekehrt. Zieh dich ein Stück zurück, dort liegt die Kraft."]
  ];
  const BRIDGE = [
    ["Daraus wächst etwas Leichteres:", "Und es wird heller:", "Das öffnet sich zu etwas Leichterem:"],
    ["Das setzt sich fort:", "Und so geht es weiter:", "Der Faden läuft weiter:"],
    ["Doch das wird nun herausfordernd:", "Dann wird es anspruchsvoller:", "Und nun zieht es sich zu:"]
  ];

  /* ------------------------------------------------------------------ Durch die Linse eines Themas */
  const LENS = {
    L: [
      ["In der Liebe öffnet sich etwas: Nähe wird leichter, und du darfst mehr zeigen, als du dich bisher getraut hast.", "Herzensdinge kommen in Fluss: Wer jetzt weich wird, gewinnt mehr, als er verliert.", "In der Liebe darf es leichter werden. Zeig, was du fühlst, bevor du es schön formulierst.", "Beziehungen atmen auf. Eine Geste, ein Satz, ein Anruf genügt, um eine Tür weit aufzustoßen."],
      ["In der Liebe ist Ehrlichkeit dein Kompass: Sag, was du brauchst, bevor Schweigen es für dich entscheidet.", "Zwischen zwei Herzen zählt jetzt Klarheit mehr als Romantik. Sprich es freundlich, aber sprich es.", "Herzensdinge bleiben in der Schwebe: Gib ihnen Worte, dann bekommen sie Boden.", "In der Liebe gilt: Weder drängen noch verstecken. Zeig dich in genau der Dosis, die sich ehrlich anfühlt."],
      ["In der Liebe wird es sensibel: Schütze dein Herz, ohne die Tür zuzuschlagen, und sprich Spannungen früh an.", "Das Herz ist empfindlich: Geh behutsam mit dir und mit anderen um, und sprich Heikles lieber heute als später.", "Beziehungen brauchen jetzt Zartheit. Wer leise anspricht, wird besser gehört als wer laut schweigt.", "In der Liebe ist Vorsicht keine Kälte. Du darfst Grenzen ziehen und trotzdem Wärme geben."]
    ],
    B: [
      ["Beruflich steht der Wind günstig: Zeig dich, verhandle, starte das Projekt, das du aufgeschoben hast.", "Im Beruf öffnet sich ein Fenster: Bitte um das, was du verdienst, und sage zu, was dich wachsen lässt.", "Arbeit und Geld bekommen Rückenwind. Was du sichtbar machst, wird gesehen.", "Beruflich ist Zeit für Mut: Ein Gespräch, ein Angebot, ein Anfang, jetzt hat es Kraft."],
      ["Beruflich zählt jetzt Beständigkeit: Ordne, priorisiere und mach den nächsten sichtbaren Schritt.", "Im Beruf gewinnt, wer dranbleibt. Sortiere deine Aufgaben und erledige eine davon ganz.", "Arbeit und Geld wollen Struktur: Ein Plan auf einer Seite ist wertvoller als zehn im Kopf.", "Beruflich ist Ausdauer dein Verbündeter. Der nächste kleine Schritt zählt mehr als der große Wurf."],
      ["Beruflich ist Vorsicht klug: Prüfe Zahlen und Zusagen zweimal und schütze deine Kraft vor Überlastung.", "Im Beruf lohnt ein zweiter Blick: Lies das Kleingedruckte, und sag nur zu, was du tragen kannst.", "Arbeit und Geld verlangen Umsicht. Schütze deine Reserven, nicht nur die Konten.", "Beruflich bist du gut beraten, nichts zu überstürzen. Wer genau hinsieht, spart später Kraft."]
    ],
    S: [
      ["Für dich selbst heißt das: Dein inneres Licht kehrt zurück. Gönn dir bewusst, was dich nährt.", "Du selbst kommst wieder in Schwung: Tu heute etwas, das dir ohne Grund guttut.", "Für dein Wohlbefinden öffnet sich eine Tür: Geh hindurch, bevor du sie erklärst.", "Dein inneres Wetter klart auf. Nutze es, um dir etwas Schönes zu schenken, das niemand sehen muss."],
      ["Für dich selbst heißt das: Bleib in Kontakt mit deinem Körper. Er weiß früher als dein Kopf, was gut ist.", "Dein Wohlbefinden wächst über kleine Rituale. Wähle eines und halte es sieben Tage.", "Für dich selbst gilt: Beobachte, ohne zu urteilen. Das Wissen, das du suchst, ist schon da.", "Dein Inneres ist im Gleichgewicht, aber es mag Pflege. Ein Spaziergang, ein Glas Wasser, ein ehrliches Atmen."],
      ["Für dich selbst heißt das: Du darfst langsamer werden. Ruhe ist kein Rückschritt, sondern Reparatur.", "Dein Inneres bittet um Schonung. Streiche etwas, das dich nur Energie kostet.", "Für dein Wohlbefinden gilt: weniger, aber echter. Eine gute Pause ist produktiver als zwei halbe.", "Du bist erschöpfter, als du zugibst. Erlaube dir Weichheit, ohne dich dafür zu entschuldigen."]
    ],
    E: [
      ["Für deine Entscheidung: Der Weg nach vorn ist freundlich. Wähle, was dich weiter macht, nicht kleiner.", "Bei deiner Entscheidung steht das Licht auf Ja. Wähle, was dich wachsen lässt.", "Deine Entscheidung ist leichter, als du denkst: Die Karten zeigen nach vorn.", "Für deine Wahl gilt: Geh dorthin, wo es dich weitet, nicht dorthin, wo es dich absichert."],
      ["Für deine Entscheidung: Beide Wege tragen etwas. Wähle den, den du in einem Jahr noch verteidigen würdest.", "Bei deiner Entscheidung hilft eine Frage: Welche Wahl kann ich in einem Jahr ruhig erklären?", "Beide Möglichkeiten haben Gewicht. Spüre, bei welcher dein Körper entspannt.", "Deine Entscheidung ist keine Prüfung mit einer richtigen Antwort. Wähle und mach sie dann richtig."],
      ["Für deine Entscheidung: Nichts überstürzen. Hol dir eine Nacht Abstand und fehlende Informationen, dann wähle.", "Bei deiner Entscheidung ist Zeit dein Verbündeter: Sammle, was fehlt, und schlaf darüber.", "Deine Wahl braucht noch ein Stück Information. Frag nach, bevor du zusagst.", "Für deine Entscheidung gilt: Ein Aufschub ist keine Flucht, wenn er der Klärung dient."]
    ]
  };
  const TEND = [
    ["Die Tendenz ist günstig.", "Die Tendenz zeigt nach oben.", "Die Karten stehen auf deiner Seite.", "Alles in allem sieht es gut für dich aus."],
    ["Die Tendenz ist offen: Dein nächster Schritt entscheidet.", "Es ist beweglich, und dein nächster Schritt setzt den Ton.", "Die Karten lassen alles offen. Du hast das Ruder.", "Noch ist nichts entschieden, und genau das ist deine Chance."],
    ["Die Tendenz ist herausfordernd, aber du kannst sie gestalten.", "Es wird nicht leicht, aber es liegt in deiner Hand.", "Die Karten fordern dich, ohne dich zu überfordern.", "Schwierigkeiten sind sichtbar, aber sie sind kein Urteil."]
  ];
  const FRQ = {
    intro: ["Zu deiner Frage nach {t}: ", "Was {t} angeht: ", "Zu deinem Thema {t}: ", "Deine Frage berührt {t}. "],
    multi: ["Gleich {n} Karten sprechen dein Thema direkt an ({l}). ", "Auffallend: {n} Karten antworten unmittelbar auf dich ({l}). ", "{n} Karten greifen dein Thema auf ({l}). "],
    one: ["Eine Karte spricht direkt dazu: <b>{l}</b> an der Stelle „{p}“. Die anderen zeigen den Rahmen drumherum. ", "<b>{l}</b> antwortet dir am deutlichsten, im Fenster „{p}“. Die übrigen Karten sind der Raum um diese Antwort. ", "Am direktesten sagt es dir <b>{l}</b> in der Position „{p}“. Der Rest ist Hintergrund und Rahmen. "],
    indirect: ["Deine Karten sprechen dein Thema nur indirekt an. Sie zeigen, was darunter liegt, nämlich {u}. Beginne dort. ", "Die Antwort liegt eine Ebene tiefer: bei {u}. Fang dort an, dann klärt sich der Rest. ", "Dein Thema wird nicht direkt beantwortet. Die Karten zeigen den Untergrund: {u}. "],
    none: ["Dein Thema ist nicht eindeutig einem Lebensbereich zuzuordnen, deshalb lies die Karten als Ganzes.", "Deine Frage passt in keine einzelne Schublade. Lies die drei Karten deshalb als eine zusammenhängende Antwort.", "Das Thema ist offen und breit. Lass die Karten als Ganzes wirken, nicht einzeln."]
  };
  const HINT = ["Tipp: Wähle oben ein Thema oder stelle eine Frage, dann wird die Deutung noch persönlicher.", "Du kannst oben ein Thema wählen oder eine Frage stellen. Dann spricht die Legung noch direkter zu dir.", "Noch persönlicher wird es mit einem Thema oder einer Frage, die du oben angibst."];
  const UNSURE = ["Wirkt es noch vielschichtig? Formuliere deine Frage konkreter und ziehe neu.", "Das Bild ist noch bunt gemischt. Eine präzisere Frage und eine neue Legung bringen mehr Klarheit.", "Viele Stimmen auf einmal? Stelle eine konkrete Frage und ziehe noch einmal."];
  const H_MAIN = ["Was deine drei Karten zusammen sagen", "Die Stimme deiner drei Karten", "Was sich zwischen den Karten zeigt", "Die Botschaft deiner Legung"];
  const H_WORK = ["Wie die Karten zusammenwirken", "Was zwischen den Karten schwingt", "Das Zusammenspiel deiner Karten"];
  const H_TASK = ["Deine Mutprobe für heute", "Dein Auftrag für die nächsten Stunden", "Dein Mut-Schritt für heute", "Was heute von dir verlangt wird"];
  const ST_B = ["Heute:", "Für diesen Tag:", "Jetzt gleich:", "Im Hier und Jetzt:"];
  const ST_C = ["Richte dich auf morgen aus:", "Schau schon jetzt nach vorn:", "Lege einen Stein für morgen:", "Dein Kompass für morgen:"];
  const ST_Q = ["Frag dich: ", "Lass dich fragen: ", "Die Karte fragt: ", "Flüstere dir zu: "];

  /* ------------------------------------------------------------------ Kartendialog (einzelne Karte) */
  const MAJX = [
    "Eine der großen Stimmen des Arkanums spricht hier. Das ist kein Zufall, sondern ein Ruf der Seele, der dein Leben in ein größeres Muster stellt.",
    "Diese Karte gehört zu den 22 Stationen eines uralten Weges. Dass sie gerade dir erscheint, hebt diesen Moment über das Gewöhnliche.",
    "Hier spricht keine Alltagskarte, sondern eine Archetypin: ein Bild, das Menschen seit Jahrhunderten bewegt und nun an deine Tür klopft."
  ];
  const ELX = [
    ["Aus der Glut deiner Wünsche steigt diese Karte auf. Sie trägt die Wärme des Mutes und jene Funken, an denen sich Neues entzündet.",
     "Diese Karte knistert. Sie gehört dem Feuer, das Entscheidungen schmiedet und Zögern verbrennt.",
     "Feuer ist ihr Element: Sie will nicht erklärt, sondern gelebt werden."],
    ["Wie Mondlicht auf dunklem Wasser erscheint diese Karte. Sie spricht die Sprache der Gefühle: leise, tief und ohne Eile.",
     "Diese Karte fließt. Sie gehört dem Wasser, das sich jedem Gefäß anpasst und doch seinen Weg findet.",
     "Das Wasser trägt sie zu dir: Sie berührt das, was du fühlst, bevor du es benennen kannst."],
    ["Wie ein klarer Wind kommt diese Karte zu dir. Sie trennt Nebel von Wahrheit und lässt dich wieder weit sehen.",
     "Diese Karte atmet. Sie gehört der Luft, die Gedanken ordnet und Fenster öffnet.",
     "Die Luft ist ihr Element: Sie fordert dich auf, genau hinzusehen und das Wesentliche in Worte zu fassen."],
    ["Aus fruchtbarer Erde wächst diese Karte. Sie erzählt von Wurzeln, Werk und dem, was Bestand hat, wenn der Zauber des Augenblicks verklingt.",
     "Diese Karte hat Gewicht. Sie gehört der Erde, die trägt, nährt und Geduld belohnt.",
     "Die Erde ist ihr Element: Sie spricht von dem, was du anfassen, aufbauen und pflegen kannst."]
  ];
  const PP = [
    [["Im Gestern klingt sie wie ein Echo, das noch durch deine Räume zieht: {k} haben dich geprägt und dir etwas mitgegeben, das du jetzt bewusst tragen darfst.",
      "Das Gestern hat sie wie ein Siegel hinterlassen: {k} sind Teil deiner Geschichte geworden, und du darfst sie nun mit Absicht verwenden.",
      "Aus dem Gestern reicht sie dir die Hand: {k} waren dein Lehrmeister, und du bist klüger aus ihnen hervorgegangen."],
     ["Umgekehrt zeigt sie, was im Gestern unausgesprochen blieb: {k} wurden nicht ganz gelebt oder verabschiedet. Was hier hängt, will gesehen werden, nicht gerichtet.",
      "Umgekehrt im Gestern: {k} haben Spuren hinterlassen, die noch nicht verheilt sind. Du darfst sie jetzt in Ruhe anschauen.",
      "Im Gestern liegt sie auf dem Kopf: {k} blieben unvollendet. Nicht als Schuld, sondern als offene Tür."]],
    [["Im Heute ist sie das Licht auf deinem Weg: {k} färben deinen Moment. Achte darauf, wo sie sich gerade zeigen, in einem Gespräch, einer Stimmung oder einem Zögern.",
      "Das Heute trägt ihre Farbe: {k} sind gerade lebendig. Schau, wo sie dir begegnen, vielleicht schon in der nächsten Stunde.",
      "Im Jetzt steht sie neben dir: {k} sind genau jetzt gefragt, und du bist genau jetzt bereit, sie zu spüren."],
     ["Umgekehrt verrät sie eine Schwelle im Jetzt: {k} stocken oder wenden sich nach innen. Frag dich leise, was gerade zu viel Raum einnimmt.",
      "Umgekehrt im Heute: {k} wirken gerade nach innen. Es ist weniger Stillstand als Sammlung.",
      "Im Heute auf dem Kopf: {k} sind blockiert oder zu laut. Prüfe, wo du zu viel oder zu wenig davon gibst."]],
    [["Im Morgen ist sie eine Einladung, kein Urteil: {k} zeigen die Richtung, in die sich dein Pfad öffnet, wenn du ihm Schritt für Schritt vertraust.",
      "Das Morgen winkt mit ihr: {k} warten am Rand deines Weges, und sie lassen sich nicht erzwingen, nur einladen.",
      "Im Morgen liegt sie wie ein ausgebreiteter Mantel: {k} sind bereit, dich zu umhüllen, wenn du näher kommst."],
     ["Umgekehrt ist sie eine Warnung mit sanfter Hand: Übergehst du {k}, kehren sie als Lektion zurück. Du darfst jetzt anders wählen.",
      "Im Morgen auf dem Kopf: Wenn {k} zu kurz kommen, melden sie sich lauter. Gib ihnen schon jetzt ein wenig Raum.",
      "Umgekehrt im Morgen: {k} können sich noch nicht zeigen, weil etwas davor liegt. Räume es freundlich beiseite."]]
  ];
  const PN = [
    ["Sie steht am Anfang deiner Geschichte. Aus ihr entspringt „{b}“ im Heute.", "Sie eröffnet die Erzählung. Ohne sie gäbe es „{b}“ im Heute nicht.", "Mit ihr beginnt dein Faden, und er spinnt sich zu „{b}“ weiter."],
    ["Sie ist die Mitte, der Drehpunkt deiner Legung: Von „{a}“ führt sie dich zu „{c}“.", "Sie ist das Scharnier: Links „{a}“, rechts „{c}“, und sie hält beides zusammen.", "In ihr kreuzen sich die Wege: „{a}“ liegt hinter ihr, „{c}“ vor ihr."],
    ["Sie öffnet das Tor. Was mit „{a}“ begann und sich in „{b}“ verwandelte, mündet in ihr.", "Sie ist das Ziel des Bogens: „{a}“ und „{b}“ haben auf sie hingeführt.", "In ihr laufen die Fäden aus „{a}“ und „{b}“ zusammen und werden zu einem Muster."]
  ];
  const QQ = [
    ["{K}: Was darf ich davon dankbar mitnehmen, und was gebe ich dem Gestern zurück?", "{K}: Welches Geschenk steckt im Gestern, das ich noch nicht ausgepackt habe?", "{K}: Was hat mich geprägt, und wofür bin ich heute bereit, loszulassen?", "{K}: Wem oder was aus dem Gestern möchte ich heute ein stilles Danke sagen?", "{K}: Welche Geschichte erzähle ich noch immer, obwohl sie längst weitergeschrieben ist?"],
    ["{K}: Wo zeigen sie sich in diesem Moment, und was brauchen sie von mir?", "{K}: Was würde sich ändern, wenn ich heute einen Hauch mehr davon zuließe?", "{K}: Wo spüre ich es gerade im Körper, und was möchte es mir sagen?", "{K}: Welche kleine Geste würde heute genau dazu passen?", "{K}: Was tue ich gerade aus Gewohnheit, das nicht mehr zu mir passt?"],
    ["{K}: Welchen einen Schritt gehe ich zuerst, damit sie sich entfalten können?", "{K}: Wie sähe ein Tag aus, an dem das schon selbstverständlich ist?", "{K}: Was kann ich heute vorbereiten, damit das Morgen leichter ankommt?", "{K}: Wem möchte ich davon erzählen, damit es Wirklichkeit wird?", "{K}: Was würde mein künftiges Ich mir heute zuflüstern?"]
  ];
  const SG = [
    ["Das Gestern ist kein Käfig, sondern ein Schlüssel.", "Das Gestern ist ein Lehrer, kein Richter.", "Was war, darf Wurzel sein, nicht Fessel.", "Dein Gestern hat dich nicht festgehalten, sondern geformt.", "Alles, was war, ist jetzt Material, kein Urteil."],
    ["Das Heute ist die einzige Tür, die sich wirklich öffnen lässt.", "Im Heute liegt die einzige Kraft, die du anfassen kannst.", "Jetzt ist der Ort, an dem Wandel überhaupt geschieht.", "Das Heute ist klein genug, um es zu ändern.", "Der Augenblick ist deine Werkstatt."],
    ["Das Morgen ist kein Schicksal, sondern ein Versprechen, das du selbst mitschreibst.", "Das Morgen ist eine leere Seite mit deinem Namen darauf.", "Nichts ist festgelegt, aber vieles ist eingeladen.", "Das Morgen ist ein Garten, den du heute schon gießt.", "Was kommt, entsteht aus dem, was du jetzt wählst."]
  ];

  /* ------------------------------------------------------------------ Siegel dieser Stunde */
  const WD = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
  const PLANET = ["der Sonne", "des Mondes", "des Mars", "des Merkur", "des Jupiter", "der Venus", "des Saturn"];
  const NUMSEN = {
    1: ["Die Eins: Ursprung und Anfang. Was jetzt beginnt, trägt deine Handschrift.", "Die Eins steht für den ersten Schritt und den Mut, allein zu beginnen.", "Eins: Eine einzige Entscheidung kann jetzt alles ordnen."],
    2: ["Die Zwei: Zwei Möglichkeiten, zwei Stimmen, ein Gleichgewicht, das du erst finden darfst.", "Die Zwei erzählt von Partnerschaft, Spiegel und leiser Intuition.", "Zwei: Hör nicht nur auf den Kopf, sondern auch auf den Zwischenton."],
    3: ["Die Drei: Wachstum und Ausdruck. Etwas will gezeigt, erzählt, gelebt werden.", "Die Drei steht für Fülle und Schöpferkraft: Du darfst Neues in die Welt bringen.", "Drei: Was gefühlt, gedacht und getan wird, ergibt zusammen Wirklichkeit."],
    4: ["Die Vier: Fundament. Baue ruhig, und es hält.", "Die Vier erzählt von Ordnung, Zuverlässigkeit und einem sicheren Platz.", "Vier: Struktur ist jetzt kein Zwang, sondern Geschenk."],
    5: ["Die Fünf: Bewegung und Wandel. Etwas Festes wird beweglich.", "Die Fünf steht für Freiheit und Abenteuer, aber auch für Prüfungen, die dich wachsen lassen.", "Fünf: Erwarte das Unerwartete, es meint es gut."],
    6: ["Die Sechs: Harmonie und Fürsorge. Etwas darf heilen.", "Die Sechs erzählt von Verbundenheit, Schönheit und gegenseitigem Geben.", "Sechs: Wer sich verbindet, wird stärker."],
    7: ["Die Sieben: Die Zahl der Suchenden. Die Antwort kommt in der Stille.", "Die Sieben steht für Tiefe, Beobachtung und inneres Wissen.", "Sieben: Du bist näher an einer Einsicht, als du denkst."],
    8: ["Die Acht: Kraft und Ausdauer. Was du jetzt pflegst, wächst kraftvoll.", "Die Acht erzählt von Meisterschaft, Fluss und Gleichgewicht zwischen Geben und Nehmen.", "Acht: Deine Wirkung reicht weiter, als du sie spürst."],
    9: ["Die Neun: Vollendung. Etwas rundet sich, und du darfst es loslassen.", "Die Neun steht für Weisheit und den Abschluss eines Kreises.", "Neun: Du hast mehr geschafft, als du dir anrechnest."],
    11: ["Die Elf, eine Meisterzahl: Erleuchtung und Intuition, ein Blitz, der Wesentliches zeigt.", "Die Elf ist selten und leuchtend: Etwas will durch dich sichtbar werden.", "Elf: Eine feine Antenne in dir ist gerade besonders wach."],
    22: ["Die Zweiundzwanzig, die Baumeisterzahl: Träume lassen sich in Wirklichkeit gießen.", "Die 22 ist die Zahl der großen Verwirklichung: Aus Vision wird Bauplan.", "Zweiundzwanzig: Was du heute aufs Papier bringst, kann tragen."]
  };
  const FORMEN = ["brief", "raetsel", "ritual", "rueckblick", "prophezeiung", "farbe", "karte4"];
  const OPEN = [
    "Gezogen {t}, an einem {w}, dem Tag {p}, unter {md}.",
    "Diese Legung entstand {t}, an einem {w}. Der Tag gehört {p}, am Himmel steht {mn}.",
    "{t}, ein {w}, der Tag {p}, dazu {mn}: Diese Konstellation gab es genau so nie zuvor.",
    "Als du die Karten gezogen hast, war es {t}. Ein {w}, der Tag {p}, begleitet von {md}.",
    "Der Moment dieser Legung: {t}, {w}, Tag {p}, am Himmel {mn}.",
    "Genau jetzt, {t}, an diesem {w}, steht der Tag {p} im Zeichen von {md}.",
    "Dein Zeitpunkt ist Teil der Deutung: {t}, {w}, Tag {p}. Dazu zeigt sich {mn}.",
    "Heute, {t}: ein {w}, der Tag {p}, unter {md}. Die Karten haben sich ihre Stunde gut gewählt."
  ];
  const PLFLAVOR = [
    ["Die Sonne schenkt diesem Tag Lebenskraft und Selbstvertrauen.", "Am Sonnentag zählt, was dich wirklich leuchten lässt.", "Sonnentage fragen: Wofür brennst du eigentlich?"],
    ["Der Mond färbt diesen Tag mit Gefühl und Intuition.", "Am Mondtag spricht das Innere lauter als das Außen.", "Mondtage laden ein, auf Stimmungen zu hören, statt sie zu bekämpfen."],
    ["Mars gibt diesem Tag Tatkraft und Mut zur Klarheit.", "Am Marstag darf Energie in Handlung fließen.", "Marstage fragen: Wofür lohnt es sich, aufzustehen?"],
    ["Merkur würzt diesen Tag mit Worten, Ideen und schnellen Gedanken.", "Am Merkurtag will etwas gesagt, geschrieben oder geklärt werden.", "Merkurtage belohnen, wer Fragen stellt."],
    ["Jupiter erweitert diesen Tag um Fülle, Vertrauen und Großzügigkeit.", "Am Jupitertag wächst, was du mit Zuversicht nährst.", "Jupitertage laden ein, größer zu denken, als du dich sonst traust."],
    ["Venus verleiht diesem Tag Wärme, Schönheit und Verbundenheit.", "Am Venustag zählt, was dein Herz freundlicher macht.", "Venustage fragen: Was darf heute leicht und schön sein?"],
    ["Saturn gibt diesem Tag Tiefe, Struktur und Ernsthaftigkeit.", "Am Saturntag zahlt sich aus, was du mit Geduld aufgebaut hast.", "Saturntage fragen: Was trägt dich wirklich, wenn es drauf ankommt?"]
  ];
  const UNIQ = [
    "Genau diese Legung, mit diesen Karten, in dieser Reihenfolge und Ausrichtung, gibt es nur 1 von {n} Möglichkeiten.",
    "Es gibt {n} verschiedene Wege, drei Karten zu ziehen. Du hast genau diesen einen bekommen.",
    "Wenn du diese Legung noch einmal ziehen wolltest, müsstest du im Schnitt {n} Mal neu mischen.",
    "1 zu {n}: So selten ist genau diese Legung. Sie gehört in dieser Form nur dir und diesem Moment."
  ];
  const LETTER_OPEN = ["Liebe Du von heute,", "An dich, die oder den Mutigen,", "Hallo, ich bin dein Morgen,", "Du da im Jetzt,", "Hör zu, ich schreibe dir von weiter vorn,"];
  const LETTER_BODY = [
    "ich bin {C}, und ich wollte dir sagen: „{kC}“ ist näher, als es von dort aus aussieht. Du hast „{kB}“ gerade als Gegenwart, aber ich sehe, wie es sich verwandelt.",
    "von hier aus ist {B} nur noch eine Erinnerung, ein Anlauf. Was jetzt noch schwer scheint, hat sich bei mir in „{kC}“ verwandelt. Mach weiter.",
    "ich habe nicht vergessen, wie es sich anfühlt, bei {B} zu stehen. Und ich schwöre dir, dass „{kC}“ auf dich wartet, als hätte es nie etwas anderes getan.",
    "{A} hat dich geformt, {B} hat dich gefordert, und ich, {C}, bin das, wohin beides geführt hat. Es hat sich gelohnt.",
    "du fragst dich vielleicht, ob es gut ausgeht. Ich bin der Beweis, dass „{kC}“ nicht nur ein Wort ist, sondern ein Ort, an dem du ankommst."
  ];
  const LETTER_END = ["In Verbundenheit, {C}", "Dein Morgen, {C}", "Bis bald, {C}", "Ich warte schon auf dich, {C}"];
  const RIDDLE = [
    "Was in deinem Leben trägt den Namen „{kA}“, ohne dass du es je so genannt hast?",
    "Wenn „{kB}“ ein Raum wäre: Wer hat dort den Schlüssel, und wann hast du ihn zuletzt benutzt?",
    "Welche Tür hat sich hinter dir geschlossen, als „{kA}“ aufhörte, und welche Tür steht seither einen Spalt offen, hin zu „{kC}“?",
    "Wenn „{kC}“ schon heute Nacht in deinem Leben anwesend wäre: Was würdest du morgen früh als Erstes anders machen?",
    "Zwischen „{kA}“ und „{kC}“ liegt „{kB}“. Was verbindet diese drei, und warum hast du es noch nie so gesehen?",
    "Was würdest du tun, wenn du wüsstest, dass „{kB}“ keine Strafe, sondern eine Einladung ist?"
  ];
  const RIDDLE_T = ["Das Rätsel, das bleibt", "Eine Frage für deine Nacht", "Das ungelöste Rätsel deiner Legung"];
  const RITUAL = {
    0: ["Reibe deine Handflächen aneinander, bis sie warm werden. Lege sie auf dein Herz und sprich innerlich: „{w}“.", "Zünde, wenn du magst, eine Kerze an und schau eine Minute in die Flamme. Sie trägt „{w}“ in sich.", "Stelle dich aufrecht hin, spüre die Wärme in deinem Bauch und sag dreimal leise: „{w}“."],
    1: ["Trinke langsam ein Glas Wasser und stelle dir vor, dass jeder Schluck „{w}“ in dich hineinträgt.", "Halte die Hände unter fließendes Wasser und lass dabei los, was dir zu schwer ist. Sag danach: „{w}“.", "Schließe die Augen, atme tief aus und stell dir einen stillen See vor, auf dem „{w}“ schwimmt."],
    2: ["Öffne ein Fenster. Atme drei Mal tief ein und aus und lass bei jedem Ausatmen einen Gedanken ziehen. Das Wort dazu: „{w}“.", "Schreibe das Wort „{w}“ auf einen Zettel und lege ihn dorthin, wo du ihn morgen früh siehst.", "Sprich laut aus, was du dir vornimmst, und beende den Satz mit „{w}“."],
    3: ["Stelle dich barfuß hin und spüre den Boden, als würdest du Wurzeln schlagen. Atme ruhig und sprich: „{w}“.", "Lege eine Hand auf deinen Bauch, die andere auf die Brust. Atme sechs Mal in die Mitte und denke „{w}“.", "Gehe eine Minute langsam im Raum umher, Schritt für Schritt, und wiederhole innerlich „{w}“."],
    9: ["Sieh dir die Karten noch einmal an, schließe die Augen und frag dich: Welches Bild bleibt? Das ist dein Wort für heute: „{w}“.", "Lege deine Hand auf dein Herz, atme tief durch und sprich dreimal: „{w}“. Dann öffne die Augen.", "Sprich „{w}“ leise zu dir selbst, so als würdest du es jemandem schenken, den du liebst."]
  };
  const RITUAL_T = ["Das 60-Sekunden-Ritual", "Eine Minute für dich", "Dein kleines Ritual"];
  const LOOK = [
    "In einem Jahr wirst du dich an eine Stunde erinnern, in der „{kB}“ mitten in deinem Leben stand. Du wirst sagen: Da hat es angefangen, sich zu drehen.",
    "Wenn du in einem Jahr zurückblickst, ist {B} der Moment, der den Unterschied gemacht hat. Und „{kC}“ ist dann längst Alltag.",
    "Ein Jahr später: „{kA}“ ist eine Geschichte, die du lächelnd erzählst, und „{kC}“ eine Gegenwart, die du kaum noch bemerkst, weil sie so selbstverständlich ist.",
    "Du wirst irgendwann nicht mehr wissen, wie du ohne „{kC}“ gelebt hast. Und du wirst dich fragen, wann genau es begann. Es war heute.",
    "In zwölf Monaten sitzt du an einem ganz normalen Tag da und denkst an {A}, {B} und {C}. Und du spürst Dankbarkeit, ohne zu wissen, wofür genau."
  ];
  const LOOK_T = ["Rückblick aus einem Jahr", "Ein Jahr weiter", "Ein Blick aus der Zukunft"];
  const PROPH = [
    ["Was „{kA}“ war, wird zum Boden.", "Was „{kB}“ ist, wird zur Brücke.", "Was „{kC}“ werden will, wird zu deinem Licht."],
    ["Zuerst ist da {A}, ein leiser Anfang.", "Dann kommt {B}, ein klarer Ruf.", "Am Ende steht {C}, ein offener Himmel."],
    ["Du kommst aus „{kA}“.", "Du stehst in „{kB}“.", "Du gehst nach „{kC}“, und der Weg kennt deinen Namen."],
    ["Aus {A} wächst eine Wurzel.", "Durch {B} treibt sie aus.", "In {C} wird sie zur Blüte."],
    ["Was verging, war „{kA}“.", "Was jetzt zählt, ist „{kB}“.", "Was kommt, trägt den Namen „{kC}“."],
    ["Einst: {A}. Jetzt: {B}. Bald: {C}.", "Dazwischen liegt kein Zufall, sondern ein Faden.", "Folge ihm, und er führt dich nach „{kC}“."]
  ];
  const PROPH_T = ["Die Prophezeiung in drei Zeilen", "Drei Zeilen für dich", "Dein Dreizeiler der Nacht"];
  const COLOR = {
    0: ["Rot und Bernstein", "Flammenorange", "Goldrot"],
    1: ["Silber und Tiefblau", "Mondweiß", "Meergrün"],
    2: ["Sonnengelb", "Wolkenweiß", "Himmelblau"],
    3: ["Waldgrün", "Erdbraun", "Moosgrün"],
    9: ["Gold und Violett", "Nachtblau mit Goldstaub", "Perlmutt"]
  };
  const COLOR_TXT = [
    "Deine Farbe für die nächsten 24 Stunden: {c}. Trage oder lege etwas in dieser Farbe in deine Nähe und nimm jedes Mal, wenn du es siehst, einen tiefen Atemzug.",
    "Die Farbe deiner Legung ist {c}. Such dir heute einen Gegenstand in dieser Farbe und lass ihn dein Anker für „{w}“ sein.",
    "{c}: Das ist die Farbe, die deine drei Karten zusammen ergeben. Umgib dich heute bewusst damit, es verstärkt, was die Karten sagen."
  ];
  const COLOR_T = ["Deine Farbe der nächsten 24 Stunden", "Das Farbsiegel", "Dein Talisman im Alltag"];
  const HIDDEN = [
    "Hinter deiner Legung steht still eine vierte Karte, nicht gezogen, sondern errechnet aus der Summe deiner drei Karten ({s}): {h}. Sie ist das Echo, das unter allem mitschwingt: {k}.",
    "Rechnest du die Zahlen deiner Karten zusammen, erhältst du {s}. Das führt zu {h}, der unsichtbaren Karte hinter deiner Legung. Ihr Thema: {k}.",
    "Die verborgene Karte deiner Legung ist {h} (Summe {s}). Sie wurde nicht gezogen, sie wird durch dich errechnet. Sie flüstert: {k}."
  ];
  const HIDDEN_IN = [
    "Die Summe deiner Karten ist {s} und führt zu {h}, einer Karte, die schon in deiner Legung liegt. Das ist ein seltenes Zeichen: Das Thema ({k}) wirkt hier doppelt, offen und im Verborgenen.",
    "Rechne nach: {s}. Das ergibt {h}, und diese Karte hast du bereits gezogen. Ihr Thema ({k}) ist nicht nur ein Teil deiner Legung, sondern ihr Fundament."
  ];
  const HIDDEN_T = ["Die Zahl deiner Legung und die Karte dahinter", "Die verborgene vierte Karte", "Was die Zahlen verraten"];
  const FUNKE = [
    "Schließe jetzt kurz die Augen und atme einmal tief aus. Der Rest dieses Tages gehört dir.",
    "Nimm das erste Wort, das dir beim Lesen im Herzen aufgeleuchtet ist. Das ist dein Wort für heute.",
    "Du hast diese Karten nicht einfach gezogen. Sie haben einen Moment lang auf dich gewartet.",
    "Manche Legungen beschreiben das Leben. Diese hier lädt dich ein, es zu beginnen.",
    "Vielleicht war nichts davon neu. Vielleicht ist genau das der Grund, warum es sich so wahr anfühlt.",
    "Du trägst das, was die Karten sagen, schon in dir. Sie haben es nur laut gemacht.",
    "Es ist kein Zufall, dass du jetzt hier bist, genau mit dieser Frage in der Brust.",
    "Gleich legst du das Gerät weg. Und irgendwo in dir bleibt ein kleines Licht an.",
    "Wenn du nur eines mitnimmst: Du bist nicht am Anfang, du bist mittendrin, und es geht gut weiter.",
    "Die Karten haben gesprochen. Jetzt bist du dran.",
    "In dieser Stunde, in diesem Raum, hat sich etwas verschoben. Spürst du es?",
    "Und wenn du heute Nacht träumst: Achte auf das erste Bild. Es gehört zu dieser Legung."
  ];

  const MOON_N = ["der Neumond", "die zunehmende Sichel", "das erste Viertel", "der zunehmende Mond", "der Vollmond", "der abnehmende Mond", "das letzte Viertel", "die abnehmende Sichel"];
  const MOON_D = ["dem Neumond", "der zunehmenden Sichel", "dem ersten Viertel", "dem zunehmenden Mond", "dem Vollmond", "dem abnehmenden Mond", "dem letzten Viertel", "der abnehmenden Sichel"];
  /* ------------------------------------------------------------------ Erweiterungen kleiner Pools */
  UNIQ.push(
    "Von {n} möglichen Legungen hast du genau diese erhalten: dieselben Karten, dieselbe Reihenfolge, dieselbe Ausrichtung kommt nur einmal darin vor.",
    "Rechnerisch gibt es {n} Wege, drei Karten aus 78 mit Ausrichtung zu ziehen. Dieser eine ist jetzt deiner.",
    "Die Wahrscheinlichkeit für genau diese Legung liegt bei 1 zu {n}. Kein Zufall ist so genau, wie dieser hier aussieht.",
    "Wärst du ein Würfel mit {n} Seiten, du wärst genau auf dieser gelandet.");
  HINT.push(
    "Mit einem Thema oder einer eigenen Frage oben wird die nächste Deutung noch treffsicherer.",
    "Wähle beim nächsten Mal oben ein Thema oder schreibe deine Frage, und die Karten antworten gezielter.",
    "Möchtest du es genauer? Gib oben ein Thema an oder stelle deine Frage in einem Satz.");
  UNSURE.push(
    "Es ist noch vieles gleichzeitig laut. Ein klarer Satz als Frage und ein neues Ziehen schaffen Ordnung.",
    "Dieses Bild hat viele Ebenen. Mit einer genaueren Frage wird die nächste Legung deutlicher.");
  COURT.push(
    "{n} ist eine Hofkarte und steht oft für einen Menschen, eine Haltung oder eine Rolle, in die du hineinwächst.",
    "Eine Gestalt tritt auf: {n}. Wer begegnet dir gerade, oder welche Seite von dir will die Bühne?",
    "Mit {n} zeigt sich ein Charakter. Frag dich, ob er dir begegnet oder ob du ihn gerade verkörperst.");
  [
    ["Keine Große Arkana: Dein Alltag ist dein Schauplatz, und er ist mächtiger, als er wirkt.", "Ohne Große Arkana zeigt die Legung, wie viel in deinem Alltag verhandelbar ist."],
    ["<b>{n}</b> trägt als einzige Große Arkana die Hauptstimme. Die anderen begleiten sie.", "Ein einziges großes Bild: <b>{n}</b>. Um dieses Bild herum erzählen die anderen Karten ihre Details."],
    ["Zwei große Bilder in einer Legung: Das Leben legt gerade Gewicht auf Bedeutung statt Kleinigkeiten.", "Zwei Große Arkana: Zwei Archetypen sprechen miteinander, und du sitzt dazwischen."],
    ["Nur große Bilder: Diese Legung ist ein kleines Märchen, und du bist darin die Hauptfigur.", "Drei Große Arkana, das ist wie drei Leuchttürme in einer Nacht: Du kannst dich an jedem orientieren."]
  ].forEach((x, i) => MAJ_N[i].push(...x));
  [
    ["Aufrecht, aufrecht, aufrecht: Die Karten wirken ohne Umweg, ohne Bremse.", "Alles steht, wie es soll: Du kannst die Botschaften unmittelbar nutzen."],
    ["Mit <b>{n}</b> liegt eine Karte auf dem Kopf: Ein Thema wartet auf deine Aufmerksamkeit, bevor es sich zeigt.", "Eine umgekehrte Karte, <b>{n}</b>, sagt: Zuerst nach innen, dann nach außen."],
    ["Zwei umgekehrte Karten: Du bist dabei, etwas innerlich zu sortieren. Gib dir die Zeit.", "Doppelt nach innen gekehrt: Dein Inneres arbeitet, auch wenn man es von außen nicht sieht."],
    ["Alle Karten sind nach innen gekehrt: Dies ist deine Nacht der Einkehr. Das Handeln darf warten.", "Dreimal umgekehrt: Du bekommst heute keine Anweisung, sondern einen Spiegel."]
  ].forEach((x, i) => REV[i].push(...x));
  RANKS.push(
    "Die <b>{r}</b> kehrt wieder: {m}. Wenn eine Zahl dreimal anklopft, sollte man öffnen.",
    "Mehr als einmal die <b>{r}</b>: Das Leben betont hier ein Wort, und es lautet „{m}“.");
  FUNKE.push(
    "Atme einmal so tief ein, dass du es bis in die Füße spürst. Dann geh in den Rest dieses Tages.",
    "Du hast gerade drei Bilder angeschaut, die nur dich meinen. Trag eines davon mit dir.",
    "Manchmal ist die beste Antwort die, bei der man lächelt, weil man sie schon wusste.",
    "Lass die Karten jetzt in dir arbeiten. Sie brauchen dich nicht mehr, nur noch deine Aufmerksamkeit.",
    "Ein einziger mutiger Gedanke reicht, um diese Legung wahr zu machen.",
    "Was auch immer als Nächstes kommt: Du hast bereits eine Landkarte.",
    "Behalte die Karte, bei der dein Herz einen kleinen Satz gemacht hat. Sie ist nicht zufällig deine.",
    "Wenn du heute Nacht schlafen gehst, nimm ein einziges Wort aus dieser Legung mit. Es wird bei dir wachen.",
    "Der Zauber ist nicht in den Karten. Er ist in dem Moment, in dem du hingeschaut hast.",
    "Jetzt, genau jetzt, hat sich eine kleine Tür in dir aufgelegt. Du musst sie nur nicht sofort durchschreiten.",
    "Es gibt Antworten, die man nicht lösen, sondern leben muss. Diese hier gehört dazu.",
    "Bevor du gehst: Sag dir leise „Danke“. Nicht den Karten, sondern der, die oder dem, der sie gelesen hat.");

  /* Zweiteilige Sätze: ganze Sätze wiederholen sich so erst nach Vielfachen der Pool-Größe */
  const HINT2 = ["Es genügt ein einziger Satz.", "Die Karten hören genau zu.", "Das Ziehen dauert nur einen Atemzug.", "Je klarer die Frage, desto leuchtender die Antwort.", "Du musst nichts erklären, nur benennen.", "Probiere es beim nächsten Ziehen aus.", "Die Legung wird dadurch erstaunlich persönlich.", "Ein Wort wie „Liebe“ oder „Arbeit“ reicht schon."];
  const UNIQ2 = ["Sie gehört in dieser Form nur dir und diesem Moment.", "Kein anderer Mensch hat sie so bekommen.", "Das ist kein Zufall, das ist Einzigartigkeit.", "Nimm sie als Geschenk des Augenblicks an.", "Selbst wenn du morgen neu ziehst, wird sie nie wiederkehren.", "Sie ist so einmalig wie dein Fingerabdruck.", "Dieses Muster hat es vor dir nie gegeben, und nach dir wird es kaum wiederkehren.", "Ein Bild, das nur für diesen Moment gemalt wurde."];
  const PLT = ["Lass dich davon heute leiten.", "Es ist ein feiner Hintergrundton für alles, was du heute deutest.", "Das färbt jede Karte ein wenig mit.", "Beachte, wie sich das in deiner Legung spiegelt.", "Auch das gehört zur Botschaft.", "So wird aus dem Kalender ein Verbündeter.", "Die Karten wissen nichts vom Kalender, aber der Kalender weiß etwas von dir.", "Es ist kein Zwang, nur eine Einladung.", "Du kannst es als Rückenwind nutzen.", "Ein stiller Mitleser deiner Legung."];
  FUNKE.push(
    "Lass dir Zeit mit dem Weitergehen. Gute Antworten sind keine Eilsendungen.",
    "Du darfst die Legung jetzt schließen und trotzdem weiter in ihr wohnen.",
    "Wenn dich etwas berührt hat, folge genau dieser Spur. Sie ist selten falsch.",
    "In diesem Moment weißt du mehr, als du aussprichst. Das ist gut so.",
    "Vielleicht ist heute der Tag, an dem du dir selbst einmal glaubst.",
    "Was dir bleibt, wenn du alles vergisst: ein einziges warmes Gefühl. Halte daran fest.",
    "Manche Karten deuten, manche begleiten. Diese hier tut beides.",
    "Jetzt kannst du aufstehen, ein Glas Wasser trinken und merken, dass etwas leichter ist.",
    "Du bist der Ort, an dem diese Legung zu Ende geht und etwas Neues beginnt.",
    "Das Leben antwortet selten laut. Heute hat es einen Moment lang geflüstert.",
    "Schau beim nächsten Gehen auf deine Füße: Sie tragen dich schon in die Richtung der Karten.",
    "Der erste Schritt, den du jetzt tust, gehört schon zur Legung.");
  H_MAIN.push("Das, was zwischen deinen Karten liegt", "Dein Dreiklang aus Gestern, Heute, Morgen");
  H_WORK.push("Wie deine Karten miteinander sprechen", "Fäden zwischen deinen Karten", "Das Netz deiner Legung");
  H_TASK.push("Deine kleine Mutprobe", "Zum Mitnehmen in den Tag");
  ST_B.push("Für diese Stunde:", "Gleich im Anschluss:");
  ST_C.push("Ein Blick nach vorn:", "Bereite das Morgen vor:");
  ST_Q.push("Eine Frage an dich: ", "Die Karte flüstert: ");
  return { KW, CORE1, CORE2, ADV, MANTRA, MAJ_N, ELT, PR, RANKS, ASC, DESC, COURT, REV, BRIDGE, LENS, TEND, FRQ, HINT, UNSURE, H_MAIN, H_WORK, H_TASK, ST_B, ST_C, ST_Q, MAJX, ELX, PP, PN, QQ, SG, WD, PLANET, NUMSEN, FORMEN, OPEN, PLFLAVOR, UNIQ, LETTER_OPEN, LETTER_BODY, LETTER_END, RIDDLE, RIDDLE_T, RITUAL, RITUAL_T, LOOK, LOOK_T, PROPH, PROPH_T, COLOR, COLOR_TXT, COLOR_T, HIDDEN, HIDDEN_IN, HIDDEN_T, FUNKE, MOON_N, MOON_D, HINT2, UNIQ2, PLT };
})();
