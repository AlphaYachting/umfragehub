// English FAQ for the public pages under /en (17.11.2026), adapted from src/inhalte/faq.js.
// Same keys and fields as the German file. British English.
//
// Rules: always "interview", never "survey" for our own offer. No dashes, curly quotes,
// middle dots or ellipses (missing in the Gilroy subset): straight apostrophes only.
// Anonymity is never promised in absolute terms (project rule): no names, groups under 6 merged.

export const FAQ_EN = {
  startseite: {
    etikett: "Questions about andi fragt.",
    titelA: "Good questions deserve",
    titelB: "honest answers.",
    lead: "What managing directors, HR and sales leaders ask us before the first call. And what invited participants want to know before they answer.",
    filter: true,
    fragen: [
      {
        g: "auftrag",
        q: "What is andi fragt.?",
        kopf: "andi fragt. brings to light the knowledge that already exists in your company but rarely reaches the top.",
        text: "Why customers really buy, why good people stay or leave, where deals get stuck. Rittler & Co, a brand and advertising agency in Graz, Austria, first works out which questions are the right ones for you, then asks them in confidential interviews with leadership, team, sales and customers. What you get is a basis for decisions, not a pile of data.",
      },
      {
        g: "auftrag",
        q: "How do you know which questions are right for us?",
        kopf: "From more than 500 brand projects.",
        text: "They taught us that companies almost always misjudge themselves in the same places, only with different content each time: why customers buy, why good people leave, which argument makes or breaks a deal. In the goal-setting meeting we find out where those places are in your company and aim the questions right at them. A proven core stays the same, so results remain comparable.",
      },
      {
        g: "auftrag",
        q: "Couldn't I just do this myself with AI or an online form?",
        kopf: "You can write the questions yourself, and AI will gladly help.",
        text: "But it doesn't know which assumption in your company is wrong, so it asks the questions everyone asks. And when the boss does the asking, employees and customers answer carefully. We are the neutral party, we know where to dig deeper, and we read the answers with an eye on what they mean for your brand, your team and your sales.",
      },
      {
        g: "auftrag",
        q: "How does a project with andi fragt. work?",
        kopf: "It starts with an assessment, not with a questionnaire.",
        text: "",
        schritte: [
          { verb: "fragt", text: "In the goal-setting meeting we clarify the situation, goals and assumptions, then build a separate interview for each group, answered without names." },
          { verb: "weiß", text: "We condense all answers using the ANDI method." },
          { verb: "macht", text: "The gaps we find become clear recommendations." },
          { verb: "zeigt", text: "We present the results to you in person and agree the next steps." },
        ],
      },
      {
        g: "auftrag",
        q: "How much of my own time does it take?",
        kopf: "About two hours, spread over four to six weeks.",
        text: "The goal-setting meeting, signing off the interview and the presentation. Everything in between, from developing the questions to the analysis, is on us. For each participant an interview takes 15 to 30 minutes, with no appointment and no travel.",
      },
      {
        g: "auftrag",
        q: "What does a project with andi fragt. cost?",
        kopf: "Less than a single wrong hire or a website relaunch that heads in the wrong direction.",
        text: "Every module has a fixed price based on group size: from EUR 2,900 plus VAT for small businesses with up to 6 people, EUR 5,400 plus VAT for 21 to 50 people. All tiers are listed on the pricing page. The price covers the goal-setting meeting, developing the interview, analysis by our strategists and the presentation at your premises. More groups, customers as an additional group or several locations add to the effort. You get your fixed price after the first call.",
      },
      {
        g: "auftrag",
        q: "Is it worth it for a business with 30 people?",
        kopf: "Especially there.",
        text: "In small businesses the owner thinks they know everything because they know everyone, and that is exactly why nobody tells them everything. To keep answers confidential, a group needs at least 6 interviews, so we analyse 30 people in a few groups or as a whole. There is no upper limit: we usually interview 5 to 100 people, and your customers too if you wish.",
      },
      {
        g: "auftrag",
        q: "Who reads the answers, and where are they stored?",
        kopf: "Only the project team at Rittler & Co in Graz reads the answers.",
        text: "As the client, you only ever receive them in aggregated form. They are stored without names and without email addresses. Where they are stored and when we delete them is set out in our privacy policy.",
      },
      {
        g: "eingeladen",
        q: "Will my boss find out what I said?",
        kopf: "No.",
        text: "Your employer sees no names. Results are only shown in aggregated form and only once enough colleagues have taken part; small departments are merged. We quote open answers in a way that does not point to anyone. That is why you can be honest, even when the answer is uncomfortable.",
      },
      {
        g: "eingeladen",
        q: "I received an invitation. Is this legitimate?",
        kopf: "Yes.",
        text: "A company you work for, or whose customer you are, has asked Rittler & Co, a brand and advertising agency in Graz, Austria, to gather your honest view. Taking part is voluntary and free, takes 15 to 30 minutes and works on your phone or computer, and you can pause at any time. Open the link in your invitation or enter your code below. If it doesn't work, give us a call.",
      },
    ],
  },

  positionierung: {
    etikett: "Questions about positioning",
    titelA: "Clarity before",
    titelB: "you invest.",
    lead: "What business owners want to know before they rethink their positioning.",
    verweis: true,
    fragen: [
      {
        q: "How do we find out what customers really pay us for?",
        kopf: "By asking the people who know, with the right questions.",
        text: "For brand positioning with andi fragt., we first test your view of the company in the goal-setting meeting and then build interviews for leadership, team and regular customers. Where the three views differ, you usually find the edge you are giving away today.",
        beispiel: "A window manufacturer has advertised quality for years. In the interviews, almost all of his customers name something else: installation that is on time to the minute.",
      },
      {
        q: "Isn't a workshop with the management team enough?",
        kopf: "A workshop collects what leadership thinks about itself. We test it.",
        text: "Team and customers answer, without names, questions aimed precisely where companies tend to misjudge themselves. So you decide on your positioning based on what lands outside, not on what sounds good inside. The discussion still happens, during the presentation at your premises.",
      },
      {
        q: "We already have a mission statement. Do we still need this?",
        kopf: "A mission statement describes who you want to be.",
        text: "Positioning defines what customers pay you for and what sets you apart from competitors. The two often drift apart, for instance when the website talks about tradition while customers buy for the service and the speed. The interview makes that gap visible. A good mission statement stays; it simply gets evidence.",
      },
      {
        q: "How do I know we need a new positioning?",
        kopf: "Three signs.",
        text: "Conversations keep ending up on price. Your team cannot tell a new customer in two sentences why they should buy from you. And your website would fit a competitor just as well with a different logo. At the latest before a larger investment in how you present yourself, such as a website, a trade fair stand or handing over to the next generation, an outside view pays off.",
      },
      {
        q: "What do I have in my hands at the end?",
        kopf: "A basis for decisions, not a data report.",
        text: "An analysis handout with every gap we found, the presentation at your premises and recommendations for the next 90 days. Plus your positioning on a single page: the promise, three proof points, tone of voice and what you will stop saying. From then on it guides your website, proposals, trade fair stand and job ads.",
      },
      {
        q: "Do you also implement the positioning?",
        kopf: "Yes.",
        text: "andi fragt. is run by Rittler & Co, a brand and advertising agency in Graz. The interview is the core of the ANDI brand check, and if you wish we implement the positioning straight away, from the core message to the website. Because analysis and implementation come from one source, nothing gets lost between insight and execution. You can just as well implement the results with your own team.",
      },
    ],
  },

  team: {
    etikett: "Questions about the team interview",
    titelA: "What leaders want",
    titelB: "to know first.",
    lead: "The questions managing directors and HR leaders ask us before a team interview.",
    verweis: true,
    fragen: [
      {
        q: "Why a team interview instead of a satisfaction questionnaire?",
        kopf: "Because satisfaction doesn't explain why good people leave.",
        text: "A questionnaire measures mood, with the same questions for every business. The team interview goes where leaders tend to misjudge things: what really keeps people, what holds them back and where money goes that nobody would miss. We also put your own assessment side by side with your team's.",
        beispiel: "A managing director estimates that 80% of his team feel well informed. In the interviews it is 48%.",
      },
      {
        q: "What if my team says things I don't want to hear?",
        kopf: "Then the interview has already paid off.",
        text: "Uncomfortable answers are the most valuable, because otherwise you only find out when a good employee hands in their notice. We discuss the results with you first, put them in context and show what really carries weight and what is a lone voice. What you then tell your team is your call, and we help you find the right words.",
      },
      {
        q: "We asked once before and nothing happened. Why would this time be different?",
        kopf: "Because we plan the follow-through from the start.",
        text: "An interview without consequences is the most common reason nobody answers honestly the next time. In the goal-setting meeting we agree what you want to do with the results and what you will report back to the team. You get three priorities instead of a list of 40 problems, and after six months a short pulse check shows whether anything has moved.",
      },
      {
        q: "From how many employees does the team interview stay confidential?",
        kopf: "A group is only shown once at least 6 interviews are in.",
        text: "Smaller departments are merged, so a team of eight is analysed as one group. Until then you only see how many have taken part: no answers and no trend.",
      },
      {
        q: "How do I get my team to take part?",
        kopf: "What works best is telling them yourself, beforehand, why you are asking and that you will share the results.",
        text: "We take care of the rest: an invitation that explains the purpose, a clear commitment on confidentiality and at least one reminder. The questions avoid jargon and work for everyone from apprentice to managing director, even on a phone during a break.",
      },
      {
        q: "Does the works council have to agree?",
        kopf: "If you have a works council or employee representatives, we involve them before the start and show them the questions and the process.",
        text: "Whether formal consent is required depends on your country, on which questions are asked and on whether answers can be traced to individuals. Because the team interview is analysed without names and in aggregate, employee representatives are usually an ally rather than a hurdle.",
      },
      {
        q: "Will this help us find good people?",
        kopf: "Yes, in your own team's words.",
        text: "The answers make clear why people really work for you, and that turns into lines for job ads that sound genuine. They attract applicants who fit, not just anyone looking for a job. At the same time you learn what is holding good people back, before they leave.",
      },
      {
        q: "What do I get after the team interview?",
        kopf: "Priorities, not a mood curve.",
        text: "Where you and your team are furthest apart, where you are losing people and where you spend money that achieves nothing. Plus concrete actions and lines for your employer brand. All presented to you in person; after six months a short pulse check follows, and after that most businesses need one interview a year.",
      },
    ],
  },

  kunden: {
    etikett: "Questions about the customer interview",
    titelA: "Before you ask",
    titelB: "your customers.",
    lead: "What business owners want to know before they invite their own customers to an interview.",
    verweis: true,
    fragen: [
      {
        q: "What does a customer interview tell me that a satisfaction score doesn't?",
        kopf: "The why.",
        text: "A score shows how satisfied customers are, but not why they buy from you, why they leave, and what they buy elsewhere even though they would rather buy it from you. Which of these questions matters for you right now, we decide together in the goal-setting meeting. Our strategists read every answer and turn it into arguments and actions.",
      },
      {
        q: "Won't this annoy our customers?",
        kopf: "As a rule, no: customers see being asked as a sign of appreciation.",
        text: "The invitation comes in your name, we conduct the interview as a neutral party, and it takes 15 to 30 minutes. A customer who was able to say what bothers them is more likely to stay than one nobody ever asked.",
      },
      {
        q: "Which customers should we ask?",
        kopf: "That depends on the decision ahead, and that is exactly what we clarify first.",
        text: "For reasons to buy we ask regular and new customers, for churn former ones, for growth those who only buy part of what they need from you today. We analyse these groups separately. Each group needs at least 6 answers; it becomes truly meaningful from 10 to 15.",
      },
      {
        q: "Does this work if all our customers are businesses?",
        kopf: "Especially then.",
        text: "In B2B, many customers depend on a handful of contacts, every customer is worth a lot, and dissatisfaction only shows when orders stop coming. If you wish, we interview several people at the same customer, for example purchasing, engineering and management, because they often buy from you for very different reasons.",
      },
      {
        q: "Will I find out which customer said what?",
        kopf: "No.",
        text: "You learn what was said, not who said it. That is exactly why customers speak openly: they are not talking to you, they are talking to us. With a few large customers, we summarise answers so that nobody can be identified.",
      },
      {
        q: "What do I do with my customers' answers?",
        kopf: "You sell with them.",
        text: "The real reasons to buy, in your customers' own words, go straight onto your website, into your proposals and into sales conversations. You also see where customers are unhappy before they show it, and where revenue is going to others. If your team has been interviewed too, we put your self-image and your customers' view side by side; that is where the biggest opportunities lie.",
      },
    ],
  },

  vertrieb: {
    etikett: "Questions about the sales interview",
    titelA: "What sales leaders",
    titelB: "ask first.",
    lead: "Before you invest in the next sales initiative: answers to the questions we hear most often.",
    verweis: true,
    fragen: [
      {
        q: "Why do we really lose proposals?",
        kopf: "Rarely for the reason sales assumes.",
        text: "Salespeople mostly say price; customers often say something else: an unclear benefit, following up too late or no fixed contact person. In the example on this page, 58% of the sales team name price, but only 19% of customers (example figures). Too expensive often means: I can't see the difference.",
      },
      {
        q: "What does the sales interview show that my CRM doesn't?",
        kopf: "Your CRM shows that a proposal was lost, but not why.",
        text: "In the goal-setting meeting we capture your hypotheses and aim the questions where deals tend to get stuck: the argument that doesn't land, the follow-up, and the revenue from existing customers that ends up elsewhere. Then we ask both sides, sales and customers. Experts call this win-loss analysis; we add the inside view of your sales team.",
      },
      {
        q: "Won't my sales team feel they are being checked on?",
        kopf: "No, because this is about the path to closing, not about any individual's quota.",
        text: "Answers are given without names, and there is no analysis per person. Ideas from the team are rated by everyone, on customer value rather than hierarchy. Your sales team pulls together on implementation because they were asked.",
      },
      {
        q: "We want to restructure sales. When should we ask?",
        kopf: "Before you spend money: on a new CRM, a new structure, a new head of sales or a campaign.",
        text: "Then you invest in tested assumptions rather than guesses. Clear signals are falling close rates, more price discussions or existing customers buying part of their needs elsewhere. The people who sell every day usually know exactly where things get stuck. Nobody has asked them properly yet.",
      },
      {
        q: "How realistic is the revenue calculator?",
        kopf: "The calculator is a worked example based on your assumptions, not a promise.",
        text: "It shows what a single lever is worth: if your close rate rises by five points, you win one more out of every twenty proposals. Which levers will do the most for you, only the interviews can show.",
      },
      {
        q: "What will my sales team do differently afterwards?",
        kopf: "They will know which lines convince and which ones they can drop.",
        text: "Plus what customers really mean by their objections and where the fastest growth with existing customers lies. This becomes your three strongest levers and a 90-day plan, developed together with the sales team. After six months a short pulse check shows what has been implemented and whether the close rate has moved.",
      },
    ],
  },

  ueberUns: {
    etikett: "Questions about Rittler & Co and the ANDI method",
    titelA: "Who asks,",
    titelB: "and why this way.",
    lead: "Who is behind andi fragt., how the method works and why an advertising agency asks the right questions.",
    verweis: true,
    fragen: [
      {
        q: "Who is behind andi fragt.?",
        kopf: "Rittler & Co GmbH, a brand and advertising agency at Peter-Rosegger-Straße 27, 8053 Graz, Austria.",
        text: "In more than 20 years and over 500 brand projects, we kept seeing the same thing: the best answers are already inside the company, and nobody asks the right questions. andi fragt. turns that experience into a method.",
      },
      {
        q: "What is the ANDI method?",
        kopf: "The approach Rittler & Co uses to turn answers into decisions.",
        text: "It starts before the first interview, with an assessment of the situation and of the assumptions that need testing. Every answer is analysed in four steps. We are not looking for the average but for the deviation, because that shows where a decision needs to go differently.",
      },
      {
        q: "Does software or AI analyse the answers?",
        kopf: "No, people draw the conclusions.",
        text: "Technology helps to collect and sort; every answer is read and interpreted by our strategists. Software counts how often something is said. We spot the one sentence that carries your positioning, even if it only comes up three times.",
      },
      {
        q: "Why an advertising agency and not a market research institute?",
        kopf: "A market research institute answers the questions it is given.",
        text: "We start one step earlier and work out with you which questions will move your company forward. Then we deliver what follows from the answers: the message, the job ad, the sales argument. Because Rittler & Co has been building brands for years, we can implement it straight away if you wish.",
      },
      {
        q: "Do you only work in Graz and Styria?",
        kopf: "No.",
        text: "We are based in Graz, Austria, and the interviews run online. We work with companies across the German-speaking world and beyond, and interviews are available in German, English, Italian and Croatian. The goal-setting meeting and the presentation take place in person or by video.",
      },
    ],
  },

  kontakt: {
    etikett: "Before you call",
    titelA: "What to know",
    titelB: "in advance.",
    lead: "How the first call works, when you receive a proposal and what to do if your interview link doesn't work.",
    verweis: true,
    ohneKontaktkarte: true,
    fragen: [
      {
        q: "What happens in the first call?",
        kopf: "In the first call we listen and assess your situation.",
        text: "Which decision is coming up, what do you already know, what are you only assuming? Then we tell you honestly whether an interview makes sense and which module fits. We develop the actual questions in the goal-setting meeting once you have commissioned us. The first call is free and without obligation, takes 30 minutes and runs by video or phone.",
      },
      {
        q: "What should I prepare for the first call?",
        kopf: "Just the decision that is on your mind.",
        text: "Helpful but not essential: the rough number of employees per department, which customer groups you have and what you already suspect is behind the issue. We work out the rest together.",
      },
      {
        q: "I don't know which module fits. What now?",
        kopf: "That is part of our assessment in the first call.",
        text: "Often more than one module fits, for example team and positioning, because employees know a great deal about customers. If you don't yet know where you stand at all, the ANDI brand check from Rittler & Co is the right place to start.",
      },
      {
        q: "How quickly will I get a proposal?",
        kopf: "You receive your proposal within three working days of the first call.",
        text: "It sets out the question to be answered, the groups, the number of people, the timeline and the price.",
      },
      {
        q: "How quickly can we start?",
        kopf: "After the goal-setting meeting we develop the interview and send it to you for sign-off.",
        text: "Once you have signed it off, we send the invitations within a week. We write the invitation with you and time the interview period around your calendar, for instance so it doesn't fall in the holiday season.",
      },
      {
        q: "My interview link doesn't work. What should I do?",
        kopf: "The best option is to open the link directly from your invitation or enter your interview code on the home page.",
        text: "If that doesn't work, call us. We will send you a new link, and your answers stay without names.",
      },
    ],
  },

  preise: {
    etikett: "Questions about pricing",
    titelA: "Answered",
    titelB: "briefly.",
    lead: "What managing directors, HR and sales leaders want to know about price and effort before the first call.",
    fragen: [
      {
        q: "What is included in the price?",
        kopf: "Everything from the goal-setting meeting to the presentation.",
        text: "Developing the questions, sending invitations and reminders, analysis and presenting in person. If you need several groups or rounds, the proposal says so up front.",
      },
      {
        q: "Why is every additional module so much cheaper?",
        kopf: "Because most of the work happens at the start.",
        text: "Understanding your company and finding the right questions: every further module builds on that. The price applies if you start the module within six months.",
      },
      {
        q: "Is the first call a sales pitch?",
        kopf: "No. It is about your situation, not our product.",
        text: "If none of our modules fits, we will tell you.",
      },
      {
        q: "We are only five people. Does it stay confidential?",
        kopf: "We combine all answers and only ever paraphrase what was said.",
        text: "For very small teams we often recommend starting with the customer interview.",
      },
      {
        q: "How much of my time does it take?",
        kopf: "Very little of yours: the goal-setting meeting, the sign-off and the presentation.",
        text: "About two hours in total. Your team: 15 to 30 minutes per person, on a phone or computer.",
      },
    ],
  },
};
