// Seed drills loaded into localStorage on first run.
// After that, all drills are editable in the app (see data/storage.js).

export const CATEGORIES = [
  { id: "warmUp", label: "Warm-Up" },
  { id: "skill", label: "Skill" },
  { id: "game", label: "Game" },
];

export const seedDrills = [
  // Warm-up
  {
    id: "seed-butterfly",
    category: "warmUp",
    name: "Butterfly",
    description:
      "Players work on throwing over the net from one side, receiver passes to target in the setter position, target then goes to throw from their side on the net to the other side. The movement of the players follows the ball; tosser becomes passer, passer becomes target, target becomes tosser.",
    image:
      "https://thrivevolleyball.com/wp-content/uploads/2019/05/butterfly-drill-cover.jpg",
    video: "",
    defaultMinutes: 10,
  },
  {
    id: "seed-shuttle-pass",
    category: "warmUp",
    name: "Shuttle Pass/Set",
    description:
      "Two groups of players in one line facing each other from sideline to sideline. Players pass/set the ball to the other side and moving to the other line as well.",
    image:
      "https://thrivevolleyball.com/wp-content/uploads/2019/05/shuttle-passing-cover.jpg",
    video: "",
    defaultMinutes: 10,
  },
  {
    id: "seed-team-pepper",
    category: "warmUp",
    name: "Team Pepper",
    description:
      "Two hitters on the wings, setter in the middle, defenders all back row. Setter alternates setting outside and rightside, hitters hit BACK into the same side of the court (not over the net), defenders pass back to setter.",
    image: "",
    video: "https://www.youtube.com/watch?v=_FEAQt4pVN4",
    defaultMinutes: 10,
  },
  {
    id: "seed-dot-drill",
    category: "warmUp",
    name: "Dot Drill",
    description:
      "Players start in center of the court. Coach tosses ball over the net; short, sideline, and deep. Player works to pass each and go back to the center after each pass.",
    image:
      "https://thrivevolleyball.com/wp-content/uploads/2018/04/dot-drill-1-400x250.jpg",
    video: "",
    defaultMinutes: 10,
  },
  {
    id: "seed-volleyball-tennis",
    category: "warmUp",
    name: "Volleyball Tennis",
    description:
      "Just like shuttle passing but over the net. Players go on the court one by one receiving the ball and sending it over in one touch.",
    image:
      "https://thrivevolleyball.com/wp-content/uploads/2018/04/1v1-tennis-400x250.jpg",
    video: "",
    defaultMinutes: 10,
  },
  {
    id: "seed-serve-relay",
    category: "warmUp",
    name: "Serve Relay",
    description:
      "Players split into two groups, they go against each other in a relay race. If the serve goes over the net and in, the player only runs half court and back. If the player misses the serve, they have to run the whole court. Add zones for intermediate or higher players.",
    image:
      "https://thrivevolleyball.com/wp-content/uploads/2019/05/serve-relay-1-400x250.jpg",
    video: "",
    defaultMinutes: 10,
  },
  {
    id: "seed-pepper",
    category: "warmUp",
    name: "Pepper",
    description:
      "Pass-set-hit sequence. Players in pairs or can have variation, usually one touch.",
    image: "",
    video: "https://www.youtube.com/watch?v=0FK1nQunWus",
    defaultMinutes: 10,
  },

  // Skill
  {
    id: "seed-dig-tip-chase",
    category: "skill",
    name: "Dig-Tip-Chase",
    description:
      "3-ball drill, players will receive 3 balls; downball, tip ball, and a chase ball. Players must dig the down ball, then pickup the tip ball, then chase the chase ball.",
    image: "",
    video: "https://www.youtube.com/watch?v=T9zZJNKpnc8",
    defaultMinutes: 15,
  },
  {
    id: "seed-setting-triangle",
    category: "skill",
    name: "Setting Triangle",
    description:
      "Players form a triangle and set. Focus on getting squared and finishing to target.",
    image: "",
    video: "https://www.youtube.com/watch?v=n7GTFEfbR6U",
    defaultMinutes: 15,
  },
  {
    id: "seed-servers-vs-passers",
    category: "skill",
    name: "Servers vs Passers",
    description:
      "Players divide in two groups, one group focuses on serves and tries to get aces, other group focus on receive. Up to the coach on how they'd like to incorporate a point system.",
    image: "",
    video: "https://www.youtube.com/watch?v=oqOb2Kad3UY",
    defaultMinutes: 15,
  },
  {
    id: "seed-defensive-transitions",
    category: "skill",
    name: "Defensive Transitions",
    description:
      "Players work on footwork transitions into defensive spots. Blocking, and digging positions.",
    image: "",
    video: "https://www.youtube.com/watch?v=IGfj8k9QjwI",
    defaultMinutes: 15,
  },
  {
    id: "seed-offensive-transitions",
    category: "skill",
    name: "Offensive Transitions",
    description:
      "Players work on transitioning from a defensive position into their offensive positions on the court.",
    image: "",
    video: "https://www.youtube.com/watch?v=brY9BKBGQBw",
    defaultMinutes: 15,
  },
  {
    id: "seed-half-court-sr",
    category: "skill",
    name: "Half Court Serve Receive",
    description:
      "Serve/Receive drill, start by splitting the court in half endline-to-endline. Servers will be at the right side of the endline serving straight, while two receivers work on passing on the same line. Switch sides after a few minutes.",
    image:
      "https://thrivevolleyball.com/wp-content/uploads/2022/02/split-court-sr-400x250.jpg",
    video: "",
    defaultMinutes: 15,
  },
  {
    id: "seed-middles-vs-pins",
    category: "skill",
    name: "Middles vs Pins",
    description:
      "Middle blockers work on blocking outside and oppo hits from a live setter. Attackers tries to make a point. Middle blocker tries to block, while three passers are behind the blocker.",
    image:
      "https://thrivevolleyball.com/wp-content/uploads/2020/02/middles-vs-pins-1-400x250.jpg",
    video: "",
    defaultMinutes: 15,
  },
  {
    id: "seed-dig-and-chase",
    category: "skill",
    name: "Dig and Chase",
    description:
      "Players receive two balls, first ball is a downball, second ball is a chase ball. Focus on reaction and moving towards the ball to get it up.",
    image: "",
    video: "",
    defaultMinutes: 15,
  },

  // Game
  {
    id: "seed-queens",
    category: "game",
    name: "Queens",
    description:
      "There's a winner side, and a challenger side. The winner side only has one team and they play to stay on that side until challengers win and move to winners side.",
    image: "",
    video: "https://www.youtube.com/watch?v=kMc85Auwt7M",
    defaultMinutes: 20,
  },
  {
    id: "seed-usa",
    category: "game",
    name: "USA",
    description:
      "Players scrimmage for one BIG point by winning 3 small points in a row. First ball is a free ball, second is a downball, third is a serve or a chase ball. At any point one side loses the rally, chance goes to the other side.",
    image: "",
    video: "https://www.youtube.com/watch?v=8jelH6pchtI",
    defaultMinutes: 20,
  },
  {
    id: "seed-18-22",
    category: "game",
    name: "18-22",
    description:
      "This is a high pressure mini game. One side has an advantage with score starting at 22, the other starts at 18. Game to 25.",
    image: "",
    video: "",
    defaultMinutes: 15,
  },
  {
    id: "seed-quiet-but-one",
    category: "game",
    name: "Quiet But One",
    description:
      "Regular scrimmage, however everyone is quiet except one person making all the calls.",
    image: "",
    video: "",
    defaultMinutes: 15,
  },
  {
    id: "seed-tug-of-war",
    category: "game",
    name: "Tug-of-War",
    description:
      "Game starts at 5, one side tries to get to 10, while the other tries to get to 0 by winning rallies.",
    image: "",
    video: "",
    defaultMinutes: 15,
  },
  {
    id: "seed-specific-killer",
    category: "game",
    name: "Specific Killer",
    description:
      "Scrimmage game, however only one player or position is able to make a score.",
    image: "",
    video: "",
    defaultMinutes: 15,
  },
];
