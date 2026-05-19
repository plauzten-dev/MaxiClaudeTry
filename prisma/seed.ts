import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` })
const prisma = new PrismaClient({ adapter } as any)

const exercises = [
  {
    name: 'Kurzpassspiel im Dreieck',
    description: 'Drei Spieler stehen in einem gleichseitigen Dreieck (ca. 10m Abstand). Spieler A passt zu B, B passt zu C, C passt zu A. Nach dem Pass folgt man dem Ball und wechselt die Position.\n\nZiel: Passgenauigkeit und Timing verbessern.\nVariante: Mit einer Berührung spielen oder nach dem Pass durch die Mitte sprinten.',
    fieldPlayers: 3,
    goalkeepers: 0,
    coreCompetency: 'Passspiel',
    difficulty: 'Anfänger',
    fieldSize: 'Klein',
  },
  {
    name: 'Rondo 4 gegen 2',
    description: 'Vier Außenspieler halten den Ball gegen zwei Mittelfeldspieler. Die zwei Innenspieler versuchen den Ball zu gewinnen. Wer den Ball verliert, geht in die Mitte.\n\nZiel: Ballbesitz unter Druck, schnelles Passspiel, Bewegung ohne Ball.\nDauer: 5-8 Minuten.',
    fieldPlayers: 6,
    goalkeepers: 0,
    coreCompetency: 'Ballbesitz',
    difficulty: 'Fortgeschritten',
    fieldSize: 'Klein',
  },
  {
    name: 'Torabschluss nach Flanke',
    description: 'Ein Flankengeber steht auf der Seite, ein Stürmer läuft in den Strafraum. Der Flankengeber flankt, der Stürmer schließt ab. Wechsel nach je 5 Versuchen.\n\nZiel: Timing des Einlaufens, Kopfballstärke und Volleyabschlüsse.\nVariante: Zwei Stürmer, einer als Ablage.',
    fieldPlayers: 2,
    goalkeepers: 1,
    coreCompetency: 'Torschuss',
    difficulty: 'Anfänger',
    fieldSize: 'Mittel',
  },
  {
    name: 'Pressing-Übung 3 gegen 3',
    description: 'Zwei Teams à 3 Spieler in einem begrenzten Feld (ca. 20x20m). Das pressende Team versucht den Ball innerhalb von 5 Sekunden nach Ballverlust zurückzugewinnen.\n\nZiel: Koordiniertes Pressing, Laufwege und Kommunikation.\nZählen: Wer 3 erfolgreiche Ballgewinne hat, gewinnt die Runde.',
    fieldPlayers: 6,
    goalkeepers: 0,
    coreCompetency: 'Pressing',
    difficulty: 'Fortgeschritten',
    fieldSize: 'Klein',
  },
  {
    name: 'Elfmeterschießen mit Variation',
    description: 'Spieler üben Elfmeter aus verschiedenen Positionen. Torwart bekommt Hinweis auf Ecke erst beim Anlauf.\n\nVarianten:\n1. Klassischer Elfmeter\n2. Chipped Penalty (Lupfer)\n3. Nach vorherigem Dribbling\n\nZiel: Nervenstärke, Technik und Torwartroutine.',
    fieldPlayers: 4,
    goalkeepers: 1,
    coreCompetency: 'Standardsituationen',
    difficulty: 'Anfänger',
    fieldSize: 'Klein',
  },
  {
    name: '1 gegen 1 Zweikampf',
    description: 'Zwei Spieler stehen sich gegenüber. Angreifer versucht am Verteidiger vorbeizukommen und eine Linie zu überqueren. Verteidiger verhindert dies.\n\nZiel: Defensivverhalten, Timing des Eingreifens, Angreifer-Finten.\nDauer pro Duell: 30 Sekunden, dann Rollenwechsel.',
    fieldPlayers: 2,
    goalkeepers: 0,
    coreCompetency: 'Zweikampf',
    difficulty: 'Anfänger',
    fieldSize: 'Klein',
  },
  {
    name: 'Gegenpressing nach Ballverlust',
    description: 'In einem Großfeld spielen zwei Teams (7v7). Nach jedem Ballverlust wird sofortiges Gegenpressing trainiert. Die Mannschaft mit mehr Ballgewinnen innerhalb von 5 Sekunden nach Ballverlust gewinnt.\n\nZiel: Umschaltverhalten, Kondition und Teamkommunikation.',
    fieldPlayers: 14,
    goalkeepers: 2,
    coreCompetency: 'Pressing',
    difficulty: 'Experte',
    fieldSize: 'Groß',
  },
  {
    name: 'Kombinationsspiel 5 gegen 2 mit Torabschluss',
    description: 'Fünf Angreifer spielen sich in einem Mittelfeld frei gegen 2 Verteidiger. Nach 10 erfolgreichen Pässen darf auf ein verkleinertes Tor geschossen werden.\n\nZiel: Ballbesitz kombinieren mit Torchance herausspielen.',
    fieldPlayers: 7,
    goalkeepers: 1,
    coreCompetency: 'Torschuss',
    difficulty: 'Fortgeschritten',
    fieldSize: 'Mittel',
  },
  {
    name: 'Freistoßtraining aus 20 Metern',
    description: 'Spieler üben Freistöße aus verschiedenen Winkeln und Distanzen (18-25m). Mauer aus 2-3 Spielern wird aufgestellt.\n\nVarianten:\n1. Direkter Schuss in den Winkel\n2. Flanke in den Strafraum\n3. Kombination mit Ablage\n\nJeder Schütze erhält 5 Versuche.',
    fieldPlayers: 5,
    goalkeepers: 1,
    coreCompetency: 'Standardsituationen',
    difficulty: 'Fortgeschritten',
    fieldSize: 'Mittel',
  },
  {
    name: 'Großes Spielform 8 gegen 8',
    description: 'Freies Spielen auf zwei Tore, 8 gegen 8 auf einem halbgroßen Feld. Besondere Regeln: 3 Berührungen maximal, bei Ballgewinn sofort in die Tiefe spielen.\n\nZiel: Anwendung aller erlernten Techniken im Spielzusammenhang.\nDauer: 3x10 Minuten mit je 2 Minuten Pause.',
    fieldPlayers: 16,
    goalkeepers: 2,
    coreCompetency: 'Ballbesitz',
    difficulty: 'Experte',
    fieldSize: 'Groß',
  },
]

async function main() {
  console.log('Seeding database...')
  for (const ex of exercises) {
    await prisma.exercise.create({ data: ex })
  }
  console.log(`Created ${exercises.length} exercises.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
